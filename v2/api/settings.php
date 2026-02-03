<?php
/**
 * Settings API endpoint
 * GET /api/settings.php - Get all settings or specific setting
 * PUT /api/settings.php - Update a setting
 */

require_once 'config.php';
require_once 'jwt_functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch settings
if ($method === 'GET') {
    try {
        $key = $_GET['key'] ?? null;
        
        if ($key) {
            // Get specific setting
            $stmt = $pdo->prepare("SELECT k, v FROM settings WHERE k = ?");
            $stmt->execute([$key]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                json_out(['success' => true, 'data' => $result]);
            } else {
                json_out(['success' => false, 'error' => 'Setting not found'], 404);
            }
        } else {
            // Get all settings
            $stmt = $pdo->query("SELECT k, v FROM settings ORDER BY k");
            $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convert to key-value object
            $data = [];
            foreach ($settings as $setting) {
                $data[$setting['k']] = $setting['v'];
            }
            
            json_out(['success' => true, 'data' => $data]);
        }
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// PUT - Update setting (requires auth)
elseif ($method === 'PUT') {
    $token = get_bearer_token();
    if (!$token || !verify_jwt($token)) {
        json_out(['error' => 'Unauthorized'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $key = $input['key'] ?? null;
    $value = $input['value'] ?? null;
    
    if (!$key) {
        json_out(['error' => 'Key is required'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)");
        $stmt->execute([$key, $value]);
        
        json_out(['success' => true, 'message' => 'Setting updated']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

else {
    json_out(['error' => 'Method not allowed'], 405);
}
