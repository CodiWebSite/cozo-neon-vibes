<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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

// Gallery data file
$gallery_file = __DIR__ . '/gallery.json';

// Initialize gallery file if it doesn't exist
if (!file_exists($gallery_file)) {
    file_put_contents($gallery_file, json_encode([]));
}

// GET - List all gallery items
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $gallery_data = json_decode(file_get_contents($gallery_file), true) ?: [];
    echo json_encode($gallery_data);
    exit();
}

// For POST and DELETE, require authentication
if (!verifyToken()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Neautorizat']);
    exit();
}

// POST - Add new gallery item
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['title']) || !isset($input['category']) || !isset($input['type'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Date incomplete']);
        exit();
    }
    
    $gallery_data = json_decode(file_get_contents($gallery_file), true) ?: [];
    
    $new_item = [
        'id' => uniqid(),
        'title' => trim($input['title']),
        'category' => trim($input['category']),
        'type' => trim($input['type']),
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    if ($input['type'] === 'image') {
        $new_item['src'] = $input['src'] ?? '';
        $new_item['alt'] = $input['alt'] ?? $input['title'];
    } elseif ($input['type'] === 'video') {
        $new_item['videoUrl'] = $input['videoUrl'] ?? '';
        $new_item['thumbnail'] = $input['thumbnail'] ?? '';
    }
    
    $gallery_data[] = $new_item;
    
    if (file_put_contents($gallery_file, json_encode($gallery_data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'item' => $new_item]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare la salvare']);
    }
    exit();
}

// DELETE - Remove gallery item
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID lipsă']);
        exit();
    }
    
    $gallery_data = json_decode(file_get_contents($gallery_file), true) ?: [];
    $item_id = $input['id'];
    
    // Find and remove the item
    $found = false;
    $gallery_data = array_filter($gallery_data, function($item) use ($item_id, &$found) {
        if ($item['id'] === $item_id) {
            $found = true;
            return false;
        }
        return true;
    });
    
    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Element negăsit']);
        exit();
    }
    
    // Re-index array
    $gallery_data = array_values($gallery_data);
    
    if (file_put_contents($gallery_file, json_encode($gallery_data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Element șters cu succes']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare la ștergere']);
    }
    exit();
}

// Method not allowed
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metodă nepermisă']);
?>