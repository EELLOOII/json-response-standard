function jsonResponse(data = {}, status = 200, message = '') {
    // Validate inputs
    if (typeof status !== 'number' || status < 100 || status > 599) {
        throw new Error('Status must be a valid HTTP status code (100-599)');
    }
    
    if (typeof message !== 'string') {
        throw new Error('Message must be a string');
    }

    return JSON.stringify({
        status,
        message,
        data: data || {}
    }, null, 2);
}

// Example
if (require.main === module) {
    console.log(jsonResponse({ user: "John" }, 200, "Success"));
}

module.exports = { jsonResponse };
