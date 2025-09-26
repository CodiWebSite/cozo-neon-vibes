<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['valid' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get authorization header
$headers = getallheaders();
$auth_header = $headers['Authorization'] ?? '';

if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['valid' => false, 'message' => 'Token lipsă']);
    exit();
}

$token = substr($auth_header, 7); // Remove "Bearer " prefix

// Load tokens
$tokens_file = __DIR__ . '/tokens.json';
if (!file_exists($tokens_file)) {
    http_response_code(401);
    echo json_encode(['valid' => false, 'message' => 'Token invalid']);
    exit();
}

$tokens = json_decode(file_get_contents($tokens_file), true) ?: [];

// Check if token exists and is not expired
if (!isset($tokens[$token])) {
    http_response_code(401);
    echo json_encode(['valid' => false, 'message' => 'Token invalid']);
    exit();
}

$token_data = $tokens[$token];
$current_time = time();

// Check if token is expired (24 hours)
if (($current_time - $token_data['created']) >= 86400) {
    // Remove expired token
    unset($tokens[$token]);
    file_put_contents($tokens_file, json_encode($tokens));
    
    http_response_code(401);
    echo json_encode(['valid' => false, 'message' => 'Token expirat']);
    exit();
}

echo json_encode([
    'valid' => true,
    'username' => $token_data['username']
]);
?>