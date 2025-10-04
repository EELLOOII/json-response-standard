interface JsonResponseData {
    [key: string]: any;
}

interface JsonResponseFormat {
    status: number;
    message: string;
    data: JsonResponseData;
}

/**
 * Generate a standardized JSON response
 * @param data - Response payload (object or null)
 * @param status - HTTP-like status code (100-599)
 * @param message - Human-readable status message
 * @returns JSON string with standardized format
 * @throws Error if status code is invalid or message is not a string
 */
function jsonResponse(
    data: JsonResponseData = {},
    status: number = 200,
    message: string = ''
): string {
    // Validate inputs
    if (typeof status !== 'number' || status < 100 || status > 599) {
        throw new Error('Status must be a valid HTTP status code (100-599)');
    }

    if (typeof message !== 'string') {
        throw new Error('Message must be a string');
    }

    const response: JsonResponseFormat = {
        status,
        message,
        data: data || {}
    };

    return JSON.stringify(response, null, 2);
}

// Example usage (uncomment to test)
// console.log(jsonResponse({ user: "John" }, 200, "Success"));
// console.log(jsonResponse({ error: "Not found" }, 404, "Resource not found"));
// console.log(jsonResponse({}, 500, "Internal server error"));

export { jsonResponse, JsonResponseData, JsonResponseFormat };
