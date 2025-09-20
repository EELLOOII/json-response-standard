# JSON Response Standard

A simple, consistent JSON response format that works across **PHP, Python, JavaScript**, and other languages.

---

## 📌 Schema
All responses follow this format:

```json
{
  "status": 200,
  "message": "Success",
  "data": {}
}
```

## 🚀 Usage Examples

### JavaScript
```javascript
const { jsonResponse } = require('./examples/response.js');
console.log(jsonResponse({ user: "John" }, 200, "Success"));
```

### Python
```python
from examples.response import json_response
print(json_response({"user": "John"}, 200, "Success"))
```

### PHP
```php
require_once './examples/response.php';
jsonResponse(['user' => 'John'], 200, 'Success');
```

## 📋 Schema Validation

This project includes a JSON schema file ([response.schema.json](response.schema.json)) that defines the standard response format. All responses must include:

- `status` (integer): HTTP-like status code
- `message` (string): Human-readable status message  
- `data` (object): Response payload

## 🔧 Installation

### Option 1: Direct Installation
1. Clone this repository
2. Include the appropriate response function in your project
3. Use the schema file for validation if needed

### Option 2: Docker (Recommended for Contributors)
```bash
# Clone the repository
git clone https://github.com/EELLOOII/json-response-standard.git
cd json-response-standard

# Run all tests with Docker
docker-compose up json-response-standard

# Or build and run manually
docker build -t json-response-standard .
docker run json-response-standard
```

### 📦 Project Structure

```
json-response-standard/
├── examples/           # Implementation files
│   ├── response.js     # JavaScript implementation
│   ├── response.py     # Python implementation
│   └── response.php    # PHP implementation
├── test/              # Test files
│   ├── test.js        # JavaScript tests
│   ├── test.py        # Python tests
│   ├── test.php       # PHP tests
│   └── run-tests.js   # Unified test runner
├── .github/           # CI/CD workflows
│   └── workflows/     # GitHub Actions
├── response.schema.json  # JSON schema definition
├── response.d.ts        # TypeScript definitions
├── package.json        # NPM package configuration
├── package-lock.json   # Dependency lock file
├── Dockerfile          # Docker container definition
├── docker-compose.yml  # Multi-service Docker setup
├── .dockerignore      # Docker build exclusions
└── README.md           # This file
```

### 🔄 Recent Updates

- ✅ **Zero-dependency design** - All implementations use only standard libraries
- ✅ **Comprehensive CI/CD** - Automated testing across multiple language versions
- ✅ **Cross-platform testing** - Ubuntu, Windows, and macOS compatibility
- ✅ **Professional package structure** - Ready for npm publishing
- ✅ **TypeScript support** - Full type definitions included
- ✅ **JSON schema validation** - Standard-compliant response format

## 🧪 Testing

This project includes comprehensive tests to ensure all implementations work correctly across **JavaScript, Python, and PHP**.

### 🚀 Unified Test Runner (Recommended)

Run tests for all languages or specific ones using our intelligent test runner:

#### Using npm scripts:
```powershell
# Test all languages
npm test

# Test specific languages
npm run test:js      # JavaScript only
npm run test:python  # Python only  
npm run test:php     # PHP only
npm run test:all     # All languages
```

#### Direct execution:
```powershell
# Test all languages
node test/run-tests.js

# Test specific languages
node test/run-tests.js js        # JavaScript only
node test/run-tests.js python    # Python only
node test/run-tests.js php       # PHP only

# Get help
node test/run-tests.js --help
```

### 📋 Individual Test Files

You can also run tests for each language individually:

```powershell
# JavaScript tests
node test/test.js

# Python tests  
python test/test.py

# PHP tests
php test/test.php
```

**Note for Windows PowerShell users:** If you encounter execution policy errors with npm, use the direct Node.js commands or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 📦 Required Dependencies for Testing

To run all tests, you need the following installed on your machine:

#### Node.js (Required for JavaScript tests and test runner)
- **Download:** [nodejs.org](https://nodejs.org/)
- **Minimum version:** Node.js 12+ (any recent version)
- **Verify installation:** `node --version`

#### Python (Required for Python tests)
- **Download:** [python.org](https://www.python.org/downloads/)
- **Minimum version:** Python 3.5+ (for typing support)
- **Verify installation:** `python --version`

#### PHP (Required for PHP tests)
- **Download:** [php.net](https://www.php.net/downloads)
- **Minimum version:** PHP 5.4+ (for array syntax)
- **Verify installation:** `php --version`

**Note:** You can test individual languages if you only have some dependencies installed. The unified test runner will automatically detect which languages are available and skip missing ones.

### ⚠️ Windows PowerShell Execution Policy Disclaimer

If you encounter this error when running `npm test`:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
+ CategoryInfo          : SecurityError: (:) [], PSSecurityException
+ FullyQualifiedErrorId : UnauthorizedAccess
```

**Quick Solutions:**

1. **Use Node.js directly (Recommended):**
   ```powershell
   node test/run-tests.js
   ```

2. **Fix execution policy (Run PowerShell as Administrator):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Temporary bypass:**
   ```powershell
   powershell -ExecutionPolicy Bypass -Command "npm test"
   ```

4. **Use Command Prompt instead:**
   ```cmd
   npm test
   ```

### 🎯 Test Coverage

The comprehensive test suite validates:

#### JavaScript Tests (5 tests)
- ✅ **Basic response generation** - Creates proper JSON with correct structure
- ✅ **Default values** - Handles missing parameters correctly  
- ✅ **Status validation** - Catches invalid status codes and types
- ✅ **Message validation** - Ensures message is always a string
- ✅ **Error handling** - Robust validation and error messages

#### Python Tests (7 tests)
- ✅ **Basic response generation** - JSON structure validation
- ✅ **Default values** - Parameter handling
- ✅ **Status validation** - Type and range checking
- ✅ **Message validation** - String type enforcement
- ✅ **None data handling** - Proper null handling
- ✅ **Complex data structures** - Nested objects and arrays
- ✅ **Type hints validation** - Python-specific type checking

#### PHP Tests (3 detailed tests)
- ✅ **JSON structure validation** - Complete response format
- ✅ **Default values** - Parameter defaults
- ✅ **JSON encoding** - Pretty print and UTF-8 support

### 📊 Expected Output

#### All Languages Test:
```
🚀 JSON Response Standard Test Runner
=====================================

🌐 Running tests for all languages

🟡 Running JavaScript tests...
✅ Basic response generation
✅ Default values
✅ Status validation - invalid type
✅ Status validation - out of range
✅ Message validation - invalid type

Tests completed!

🟡 Running Python tests...
✅ Basic response generation
✅ Default values
✅ Status validation - invalid type
✅ Status validation - out of range
✅ Message validation - invalid type
✅ None data handling
✅ Complex data structure

Tests completed! 7/7 tests passed.

🟡 Running PHP tests...
✅ Detailed JSON structure validation
✅ Default values detailed
✅ JSON pretty print format

Detailed tests completed! 3/3 tests passed.

==================================================
📊 TEST SUMMARY
==================================================
✅ Javascript: PASSED
✅ Python: PASSED
✅ Php: PASSED
==================================================
🎯 Overall: 3/3 language tests passed
🎉 All tests passed! Your JSON Response Standard is working perfectly across all languages!
```

## 🔍 System Requirements

### For Contributors and Developers

To contribute to this project or run all tests, install these dependencies:

| Language | Minimum Version | Download Link | Verify Command |
|----------|----------------|---------------|----------------|
| **Node.js** | 12+ | [nodejs.org](https://nodejs.org/) | `node --version` |
| **Python** | 3.5+ | [python.org](https://www.python.org/downloads/) | `python --version` |
| **PHP** | 5.4+ | [php.net](https://www.php.net/downloads) | `php --version` |

### For End Users (Implementation Only)

Each implementation has **zero external dependencies**:

#### JavaScript
- Node.js (any recent version)
- No external packages required

#### Python  
- Python 3.5+ (for typing support)
- Uses only standard library (`json`, `typing`)

#### PHP
- PHP 5.4+ (for modern array syntax)
- No external packages required

### 💡 Partial Testing
You can test individual languages even if you don't have all dependencies installed. The unified test runner automatically detects available languages and skips missing ones.

### 📦 Package Management

This project follows a **zero-dependency philosophy**:

- **No external npm packages** - JavaScript uses only Node.js built-ins
- **No pip requirements** - Python uses only standard library
- **No composer dependencies** - PHP uses only built-in functions
- **package-lock.json included** - Ensures consistent builds in CI/CD
- **Ready for npm publishing** - Proper package.json configuration

The `package-lock.json` exists primarily for CI/CD consistency and npm publishing, but the actual implementations have zero runtime dependencies.

## 🐳 Docker Support

For contributors and cross-platform testing, Docker provides a consistent environment with all languages pre-installed.

### 🚀 Quick Start with Docker

```bash
# Run all tests
docker-compose up json-response-standard

# Run specific language tests
docker-compose up test-js      # JavaScript only
docker-compose up test-python  # Python only  
docker-compose up test-php     # PHP only

# Interactive development
docker-compose up json-dev
```

### 🛠️ Manual Docker Commands

```bash
# Build the image
docker build -t json-response-standard .

# Run all tests
docker run json-response-standard

# Run with volume mount for development
docker run -v $(pwd):/app json-response-standard

# Interactive shell
docker run -it json-response-standard /bin/bash
```

### 🔧 Docker Environment

The Docker container includes:
- **Ubuntu 22.04** base image
- **Node.js 20** for JavaScript testing
- **Python 3.11** for Python testing  
- **PHP 8.2** for PHP testing
- **Non-root user** for security
- **Health checks** for monitoring

### 💡 Benefits of Docker

- ✅ **Consistent environment** across all platforms
- ✅ **No local language installation** required
- ✅ **Isolated testing** - no conflicts with your system
- ✅ **Easy contributor onboarding** - one command setup
- ✅ **CI/CD ready** - same environment as production

## 🤝 Contributing

We welcome contributions to expand the JSON Response Standard to more languages and improve existing implementations!

### 🌟 How to Contribute

#### 1. Adding a New Language Implementation

Want to implement this standard in Go, Rust, Java, C#, or another language? Here's how:

1. **Fork the repository**
2. **Follow the standard format:**
   ```json
   {
     "status": 200,
     "message": "Success message",
     "data": {}
   }
   ```

3. **Create your implementation** in `examples/response.[extension]`:
   - Function should accept: `data`, `status` (default: 200), `message` (default: "")
   - Validate status codes (100-599)
   - Validate message is string type
   - Return formatted JSON string
   - Handle null/empty data gracefully

4. **Add comprehensive tests** in `test/test.[extension]`:
   - Basic response generation
   - Default value handling
   - Input validation
   - Error handling
   - Language-specific features

5. **Update the test runner** (`test/run-tests.js`) to include your language

#### 2. Implementation Template

```javascript
// Template structure for any language
function jsonResponse(data = {}, status = 200, message = "") {
    // 1. Validate status (100-599)
    // 2. Validate message is string
    // 3. Handle null/undefined data
    // 4. Return JSON with required structure
}
```

#### 3. Testing Guidelines

Your implementation must pass these core tests:
- ✅ **Structure validation** - Correct JSON format
- ✅ **Default handling** - Proper defaults for missing parameters
- ✅ **Input validation** - Type checking and range validation
- ✅ **Error handling** - Appropriate exceptions/errors
- ✅ **Edge cases** - Null data, special characters, etc.

### 🎯 Contribution Areas

We're looking for:

- **New language implementations** (Go, Rust, Java, C#, Ruby, etc.)
- **Enhanced validation** in existing implementations
- **Performance improvements**
- **Documentation improvements**
- **Test coverage expansion**
- **CI/CD pipeline** enhancements
- **Schema validation** tools

### 📋 Pull Request Guidelines

1. **Create a feature branch** from `main`
2. **Follow existing code style** in each language
3. **Add comprehensive tests** for your changes
4. **Update documentation** (README, comments)
5. **Ensure all tests pass** before submitting
6. **Write clear commit messages**

Example commit messages:
```
feat: add Go implementation with validation
test: add edge case tests for Python implementation  
docs: update README with Rust example
fix: handle Unicode characters in PHP implementation
```

### 🚀 Development Setup

#### Option 1: Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/EELLOOII/json-response-standard.git
   cd json-response-standard
   ```

2. **Install dependencies** (for testing):
   - Node.js 12+ 
   - Python 3.5+
   - PHP 5.4+

3. **Run tests:**
   ```bash
   node test/run-tests.js
   ```

#### Option 2: Docker Development (Recommended)
1. **Clone and start with Docker:**
   ```bash
   git clone https://github.com/EELLOOII/json-response-standard.git
   cd json-response-standard
   docker-compose up json-dev
   ```

2. **Test your changes:**
   ```bash
   docker-compose up json-response-standard
   ```

**Benefits of Docker approach:**
- ✅ No need to install multiple languages locally
- ✅ Consistent environment for all contributors
- ✅ Same environment as CI/CD pipeline
- ✅ Isolated testing without system conflicts

### 🏷️ Code Standards

- **Zero external dependencies** (use standard libraries only)
- **Consistent naming** across languages
- **Comprehensive error handling**
- **Clear documentation** and comments
- **Follow language conventions** (camelCase for JS, snake_case for Python, etc.)

### 🆘 Need Help?

- **Check existing implementations** in `examples/` for reference
- **Review test files** in `test/` for expected behavior
- **Open an issue** for questions or clarifications
- **Join discussions** in GitHub Issues

## � CI/CD Pipeline

This project includes comprehensive automated testing and deployment pipelines.

### 🔄 Continuous Integration

Every push and pull request triggers automated testing across:

#### Multi-Language Testing
- **JavaScript**: Node.js 16, 18, 20, 22
- **Python**: 3.8, 3.9, 3.10, 3.11, 3.12
- **PHP**: 7.4, 8.0, 8.1, 8.2, 8.3

#### Cross-Platform Testing
- **Ubuntu** (primary)
- **Windows** (compatibility)
- **macOS** (compatibility)

#### Quality Checks
- Code syntax validation
- Security audits
- File structure validation
- JSON schema validation
- TypeScript definitions check
- Zero-dependency verification

### 📦 Automated Releases

When you create a new tag (e.g., `v1.1.0`):

1. **Pre-release testing** - Full test suite across all platforms
2. **Version validation** - Ensures package.json matches tag
3. **Asset creation** - ZIP and TAR archives
4. **NPM publishing** - Automatic npm package publication
5. **Documentation updates** - Changelog generation

### 🔧 Maintenance Automation

Weekly automated tasks:
- **Dependency updates** via Dependabot
- **Latest version testing** - Test with newest language versions
- **Link checking** - Validate documentation links
- **Performance benchmarks** - Monitor response generation speed
- **Security scans** - Regular vulnerability checks

### 📊 CI/CD Status

All workflows run automatically and provide status badges:

```markdown
![CI Tests](https://github.com/EELLOOII/json-response-standard/workflows/JSON%20Response%20Standard%20Tests/badge.svg)
![Release](https://github.com/EELLOOII/json-response-standard/workflows/Release%20and%20Publish/badge.svg)
![Maintenance](https://github.com/EELLOOII/json-response-standard/workflows/Maintenance%20and%20Dependency%20Updates/badge.svg)
```

### 🛠️ Local CI Testing

You can run the same tests locally that run in CI:

```bash
# Run all tests (same as CI)
npm run test:ci

# Run individual language tests
npm run test:js
npm run test:python  
npm run test:php

# Check for issues before committing
npm test
```

**Note**: The CI is designed to work with or without `package-lock.json` and gracefully handles projects with zero dependencies like this one.

## �📄 License

MIT License - see [LICENSE](LICENSE) file for details.
