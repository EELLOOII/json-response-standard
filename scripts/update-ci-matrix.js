#!/usr/bin/env node
/**
 * Automatically update CI matrix based on supported languages
 * This script reads the language configurations and updates the CI workflow
 * 
 * Usage: node scripts/update-ci-matrix.js
 */

const fs = require('fs');
const path = require('path');

// Import the language configurations from the test runner
const testRunnerPath = path.join(__dirname, '..', 'test', 'run-tests.js');
const testRunnerContent = fs.readFileSync(testRunnerPath, 'utf8');

// Extract language configurations (this is a simple regex-based extraction)
const configMatch = testRunnerContent.match(/languageConfigs\s*=\s*({[\s\S]*?});/);
if (!configMatch) {
    console.error('Could not find languageConfigs in test runner');
    process.exit(1);
}

// Parse the configuration (note: this is a simplified approach)
const configStr = configMatch[1];
const languageConfigs = eval(`(${configStr})`); // Note: eval is used here for simplicity

// Define version matrices for each language/runtime
const versionMatrices = {
    javascript: ['16', '18', '20', '22'],
    python: ['3.8', '3.9', '3.10', '3.11', '3.12'],
    php: ['7.4', '8.0', '8.1', '8.2', '8.3'],
    go: ['1.19', '1.20', '1.21', '1.22'],
    rust: ['1.70', '1.71', '1.72'],
    java: ['11', '17', '21'],
    csharp: ['6.0', '7.0', '8.0']
};

// Map language to setup actions
const setupActions = {
    javascript: 'actions/setup-node@v5',
    python: 'actions/setup-python@v6',
    php: 'shivammathur/setup-php@v2',
    go: 'actions/setup-go@v5',
    rust: 'actions-rs/toolchain@v1',
    java: 'actions/setup-java@v4',
    csharp: 'actions/setup-dotnet@v4'
};

// Map language to version parameter names
const versionParams = {
    javascript: 'node-version',
    python: 'python-version',
    php: 'php-version',
    go: 'go-version',
    rust: 'toolchain',
    java: 'java-version',
    csharp: 'dotnet-version'
};

// Map language to runtime names for display
const runtimeNames = {
    javascript: 'node',
    python: 'python',
    php: 'php',
    go: 'go',
    rust: 'cargo',
    java: 'java',
    csharp: 'dotnet'
};

// Generate the matrix include entries
function generateMatrixEntries() {
    const entries = [];
    
    Object.keys(languageConfigs).forEach(langKey => {
        const config = languageConfigs[langKey];
        const versions = versionMatrices[langKey];
        const setupAction = setupActions[langKey];
        const versionParam = versionParams[langKey];
        const runtime = runtimeNames[langKey];
        
        if (versions && setupAction && versionParam && runtime) {
            versions.forEach(version => {
                entries.push({
                    language: langKey,
                    runtime: runtime,
                    version: version,
                    setup_action: setupAction,
                    version_param: versionParam
                });
            });
        } else {
            console.warn(`⚠️  Language ${langKey} is configured but missing CI matrix configuration`);
        }
    });
    
    return entries;
}

// Format matrix entries for YAML
function formatMatrixForYAML(entries) {
    const yamlLines = [];
    yamlLines.push('        include:');
    
    entries.forEach(entry => {
        yamlLines.push(`          - language: ${entry.language}`);
        yamlLines.push(`            runtime: ${entry.runtime}`);
        yamlLines.push(`            version: "${entry.version}"`);
        yamlLines.push(`            setup_action: ${entry.setup_action}`);
        yamlLines.push(`            version_param: ${entry.version_param}`);
    });
    
    return yamlLines.join('\n');
}

// Generate documentation for adding new languages
function generateLanguageGuide() {
    const availableLanguages = Object.keys(languageConfigs);
    const configuredLanguages = Object.keys(versionMatrices);
    const unconfiguredLanguages = availableLanguages.filter(lang => !configuredLanguages.includes(lang));
    
    console.log('\n📊 Language Support Summary:');
    console.log('============================');
    console.log(`✅ Configured languages: ${configuredLanguages.join(', ')}`);
    
    if (unconfiguredLanguages.length > 0) {
        console.log(`⚠️  Languages needing CI configuration: ${unconfiguredLanguages.join(', ')}`);
        console.log('\nTo add CI support for these languages:');
        console.log('1. Add version matrix to scripts/update-ci-matrix.js');
        console.log('2. Add setup action mapping');
        console.log('3. Add version parameter mapping');
        console.log('4. Run: node scripts/update-ci-matrix.js');
    }
    
    return {
        total: availableLanguages.length,
        configured: configuredLanguages.length,
        needsConfig: unconfiguredLanguages.length
    };
}

// Main execution
function main() {
    console.log('🔧 Updating CI matrix for JSON Response Standard...\n');
    
    const entries = generateMatrixEntries();
    const matrixYAML = formatMatrixForYAML(entries);
    
    console.log('Generated CI Matrix:');
    console.log('===================');
    console.log(matrixYAML);
    
    const stats = generateLanguageGuide();
    
    console.log('\n📝 Instructions:');
    console.log('================');
    console.log('1. Copy the matrix configuration above');
    console.log('2. Replace the matrix section in .github/workflows/ci.yml');
    console.log('3. Ensure the strategy.matrix section looks like this:\n');
    console.log('    strategy:');
    console.log('      matrix:');
    console.log('        # Test core languages with multiple versions');
    console.log(matrixYAML);
    
    console.log(`\n✨ Summary: ${stats.configured}/${stats.total} languages configured for CI testing`);
    
    if (stats.needsConfig > 0) {
        console.log(`\n⚡ Next: Add CI configuration for ${stats.needsConfig} remaining language(s)`);
    } else {
        console.log('\n🎉 All discovered languages are configured for CI testing!');
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    generateMatrixEntries,
    formatMatrixForYAML,
    generateLanguageGuide
};
