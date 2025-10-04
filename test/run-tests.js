#!/usr/bin/env node
/**
 * Unified Test Runner for JSON Response Standard
 *
 * SUPPORTED LANGUAGES: JavaScript, Python, PHP, Go, Rust, Java, C#, Ruby
 * NOTE: Additional languages are automatically detected if test files exist.
 * Languages without test files will be gracefully skipped.
 *
 * Usage: node test/run-tests.js [language]
 *
 * Examples:
 *   node test/run-tests.js           // Run all tests
 *   node test/run-tests.js js        // Run only JavaScript tests
 *   node test/run-tests.js python    // Run only Python tests
 *   node test/run-tests.js php       // Run only PHP tests
 *   node test/run-tests.js go        // Run only Go tests (if test.go exists)
 *   node test/run-tests.js rust      // Run only Rust tests (if test.rs exists)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class TestRunner {
    constructor() {
        this.testDir = __dirname;
        this.projectRoot = path.dirname(this.testDir);
        this.results = {};

        // Language configurations - easily extensible by contributors
        this.languageConfigs = {
            'javascript': {
                aliases: ['js', 'javascript', 'node'],
                testFile: 'test.js',
                command: 'node',
                args: ['test/test.js'],
                versionFlag: '--version',
                displayName: 'JavaScript'
            },
            'python': {
                aliases: ['py', 'python', 'python3'],
                testFile: 'test.py',
                command: 'python',
                args: ['test/test.py'],
                versionFlag: '--version',
                displayName: 'Python'
            },
            'php': {
                aliases: ['php'],
                testFile: 'test.php',
                command: 'php',
                args: ['test/test.php'],
                versionFlag: '--version',
                displayName: 'PHP'
            },
            'typescript': {
                aliases: ['ts', 'typescript'],
                testFile: 'test.ts',
                command: 'npx',
                args: ['ts-node', '--transpile-only', 'test/test.ts'],
                versionFlag: '--version',
                displayName: 'TypeScript',
                skipIfMissing: true // Skip if ts-node not available
            },
            // Additional languages (will be auto-discovered if test files exist)
            'go': {
                aliases: ['go', 'golang'],
                testFile: 'test.go',
                command: 'go',
                args: ['run', 'test/test.go'],
                versionFlag: 'version',
                displayName: 'Go'
            },
            'rust': {
                aliases: ['rust', 'rs'],
                testFile: 'test.rs',
                command: 'cargo',
                args: ['run', '--bin', 'test'],
                versionFlag: '--version',
                displayName: 'Rust'
            },
            'java': {
                aliases: ['java'],
                testFile: 'Test.java',
                command: 'java',
                args: ['test/Test.java'],
                versionFlag: '--version',
                displayName: 'Java'
            },
            'csharp': {
                aliases: ['cs', 'csharp', 'c#'],
                testFile: 'test.cs',
                command: 'dotnet',
                args: ['run', '--project', 'test/'],
                versionFlag: '--version',
                displayName: 'C#'
            },
            'ruby': {
                aliases: ['rb', 'ruby'],
                testFile: 'test.rb',
                command: 'ruby',
                args: ['test/test.rb'],
                versionFlag: '--version',
                displayName: 'Ruby'
            }
        };
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
     * Automatically discover available languages by checking for test files
     */
    discoverAvailableLanguages() {
        const availableLanguages = [];

        for (const [langKey, config] of Object.entries(this.languageConfigs)) {
            const testFilePath = path.join(this.testDir, config.testFile);
            if (fs.existsSync(testFilePath)) {
                availableLanguages.push({
                    key: langKey,
                    config: config,
                    testFilePath: testFilePath
                });
            }
        }

        return availableLanguages;
    }

    /**
     * Get language configuration by alias
     */
    getLanguageByAlias(alias) {
        const normalizedAlias = alias.toLowerCase();

        for (const [langKey, config] of Object.entries(this.languageConfigs)) {
            if (config.aliases.includes(normalizedAlias)) {
                return { key: langKey, config: config };
            }
        }

        return null;
    }

    /**
     * Check if a command is available
     */
    async checkCommand(command, versionFlag = '--version') {
        try {
            const result = await this.runCommand(command, [versionFlag]);
            return result.success || result.code === 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Run tests for a specific language
     */
    async runLanguageTests(languageKey, config) {
        console.log(`[INFO] Running ${config.displayName} tests...`);

        // Check if test file exists
        const testFilePath = path.join(this.testDir, config.testFile);
        if (!fs.existsSync(testFilePath)) {
            console.log(`[SKIP] ${config.displayName} test file (${config.testFile}) not found.`);
            return null; // null indicates test file doesn't exist
        }

        // Check if command is available
        const commandAvailable = await this.checkCommand(config.command, config.versionFlag);
        if (!commandAvailable) {
            console.log(`[ERROR] ${config.displayName} runtime (${config.command}) not found. Please install ${config.displayName} to run ${config.displayName} tests.`);
            return null; // null indicates language not available
        }

        try {
            const result = await this.runCommand(config.command, config.args);
            console.log(result.stdout);
            if (result.stderr) console.log('Error:', result.stderr);

            this.results[languageKey] = {
                success: result.success,
                output: result.stdout,
                displayName: config.displayName
            };

            return result.success;
        } catch (error) {
            console.log(`[ERROR] ${config.displayName} tests failed:`, error.message);
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
            const languageName = result.displayName || language.charAt(0).toUpperCase() + language.slice(1);
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

            // Find language by alias
            const langInfo = this.getLanguageByAlias(targetLanguage);

            if (!langInfo) {
                console.log(`[ERROR] Unknown language: ${targetLanguage}`);

                // Show available languages dynamically
                const availableLanguages = this.discoverAvailableLanguages();
                if (availableLanguages.length > 0) {
                    console.log('Available languages:');
                    availableLanguages.forEach(lang => {
                        console.log(`  - ${lang.config.displayName}: ${lang.config.aliases.join(', ')}`);
                    });
                } else {
                    console.log('No test files found. Please add test files for supported languages.');
                }

                console.log('\nTo add a new language:');
                console.log('1. Create a test file (e.g., test/test.go)');
                console.log('2. Add language configuration to test/run-tests.js');
                console.log('3. Ensure the language runtime is installed');
                process.exit(1);
            }

            const success = await this.runLanguageTests(langInfo.key, langInfo.config);
            process.exit(success ? 0 : 1);
        } else {
            console.log('[INFO] Running tests for all available languages\n');

            // Discover and run all available language tests
            const availableLanguages = this.discoverAvailableLanguages();

            if (availableLanguages.length === 0) {
                console.log('[ERROR] No test files found in test/ directory.');
                console.log('Please ensure test files exist (test.js, test.py, test.php, etc.)');
                process.exit(1);
            }

            console.log(`[INFO] Discovered ${availableLanguages.length} language(s): ${availableLanguages.map(l => l.config.displayName).join(', ')}\n`);

            const results = [];

            // Run tests for each discovered language
            for (let i = 0; i < availableLanguages.length; i++) {
                const lang = availableLanguages[i];
                const result = await this.runLanguageTests(lang.key, lang.config);
                results.push(result);

                // Add spacing between language tests (except after the last one)
                if (i < availableLanguages.length - 1) {
                    console.log('');
                }
            }

            this.printSummary();

            // Only consider languages that were actually attempted (not null)
            const attemptedResults = results.filter(result => result !== null);
            const allPassed = attemptedResults.length > 0 && attemptedResults.every(result => result === true);

            if (attemptedResults.length === 0) {
                console.log('[ERROR] No languages available for testing. Please install required runtimes.');
                process.exit(1);
            }

            process.exit(allPassed ? 0 : 1);
        }
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetLanguage = args[0];

// Show usage if help is requested
if (args.includes('--help') || args.includes('-h')) {
    const runner = new TestRunner();
    const availableLanguages = runner.discoverAvailableLanguages();

    console.log(`
Usage: node test/run-tests.js [language]

Examples:
  node test/run-tests.js           # Run all available tests
  node test/run-tests.js js        # Run only JavaScript tests
  node test/run-tests.js python    # Run only Python tests
  node test/run-tests.js php       # Run only PHP tests

Currently available languages:`);

    if (availableLanguages.length > 0) {
        availableLanguages.forEach(lang => {
            console.log(`  - ${lang.config.displayName}: ${lang.config.aliases.join(', ')}`);
        });
    } else {
        console.log('  (No test files found)');
    }

    console.log(`
Adding a new language:
1. Create a test file: test/test.[extension]
2. Add language configuration to the languageConfigs object in run-tests.js
3. Install the language runtime
4. Test with: node test/run-tests.js [language]

This test runner automatically discovers available languages based on test files
and language configurations, making it easy for contributors to add new languages.
`);
    process.exit(0);
}

// Run the tests
const runner = new TestRunner();
runner.run(targetLanguage).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
