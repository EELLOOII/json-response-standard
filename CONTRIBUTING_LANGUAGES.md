# Adding New Languages to JSON Response Standard

This guide helps contributors add support for new programming languages to the JSON Response Standard project.

## Quick Start

To add a new language (e.g., Go):

1. **Create the implementation** in `examples/response.go`
2. **Create tests** in `test/test.go`
3. **Add language configuration** to `test/run-tests.js`
4. **Test it** with `node test/run-tests.js go`

## Step-by-Step Guide

### 1. Create the Language Implementation

Create `examples/response.[extension]` following this template:

```go
// examples/response.go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type JsonResponse struct {
    Status  int         `json:"status"`
    Message string      `json:"message"`
    Data    interface{} `json:"data"`
}

func jsonResponse(data interface{}, status int, message string) (string, error) {
    // Validate status code (100-599)
    if status < 100 || status > 599 {
        return "", fmt.Errorf("status must be a valid HTTP status code (100-599)")
    }
    
    // Handle nil data
    if data == nil {
        data = make(map[string]interface{})
    }
    
    response := JsonResponse{
        Status:  status,
        Message: message,
        Data:    data,
    }
    
    jsonBytes, err := json.MarshalIndent(response, "", "  ")
    if err != nil {
        return "", err
    }
    
    return string(jsonBytes), nil
}

func main() {
    // Example usage
    data := map[string]interface{}{"user": "John"}
    result, err := jsonResponse(data, 200, "Success")
    if err != nil {
        fmt.Println("Error:", err)
        os.Exit(1)
    }
    fmt.Println(result)
}
```

### 2. Create the Test File

Create `test/test.[extension]` with comprehensive tests:

```go
// test/test.go
package main

import (
    "encoding/json"
    "fmt"
    "os"
    "path/filepath"
    "strings"
)

// Include the jsonResponse function here or import it

func test(description string, testFunc func() error) bool {
    err := testFunc()
    if err != nil {
        fmt.Printf("[FAIL] %s: %s\n", description, err)
        return false
    }
    fmt.Printf("[PASS] %s\n", description)
    return true
}

func main() {
    fmt.Println("Running Go JSON Response tests...")
    
    passedTests := 0
    totalTests := 0
    
    // Test 1: Basic response generation
    totalTests++
    if test("Basic response generation", func() error {
        result, err := jsonResponse(map[string]interface{}{"user": "John"}, 200, "Success")
        if err != nil {
            return err
        }
        
        var parsed JsonResponse
        if err := json.Unmarshal([]byte(result), &parsed); err != nil {
            return fmt.Errorf("invalid JSON: %v", err)
        }
        
        if parsed.Status != 200 {
            return fmt.Errorf("expected status 200, got %d", parsed.Status)
        }
        
        return nil
    }) {
        passedTests++
    }
    
    // Test 2: Default values
    totalTests++
    if test("Default values", func() error {
        result, err := jsonResponse(nil, 200, "")
        if err != nil {
            return err
        }
        
        var parsed JsonResponse
        if err := json.Unmarshal([]byte(result), &parsed); err != nil {
            return fmt.Errorf("invalid JSON: %v", err)
        }
        
        if parsed.Status != 200 {
            return fmt.Errorf("expected status 200, got %d", parsed.Status)
        }
        
        return nil
    }) {
        passedTests++
    }
    
    // Test 3: Status validation
    totalTests++
    if test("Status validation - out of range", func() error {
        _, err := jsonResponse(nil, 99, "test")
        if err == nil {
            return fmt.Errorf("should have failed with invalid status")
        }
        if !strings.Contains(err.Error(), "status must be a valid HTTP status code") {
            return fmt.Errorf("wrong error message: %s", err.Error())
        }
        return nil
    }) {
        passedTests++
    }
    
    fmt.Printf("\nTests completed! %d/%d tests passed.\n", passedTests, totalTests)
    
    if passedTests == totalTests {
        fmt.Println("[SUCCESS] All Go tests passed!")
        os.Exit(0)
    } else {
        fmt.Printf("[FAILURE] %d tests failed.\n", totalTests-passedTests)
        os.Exit(1)
    }
}
```

### 3. Add Language Configuration

Edit `test/run-tests.js` and add your language to the `languageConfigs` object:

```javascript
'go': {
    aliases: ['go', 'golang'],
    testFile: 'test.go',
    command: 'go',
    args: ['run', 'test/test.go'],
    versionFlag: 'version',  // Go uses 'go version' not 'go --version'
    displayName: 'Go'
},
```

### 4. Test Your Implementation

```bash
# Test specific language
node test/run-tests.js go

# Test all languages (including your new one)
node test/run-tests.js

# Get help
node test/run-tests.js --help
```

## Language Configuration Reference

Each language configuration includes:

- **aliases**: Array of command-line aliases (e.g., ['go', 'golang'])
- **testFile**: Test file name in test/ directory (e.g., 'test.go')
- **command**: Executable command (e.g., 'go', 'cargo', 'javac')
- **args**: Array of arguments to run tests (e.g., ['run', 'test/test.go'])
- **versionFlag**: Flag to check version (usually '--version' or 'version')
- **displayName**: Human-readable name for output

## Examples for Common Languages

### Rust
```javascript
'rust': {
    aliases: ['rust', 'rs', 'cargo'],
    testFile: 'test.rs',
    command: 'cargo',
    args: ['run', '--bin', 'test'],
    versionFlag: '--version',
    displayName: 'Rust'
}
```

### Java
```javascript
'java': {
    aliases: ['java'],
    testFile: 'Test.java',
    command: 'java',
    args: ['test/Test.java'],  // or use javac + java workflow
    versionFlag: '--version',
    displayName: 'Java'
}
```

### C#
```javascript
'csharp': {
    aliases: ['csharp', 'cs', 'dotnet'],
    testFile: 'test.cs',
    command: 'dotnet',
    args: ['run', '--project', 'test/'],
    versionFlag: '--version',
    displayName: 'C#'
}
```

## Testing Requirements

Your test file must:

1. **Exit with code 0** on success, code 1 on failure
2. **Print clear test results** with [PASS]/[FAIL] prefixes
3. **Test core functionality**:
   - Basic response generation
   - Default parameter handling
   - Input validation (status codes, types)
   - Error handling
4. **Follow the JSON schema** defined in `response.schema.json`

## Implementation Requirements

Your implementation must:

1. **Follow the standard format**:
   ```json
   {
     "status": 200,
     "message": "Success",
     "data": {}
   }
   ```

2. **Validate inputs**:
   - Status codes: 100-599
   - Message: string type
   - Data: handle null/undefined gracefully

3. **Use only standard libraries** (no external dependencies)

4. **Return properly formatted JSON** (preferably pretty-printed)

## Contributing Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b add-go-support`
3. **Add your implementation and tests**
4. **Update the language configuration**
5. **Test thoroughly**: `node test/run-tests.js`
6. **Create a pull request**

## Benefits of This System

- ✅ **Zero core changes** - Just add files and config
- ✅ **Automatic discovery** - Test runner finds your language
- ✅ **Consistent interface** - Same commands for all languages
- ✅ **Easy maintenance** - Clear separation of concerns
- ✅ **Future-proof** - Scales to any number of languages

## Need Help?

- Check existing implementations in `examples/`
- Look at existing tests in `test/`
- Open an issue for questions
- Join discussions in pull requests

Happy contributing! 🚀