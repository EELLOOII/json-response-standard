# Advanced Language Setup �

For contributors who want to add comprehensive language support with Docker and CI integration.

## 🚀 Quick Setup

```bash
# Interactive setup (easiest)
node scripts/test-language.js --setup

# Or manual setup
node scripts/test-language.js [language-name]
```

## 🐳 Adding Docker Support

Edit `scripts/generate-dockerfile.js` and add your language installer:

```javascript
'your-language': {
    required: false,  // Set to true if always needed
    install: () => `
# Install Your Language
RUN your-package-manager install your-language
ENV PATH="/path/to/your-language:$PATH"`,
    verify: 'RUN your-language --version',
    env: 'ENV YOUR_LANGUAGE_VERSION=1.0.0'
}
```

### Popular Language Examples:

```javascript
// Go
'go': {
    required: false,
    install: () => `
RUN wget https://golang.org/dl/go\${GO_VERSION}.linux-amd64.tar.gz \\
    && tar -C /usr/local -xzf go\${GO_VERSION}.linux-amd64.tar.gz
ENV PATH="/usr/local/go/bin:\${PATH}"`,
    verify: 'RUN go version',
    env: 'ENV GO_VERSION=1.21.0'
},

// Rust
'rust': {
    required: false,
    install: () => `
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:\${PATH}"`,
    verify: 'RUN rustc --version',
    env: ''
},

// Java
'java': {
    required: false,
    install: () => `
RUN apt-get update && apt-get install -y openjdk-\${JAVA_VERSION}-jdk
ENV JAVA_HOME="/usr/lib/jvm/java-\${JAVA_VERSION}-openjdk-amd64"`,
    verify: 'RUN java -version',
    env: 'ENV JAVA_VERSION=17'
}
```

## ⚙️ Adding CI Integration

Edit `scripts/update-ci-matrix.js` for automated CI testing:

```javascript
// Add version matrix
versionMatrices: {
    'your-language': ['1.0', '1.1', '1.2']
}

// Add setup action (if available)
setupActions: {
    'your-language': 'actions/setup-your-language@v1'
}

// Add version parameter
versionParams: {
    'your-language': 'your-language-version'
}
```

## 🛠️ Complex Language Configurations

### Compiled Languages (with build steps)
```javascript
'rust': {
    aliases: ['rust', 'rs'],
    testFile: 'test.rs',
    command: 'sh',
    args: ['-c', 'cd test && rustc test.rs -o test_binary && ./test_binary'],
    versionFlag: '--version',
    displayName: 'Rust'
}
```

### Languages with Package Managers
```javascript
'node-with-deps': {
    aliases: ['node-deps'],
    testFile: 'test.js',
    command: 'sh',
    args: ['-c', 'cd test && npm install && node test.js'],
    versionFlag: '--version',
    displayName: 'Node.js with Dependencies'
}
```

### Languages with Virtual Environments
```javascript
'python-venv': {
    aliases: ['py-venv'],
    testFile: 'test.py',
    command: 'sh',
    args: ['-c', 'cd test && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python test.py'],
    versionFlag: '--version',
    displayName: 'Python with Virtual Environment'
}
```

## 🎯 Testing Your Setup

```bash
# Test language configuration
node test/run-tests.js your-language

# Generate Docker support
node scripts/generate-dockerfile.js --all

# Update CI matrix
node scripts/update-ci-matrix.js

# Test with Docker
docker-compose up your-language-service
```

## � Automation Scripts

### Generate Everything
```bash
# Complete setup for new language
node scripts/setup-dynamic.js
```

### Individual Components
```bash
# Docker only
node scripts/generate-dockerfile.js --language your-language

# CI only  
node scripts/update-ci-matrix.js --add your-language

# Docker Compose
node scripts/generate-docker-compose.js --override
```

## 💡 Pro Tips

1. **Test locally first** - Ensure your language works before adding Docker
2. **Use official images** - When possible, base on official language images
3. **Version matrices** - Test multiple versions for better compatibility
4. **Graceful failures** - Handle missing runtimes elegantly

## � Troubleshooting

### Language Not Found
```bash
# Check if language is detected
node test/run-tests.js --list

# Verify configuration syntax
node -c test/run-tests.js
```

### Docker Build Issues
```bash
# Test Dockerfile generation
node scripts/generate-dockerfile.js --language your-language --dry-run

# Manual Docker test
docker build -t test-image .
```

### CI Integration Issues
```bash
# Validate CI matrix
node scripts/update-ci-matrix.js --validate

# Test specific language in CI
node scripts/test-language.js your-language --ci-test
```

That's it! Your language will be fully integrated with automatic testing, Docker support, and CI/CD pipelines! 🌟
