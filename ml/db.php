<?php
$host = 'localhost';
$dbname = 'evilgeo2_emails18';
$user = 'evilgeo2_maleDB';
$pass = 'HelloShitty1969.5';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure necessary tables exist (matching submit.php expectations)
//     $pdo->exec("
//         CREATE TABLE IF NOT EXISTS emails (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             name VARCHAR(100),
//             email VARCHAR(255),
//             message TEXT,
//             site VARCHAR(255),
//             ip VARCHAR(45),
//             user_cookie VARCHAR(255),
//             timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
//         );
        
//         CREATE TABLE IF NOT EXISTS bans (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             ip VARCHAR(45),
//             cookie_hash VARCHAR(255),
//             reason VARCHAR(255),
//             banned_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         );
        
//         CREATE TABLE IF NOT EXISTS admin_users (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             email VARCHAR(255),
//             password VARCHAR(255),
//             reset_token VARCHAR(255),
//             reset_expires DATETIME
//         );
//     ");
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
