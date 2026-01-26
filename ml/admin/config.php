<?php
/**
 * Admin API Configuration
 * Database: evilgeo2_egc
 */

// Error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'evilgeo2_egc');
define('DB_USER', 'evilgeo2_iana');
define('DB_PASS', 'noHackingB26354!');

// Session configuration
define('SESSION_NAME', 'egc_admin_session');
define('SESSION_LIFETIME', 86400); // 24 hours

// CORS settings
define('ALLOWED_ORIGINS', [
    'https://evilgeniuscreative.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]);

// JWT Secret (change this in production)
define('JWT_SECRET', 'egc_admin_secret_key_change_in_production_2024');
define('JWT_EXPIRY', 86400); // 24 hours

/**
 * Get PDO database connection
 */
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    
    return $pdo;
}

/**
 * Set CORS headers
 */
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
    
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Generate JWT token
 */
function generateJWT($userId, $username) {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode([
        'user_id' => $userId,
        'username' => $username,
        'exp' => time() + JWT_EXPIRY,
        'iat' => time()
    ]));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    
    return "$header.$payload.$signature";
}

/**
 * Verify JWT token
 */
function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    
    if ($signature !== $expectedSignature) {
        return false;
    }
    
    $data = json_decode(base64_decode($payload), true);
    
    if ($data['exp'] < time()) {
        return false;
    }
    
    return $data;
}

/**
 * Require authentication
 */
function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }
    
    $token = $matches[1];
    $userData = verifyJWT($token);
    
    if (!$userData) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }
    
    return $userData;
}

/**
 * Get JSON request body
 */
function getRequestBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}
