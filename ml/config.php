<?php
// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception('.env file not found at: ' . $path);
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue; // Skip comments
        }
        
        if (strpos($line, '=') === false) {
            continue; // Skip lines without = sign
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if present
        $value = trim($value, '"\'');
        
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Load .env file from root directory
loadEnv($_SERVER['DOCUMENT_ROOT'] . '/.env');

// Database configuration
define('DB_HOST', $_ENV['DB_HOST']);
define('DB_NAME', $_ENV['DB_NAME']);
define('DB_USER', $_ENV['DB_USER']);
define('DB_PASS', $_ENV['DB_PASS']);

// SMTP configuration - make these global variables accessible
$SMTP_HOST = $_ENV['SMTP_HOST'];
$SMTP_PORT = (int)$_ENV['SMTP_PORT'];
$SMTP_USER = $_ENV['SMTP_USER'];
$SMTP_PASS = $_ENV['SMTP_PASS'];

// Admin email for alerts
define('ADMIN_EMAIL', $_ENV['ADMIN_EMAIL']);

// Allowed referring domains
$allowed_domains = array_map('trim', explode(',', $_ENV['ALLOWED_DOMAINS']));
$ALLOWED_SITES = $allowed_domains;

// Rate limits
define('EMAILS_PER_MINUTE', (int)$_ENV['EMAILS_PER_MINUTE']);
define('EMAILS_PER_10_MIN', (int)$_ENV['EMAILS_PER_10_MIN']);

// reCAPTCHA keys
define('RECAPTCHA_SECRET', $_ENV['RECAPTCHA_SECRET']);
define('RECAPTCHA_SITE_KEY', $_ENV['RECAPTCHA_SITE_KEY']);

// Cookie + IP ban control
define('COOKIE_NAME', $_ENV['COOKIE_NAME']);
?>