<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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

$packagesFile = __DIR__ . '/packages.json';

// Helper function to read packages
function readPackages($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

// Helper function to write packages
function writePackages($file, $packages) {
    return file_put_contents($file, json_encode($packages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Helper function to generate unique ID
function generatePackageId($name) {
    return strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name)) . '_' . time();
}

// Helper function to validate package data
function validatePackageData($data) {
    $required = ['name', 'duration', 'description', 'features'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            return "Câmpul '$field' este obligatoriu";
        }
    }
    
    if (!is_array($data['features']) || empty($data['features'])) {
        return "Features trebuie să fie un array non-gol";
    }
    
    return null;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all packages (public endpoint)
            $packages = readPackages($packagesFile);
            echo json_encode($packages);
            break;
            
        case 'POST':
            // Create new package (admin only)
            if (!verifyToken()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Neautorizat']);
                exit();
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $error = validatePackageData($input);
            if ($error) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => $error]);
                exit();
            }
            
            $packages = readPackages($packagesFile);
            
            $newPackage = [
                'id' => generatePackageId($input['name']),
                'name' => $input['name'],
                'icon' => $input['icon'] ?? 'Star',
                'duration' => $input['duration'],
                'description' => $input['description'],
                'features' => $input['features'],
                'popular' => $input['popular'] ?? false,
                'gradient' => $input['gradient'] ?? 'from-blue-500 to-cyan-500',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            $packages[] = $newPackage;
            
            if (writePackages($packagesFile, $packages)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Pachet adăugat cu succes',
                    'package' => $newPackage
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Eroare la salvarea pachetului']);
            }
            break;
            
        case 'PUT':
            // Update existing package (admin only)
            if (!verifyToken()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Neautorizat']);
                exit();
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID pachet este obligatoriu']);
                exit();
            }
            
            $error = validatePackageData($input);
            if ($error) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => $error]);
                exit();
            }
            
            $packages = readPackages($packagesFile);
            $packageIndex = -1;
            
            foreach ($packages as $index => $package) {
                if ($package['id'] === $input['id']) {
                    $packageIndex = $index;
                    break;
                }
            }
            
            if ($packageIndex === -1) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Pachetul nu a fost găsit']);
                exit();
            }
            
            // Update package while preserving created_at
            $packages[$packageIndex] = [
                'id' => $input['id'],
                'name' => $input['name'],
                'icon' => $input['icon'] ?? $packages[$packageIndex]['icon'],
                'duration' => $input['duration'],
                'description' => $input['description'],
                'features' => $input['features'],
                'popular' => $input['popular'] ?? false,
                'gradient' => $input['gradient'] ?? $packages[$packageIndex]['gradient'],
                'created_at' => $packages[$packageIndex]['created_at'],
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            if (writePackages($packagesFile, $packages)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Pachet actualizat cu succes',
                    'package' => $packages[$packageIndex]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Eroare la actualizarea pachetului']);
            }
            break;
            
        case 'DELETE':
            // Delete package (admin only)
            if (!verifyToken()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Neautorizat']);
                exit();
            }
            
            $packageId = $_GET['id'] ?? null;
            
            if (!$packageId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID pachet este obligatoriu']);
                exit();
            }
            
            $packages = readPackages($packagesFile);
            $packageIndex = -1;
            
            foreach ($packages as $index => $package) {
                if ($package['id'] === $packageId) {
                    $packageIndex = $index;
                    break;
                }
            }
            
            if ($packageIndex === -1) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Pachetul nu a fost găsit']);
                exit();
            }
            
            $deletedPackage = $packages[$packageIndex];
            array_splice($packages, $packageIndex, 1);
            
            if (writePackages($packagesFile, $packages)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Pachet șters cu succes',
                    'package' => $deletedPackage
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Eroare la ștergerea pachetului']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Metodă nepermisă']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Eroare server: ' . $e->getMessage()]);
}
?>