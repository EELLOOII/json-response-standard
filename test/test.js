const { jsonResponse } = require('../examples/response.js');

function test(description, fn) {
    try {
        fn();
        console.log(`[PASS] ${description}`);
    } catch (error) {
        console.log(`[FAIL] ${description}: ${error.message}`);
    }
}

// Tests
test('Basic response generation', () => {
    const result = jsonResponse({ user: "John" }, 200, "Success");
    const parsed = JSON.parse(result);
    if (parsed.status !== 200) throw new Error('Status should be 200');
    if (parsed.message !== "Success") throw new Error('Message should be "Success"');
    if (parsed.data.user !== "John") throw new Error('Data should contain user');
});

test('Default values', () => {
    const result = jsonResponse();
    const parsed = JSON.parse(result);
    if (parsed.status !== 200) throw new Error('Default status should be 200');
    if (parsed.message !== "") throw new Error('Default message should be empty');
    if (typeof parsed.data !== 'object') throw new Error('Default data should be object');
});

test('Status validation - invalid type', () => {
    let errorThrown = false;
    try {
        jsonResponse({}, "invalid", "test");
    } catch (error) {
        errorThrown = true;
        if (!error.message.includes('Status must be a valid HTTP status code')) {
            throw new Error('Wrong error message for invalid status type');
        }
    }
    if (!errorThrown) throw new Error('Should throw error for invalid status type');
});

test('Status validation - out of range', () => {
    let errorThrown = false;
    try {
        jsonResponse({}, 99, "test");
    } catch (error) {
        errorThrown = true;
        if (!error.message.includes('Status must be a valid HTTP status code')) {
            throw new Error('Wrong error message for out of range status');
        }
    }
    if (!errorThrown) throw new Error('Should throw error for out of range status');
});

test('Message validation - invalid type', () => {
    let errorThrown = false;
    try {
        jsonResponse({}, 200, 123);
    } catch (error) {
        errorThrown = true;
        if (!error.message.includes('Message must be a string')) {
            throw new Error('Wrong error message for invalid message type');
        }
    }
    if (!errorThrown) throw new Error('Should throw error for invalid message type');
});

console.log('\n[SUCCESS] Tests completed!');
