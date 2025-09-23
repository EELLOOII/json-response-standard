# Adding ANY Programming Language 🌍

This guide shows how to add **any programming language** to the JSON Response Standard project.

## 🎯 Current Status

- **✅ Implemented:** JavaScript, Python, PHP
- **🔧 Pre-configured:** Go, Rust, Java, C#, Ruby
- **🌟 Can Add:** ANY language with command-line runtime

## 🚀 Quick Start

### Option 1: Interactive Setup (Easiest)
```bash
node scripts/test-language.js --setup
```

### Option 2: Manual Setup

1. **Add configuration** to `test/run-tests.js`:
```javascript
'your-language': {
    aliases: ['lang', 'your-lang'],
    testFile: 'test.ext',
    command: 'your-runtime',
    args: ['test/test.ext'],
    versionFlag: '--version',
    displayName: 'Your Language'
}
```

2. **Create files:**
- `examples/response.ext` - Implementation
- `test/test.ext` - Test suite

3. **Test immediately:**
```bash
node test/run-tests.js your-language
```

## 📋 Language Examples

### Lua
```javascript
'lua': {
    aliases: ['lua'],
    testFile: 'test.lua',
    command: 'lua',
    args: ['test/test.lua'],
    versionFlag: '-v',
    displayName: 'Lua'
}
```

### Kotlin
```javascript
'kotlin': {
    aliases: ['kotlin', 'kt'],
    testFile: 'test.kt',
    command: 'kotlin',
    args: ['test/test.kt'],
    versionFlag: '-version',
    displayName: 'Kotlin'
}
```

### Swift
```javascript
'swift': {
    aliases: ['swift'],
    testFile: 'test.swift',
    command: 'swift',
    args: ['test/test.swift'],
    versionFlag: '--version',
    displayName: 'Swift'
}
```

## 🌟 What Languages Can You Add?

**Any language that can:**
1. Run from command line
2. Exit with status codes (0=success, 1=failure)
3. Print to stdout/stderr

**Examples:**
- **Compiled:** Rust, Go, C/C++, Zig
- **Interpreted:** Ruby, Perl, Lua, R
- **JVM:** Java, Scala, Clojure, Kotlin
- **Modern:** Swift, Dart, Crystal, Nim
- **Functional:** Haskell, Elixir, F#
- **Scientific:** Julia, MATLAB, Octave

## 🎯 Requirements

Your implementation must:
1. **Exit properly:** `0` for success, `1` for failure
2. **Print results:** `[PASS]` and `[FAIL]` messages
3. **Follow JSON format:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {}
}
```
4. **Validate status codes:** 100-599

## 🚀 The Magic

Once you add any language:
- ✅ **Automatic CI testing** across multiple versions
- ✅ **Automatic Docker support**
- ✅ **Cross-platform testing** (Linux, Windows, macOS)
- ✅ **Zero infrastructure changes needed**

## 💡 Pro Tips

```bash
# Test if runtime is available
which your-language
your-language --version

# Test your configuration
node test/run-tests.js your-language

# Generate Docker/CI support (optional)
node scripts/generate-dockerfile.js --all
node scripts/update-ci-matrix.js
```

## 🎉 That's It!

The project supports **infinite languages**! Just add your configuration, create your files, and everything else happens automatically! 🌟
