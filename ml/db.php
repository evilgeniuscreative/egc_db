<?php
/**
 * Filename: db.php
 * Location: /web/root/
 * 
 * Database connection handler for Evil Genius Creative mail system
 * Creates PDO connection using constants from config.php
 * 
 * Variables:
 * - $pdo: Global PDO database connection object
 * 
 * Instructions:
 * 1. Requires config.php to be loaded first for DB constants
 * 2. Creates global $pdo variable for use in other scripts
 * 3. Uses UTF-8 charset and error mode for debugging
 * 4. Handles connection errors gracefully
 */

try {
    // Create PDO connection
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
} catch (PDOException $e) {
    // Log the error but don't expose database details to users
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    exit('Database connection error. Please try again later.');
}
?>