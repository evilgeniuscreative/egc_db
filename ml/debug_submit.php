<?php
/**
 * Debug version of submit.php to identify configuration issues
 */

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set content type to plain text for easier reading
header('Content-Type: text/plain');

echo "Starting debug...\n\n";

try {
    echo "1. Loading config.php...\n";
    require_once 'config.php';
    echo "   ✓ Config loaded successfully\n\n";
    
    echo "2. Loading db.php...\n";
    require_once 'db.php';
    echo "   ✓ Database connection successful\n\n";
    
    echo "3. Loading smtp_mailer.php...\n";
    require_once 'smtp_mailer.php';
    echo "   ✓ SMTP mailer loaded successfully\n\n";
    
    echo "4. Checking required constants:\n";
    echo "   RECAPTCHA_SECRET: " . (defined('RECAPTCHA_SECRET') ? '✓ defined' : '✗ NOT DEFINED') . "\n";
    echo "   RECAPTCHA_SITE_KEY: " . (defined('RECAPTCHA_SITE_KEY') ? '✓ defined' : '✗ NOT DEFINED') . "\n";
    echo "   ADMIN_EMAIL: " . (defined('ADMIN_EMAIL') ? '✓ defined (' . ADMIN_EMAIL . ')' : '✗ NOT DEFINED') . "\n";
    echo "   EMAILS_PER_MINUTE: " . (defined('EMAILS_PER_MINUTE') ? '✓ defined (' . EMAILS_PER_MINUTE . ')' : '✗ NOT DEFINED') . "\n";
    echo "   EMAILS_PER_10_MIN: " . (defined('EMAILS_PER_10_MIN') ? '✓ defined (' . EMAILS_PER_10_MIN . ')' : '✗ NOT DEFINED') . "\n";
    echo "   COOKIE_NAME: " . (defined('COOKIE_NAME') ? '✓ defined (' . COOKIE_NAME . ')' : '✗ NOT DEFINED') . "\n\n";
    
    echo "5. Checking ALLOWED_SITES variable:\n";
    if (isset($ALLOWED_SITES)) {
        echo "   ✓ ALLOWED_SITES is set:\n";
        foreach ($ALLOWED_SITES as $site) {
            echo "     - $site\n";
        }
    } else {
        echo "   ✗ ALLOWED_SITES is NOT SET\n";
    }
    echo "\n";
    
    echo "6. Testing database connection:\n";
    $stmt = $pdo->query("SELECT 1 as test");
    $result = $stmt->fetch();
    echo "   ✓ Database query successful (result: " . $result['test'] . ")\n\n";
    
    echo "7. Checking database tables:\n";
    try {
        $stmt = $pdo->query("SHOW TABLES LIKE 'emails'");
        if ($stmt->rowCount() > 0) {
            echo "   ✓ 'emails' table exists\n";
        } else {
            echo "   ✗ 'emails' table does NOT exist\n";
        }
        
        $stmt = $pdo->query("SHOW TABLES LIKE 'bans'");
        if ($stmt->rowCount() > 0) {
            echo "   ✓ 'bans' table exists\n";
        } else {
            echo "   ✗ 'bans' table does NOT exist\n";
        }
    } catch (Exception $e) {
        echo "   ✗ Error checking tables: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    echo "8. Testing SMTP configuration:\n";
    echo "   SMTP_HOST: " . (isset($SMTP_HOST) ? $SMTP_HOST : 'NOT SET') . "\n";
    echo "   SMTP_PORT: " . (isset($SMTP_PORT) ? $SMTP_PORT : 'NOT SET') . "\n";
    echo "   SMTP_USER: " . (isset($SMTP_USER) ? $SMTP_USER : 'NOT SET') . "\n";
    echo "   SMTP_PASS: " . (isset($SMTP_PASS) ? '[HIDDEN]' : 'NOT SET') . "\n\n";
    
    echo "✓ All basic checks passed!\n";
    echo "\nIf you're still getting 500 errors, the issue might be:\n";
    echo "- Missing database tables (emails, bans)\n";
    echo "- Database permissions\n";
    echo "- Server configuration issues\n";
    
} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
} catch (Error $e) {
    echo "✗ FATAL ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
?>
