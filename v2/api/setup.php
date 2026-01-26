<?php
/**
 * Database Setup - Run once, then DELETE this file
 * Access: /v2/api/setup.php?key=egc_setup_2024
 */

$setupKey = 'egc_setup_2024';

if (($_GET['key'] ?? '') !== $setupKey) {
    die('Access denied. Use ?key=' . $setupKey);
}

require_once __DIR__ . '/config.php';

echo "<pre style='font-family:monospace;'>";
echo "<h2>EGC v2 Database Setup</h2>\n";

try {
    $pdo = db();
    
    // Run schema
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    $statements = array_filter(array_map('trim', preg_split('/;[\r\n]+/', $schema)));
    
    foreach ($statements as $sql) {
        if (empty($sql) || strpos($sql, '--') === 0) continue;
        try {
            $pdo->exec($sql);
            echo "✓ " . substr($sql, 0, 50) . "...\n";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false || strpos($e->getMessage(), 'already exists') !== false) {
                echo "⚠ Skipped (exists): " . substr($sql, 0, 40) . "...\n";
            } else {
                echo "✗ Error: " . $e->getMessage() . "\n";
            }
        }
    }
    
    // Create admin user
    $username = 'ian';
    $password = 'aB26354!';
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)');
    $stmt->execute([$username, $hash]);
    echo "\n✓ Admin user '$username' ready\n";
    
    // Insert default settings
    $defaults = [
        ['site_name', 'Ian Kleinfeld'],
        ['site_title', 'Ian Kleinfeld - Full Stack Developer'],
        ['site_logo', 'logo.jpg'],
        ['hero1', 'hero1.webp'],
        ['hero2', 'hero2.webp'],
        ['hero_link', '/getstarted'],
        ['email', 'ian@evilgeniuscreative.com'],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE k=k');
    foreach ($defaults as [$k, $v]) {
        $stmt->execute([$k, $v]);
    }
    echo "✓ Default settings inserted\n";
    
    // Insert default socials
    $socials = [
        ['github', 'https://github.com/evilgeniuscreative/', 'faGithub', 1],
        ['linkedin', 'https://linkedin.com/in/iankleinfeld', 'faLinkedin', 2],
        ['stackoverflow', 'https://stackoverflow.com/users/1067156/maxrocket', 'faStackOverflow', 3],
        ['twitter', 'https://twitter.com/evilgeniuscrtv', 'faTwitter', 4],
        ['instagram', 'https://www.instagram.com/evilgeniuscrtv', 'faInstagram', 5],
        ['bluesky', 'https://bsky.app/profile/evilgeniuscreative.com', 'bluesky', 6],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO socials (platform, url, icon, sort_order, active) VALUES (?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE platform=platform');
    foreach ($socials as $s) {
        $stmt->execute($s);
    }
    echo "✓ Social links inserted\n";
    
    echo "\n<strong>Setup complete!</strong>\n";
    echo "\n⚠️ DELETE THIS FILE (setup.php) NOW!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

echo "</pre>";
