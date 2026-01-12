import type { TestCase, TestResult, Reporter } from '@playwright/test/reporter';
import axios from 'axios';
import https from 'https';

// (Optional) If you want to capture info logs, keep this, but after imports:
const infoMessages: string[] = [];
const originalConsoleInfo = console.info;
console.info = function (...args: any[]) {
  infoMessages.push(args.join(' '));
  originalConsoleInfo.apply(console, args);
};

/**
 * ✅ Read from environment variables (NO secrets in code)
 * Set these in:
 * - Local: .env (and add .env to .gitignore)
 * - CI: GitHub Actions Secrets
 */
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://ucovyconnectsinc.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
  // Don't crash imports; just warn. Reporter will fail only when it tries Jira.
  console.warn(
    'JiraReporter: Missing JIRA_EMAIL or JIRA_API_TOKEN in environment variables. Jira ticket creation/search will be skipped.'
  );
}

const JIRA_AUTH =
  JIRA_EMAIL && JIRA_API_TOKEN
    ? Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')
    : '';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

interface JiraIssueSearchResult {
  url: string;
  status: string;
}

function jiraEnabled(): boolean {
  return Boolean(JIRA_AUTH);
}

async function findJiraIssueBySummary(summary: string): Promise<JiraIssueSearchResult | null> {
  if (!jiraEnabled()) return null;

  try {
    const findTicket = {
      jql: `summary~"${summary.replace(/"/g, '\\"')}"`,
      fields: ['key', 'status'],
      maxResults: 1,
    };

    const response = await axios.post(`${JIRA_BASE_URL}/rest/api/3/search/jql`, findTicket, {
      headers: {
        Authorization: `Basic ${JIRA_AUTH}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      httpsAgent: agent,
    });

    const issues = response.data?.issues;
    if (issues && issues.length > 0) {
      const issue = issues[0];
      const url = `${JIRA_BASE_URL}/browse/${issue.key}`;
      const status =
        issue.fields?.status?.name && typeof issue.fields.status.name === 'string'
          ? issue.fields.status.name
          : '';
      return { url, status };
    }

    return null;
  } catch (error) {
    console.error('Error finding Jira issue:', error);
    return null;
  }
}

async function createJiraIssue(summary: string, description: string, teamName: string): Promise<string | null> {
  if (!jiraEnabled()) return null;

  try {
    const jiraBody = {
      fields: {
        project: { id: '10000' },
        issuetype: { id: '10001' },
        summary: `[${teamName}] ${summary}`,
        description: {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: description }],
            },
          ],
        },
        assignee: { id: '712020:b26afb57-e210-4ff3-9248-e1cf3555c486' },
        labels: [],
        parent: { id: '10003' },
        customfield_10001: 'a94ed843-0d86-46e9-bd08-6838336b32b5',
        customfield_10020: 432,
        customfield_10016: 0,
        fixVersions: [],
        customfield_10021: [],
      },
    };

    const response = await axios.post(`${JIRA_BASE_URL}/rest/api/3/issue`, jiraBody, {
      headers: {
        Authorization: `Basic ${JIRA_AUTH}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      httpsAgent: agent,
    });

    console.info('Jira issue created:', response.data.key);
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait for 20 seconds

    return response.data.key ? `${JIRA_BASE_URL}/browse/${response.data.key}` : null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating Jira issue:', error.response?.data || error.message);
      if (error.response) console.error('Response data:', error.response);
    } else {
      console.error('Error creating Jira issue:', error);
    }
    return null;
  }
}

class JiraReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult) {
    const totalRetries = test.parent?.project()?.retries ?? 0;

    // Only create a Jira ticket if this is the final failed attempt (after all retries)
    if (result.status === 'failed' && result.retry === totalRetries) {
      if (!jiraEnabled()) return; // ✅ skip if env is not set

      const summary = `Test Failed: ${test.title}`;

      const consoleInfoMessages = result.stdout
        ? result.stdout.filter((chunk: any) => typeof chunk === 'string').join('')
        : '';

      const description = `**Test Title:** ${test.title}\n\n**Error Message:** ${
        result.error?.message || 'No error message'
      }\n\n**Console Info Logs:**\n${consoleInfoMessages || 'No console info logs captured.'}`;

      const existingIssue = await findJiraIssueBySummary(summary);

      if (existingIssue) {
        console.info(`Jira issue already exists: ${existingIssue.url} (status: ${existingIssue.status})`);
        if (existingIssue.status.toLowerCase() !== 'done') return;
        console.info('Existing issue is Done, will create a new ticket.');
      }

      const teamAnnotation = test.annotations.find((a) => a.type === 'team');
      const teamName = teamAnnotation?.description || 'Default Team';

      const issueUrl = await createJiraIssue(summary, description, teamName);

      if (issueUrl) console.info(`Jira issue created successfully: ${issueUrl}`);
      else console.error('Failed to create Jira issue.');
    }
  }
}

export default JiraReporter;
