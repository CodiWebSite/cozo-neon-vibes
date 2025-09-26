<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Helper function to verify token
function verifyToken() {
    $headers = getallheaders();
    $auth_header = $headers['Authorization'] ?? '';
    
    if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
        return false;
    }
    
    $token = substr($auth_header, 7);
    $tokens_file = __DIR__ . '/tokens.json';
    
    if (!file_exists($tokens_file)) {
        return false;
    }
    
    $tokens = json_decode(file_get_contents($tokens_file), true) ?: [];
    
    if (!isset($tokens[$token])) {
        return false;
    }
    
    $token_data = $tokens[$token];
    $current_time = time();
    
    // Check if token is expired (24 hours)
    if (($current_time - $token_data['created']) >= 86400) {
        return false;
    }
    
    return true;
}

// Verify authentication
if (!verifyToken()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Neautorizat']);
    exit();
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID element lipsă']);
    exit();
}

$item_id = $input['id'];

// Load gallery data
$gallery_file = __DIR__ . '/gallery.json';
if (!file_exists($gallery_file)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Galeria nu există']);
    exit();
}

$gallery_data = json_decode(file_get_contents($gallery_file), true) ?: [];

// Find the item to delete
$item_to_delete = null;
$item_index = -1;

foreach ($gallery_data as $index => $item) {
    if ($item['id'] === $item_id) {
        $item_to_delete = $item;
        $item_index = $index;
        break;
    }
}

if (!$item_to_delete) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Element negăsit']);
    exit();
}

// Delete physical file if it exists and is a local upload
$file_deleted = true;
if (isset($item_to_delete['src']) && str_starts_with($item_to_delete['src'], '/uploads/')) {
    $file_path = __DIR__ . '/../' . $item_to_delete['src'];
    if (file_exists($file_path)) {
        $file_deleted = unlink($file_path);
    }
} elseif (isset($item_to_delete['videoUrl']) && str_starts_with($item_to_delete['videoUrl'], '/uploads/')) {
    $file_path = __DIR__ . '/../' . $item_to_delete['videoUrl'];
    if (file_exists($file_path)) {
        $file_deleted = unlink($file_path);
    }
}

// Remove item from gallery data
array_splice($gallery_data, $item_index, 1);

// Save updated gallery data
if (file_put_contents($gallery_file, json_encode($gallery_data, JSON_PRETTY_PRINT))) {
    $message = 'Element șters cu succes';
    if (!$file_deleted) {
        $message .= ' (fișierul fizic nu a putut fi șters)';
    }
    
    echo json_encode([
        'success' => true,
        'message' => $message,
        'file_deleted' => $file_deleted
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Eroare la actualizarea galeriei']);
}
?>