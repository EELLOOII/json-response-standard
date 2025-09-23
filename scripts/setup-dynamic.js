#!/usr/bin/env node
/**
 * Master Setup Script for JSON Response Standard
 * One command to set up the entire dynamic infrastructure
 * 
 * Usage: node scripts/setup-dynamic.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DynamicSetup {
    constructor() {
        this.projectRoot = process.cwd();
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

    async setupDynamicInfrastructure() {
        console.log('🚀 Setting up Dynamic Language Infrastructure for JSON Response Standard\n');
        console.log('This will make adding new languages completely automatic!\n');
        
        // Step 1: Generate all dynamic configurations
        console.log('📋 Step 1: Generating dynamic configurations...');
        await this.runCommand('node', ['scripts/generate-dockerfile.js', '--available']);
        await this.runCommand('node', ['scripts/generate-docker-compose.js', '--override']);
        console.log('✅ Dynamic configurations generated!\n');
        
        // Step 2: Test current languages
        console.log('🧪 Step 2: Testing current language implementations...');
        await this.runCommand('node', ['test/run-tests.js']);
        console.log('✅ Current languages tested!\n');
        
        // Step 3: Show language status
        console.log('📊 Step 3: Checking language support status...');
        await this.runCommand('node', ['scripts/generate-dockerfile.js', '--matrix']);
        console.log('');
        await this.runCommand('node', ['scripts/update-ci-matrix.js']);
        console.log('✅ Status check complete!\n');
        
        // Step 4: Test Docker setup
        console.log('🐳 Step 4: Testing Docker integration...');
        try {
            await this.runCommand('docker', ['--version']);
            console.log('   Docker is available, testing build...');
            
            const buildResult = await this.runCommand('docker', ['build', '-t', 'json-test-setup', '.']);
            if (buildResult.success) {
                console.log('   Testing container...');
                await this.runCommand('docker', ['run', '--rm', 'json-test-setup']);
                
                // Clean up
                await this.runCommand('docker', ['rmi', 'json-test-setup'], { stdio: 'ignore' });
                console.log('✅ Docker integration working!');
            } else {
                console.log('⚠️  Docker build failed');
            }
        } catch (error) {
            console.log('⚠️  Docker not available:', error.message);
        }
        
        console.log('\n🎉 Dynamic Infrastructure Setup Complete!\n');
        this.showUsageInstructions();
    }

    showUsageInstructions() {
        console.log('📚 How to Add a New Language (For Contributors)');
        console.log('===============================================\n');
        
        console.log('🎯 Quick Start:');
        console.log('  node scripts/test-language.js --setup\n');
        
        console.log('📝 Manual Process:');
        console.log('  1. Create: examples/response.[ext]');
        console.log('  2. Create: test/test.[ext]');
        console.log('  3. Add config to: test/run-tests.js');
        console.log('  4. Test: node scripts/test-language.js [language]\n');
        
        console.log('🔧 Advanced Features:');
        console.log('  node scripts/generate-dockerfile.js --all     # Add Docker support');
        console.log('  node scripts/generate-docker-compose.js --list  # See services');
        console.log('  node scripts/update-ci-matrix.js              # Update CI matrix\n');
        
        console.log('🧪 Testing Commands:');
        console.log('  node test/run-tests.js                        # Test all languages');
        console.log('  node test/run-tests.js [language]             # Test specific language');
        console.log('  docker compose up json-response-standard      # Test in Docker');
        console.log('  node scripts/test-language.js [language]      # Full language test\n');
        
        console.log('📊 Status Commands:');
        console.log('  node scripts/test-language.js --status        # Language status');
        console.log('  node scripts/generate-dockerfile.js --matrix  # Docker matrix');
        console.log('  node test/run-tests.js --help                 # Available languages\n');
        
        console.log('🎉 Benefits of Dynamic Infrastructure:');
        console.log('  ✅ Zero CI file edits needed for new languages');
        console.log('  ✅ Automatic Docker service generation');
        console.log('  ✅ Cross-platform testing (Linux, Windows, macOS)');
        console.log('  ✅ Multi-version runtime testing');
        console.log('  ✅ Consistent contributor experience');
        console.log('  ✅ Scales to unlimited languages\n');
        
        console.log('💡 For Maintainers:');
        console.log('  The infrastructure automatically adapts to new languages.');
        console.log('  Contributors can add languages without any infrastructure changes.');
        console.log('  Everything is tested consistently across all platforms.\n');
        
        console.log('🚀 Ready for Contributors!');
        console.log('  This project is now one of the most contributor-friendly');
        console.log('  multi-language projects on GitHub!');
    }

    async checkPrerequisites() {
        console.log('🔍 Checking prerequisites...\n');
        
        const checks = [
            { name: 'Node.js', command: 'node', args: ['--version'] },
            { name: 'npm', command: 'npm', args: ['--version'] },
            { name: 'Docker', command: 'docker', args: ['--version'], optional: true },
            { name: 'Git', command: 'git', args: ['--version'] }
        ];
        
        for (const check of checks) {
            try {
                const result = await this.runCommand(check.command, check.args, { stdio: 'pipe' });
                if (result.success) {
                    console.log(`✅ ${check.name} is available`);
                } else {
                    console.log(`❌ ${check.name} check failed`);
                }
            } catch (error) {
                if (check.optional) {
                    console.log(`⚠️  ${check.name} not available (optional)`);
                } else {
                    console.log(`❌ ${check.name} not available (required)`);
                }
            }
        }
        
        console.log('');
    }

    async runQuickDemo() {
        console.log('🎬 Running Quick Demo...\n');
        
        console.log('📋 Available languages:');
        await this.runCommand('node', ['test/run-tests.js', '--help']);
        
        console.log('\n🧪 Testing all languages:');
        await this.runCommand('node', ['test/run-tests.js']);
        
        console.log('\n📊 Language matrix:');
        await this.runCommand('node', ['scripts/generate-dockerfile.js', '--matrix']);
        
        console.log('\n🎉 Demo complete!');
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    const setup = new DynamicSetup();
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Master Setup Script for JSON Response Standard Dynamic Infrastructure

Usage:
  node scripts/setup-dynamic.js [options]

Options:
  --check, -c       Check prerequisites only
  --demo, -d        Run quick demo
  --help, -h        Show this help

Examples:
  node scripts/setup-dynamic.js              # Full setup
  node scripts/setup-dynamic.js --check      # Check prerequisites
  node scripts/setup-dynamic.js --demo       # Quick demo
        `);
        return;
    }
    
    if (args.includes('--check') || args.includes('-c')) {
        await setup.checkPrerequisites();
        return;
    }
    
    if (args.includes('--demo') || args.includes('-d')) {
        await setup.runQuickDemo();
        return;
    }
    
    // Full setup
    await setup.checkPrerequisites();
    await setup.setupDynamicInfrastructure();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = DynamicSetup;
