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

1. Clone this repository
2. Include the appropriate response function in your project
3. Use the schema file for validation if needed

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

4. **Test your changes:**
   ```bash
   node test/run-tests.js [your-language]
   ```

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

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
