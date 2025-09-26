<?php
declare(strict_types=1);

/**
 * Generate a standardized JSON response.
 *
 * @param array|null $data   Response payload
 * @param int        $status HTTP-like status code (100-599)
 * @param string     $message Human-readable status message
 *
 * @return string JSON encoded response
 *
 * @throws InvalidArgumentException When inputs are invalid
 * @throws RuntimeException         When encoding fails
 */
function jsonResponse($data = [], $status = 200, $message = ''): string
{
    if (!is_int($status) || $status < 100 || $status > 599) {
        throw new InvalidArgumentException('Status must be a valid HTTP status code (100-599)');
    }

    if (!is_string($message)) {
        throw new InvalidArgumentException('Message must be a string');
    }

    if ($data === null) {
        $data = [];
    }

    if (!is_array($data)) {
        throw new InvalidArgumentException('Data must be an array or null');
    }

    $response = [
        'status' => $status,
        'message' => $message,
        'data' => $data,
    ];

    $encoded = json_encode($response, JSON_PRETTY_PRINT);

    if ($encoded === false) {
        throw new RuntimeException('Failed to encode response as JSON');
    }

    return $encoded;
}

// Example
if (basename(__FILE__) === basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? ''))) {
    echo jsonResponse(['user' => 'John'], 200, 'Success') . PHP_EOL;
}