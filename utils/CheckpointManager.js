import { expect } from "allure-playwright";

export class CheckpointManager {
    constructor() {
        this.passed = [];
        this.failed = [];
    }

    createCheckpoint(id, actual, expected, message) {
        try {
            expect(actual).toBe(expected);
            this.passed.push(`${id}: ${message}`);
        } catch (error) {
            this.failed.push(`${id}: ${message} - ${error}`);
        }
    }

    createCustomCheckpoint(id, assertionFn, message) {
        try {
            assertionFn();
            this.passed.push(`${id}: ${message}`);
        } catch (error) {
            this.failed.push(`${id}: ${message} - ${error}`);
        }
    }

    assertAllCheckpoints() {
        const total = this.passed.length + this.failed.length;
        const summary = `\nThe Test Case executed <${total}> checkpoints: Passed <${this.passed.length}>, Failed <${this.failed.length}>\n`;
        let report = summary;
        
        if (this.passed.length > 0) {
            report += " **** Passed Checkpoints **** \n" + this.passed.map(s => `ID: ${s}`).join("\n") + "\n";
        }
        
        if (this.failed.length > 0) {
            report += " **** Failed Checkpoints **** \n" + this.failed.map(s => `ID: ${s}`).join("\n") + "\n";
        }
        
        console.info(report);
        
        if (this.failed.length > 0) {
            throw new Error(`Test failed with ${this.failed.length} failed checkpoints. Details: ${report}`);
        }
        
        this.passed = [];
        this.failed = [];
    }
}