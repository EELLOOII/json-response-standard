<?php
function jsonResponse($data = [], $status = 200, $message = '') {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ], JSON_PRETTY_PRINT);
    exit;
}

// Example usage
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    jsonResponse(['user' => 'John'], 200, 'Success');
}
?>
