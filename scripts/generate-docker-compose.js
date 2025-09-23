#!/usr/bin/env node
/**
 * Dynamic Docker Compose Generator
 * Automatically generates docker-compose.yml based on discovered languages
 * 
 * Usage: node scripts/generate-docker-compose.js
 */

const fs = require('fs');
const path = require('path');

class DockerComposeGenerator {
    constructor() {
        this.testDir = path.join(__dirname, '..', 'test');
        this.projectRoot = path.dirname(this.testDir);
        
        // Import language configurations
        this.loadLanguageConfigs();
        
        // Base docker-compose structure
        this.baseCompose = {
            version: '3.8',
            services: {},
            networks: {
                'json-network': {
                    driver: 'bridge'
                }
            },
            volumes: {
                'node_modules': null
            }
        };
    }

    loadLanguageConfigs() {
        try {
            const testRunnerPath = path.join(this.testDir, 'run-tests.js');
            const testRunnerContent = fs.readFileSync(testRunnerPath, 'utf8');
            
            // Extract language configurations
            const configMatch = testRunnerContent.match(/languageConfigs\s*=\s*({[\s\S]*?});/);
            if (!configMatch) {
                throw new Error('Could not find languageConfigs in test runner');
            }
            
            // Parse the configuration
            const configStr = configMatch[1];
            this.languageConfigs = eval(`(${configStr})`);
        } catch (error) {
            console.error('Error loading language configs:', error.message);
            this.languageConfigs = {};
        }
    }

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

    generateCoreServices() {
        // Main testing service (always present)
        this.baseCompose.services['json-response-standard'] = {
            build: {
                context: '.',
                dockerfile: 'Dockerfile'
            },
            container_name: 'json-response-standard-test',
            volumes: [
                '.:/app',
                '/app/node_modules'
            ],
            working_dir: '/app',
            command: 'node test/run-tests.js',
            environment: [
                'NODE_ENV=development'
            ],
            networks: [
                'json-network'
            ]
        };

        // Development service (always present)
        this.baseCompose.services['json-dev'] = {
            build: {
                context: '.',
                dockerfile: 'Dockerfile'
            },
            container_name: 'json-response-standard-dev',
            volumes: [
                '.:/app',
                '/app/node_modules'
            ],
            working_dir: '/app',
            command: '/bin/bash',
            stdin_open: true,
            tty: true,
            environment: [
                'NODE_ENV=development'
            ],
            networks: [
                'json-network'
            ]
        };
    }

    generateLanguageServices() {
        const availableLanguages = this.discoverAvailableLanguages();
        
        console.log(`🔍 Discovered ${availableLanguages.length} language(s): ${availableLanguages.map(l => l.config.displayName).join(', ')}`);
        
        availableLanguages.forEach(lang => {
            const serviceName = `test-${lang.key}`;
            const command = this.buildCommand(lang.config);
            
            this.baseCompose.services[serviceName] = {
                build: {
                    context: '.',
                    dockerfile: 'Dockerfile'
                },
                container_name: `json-test-${lang.key}`,
                volumes: [
                    '.:/app'
                ],
                working_dir: '/app',
                command: command,
                networks: [
                    'json-network'
                ]
            };
            
            console.log(`✅ Generated service: ${serviceName} (${lang.config.displayName})`);
        });
    }

    buildCommand(config) {
        // Handle different command structures
        if (config.args && config.args.length > 0) {
            return [config.command, ...config.args].join(' ');
        } else {
            return `${config.command} ${config.testFile}`;
        }
    }

    generateComposeFile() {
        console.log('🐳 Generating dynamic docker-compose.yml...\n');
        
        this.generateCoreServices();
        this.generateLanguageServices();
        
        // Convert to YAML-like format (simplified)
        const yamlContent = this.toYAML(this.baseCompose);
        
        return yamlContent;
    }

    toYAML(obj, indent = 0) {
        const spaces = '  '.repeat(indent);
        let yaml = '';
        
        for (const [key, value] of Object.entries(obj)) {
            if (value === null) {
                yaml += `${spaces}${key}:\n`;
            } else if (Array.isArray(value)) {
                yaml += `${spaces}${key}:\n`;
                value.forEach(item => {
                    if (typeof item === 'string') {
                        yaml += `${spaces}  - ${item}\n`;
                    } else {
                        yaml += `${spaces}  - ${this.toYAML(item, indent + 2)}`;
                    }
                });
            } else if (typeof value === 'object') {
                yaml += `${spaces}${key}:\n`;
                yaml += this.toYAML(value, indent + 1);
            } else {
                yaml += `${spaces}${key}: ${value}\n`;
            }
        }
        
        return yaml;
    }

    writeComposeFile() {
        const yamlContent = this.generateComposeFile();
        const outputPath = path.join(this.projectRoot, 'docker-compose.generated.yml');
        
        // Add header comment
        const header = `# Auto-generated docker-compose.yml
# Generated by: node scripts/generate-docker-compose.js
# Based on discovered languages in test/ directory
# 
# To regenerate: node scripts/generate-docker-compose.js
# To use: docker compose -f docker-compose.generated.yml up

`;
        
        fs.writeFileSync(outputPath, header + yamlContent);
        
        console.log(`\n📁 Generated: ${outputPath}`);
        console.log('\n🚀 Usage:');
        console.log('  docker compose -f docker-compose.generated.yml up json-response-standard');
        console.log('  docker compose -f docker-compose.generated.yml up test-javascript');
        console.log('  docker compose -f docker-compose.generated.yml up test-python');
        
        return outputPath;
    }

    generateDockerComposeOverride() {
        // Create a docker-compose.override.yml that extends the base file
        const availableLanguages = this.discoverAvailableLanguages();
        
        const override = {
            version: '3.8',
            services: {}
        };
        
        // Add language-specific services
        availableLanguages.forEach(lang => {
            const serviceName = `test-${lang.key}`;
            const command = this.buildCommand(lang.config);
            
            override.services[serviceName] = {
                build: {
                    context: '.',
                    dockerfile: 'Dockerfile'
                },
                container_name: `json-test-${lang.key}`,
                volumes: ['.:/app'],
                working_dir: '/app',
                command: command,
                networks: ['json-network']
            };
        });
        
        const yamlContent = this.toYAML(override);
        const overridePath = path.join(this.projectRoot, 'docker-compose.override.yml');
        
        const header = `# Auto-generated docker-compose.override.yml
# This file automatically extends docker-compose.yml with discovered languages
# Generated by: node scripts/generate-docker-compose.js
# 
# Docker Compose automatically merges this with docker-compose.yml

`;
        
        fs.writeFileSync(overridePath, header + yamlContent);
        
        console.log(`\n📁 Generated: ${overridePath}`);
        console.log('\n🎯 This file automatically extends docker-compose.yml');
        console.log('   Just run: docker compose up');
        
        return overridePath;
    }
}

// Helper function to show available services
function showAvailableServices() {
    const generator = new DockerComposeGenerator();
    const availableLanguages = generator.discoverAvailableLanguages();
    
    console.log('\n📊 Available Docker Services:');
    console.log('============================');
    console.log('🔧 Core Services:');
    console.log('  - json-response-standard (runs all tests)');
    console.log('  - json-dev (interactive development)');
    
    if (availableLanguages.length > 0) {
        console.log('\n🗣️  Language Services:');
        availableLanguages.forEach(lang => {
            console.log(`  - test-${lang.key} (${lang.config.displayName})`);
        });
    } else {
        console.log('\n⚠️  No language test files found');
    }
    
    console.log('\n💡 Usage Examples:');
    console.log('  docker compose up json-response-standard  # Test all languages');
    console.log('  docker compose up json-dev               # Interactive development');
    availableLanguages.forEach(lang => {
        console.log(`  docker compose up test-${lang.key.padEnd(10)} # Test ${lang.config.displayName} only`);
    });
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Dynamic Docker Compose Generator for JSON Response Standard

Usage:
  node scripts/generate-docker-compose.js [options]

Options:
  --generate, -g    Generate docker-compose.generated.yml
  --override, -o    Generate docker-compose.override.yml (recommended)
  --list, -l        List available services
  --help, -h        Show this help

Examples:
  node scripts/generate-docker-compose.js --override
  node scripts/generate-docker-compose.js --list
        `);
        return;
    }
    
    const generator = new DockerComposeGenerator();
    
    if (args.includes('--list') || args.includes('-l')) {
        showAvailableServices();
        return;
    }
    
    if (args.includes('--generate') || args.includes('-g')) {
        generator.writeComposeFile();
        return;
    }
    
    if (args.includes('--override') || args.includes('-o')) {
        generator.generateDockerComposeOverride();
        return;
    }
    
    // Default: generate override file
    generator.generateDockerComposeOverride();
    showAvailableServices();
}

if (require.main === module) {
    main();
}

module.exports = DockerComposeGenerator;
