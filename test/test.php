<?php
declare(strict_types=1);

require_once __DIR__ . '/../examples/response.php';

$passedTests = 0;
$totalTests = 0;

function assertCondition(bool $condition, string $message): void
{
    if (!$condition) {
        throw new Exception($message);
    }
}

function test(string $description, callable $fn): void
{
    global $passedTests, $totalTests;

    $totalTests++;

    try {
        $fn();
        echo "[PASS] {$description}\n";
        $passedTests++;
    } catch (Throwable $error) {
        echo "[FAIL] {$description}: {$error->getMessage()}\n";
    }
}

test('Basic response generation', function (): void {
    $result = jsonResponse(['user' => 'John'], 200, 'Success');
    $decoded = json_decode($result, true);

    assertCondition(is_array($decoded), 'Response should decode to array');
    assertCondition($decoded['status'] === 200, 'Status should be 200');
    assertCondition($decoded['message'] === 'Success', 'Message should be "Success"');
    assertCondition($decoded['data']['user'] === 'John', 'Data should contain user');
});

test('Default values', function (): void {
    $result = jsonResponse();
    $decoded = json_decode($result, true);

    assertCondition(is_array($decoded), 'Response should decode to array');
    assertCondition($decoded['status'] === 200, 'Default status should be 200');
    assertCondition($decoded['message'] === '', 'Default message should be empty string');
    assertCondition(is_array($decoded['data']), 'Default data should be array');
    assertCondition($decoded['data'] === [], 'Default data should be empty array');
});

test('Status validation - invalid type', function (): void {
    try {
        jsonResponse([], 'invalid', 'test');
        throw new Exception('Expected InvalidArgumentException');
    } catch (InvalidArgumentException $error) {
        assertCondition(strpos($error->getMessage(), 'Status must be a valid HTTP status code') !== false, 'Wrong error message for invalid status type');
    }
});

test('Status validation - out of range', function (): void {
    try {
        jsonResponse([], 99, 'test');
        throw new Exception('Expected InvalidArgumentException');
    } catch (InvalidArgumentException $error) {
        assertCondition(strpos($error->getMessage(), 'Status must be a valid HTTP status code') !== false, 'Wrong error message for out of range status');
    }
});

test('Message validation - invalid type', function (): void {
    try {
        jsonResponse([], 200, 123);
        throw new Exception('Expected InvalidArgumentException');
    } catch (InvalidArgumentException $error) {
        assertCondition(strpos($error->getMessage(), 'Message must be a string') !== false, 'Wrong error message for invalid message type');
    }
});

test('Data validation - invalid type', function (): void {
    try {
        jsonResponse('invalid', 200, 'test');
        throw new Exception('Expected InvalidArgumentException');
    } catch (InvalidArgumentException $error) {
        assertCondition(strpos($error->getMessage(), 'Data must be an array or null') !== false, 'Wrong error message for invalid data type');
    }
});

test('Null data defaults to empty array', function (): void {
    $result = jsonResponse(null, 200, 'Success');
    $decoded = json_decode($result, true);

    assertCondition($decoded['data'] === [], 'Null data should default to empty array');
});

test('Complex data structure', function (): void {
    $complexData = [
        'users' => [
            ['id' => 1, 'name' => 'John'],
            ['id' => 2, 'name' => 'Jane'],
        ],
        'meta' => ['total' => 2, 'page' => 1],
    ];

    $result = jsonResponse($complexData, 201, 'Created');
    $decoded = json_decode($result, true);

    assertCondition($decoded['status'] === 201, 'Status should be 201');
    assertCondition($decoded['data']['users'][0]['name'] === 'John', 'Complex data should be preserved');
});

test('Pretty printed JSON output', function (): void {
    $result = jsonResponse(['test' => true], 200, 'Format test');
    assertCondition(strpos($result, "\n") !== false, 'Output should be pretty printed');
});

echo "\nTests completed! {$passedTests}/{$totalTests} tests passed.\n";

exit($passedTests === $totalTests ? 0 : 1);