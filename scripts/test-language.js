#!/usr/bin/env node
/**
 * One-Command Language Tester
 * Makes it super easy for contributors to test their new languages
 * 
 * Usage: node scripts/test-language.js [language]
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class LanguageTester {
    constructor() {
        this.projectRoot = process.cwd();
        this.testDir = path.join(this.projectRoot, 'test');
        this.scriptsDir = path.join(this.projectRoot, 'scripts');
    }

    async runCommand(command, args = [], options = {}) {
        return new Promise((resolve, reject) => {
            console.log(`🔧 Running: ${command} ${args.join(' ')}`);
            
            const process = spawn(command, args, {
                cwd: this.projectRoot,
                stdio: 'inherit',
                ...options
            });

            process.on('close', (code) => {
                resolve({
                    code,
                    success: code === 0
                });
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    async testLanguage(language) {
        console.log(`🚀 Testing ${language} language support...\n`);
        
        // Step 1: Test with test runner
        console.log('📋 Step 1: Running language-specific tests...');
        const testResult = await this.runCommand('node', ['test/run-tests.js', language]);
        
        if (!testResult.success) {
            console.log(`❌ ${language} tests failed`);
            return false;
        }
        
        console.log(`✅ ${language} tests passed!\n`);
        
        // Step 2: Test Docker support
        console.log('🐳 Step 2: Testing Docker support...');
        await this.testDockerSupport(language);
        
        // Step 3: Generate dynamic configurations
        console.log('⚙️  Step 3: Generating dynamic configurations...');
        await this.generateConfigurations();
        
        console.log(`\n🎉 ${language} language support is working perfectly!`);
        return true;
    }

    async testDockerSupport(language) {
        try {
            // Generate dynamic Docker configurations
            await this.runCommand('node', ['scripts/generate-dockerfile.js', '--available']);
            await this.runCommand('node', ['scripts/generate-docker-compose.js', '--override']);
            
            // Try to build and run
            console.log('   Building Docker image...');
            const buildResult = await this.runCommand('docker', ['build', '-t', 'json-test-temp', '.']);
            
            if (buildResult.success) {
                console.log('   Testing in Docker container...');
                await this.runCommand('docker', ['run', '--rm', 'json-test-temp', 'node', 'test/run-tests.js', language]);
                
                // Clean up
                await this.runCommand('docker', ['rmi', 'json-test-temp'], { stdio: 'ignore' });
                console.log('✅ Docker support working!');
            } else {
                console.log('⚠️  Docker build failed (might need runtime installation)');
            }
        } catch (error) {
            console.log('⚠️  Docker not available or failed:', error.message);
        }
    }

    async generateConfigurations() {
        try {
            await this.runCommand('node', ['scripts/generate-dockerfile.js', '--matrix']);
            await this.runCommand('node', ['scripts/generate-docker-compose.js', '--list']);
            await this.runCommand('node', ['scripts/update-ci-matrix.js']);
        } catch (error) {
            console.log('⚠️  Configuration generation failed:', error.message);
        }
    }

    async setupNewLanguage() {
        console.log('🎯 Setting up a new language...\n');
        
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
        
        try {
            const language = await question('Language name (e.g., rust, java, csharp): ');
            const extension = await question('File extension (e.g., rs, java, cs): ');
            const command = await question('Runtime command (e.g., cargo, java, dotnet): ');
            const displayName = await question('Display name (e.g., Rust, Java, C#): ');
            
            rl.close();
            
            console.log(`\n🔧 Setting up ${displayName} support...\n`);
            
            // Create template files
            this.createTemplateFiles(language, extension, command, displayName);
            
            // Show next steps
            this.showNextSteps(language, extension, command, displayName);
            
        } catch (error) {
            console.log('❌ Setup failed:', error.message);
            rl.close();
        }
    }

    createTemplateFiles(language, extension, command, displayName) {
        // Create example implementation template
        const examplePath = path.join(this.projectRoot, 'examples', `response.${extension}`);
        const exampleContent = this.generateExampleTemplate(language, extension, command, displayName);
        
        // Create test template
        const testPath = path.join(this.projectRoot, 'test', `test.${extension}`);
        const testContent = this.generateTestTemplate(language, extension, command, displayName);
        
        // Write template files
        fs.writeFileSync(examplePath + '.template', exampleContent);
        fs.writeFileSync(testPath + '.template', testContent);
        
        console.log(`📁 Created: ${examplePath}.template`);
        console.log(`📁 Created: ${testPath}.template`);
        
        // Show config to add
        console.log('\n⚙️  Add this configuration to test/run-tests.js:');
        console.log(this.generateConfigSnippet(language, extension, command, displayName));
    }

    generateExampleTemplate(language, extension, command, displayName) {
        return `// examples/response.${extension}
// ${displayName} implementation for JSON Response Standard
// 
// TODO: Implement the jsonResponse function that:
// 1. Takes (data, status, message) parameters
// 2. Validates status code (100-599)
// 3. Handles null/empty data gracefully
// 4. Returns JSON in format: {"status": 200, "message": "Success", "data": {}}
//
// Example usage:
// ${command} examples/response.${extension}

// Your implementation here...

function main() {
    // Example usage
    const data = {"user": "John"};
    const result = jsonResponse(data, 200, "Success");
    console.log(result);
}

if (require.main === module) {
    main();
}
`;
    }

    generateTestTemplate(language, extension, command, displayName) {
        return `// test/test.${extension}
// ${displayName} tests for JSON Response Standard
//
// TODO: Implement tests that verify:
// 1. Basic response generation
// 2. Default parameter handling  
// 3. Status code validation (100-599)
// 4. Error handling
// 5. JSON structure compliance
//
// Must exit with code 0 on success, 1 on failure
// Must print [PASS]/[FAIL] for each test

// Your test implementation here...

function runTests() {
    console.log("Running ${displayName} JSON Response tests...");
    
    let passedTests = 0;
    let totalTests = 0;
    
    // TODO: Add your tests here
    
    // Test 1: Basic response generation
    totalTests++;
    if (testBasicResponse()) {
        console.log("[PASS] Basic response generation");
        passedTests++;
    } else {
        console.log("[FAIL] Basic response generation");
    }
    
    // Test 2: Status validation
    totalTests++;
    if (testStatusValidation()) {
        console.log("[PASS] Status validation");
        passedTests++;
    } else {
        console.log("[FAIL] Status validation");
    }
    
    console.log(\`\\nTests completed! \${passedTests}/\${totalTests} tests passed.\`);
    
    if (passedTests === totalTests) {
        console.log("[SUCCESS] All ${displayName} tests passed!");
        process.exit(0);
    } else {
        console.log(\`[FAILURE] \${totalTests - passedTests} tests failed.\`);
        process.exit(1);
    }
}

function testBasicResponse() {
    // TODO: Implement basic response test
    return false;
}

function testStatusValidation() {
    // TODO: Implement status validation test  
    return false;
}

if (require.main === module) {
    runTests();
}
`;
    }

    generateConfigSnippet(language, extension, command, displayName) {
        return `
'${language}': {
    aliases: ['${language}'],
    testFile: 'test.${extension}',
    command: '${command}',
    args: ['test/test.${extension}'], // Adjust based on your runtime
    versionFlag: '--version',
    displayName: '${displayName}'
},`;
    }

    showNextSteps(language, extension, command, displayName) {
        console.log(`\n📋 Next Steps for ${displayName} Support:`);
        console.log('=====================================');
        console.log('1. ✏️  Edit the template files:');
        console.log(`   - examples/response.${extension}.template`);
        console.log(`   - test/test.${extension}.template`);
        console.log('');
        console.log('2. 🔄 Rename them (remove .template):');
        console.log(`   - mv examples/response.${extension}.template examples/response.${extension}`);
        console.log(`   - mv test/test.${extension}.template test/test.${extension}`);
        console.log('');
        console.log('3. ⚙️  Add the configuration to test/run-tests.js');
        console.log('');
        console.log('4. 🧪 Test your implementation:');
        console.log(`   - node scripts/test-language.js ${language}`);
        console.log('');
        console.log('5. 🐳 Add Docker support (optional):');
        console.log('   - node scripts/generate-dockerfile.js --all');
        console.log('   - Add runtime installation to the dockerfile generator');
        console.log('');
        console.log('6. 🚀 Test everything:');
        console.log('   - node test/run-tests.js');
        console.log('   - docker compose up json-response-standard');
        console.log('');
        console.log(`🎉 Once complete, ${displayName} will be automatically:)`);
        console.log('   ✅ Tested in CI across multiple versions');
        console.log('   ✅ Included in Docker containers');
        console.log('   ✅ Tested on Windows, macOS, and Linux');
        console.log('   ✅ Available to all other contributors');
    }

    async showLanguageStatus() {
        console.log('📊 Language Support Status\n');
        
        try {
            await this.runCommand('node', ['test/run-tests.js', '--help']);
            console.log('');
            await this.runCommand('node', ['scripts/generate-dockerfile.js', '--matrix']);
            console.log('');
            await this.runCommand('node', ['scripts/update-ci-matrix.js']);
        } catch (error) {
            console.log('❌ Error checking status:', error.message);
        }
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    const tester = new LanguageTester();
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
One-Command Language Tester for JSON Response Standard

Usage:
  node scripts/test-language.js [language]     Test specific language
  node scripts/test-language.js --setup       Setup a new language
  node scripts/test-language.js --status      Show language status
  node scripts/test-language.js --help        Show this help

Examples:
  node scripts/test-language.js go            Test Go language
  node scripts/test-language.js rust          Test Rust language
  node scripts/test-language.js --setup       Setup a new language
  node scripts/test-language.js --status      Show all language status
        `);
        return;
    }
    
    if (args.includes('--setup')) {
        await tester.setupNewLanguage();
        return;
    }
    
    if (args.includes('--status')) {
        await tester.showLanguageStatus();
        return;
    }
    
    const language = args[0];
    if (language) {
        await tester.testLanguage(language);
    } else {
        console.log('❓ Please specify a language to test, or use --help for options');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = LanguageTester;
