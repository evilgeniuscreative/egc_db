<?php
/**
 * Authentication API endpoint
 * POST /ml/admin/auth.php - Login
 * GET /ml/admin/auth.php - Verify token
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Login
    $data = getRequestBody();
    
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        jsonResponse(['error' => 'Username and password required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }
    
    // Update last login
    $stmt = $db->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);
    
    // Generate token
    $token = generateJWT($user['id'], $user['username']);
    
    jsonResponse([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username']
        ]
    ]);
    
} elseif ($method === 'GET') {
    // Verify token
    $userData = requireAuth();
    jsonResponse([
        'success' => true,
        'user' => [
            'id' => $userData['user_id'],
            'username' => $userData['username']
        ]
    ]);
    
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
