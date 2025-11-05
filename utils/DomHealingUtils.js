import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Captures the current DOM state of the page and saves it to a file
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} testName - Name to use for the snapshot file
 * @returns {Promise<void>}
 */
export async function captureDomSnapshot(page, testName) {
    await page.waitForLoadState('load');
    const domContent = await page.content();
    const filePath = path.resolve(__dirname, `../snapshots/${testName}.html`);
    fs.writeFileSync(filePath, domContent);
    return filePath;
}

/**
 * Finds an alternative selector by parsing DOM HTML and examining element attributes
 * @param {string} domHtml - The HTML content to search
 * @param {string} originalSelector - The selector text to match against
 * @returns {string|null} - A new selector if found, null otherwise
 */
export function findAlternativeSelector(domHtml, hint) {
    if (!hint) return null;
    const hintLower = hint.toLowerCase();

    // iterate opening tags and their inner content to find best match
    const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*)>([\s\S]*?)<\/\1>/g;
    let m;
    while ((m = tagRegex.exec(domHtml)) !== null) {
        const tag = m[1];
        const attrs = m[2] || '';
        const inner = (m[3] || '').trim();

        // helper to test attribute values
        const attrTest = (attrRegex) => {
            const res = attrs.match(attrRegex);
            if (!res) return null;
            const val = res[1] || '';
            return val.toLowerCase().includes(hintLower) ? { value: res[1], raw: res[0] } : null;
        };

        // 1) id
        const idMatch = attrTest(/id=["']([^"']+)["']/i);
        if (idMatch) return `${tag}#${idMatch.value}`;

        // 2) name
        const nameMatch = attrTest(/name=["']([^"']+)["']/i);
        if (nameMatch) return `${tag}[name="${nameMatch.value}"]`;

        // 3) placeholder
        const placeholderMatch = attrTest(/placeholder=["']([^"']+)["']/i);
        if (placeholderMatch) return `${tag}[placeholder="${placeholderMatch.value}"]`;

        // 4) aria-label
        const ariaMatch = attrTest(/aria-label=["']([^"']+)["']/i);
        if (ariaMatch) return `${tag}[aria-label="${ariaMatch.value}"]`;

        // 5) title
        const titleMatch = attrTest(/title=["']([^"']+)["']/i);
        if (titleMatch) return `${tag}[title="${titleMatch.value}"]`;

        // 6) data- attributes (capture the key and value)
        const dataRegex = /(data-[^=\s]+)=["']([^"']+)["']/i;
        const dataMatch = attrs.match(dataRegex);
        if (dataMatch && dataMatch[2].toLowerCase().includes(hintLower)) {
            return `${tag}[${dataMatch[1]}="${dataMatch[2]}"]`;
        }

        // 7) class
        const classMatch = attrs.match(/class=["']([^"']+)["']/i);
        if (classMatch) {
            const classes = classMatch[1].split(/\s+/);
            // find a class that contains hint
            const good = classes.find(c => c.toLowerCase().includes(hintLower));
            if (good) return `${tag}.${classes.join('.')}`;
        }

            // 8) inner text contains hint (but skip overly large or non-text nodes like html/head/style)
            const skipTags = ['html','head','style','script','meta','link'];
            if (!skipTags.includes(tag.toLowerCase()) && inner) {
                // strip any child tags to get plain text
                const plain = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                if (plain.toLowerCase().includes(hintLower)) {
                    // take a short, safe snippet and escape double quotes
                    let snippet = plain.split('\n').map(s=>s.trim()).filter(Boolean).join(' ');
                    snippet = snippet.length > 80 ? snippet.slice(0, 80) : snippet;
                    // remove problematic characters that can break CSS parsing
                    snippet = snippet.replace(/["<>]/g, '');
                    const safe = snippet.replace(/\"/g, '\\"');
                    return `${tag}:has-text("${safe}")`;
                }
            }
    }

    // if nothing matched
    return null;
}

export default {
    captureDomSnapshot,
    findAlternativeSelector,
    findAlternativeSelectorInPage
};

/**
 * In-page heuristic: search the live DOM for an element matching the hint and return a selector.
 * This is more reliable than parsing HTML text in some dynamic apps.
 * @param {import('@playwright/test').Page} page
 * @param {string} hint
 * @returns {Promise<string|null>}
 */
export async function findAlternativeSelectorInPage(page, hint) {
    if (!hint) return null;
    const selector = await page.evaluate((h) => {
        const hintLower = h.toLowerCase();
        function score(el) {
            let s = 0;
            const attrs = ['id','name','placeholder','aria-label','title','alt','value'];
            for (const a of attrs) {
                const v = el.getAttribute && el.getAttribute(a);
                if (v) {
                    const vl = v.toLowerCase();
                    if (vl === hintLower) s += 20;
                    else if (vl.includes(hintLower)) s += 10;
                }
            }
            const text = (el.textContent||'').trim().toLowerCase();
            if (text === hintLower) s += 15;
            else if (text.includes(hintLower)) s += 7;
            return s;
        }
        const candidates = Array.from(document.querySelectorAll('input,button,a,select,textarea,label'));
        let best = null; let bestScore = 0;
        for (const el of candidates) {
            const s = score(el);
            if (s > bestScore) { bestScore = s; best = el; }
        }
        if (!best) return null;
        if (best.id) return '#' + best.id;
        if (best.getAttribute && best.getAttribute('name')) return best.tagName.toLowerCase() + '[name="' + best.getAttribute('name') + '"]';
        const cls = best.className && String(best.className).trim();
        if (cls) return best.tagName.toLowerCase() + '.' + cls.split(/\s+/).join('.');
        // fallback to text
        const t = (best.textContent||'').trim().split('\n').map(s=>s.trim()).filter(Boolean)[0] || '';
        if (t) return best.tagName.toLowerCase() + `:has-text("${t.slice(0,60)}")`;
        return null;
    }, hint);
    return selector;
}

/**
 * Healing action: Click on an element using original selector or healed selector if original not found
 * @param {import('@playwright/test').Page} page
 * @param {string} originalSelector
 * @param {string} hintText
 * @param {string} snapshotFileName
 */
export async function healingClick(page, originalSelector, hintText, snapshotFileName = 'healing-click') {
    const locator = page.locator(originalSelector);
    const count = await locator.count();
    
    if (count > 0) {
        // Original selector exists — use it
        await locator.click();
        console.log(`[HealingClick] Used original selector: ${originalSelector}`);
    } else {
        // Original selector not found — attempt healing
        console.log(`[HealingClick] Original selector not found: ${originalSelector}, attempting to heal...`);
        
        const snapshotPath = await captureDomSnapshot(page, snapshotFileName);
        await page.waitForLoadState('networkidle').catch(() => {});
        
        const domHtml = fs.readFileSync(snapshotPath, 'utf8');
        console.log(`[HealingClick] Saved DOM snapshot: ${snapshotPath} (size: ${domHtml.length} bytes)`);
        
        let healedSelector = findAlternativeSelector(domHtml, hintText);
        if (!healedSelector) {
            console.log('[HealingClick] No selector found in snapshot; attempting in-page heuristic...');
            healedSelector = await findAlternativeSelectorInPage(page, hintText);
            console.log(`[HealingClick] In-page heuristic returned: ${healedSelector}`);
        }
        
        if (healedSelector) {
            console.log(`[HealingClick] Found healed selector: ${healedSelector}`);
            await page.locator(healedSelector).click();
        } else {
            throw new Error(`[HealingClick] Could not find alternative selector for hint: ${hintText}`);
        }
    }
}

/**
 * Healing action: Fill/type text into an element using original selector or healed selector if original not found
 * @param {import('@playwright/test').Page} page
 * @param {string} originalSelector
 * @param {string} text
 * @param {string} hintText
 * @param {string} snapshotFileName
 */
export async function healingFill(page, originalSelector, text, hintText, snapshotFileName = 'healing-fill') {
    const locator = page.locator(originalSelector);
    const count = await locator.count();
    
    if (count > 0) {
        // Original selector exists — use it
        await locator.fill(text);
        console.log(`[HealingFill] Used original selector: ${originalSelector}`);
    } else {
        // Original selector not found — attempt healing
        console.log(`[HealingFill] Original selector not found: ${originalSelector}, attempting to heal...`);
        
        const snapshotPath = await captureDomSnapshot(page, snapshotFileName);
        await page.waitForLoadState('networkidle').catch(() => {});
        
        const domHtml = fs.readFileSync(snapshotPath, 'utf8');
        console.log(`[HealingFill] Saved DOM snapshot: ${snapshotPath} (size: ${domHtml.length} bytes)`);
        
        let healedSelector = findAlternativeSelector(domHtml, hintText);
        if (!healedSelector) {
            console.log('[HealingFill] No selector found in snapshot; attempting in-page heuristic...');
            healedSelector = await findAlternativeSelectorInPage(page, hintText);
            console.log(`[HealingFill] In-page heuristic returned: ${healedSelector}`);
        }
        
        if (healedSelector) {
            console.log(`[HealingFill] Found healed selector: ${healedSelector}`);
            await page.locator(healedSelector).fill(text);
        } else {
            throw new Error(`[HealingFill] Could not find alternative selector for hint: ${hintText}`);
        }
    }
}

/**
 * Alias for healingFill - type text into element with healing
 */
export const healingType = healingFill;