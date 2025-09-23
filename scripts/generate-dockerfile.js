#!/usr/bin/env node
/**
 * Dynamic Dockerfile Generator
 * Automatically generates Dockerfile based on language requirements
 * 
 * Usage: node scripts/generate-dockerfile.js
 */

const fs = require('fs');
const path = require('path');

class DockerfileGenerator {
    constructor() {
        this.testDir = path.join(__dirname, '..', 'test');
        this.projectRoot = path.dirname(this.testDir);
        
        // Load language configurations
        this.loadLanguageConfigs();
        
        // Language installation configurations
        this.languageInstallers = {
            javascript: {
                required: true, // Always needed for test runner
                install: () => `
# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_\${NODE_VERSION}.x | bash - \\
    && apt-get install -y nodejs`,
                verify: 'RUN node --version && npm --version',
                env: 'ENV NODE_VERSION=20'
            },
            
            python: {
                required: false,
                install: () => `
# Install Python
RUN apt-get update && apt-get install -y \\
    python\${PYTHON_VERSION} \\
    python3-pip \\
    python3-venv \\
    && ln -sf /usr/bin/python\${PYTHON_VERSION} /usr/bin/python \\
    && ln -sf /usr/bin/python\${PYTHON_VERSION} /usr/bin/python3`,
                verify: 'RUN python --version',
                env: 'ENV PYTHON_VERSION=3.10'
            },
            
            php: {
                required: false,
                install: () => `
# Install PHP
RUN apt-get update && apt-get install -y \\
    php-cli \\
    php-json \\
    php-mbstring \\
    && rm -rf /var/lib/apt/lists/*`,
                verify: 'RUN php --version',
                env: null
            },
            
            go: {
                required: false,
                install: () => `
# Install Go
RUN wget https://go.dev/dl/go\${GO_VERSION}.linux-amd64.tar.gz \\
    && tar -C /usr/local -xzf go\${GO_VERSION}.linux-amd64.tar.gz \\
    && rm go\${GO_VERSION}.linux-amd64.tar.gz

# Add Go to PATH
ENV PATH=$PATH:/usr/local/go/bin`,
                verify: 'RUN go version',
                env: 'ENV GO_VERSION=1.22.7'
            },
            
            rust: {
                required: false,
                install: () => `
# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \\
    && echo 'source ~/.cargo/env' >> ~/.bashrc
ENV PATH="/root/.cargo/bin:\${PATH}"`,
                verify: 'RUN /root/.cargo/bin/rustc --version && /root/.cargo/bin/cargo --version',
                env: null
            },
            
            java: {
                required: false,
                install: () => `
# Install Java (OpenJDK)
RUN apt-get update && apt-get install -y \\
    openjdk-\${JAVA_VERSION}-jdk \\
    && rm -rf /var/lib/apt/lists/*`,
                verify: 'RUN java --version && javac --version',
                env: 'ENV JAVA_VERSION=17'
            },
            
            csharp: {
                required: false,
                install: () => `
# Install .NET
RUN wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \\
    && dpkg -i packages-microsoft-prod.deb \\
    && rm packages-microsoft-prod.deb \\
    && apt-get update \\
    && apt-get install -y dotnet-sdk-\${DOTNET_VERSION} \\
    && rm -rf /var/lib/apt/lists/*`,
                verify: 'RUN dotnet --version',
                env: 'ENV DOTNET_VERSION=8.0'
            },
            
            ruby: {
                required: false,
                install: () => `
# Install Ruby
RUN apt-get update && apt-get install -y \\
    ruby-full \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*`,
                verify: 'RUN ruby --version && gem --version',
                env: null
            }
        };
    }

    loadLanguageConfigs() {
        try {
            const testRunnerPath = path.join(this.testDir, 'run-tests.js');
            const testRunnerContent = fs.readFileSync(testRunnerPath, 'utf8');
            
            const configMatch = testRunnerContent.match(/languageConfigs\s*=\s*({[\s\S]*?});/);
            if (!configMatch) {
                throw new Error('Could not find languageConfigs in test runner');
            }
            
            const configStr = configMatch[1];
            this.languageConfigs = eval(`(${configStr})`);
        } catch (error) {
            console.error('Error loading language configs:', error.message);
            this.languageConfigs = {};
        }
    }

    discoverRequiredLanguages() {
        const requiredLanguages = ['javascript']; // Always need Node.js for test runner
        const availableLanguages = [];
        
        for (const [langKey, config] of Object.entries(this.languageConfigs)) {
            const testFilePath = path.join(this.testDir, config.testFile);
            if (fs.existsSync(testFilePath)) {
                availableLanguages.push(langKey);
                if (!requiredLanguages.includes(langKey)) {
                    requiredLanguages.push(langKey);
                }
            }
        }
        
        return {
            required: requiredLanguages,
            available: availableLanguages,
            all: Object.keys(this.languageConfigs)
        };
    }

    generateDockerfile(mode = 'available') {
        const languages = this.discoverRequiredLanguages();
        const targetLanguages = mode === 'all' ? languages.all : languages.required;
        
        console.log(`🐳 Generating Dockerfile for ${mode} languages...`);
        console.log(`📦 Target languages: ${targetLanguages.join(', ')}`);
        
        let dockerfile = this.getDockerfileHeader();
        
        // Add environment variables
        dockerfile += this.generateEnvironmentVariables(targetLanguages);
        
        // Add system dependencies
        dockerfile += this.getSystemDependencies();
        
        // Add language installations
        dockerfile += this.generateLanguageInstallations(targetLanguages);
        
        // Add verification section
        dockerfile += this.generateVerifications(targetLanguages);
        
        // Add project setup
        dockerfile += this.getProjectSetup();
        
        return dockerfile;
    }

    getDockerfileHeader() {
        return `# Multi-language Dockerfile for JSON Response Standard
# Auto-generated by: node scripts/generate-dockerfile.js
# Supports dynamic language discovery and installation
#
# To regenerate: node scripts/generate-dockerfile.js

FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

`;
    }

    generateEnvironmentVariables(languages) {
        let envVars = '';
        
        languages.forEach(lang => {
            const installer = this.languageInstallers[lang];
            if (installer && installer.env) {
                envVars += installer.env + '\n';
            }
        });
        
        return envVars + '\n';
    }

    getSystemDependencies() {
        return `# Install system dependencies
RUN apt-get update && apt-get install -y \\
    curl \\
    wget \\
    software-properties-common \\
    ca-certificates \\
    gnupg \\
    lsb-release \\
    git \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

`;
    }

    generateLanguageInstallations(languages) {
        let installations = '';
        
        languages.forEach(lang => {
            const installer = this.languageInstallers[lang];
            if (installer && installer.install) {
                installations += installer.install() + '\n\n';
            }
        });
        
        return installations;
    }

    generateVerifications(languages) {
        let verifications = '# Verify installations\n';
        const verifyCommands = [];
        
        languages.forEach(lang => {
            const installer = this.languageInstallers[lang];
            if (installer && installer.verify) {
                // Extract just the command part after RUN
                const command = installer.verify.replace('RUN ', '');
                verifyCommands.push(command);
            }
        });
        
        if (verifyCommands.length > 0) {
            verifications += 'RUN ' + verifyCommands.join(' && \\\n    ') + '\n\n';
        }
        
        return verifications;
    }

    getProjectSetup() {
        return `# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install npm dependencies (if any)
RUN if [ -f package-lock.json ]; then npm ci --only=production; fi

# Copy project files
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 jsonuser && chown -R jsonuser:jsonuser /app
USER jsonuser

# Expose port (for future web interface)
EXPOSE 3000

# Default command runs all tests
CMD ["node", "test/run-tests.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD node -e "console.log('Health check passed')" || exit 1
`;
    }

    writeDockerfile(mode = 'available') {
        const dockerfileContent = this.generateDockerfile(mode);
        const outputPath = path.join(this.projectRoot, `Dockerfile.${mode}`);
        
        fs.writeFileSync(outputPath, dockerfileContent);
        
        console.log(`\n📁 Generated: ${outputPath}`);
        
        if (mode === 'available') {
            // Also create the main Dockerfile
            const mainPath = path.join(this.projectRoot, 'Dockerfile.generated');
            fs.writeFileSync(mainPath, dockerfileContent);
            console.log(`📁 Generated: ${mainPath}`);
        }
        
        return outputPath;
    }

    generateLanguageMatrix() {
        const languages = this.discoverRequiredLanguages();
        
        console.log('\n📊 Language Support Matrix:');
        console.log('============================');
        
        Object.entries(this.languageInstallers).forEach(([lang, installer]) => {
            const isRequired = installer.required;
            const isAvailable = languages.available.includes(lang);
            const hasTestFile = languages.available.includes(lang);
            
            let status = '❌';
            if (isRequired) status = '🔧';
            else if (isAvailable) status = '✅';
            else if (languages.all.includes(lang)) status = '⚠️';
            
            console.log(`${status} ${lang.padEnd(12)} | ${isRequired ? 'Required' : isAvailable ? 'Available' : hasTestFile ? 'Configured' : 'Possible'}`);
        });
        
        console.log('\nLegend:');
        console.log('🔧 Required (always installed)');
        console.log('✅ Available (test files exist)');
        console.log('⚠️  Configured (ready for implementation)');
        console.log('❌ Possible (can be added)');
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Dynamic Dockerfile Generator for JSON Response Standard

Usage:
  node scripts/generate-dockerfile.js [options]

Options:
  --available, -a   Generate Dockerfile for available languages (default)
  --all, -A         Generate Dockerfile for all configured languages
  --matrix, -m      Show language support matrix
  --help, -h        Show this help

Examples:
  node scripts/generate-dockerfile.js --available
  node scripts/generate-dockerfile.js --all
  node scripts/generate-dockerfile.js --matrix
        `);
        return;
    }
    
    const generator = new DockerfileGenerator();
    
    if (args.includes('--matrix') || args.includes('-m')) {
        generator.generateLanguageMatrix();
        return;
    }
    
    if (args.includes('--all') || args.includes('-A')) {
        generator.writeDockerfile('all');
        generator.generateLanguageMatrix();
        return;
    }
    
    // Default: generate for available languages
    generator.writeDockerfile('available');
    generator.generateLanguageMatrix();
}

if (require.main === module) {
    main();
}

module.exports = DockerfileGenerator;
