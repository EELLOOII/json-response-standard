#!/usr/bin/env node
/**
 * Unified Test Runner for JSON Response Standard
 * Usage: node test/run-tests.js [language]
 * 
 * Examples:
 *   node test/run-tests.js           // Run all tests
 *   node test/run-tests.js js        // Run only JavaScript tests
 *   node test/run-tests.js python    // Run only Python tests
 *   node test/run-tests.js php       // Run only PHP tests
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class TestRunner {
    constructor() {
        this.testDir = __dirname;
        this.projectRoot = path.dirname(this.testDir);
        this.results = {};
    }

    /**
     * Run a command and return a promise with the result
     */
    runCommand(command, args = [], options = {}) {
        return new Promise((resolve, reject) => {
            const process = spawn(command, args, {
                cwd: this.projectRoot,
                stdio: 'pipe',
                ...options
            });

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                resolve({
                    code,
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    success: code === 0
                });
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Check if a command is available
     */
    async checkCommand(command) {
        try {
            const result = await this.runCommand(command, ['--version']);
            return result.success || result.code === 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Run JavaScript tests
     */
    async runJavaScriptTests() {
        console.log('[INFO] Running JavaScript tests...');
        
        const nodeAvailable = await this.checkCommand('node');
        if (!nodeAvailable) {
            console.log('[ERROR] Node.js not found. Please install Node.js to run JavaScript tests.');
            return false;
        }

        try {
            const result = await this.runCommand('node', ['test/test.js']);
            console.log(result.stdout);
            if (result.stderr) console.log('Error:', result.stderr);
            
            this.results.javascript = {
                success: result.success,
                output: result.stdout
            };
            
            return result.success;
        } catch (error) {
            console.log('[ERROR] JavaScript tests failed:', error.message);
            return false;
        }
    }

    /**
     * Run Python tests
     */
    async runPythonTests() {
        console.log('[INFO] Running Python tests...');
        
        const pythonAvailable = await this.checkCommand('python');
        if (!pythonAvailable) {
            console.log('[ERROR] Python not found. Please install Python to run Python tests.');
            return false;
        }

        try {
            const result = await this.runCommand('python', ['test/test.py']);
            console.log(result.stdout);
            if (result.stderr) console.log('Error:', result.stderr);
            
            this.results.python = {
                success: result.success,
                output: result.stdout
            };
            
            return result.success;
        } catch (error) {
            console.log('[ERROR] Python tests failed:', error.message);
            return false;
        }
    }

    /**
     * Run PHP tests
     */
    async runPHPTests() {
        console.log('[INFO] Running PHP tests...');
        
        const phpAvailable = await this.checkCommand('php');
        if (!phpAvailable) {
            console.log('[ERROR] PHP not found. Please install PHP to run PHP tests.');
            return false;
        }

        try {
            const result = await this.runCommand('php', ['test/test.php']);
            console.log(result.stdout);
            if (result.stderr) console.log('Error:', result.stderr);
            
            this.results.php = {
                success: result.success,
                output: result.stdout
            };
            
            return result.success;
        } catch (error) {
            console.log('[ERROR] PHP tests failed:', error.message);
            return false;
        }
    }

    /**
     * Print summary of all test results
     */
    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        
        let totalPassed = 0;
        let totalRun = 0;
        
        Object.entries(this.results).forEach(([language, result]) => {
            const status = result.success ? '[PASS]' : '[FAIL]';
            const languageName = language.charAt(0).toUpperCase() + language.slice(1);
            console.log(`${status} ${languageName}: ${result.success ? 'PASSED' : 'FAILED'}`);
            
            if (result.success) totalPassed++;
            totalRun++;
        });
        
        console.log('='.repeat(50));
        console.log('[SUMMARY] Overall: ' + totalPassed + '/' + totalRun + ' language tests passed');
        
        if (totalPassed === totalRun && totalRun > 0) {
            console.log('[SUCCESS] All tests passed! Your JSON Response Standard is working perfectly across all languages!');
        } else if (totalPassed === 0) {
            console.log('[ERROR] All tests failed. Please check your implementation.');
        } else {
            console.log('[WARNING] Some tests failed. Please check the failed implementations.');
        }
    }

    /**
     * Run tests for specified language or all languages
     */
    async run(targetLanguage = null) {
        console.log('JSON Response Standard Test Runner');
        console.log('=====================================\n');

        if (targetLanguage) {
            console.log(`[INFO] Running tests for: ${targetLanguage}\n`);
        } else {
            console.log('[INFO] Running tests for all languages\n');
        }

        const runners = {
            'js': () => this.runJavaScriptTests(),
            'javascript': () => this.runJavaScriptTests(),
            'node': () => this.runJavaScriptTests(),
            'py': () => this.runPythonTests(),
            'python': () => this.runPythonTests(),
            'php': () => this.runPHPTests()
        };

        if (targetLanguage) {
            const normalizedTarget = targetLanguage.toLowerCase();
            const runner = runners[normalizedTarget];
            
            if (!runner) {
                console.log(`[ERROR] Unknown language: ${targetLanguage}`);
                console.log('Available languages: js, python, php');
                process.exit(1);
            }
            
            const success = await runner();
            process.exit(success ? 0 : 1);
        } else {
            // Run all tests
            const jsSuccess = await this.runJavaScriptTests();
            console.log('');
            
            const pythonSuccess = await this.runPythonTests();
            console.log('');
            
            const phpSuccess = await this.runPHPTests();
            
            this.printSummary();
            
            const allPassed = jsSuccess && pythonSuccess && phpSuccess;
            process.exit(allPassed ? 0 : 1);
        }
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetLanguage = args[0];

// Show usage if help is requested
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node test/run-tests.js [language]

Examples:
  node test/run-tests.js           # Run all tests
  node test/run-tests.js js        # Run only JavaScript tests
  node test/run-tests.js python    # Run only Python tests
  node test/run-tests.js php       # Run only PHP tests

Supported languages: js, javascript, node, py, python, php
`);
    process.exit(0);
}

// Run the tests
const runner = new TestRunner();
runner.run(targetLanguage).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
