<?php
/**
 * EGC Portfolio v2 - API Configuration
 * Database: evilgeo2_egc
 */

// Prevent direct access
if (!defined('API_ACCESS')) {
    define('API_ACCESS', true);
}

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database - use local credentials in development
$host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
$isLocal = $host === 'localhost:8000' || strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false;
define('DB_HOST', 'localhost');
define('DB_NAME', 'evilgeo2_egc');
define('DB_USER', $isLocal ? 'egc_dev' : 'evilgeo2_iana');
define('DB_PASS', $isLocal ? 'dev123' : 'noHackingB26354!');

// Security
define('JWT_SECRET', 'egc_v2_' . hash('sha256', 'evilgeniuscreative_2024_secret'));
define('JWT_EXPIRY', 86400); // 24 hours
define('ADMIN_USERNAME', 'ian');
define('ADMIN_PASSWORD_HASH', '$2y$10$PLACEHOLDER'); // Set by setup.php

// CORS
define('ALLOWED_ORIGINS', [
    'https://evilgeniuscreative.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
]);

/**
 * Database connection (singleton)
 */
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
    }
    return $pdo;
}

/**
 * Set CORS and JSON headers
 */
function headers(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Generate JWT
 */
function jwt_encode(array $payload): string {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload['iat'] = time();
    $payload = base64_encode(json_encode($payload));
    $sig = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$sig";
}

/**
 * Verify JWT, returns payload or false
 */
function jwt_decode(string $token): array|false {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    [$header, $payload, $sig] = $parts;
    $expected = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    
    if (!hash_equals($expected, $sig)) return false;
    
    $data = json_decode(base64_decode($payload), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return false;
    
    return $data;
}

/**
 * Require valid auth, returns user data or exits with 401
 */
function auth(): array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $auth, $m)) {
        json_out(['error' => 'No token'], 401);
    }
    $user = jwt_decode($m[1]);
    if (!$user) {
        json_out(['error' => 'Invalid token'], 401);
    }
    return $user;
}

/**
 * Get JSON request body
 */
function input(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

/**
 * Output JSON and exit
 */
function json_out(mixed $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
