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

This project includes comprehensive tests to ensure all implementations work correctly.

### Running Tests

#### Method 1: Direct Node.js (Recommended)
```powershell
node test/test.js
```

#### Method 2: Using npm
```powershell
npm test
```

**Note for Windows PowerShell users:** If you encounter execution policy errors with npm, use Method 1 or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Test Coverage

The test suite validates:
- ✅ **Basic response generation** - Creates proper JSON with correct structure
- ✅ **Default values** - Handles missing parameters correctly  
- ✅ **Status validation** - Catches invalid status codes and types
- ✅ **Message validation** - Ensures message is always a string
- ✅ **Error handling** - Robust validation and error messages

### Expected Output
```
✅ Basic response generation
✅ Default values
✅ Status validation - invalid type
✅ Status validation - out of range
✅ Message validation - invalid type

Tests completed!
```

## 🔍 Requirements

### JavaScript
- Node.js (any recent version)
- No external dependencies

### Python  
- Python 3.5+ (for typing support)
- No external dependencies (uses only standard library)

### PHP
- PHP 5.4+ (for array syntax)
- No external dependencies

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
