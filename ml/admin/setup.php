<?php
/**
 * Database Setup Script
 * Run once to create tables and insert default admin user
 * DELETE THIS FILE AFTER SETUP IN PRODUCTION
 */

require_once __DIR__ . '/config.php';

// Only allow from localhost or with secret key
$allowSetup = (
    in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ||
    ($_GET['key'] ?? '') === 'egc_setup_2024_secret'
);

if (!$allowSetup) {
    die('Access denied. Add ?key=egc_setup_2024_secret to URL');
}

header('Content-Type: text/html; charset=utf-8');

echo "<h1>EGC Admin Database Setup</h1>";
echo "<pre>";

try {
    $db = getDB();
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    
    // Split by semicolon but handle the INSERT statement carefully
    $statements = array_filter(array_map('trim', preg_split('/;[\r\n]+/', $schema)));
    
    foreach ($statements as $sql) {
        if (empty($sql) || strpos($sql, '--') === 0) continue;
        
        try {
            $db->exec($sql);
            echo "✓ Executed: " . substr($sql, 0, 60) . "...\n";
        } catch (PDOException $e) {
            // Ignore duplicate key errors for indexes
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                echo "⚠ Skipped (already exists): " . substr($sql, 0, 60) . "...\n";
            } else {
                echo "✗ Error: " . $e->getMessage() . "\n";
            }
        }
    }
    
    // Create admin user with proper password hash
    $adminPassword = 'aB26354!';
    $passwordHash = password_hash($adminPassword, PASSWORD_DEFAULT);
    
    $stmt = $db->prepare('
        INSERT INTO admin_users (username, password_hash, email) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    ');
    $stmt->execute(['ian', $passwordHash, 'ian@evilgeniuscreative.com']);
    
    echo "\n✓ Admin user 'ian' created/updated with password 'aB26354!'\n";
    
    echo "\n<strong>Setup complete!</strong>\n";
    echo "\n⚠️ DELETE THIS FILE (setup.php) IN PRODUCTION!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "</pre>";
