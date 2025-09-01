<?php
/**
 * Debug script to test email sending functionality
 */

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

echo "Email Debug Test\n";
echo "================\n\n";

try {
    require_once 'config.php';
    require_once 'smtp_mailer.php';
    
    echo "1. Testing SMTP configuration:\n";
    echo "   SMTP_HOST: " . (isset($SMTP_HOST) ? $SMTP_HOST : 'NOT SET') . "\n";
    echo "   SMTP_PORT: " . (isset($SMTP_PORT) ? $SMTP_PORT : 'NOT SET') . "\n";
    echo "   SMTP_USER: " . (isset($SMTP_USER) ? $SMTP_USER : 'NOT SET') . "\n";
    echo "   ADMIN_EMAIL: " . (defined('ADMIN_EMAIL') ? ADMIN_EMAIL : 'NOT SET') . "\n\n";
    
    echo "2. Testing auto-reply email:\n";
    $test_email = "ian@evilgeniuscreative.com"; // Use your own email for testing
    $test_name = "Test User";
    
    echo "   Sending auto-reply to: $test_email\n";
    $reply_result = sendSMTPMail(
        $test_email, 
        "Thanks for contacting Evil Genius Creative", 
        "Hey $test_name,\n\nThanks for your message! We'll get back to you soon.\n\nBest regards,\nEvil Genius Creative Team"
    );
    
    echo "   Auto-reply result: " . ($reply_result ? "SUCCESS" : "FAILED") . "\n\n";
    
    echo "3. Testing admin notification email:\n";
    echo "   Sending admin notification to: " . ADMIN_EMAIL . "\n";
    $admin_result = sendSMTPMail(
        ADMIN_EMAIL, 
        "Test Contact from $test_name", 
        "Test contact form submission:\n\nName: $test_name\nEmail: $test_email\nMessage: This is a test message\n\nTimestamp: " . date('Y-m-d H:i:s')
    );
    
    echo "   Admin notification result: " . ($admin_result ? "SUCCESS" : "FAILED") . "\n\n";
    
    if (!$reply_result || !$admin_result) {
        echo "4. Trying socket-based SMTP method:\n";
        $socket_result = sendSMTPMailSocket(
            $test_email,
            "Test Socket Email",
            "This is a test using the socket method."
        );
        echo "   Socket method result: " . ($socket_result ? "SUCCESS" : "FAILED") . "\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
?>
