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
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username și parola sunt obligatorii']);
    exit();
}

$username = trim($input['username']);
$password = trim($input['password']);

// Admin credentials (în producție, acestea ar trebui să fie în baza de date cu hash-uri)
$admin_username = 'djcozo_admin';
$admin_password = 'DjCozo2024!@#';

// Verify credentials
if ($username !== $admin_username || $password !== $admin_password) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Credențiale invalide']);
    exit();
}

// Generate a simple token (în producție, folosește JWT sau un sistem mai sigur)
$token = base64_encode($username . ':' . time() . ':' . bin2hex(random_bytes(16)));

// Store token in a simple file (în producție, folosește o bază de date)
$tokens_file = __DIR__ . '/tokens.json';
$tokens = [];

if (file_exists($tokens_file)) {
    $tokens = json_decode(file_get_contents($tokens_file), true) ?: [];
}

// Clean old tokens (older than 24 hours)
$current_time = time();
$tokens = array_filter($tokens, function($token_data) use ($current_time) {
    return ($current_time - $token_data['created']) < 86400; // 24 hours
});

// Add new token
$tokens[$token] = [
    'username' => $username,
    'created' => $current_time
];

// Save tokens
file_put_contents($tokens_file, json_encode($tokens));

echo json_encode([
    'success' => true,
    'token' => $token,
    'message' => 'Autentificare reușită'
]);
?>