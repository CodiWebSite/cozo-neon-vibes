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

// Get form data
$title = $_POST['title'] ?? '';
$category = $_POST['category'] ?? 'general';
$type = $_POST['type'] ?? 'image';
$videoUrl = $_POST['videoUrl'] ?? '';

if (empty($title)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Titlul este obligatoriu']);
    exit();
}

// Function to generate Facebook thumbnail
function generateFacebookThumbnail($url, $videoId) {
    // Facebook doesn't provide a direct thumbnail API like YouTube
    // We'll create a custom thumbnail with Facebook branding
    $thumbnailPath = "uploads/thumbnails/";
    
    // Create thumbnails directory if it doesn't exist
    if (!file_exists($thumbnailPath)) {
        mkdir($thumbnailPath, 0755, true);
    }
    
    $thumbnailFile = $thumbnailPath . "fb_" . $videoId . ".svg";
    
    // Check if thumbnail already exists
    if (file_exists($thumbnailFile)) {
        return "/" . $thumbnailFile;
    }
    
    // Create a custom SVG thumbnail for Facebook videos
    $svgContent = '<?xml version="1.0" encoding="UTF-8"?>
<svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1877F2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#42A5F5;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="320" height="180" fill="url(#fbGradient)"/>
  <circle cx="160" cy="90" r="30" fill="white" opacity="0.9"/>
  <polygon points="150,75 150,105 175,90" fill="#1877F2"/>
  <text x="160" y="130" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Facebook Video</text>
  <text x="160" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" opacity="0.8">Click to play</text>
</svg>';
    
    // Save the SVG file
    file_put_contents($thumbnailFile, $svgContent);
    
    return "/" . $thumbnailFile;
}

// Function to extract video ID from various URL formats
function extractVideoInfo($url) {
    $url = trim($url);
    
    // Check if it's an iframe embed code
    if (strpos($url, '<iframe') !== false) {
        // Extract src from iframe
        preg_match('/src=["\']([^"\']*)["\']/i', $url, $matches);
        if (isset($matches[1])) {
            $extractedUrl = $matches[1];
            
            // Check if it's a Facebook iframe
            if (strpos($extractedUrl, 'facebook.com/plugins/video.php') !== false) {
                // Extract the original Facebook URL from the href parameter
                if (preg_match('/href=([^&]+)/', $extractedUrl, $hrefMatches)) {
                    $originalUrl = urldecode($hrefMatches[1]);
                    
                    // Extract video/reel ID from the original URL
                    if (preg_match('/(?:videos|reel)\/(\d+)/', $originalUrl, $idMatches)) {
                        return [
                            'type' => 'facebook',
                            'id' => $idMatches[1],
                            'embedUrl' => $extractedUrl, // Use the iframe src directly
                            'thumbnail' => generateFacebookThumbnail($originalUrl, $idMatches[1])
                        ];
                    }
                    
                    // Check for watch pattern (classic videos)
                    if (preg_match('/watch.*[?&]v=(\d+)/', $originalUrl, $idMatches)) {
                        return [
                            'type' => 'facebook',
                            'id' => $idMatches[1],
                            'embedUrl' => $extractedUrl, // Use the iframe src directly
                            'thumbnail' => generateFacebookThumbnail($originalUrl, $idMatches[1])
                        ];
                    }
                }
            }
            
            $url = $extractedUrl;
        }
    }
    
    // YouTube patterns
    if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches)) {
        return [
            'type' => 'youtube',
            'id' => $matches[1],
            'embedUrl' => 'https://www.youtube.com/embed/' . $matches[1],
            'thumbnail' => 'https://img.youtube.com/vi/' . $matches[1] . '/maxresdefault.jpg'
        ];
    }
    
    // Facebook video patterns (videos and reels)
    if (preg_match('/facebook\.com.*\/videos\/(\d+)/', $url, $matches)) {
        return [
            'type' => 'facebook',
            'id' => $matches[1],
            'embedUrl' => 'https://www.facebook.com/plugins/video.php?href=' . urlencode($url),
            'thumbnail' => generateFacebookThumbnail($url, $matches[1])
        ];
    }
    
    // Facebook reels pattern
    if (preg_match('/facebook\.com.*\/reel\/(\d+)/', $url, $matches)) {
        return [
            'type' => 'facebook',
            'id' => $matches[1],
            'embedUrl' => 'https://www.facebook.com/plugins/video.php?href=' . urlencode($url),
            'thumbnail' => generateFacebookThumbnail($url, $matches[1])
        ];
    }
    
    // Facebook watch pattern (classic videos)
    if (preg_match('/facebook\.com.*\/watch.*[?&]v=(\d+)/', $url, $matches)) {
        return [
            'type' => 'facebook',
            'id' => $matches[1],
            'embedUrl' => 'https://www.facebook.com/plugins/video.php?href=' . urlencode($url),
            'thumbnail' => generateFacebookThumbnail($url, $matches[1])
        ];
    }
    
    // Vimeo patterns
    if (preg_match('/vimeo\.com\/(\d+)/', $url, $matches)) {
        return [
            'type' => 'vimeo',
            'id' => $matches[1],
            'embedUrl' => 'https://player.vimeo.com/video/' . $matches[1],
            'thumbnail' => '/placeholder.svg'
        ];
    }
    
    // If it's already an embed URL, use it directly
    if (strpos($url, 'embed') !== false || strpos($url, 'player') !== false) {
        return [
            'type' => 'embed',
            'id' => md5($url),
            'embedUrl' => $url,
            'thumbnail' => '/placeholder.svg'
        ];
    }
    
    // Default case - treat as direct URL
    return [
        'type' => 'direct',
        'id' => md5($url),
        'embedUrl' => $url,
        'thumbnail' => '/placeholder.svg'
    ];
}

// Handle different upload types
if ($type === 'video' && !empty($videoUrl)) {
    // Handle video URL upload
    $videoInfo = extractVideoInfo($videoUrl);
    
    $gallery_item = [
        'id' => uniqid(),
        'title' => trim($title),
        'category' => trim($category),
        'type' => 'video',
        'videoUrl' => $videoInfo['embedUrl'],
        'videoType' => $videoInfo['type'],
        'videoId' => $videoInfo['id'],
        'thumbnail' => $videoInfo['thumbnail'],
        'originalUrl' => $videoUrl,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
} else if ($type === 'image' || ($type === 'video' && empty($videoUrl))) {
    // Handle file upload (images or local video files)
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Fișier lipsă sau eroare la upload']);
        exit();
    }

    $file = $_FILES['file'];

    // Validate file type
    $allowed_types = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'
    ];

    $file_type = $file['type'];
    $file_info = pathinfo($file['name']);
    $file_extension = strtolower($file_info['extension']);

    if (!in_array($file_type, $allowed_types)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tip de fișier nepermis']);
        exit();
    }

    // Check file size (max 50MB)
    $max_size = 50 * 1024 * 1024; // 50MB
    if ($file['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Fișierul este prea mare (max 50MB)']);
        exit();
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = __DIR__ . '/../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename
    $unique_name = uniqid() . '_' . time() . '.' . $file_extension;
    $upload_path = $upload_dir . $unique_name;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Eroare la salvarea fișierului']);
        exit();
    }

    // Determine media type
    $media_type = str_starts_with($file_type, 'image/') ? 'image' : 'video';

    // Create gallery item
    $gallery_item = [
        'id' => uniqid(),
        'title' => trim($title),
        'category' => trim($category),
        'type' => $media_type,
        'created_at' => date('Y-m-d H:i:s')
    ];

    if ($media_type === 'image') {
        $gallery_item['src'] = '/uploads/' . $unique_name;
        $gallery_item['alt'] = $title;
    } else {
        $gallery_item['videoUrl'] = '/uploads/' . $unique_name;
        $gallery_item['videoType'] = 'file';
        $gallery_item['thumbnail'] = '/uploads/' . $unique_name;
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Date invalide pentru upload']);
    exit();
}

// Add to gallery
$gallery_file = __DIR__ . '/gallery.json';
$gallery_data = [];

if (file_exists($gallery_file)) {
    $gallery_data = json_decode(file_get_contents($gallery_file), true) ?: [];
}

$gallery_data[] = $gallery_item;

if (file_put_contents($gallery_file, json_encode($gallery_data, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true,
        'message' => $type === 'video' && !empty($videoUrl) ? 'Video URL adăugat cu succes' : 'Fișier încărcat cu succes',
        'item' => $gallery_item
    ]);
} else {
    // If gallery update fails and we uploaded a file, remove it
    if (isset($upload_path) && file_exists($upload_path)) {
        unlink($upload_path);
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Eroare la actualizarea galeriei']);
}
?>