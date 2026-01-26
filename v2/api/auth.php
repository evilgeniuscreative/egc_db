<?php
/**
 * Authentication endpoint
 * POST - Login
 * GET  - Verify token
 */

require_once __DIR__ . '/config.php';
headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = input();
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    
    if (!$username || !$password) {
        json_out(['error' => 'Username and password required'], 400);
    }
    
    $stmt = db()->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_out(['error' => 'Invalid credentials'], 401);
    }
    
    // Update last login
    db()->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);
    
    $token = jwt_encode(['id' => $user['id'], 'username' => $user['username']]);
    
    json_out([
        'token' => $token,
        'user' => ['id' => $user['id'], 'username' => $user['username']]
    ]);
    
} elseif ($method === 'GET') {
    $user = auth();
    json_out(['user' => ['id' => $user['id'], 'username' => $user['username']]]);
    
} else {
    json_out(['error' => 'Method not allowed'], 405);
}
