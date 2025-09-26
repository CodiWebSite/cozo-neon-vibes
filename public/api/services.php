<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
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

// Calea către fișierul JSON
$servicesFile = __DIR__ . '/services.json';

// Funcție pentru citirea serviciilor
function getServices() {
    global $servicesFile;
    if (!file_exists($servicesFile)) {
        // Servicii implicite
        $defaultServices = [
            [
                'id' => 1,
                'title' => 'Nunți',
                'description' => 'Creez atmosfera perfectă pentru cea mai importantă zi din viața voastră',
                'image' => '/src/assets/wedding-dj.jpg',
                'icon' => 'Heart',
                'features' => [
                    'Consultanță muzicală personalizată',
                    'Echipamente premium de sunet și lumini',
                    'Mixuri personalizate pentru momentele speciale',
                    'Backup complet pentru siguranță',
                    'Coordonare cu fotograful și videograful'
                ],
                'gradient' => 'from-pink-500 to-rose-500'
            ],
            [
                'id' => 2,
                'title' => 'Evenimente Corporate',
                'description' => 'Profesionalism și eleganță pentru evenimentele voastre de business',
                'image' => '/src/assets/corporate-event.jpg',
                'icon' => 'Building',
                'features' => [
                    'Prezentare profesională și discretă',
                    'Muzică adaptată publicului corporate',
                    'Sistem de sonorizare pentru prezentări',
                    'Coordonare cu organizatorii evenimentului',
                    'Flexibilitate în programul muzical'
                ],
                'gradient' => 'from-blue-500 to-cyan-500'
            ],
            [
                'id' => 3,
                'title' => 'Cluburi & Baruri',
                'description' => 'Energie pură și vibrații electrizante pentru nopțile de neuitat',
                'image' => '/src/assets/club-night.jpg',
                'icon' => 'Music',
                'features' => [
                    'Mixuri live adaptate energiei publicului',
                    'Repertoriu vast de muzică electronică',
                    'Interacțiune cu publicul',
                    'Efecte speciale de lumini și sunet',
                    'Experiență în cluburi de top'
                ],
                'gradient' => 'from-purple-500 to-violet-500'
            ],
            [
                'id' => 4,
                'title' => 'Evenimente Private',
                'description' => 'Petreceri personalizate pentru momente speciale cu prietenii',
                'image' => '/src/assets/private-party.jpg',
                'icon' => 'Users',
                'features' => [
                    'Atmosferă intimă și personalizată',
                    'Playlist-uri create special pentru voi',
                    'Echipamente adaptate spațiului',
                    'Flexibilitate maximă în program',
                    'Prețuri accesibile pentru grupuri mici'
                ],
                'gradient' => 'from-emerald-500 to-teal-500'
            ]
        ];
        file_put_contents($servicesFile, json_encode($defaultServices, JSON_PRETTY_PRINT));
        return $defaultServices;
    }
    
    $content = file_get_contents($servicesFile);
    return json_decode($content, true) ?: [];
}

// Funcție pentru salvarea serviciilor
function saveServices($services) {
    global $servicesFile;
    return file_put_contents($servicesFile, json_encode($services, JSON_PRETTY_PRINT)) !== false;
}

// Funcție pentru generarea unui ID unic
function generateId($services) {
    $maxId = 0;
    foreach ($services as $service) {
        if ($service['id'] > $maxId) {
            $maxId = $service['id'];
        }
    }
    return $maxId + 1;
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // Returnează toate serviciile
            $services = getServices();
            echo json_encode($services);
            break;
            
        case 'POST':
            // Adaugă un serviciu nou (necesită autentificare)
            if (!verifyToken()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Token invalid sau expirat']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['title']) || !isset($input['description'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Date incomplete']);
                exit;
            }
            
            $services = getServices();
            $newService = [
                'id' => generateId($services),
                'title' => $input['title'],
                'description' => $input['description'],
                'image' => $input['image'] ?? '/src/assets/placeholder.svg',
                'icon' => $input['icon'] ?? 'Star',
                'features' => $input['features'] ?? [],
                'gradient' => $input['gradient'] ?? 'from-blue-500 to-cyan-500'
            ];
            
            $services[] = $newService;
            
            if (saveServices($services)) {
                echo json_encode(['success' => true, 'service' => $newService]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Eroare la salvare']);
            }
            break;
            
        case 'PUT':
            // Actualizează un serviciu (necesită autentificare)
            if (!verifyToken()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Token invalid sau expirat']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID serviciu lipsă']);
                exit;
            }
            
            $services = getServices();
            $serviceIndex = -1;
            
            for ($i = 0; $i < count($services); $i++) {
                if ($services[$i]['id'] == $input['id']) {
                    $serviceIndex = $i;
                    break;
                }
            }
            
            if ($serviceIndex === -1) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Serviciul nu a fost găsit']);
                exit;
            }
            
            // Actualizează serviciul
            $services[$serviceIndex] = array_merge($services[$serviceIndex], [
                'title' => $input['title'] ?? $services[$serviceIndex]['title'],
                'description' => $input['description'] ?? $services[$serviceIndex]['description'],
                'image' => $input['image'] ?? $services[$serviceIndex]['image'],
                'icon' => $input['icon'] ?? $services[$serviceIndex]['icon'],
                'features' => $input['features'] ?? $services[$serviceIndex]['features'],
                'gradient' => $input['gradient'] ?? $services[$serviceIndex]['gradient']
            ]);
            
            if (saveServices($services)) {
                echo json_encode(['success' => true, 'service' => $services[$serviceIndex]]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Eroare la salvare']);
            }
            break;
            
        case 'DELETE':
            // Șterge un serviciu (necesită autentificare)
            if (!verifyToken()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Token invalid sau expirat']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID serviciu lipsă']);
                exit;
            }
            
            $services = getServices();
            $serviceIndex = -1;
            $deletedService = null;
            
            for ($i = 0; $i < count($services); $i++) {
                if ($services[$i]['id'] == $input['id']) {
                    $serviceIndex = $i;
                    $deletedService = $services[$i];
                    break;
                }
            }
            
            if ($serviceIndex === -1) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Serviciul nu a fost găsit']);
                exit;
            }
            
            // Șterge serviciul
            array_splice($services, $serviceIndex, 1);
            
            if (saveServices($services)) {
                echo json_encode(['success' => true, 'message' => 'Serviciu șters cu succes', 'service' => $deletedService]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Eroare la salvare']);
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