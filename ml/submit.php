<?php
require_once 'config.php';
require_once 'db.php';
require_once 'smtp_mailer.php';
session_start();

$ip = $_SERVER['REMOTE_ADDR'];
$cookie = $_COOKIE[COOKIE_NAME] ?? null;

// Domain enforcement
$referrer = parse_url($_SERVER['HTTP_REFERER'] ?? '', PHP_URL_HOST);
if (!in_array($referrer, $ALLOWED_SITES)) {
    http_response_code(403);
    exit('Unauthorized referrer');
}

// Form inputs with sanitization
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);
$recaptcha = $_POST['g-recaptcha-response'] ?? '';
$site = $referrer ?? 'unknown';

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    exit('All fields are required');
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Invalid email address');
}

// CAPTCHA check
$captcha_response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . RECAPTCHA_SECRET . "&response=" . $recaptcha);
$captcha_data = json_decode($captcha_response, true);
if (!$captcha_data['success']) {
    exit('Captcha failed.');
}

// Check if user is banned
$stmt = $pdo->prepare("SELECT COUNT(*) FROM bans WHERE ip = ? OR cookie_hash = ?");
$stmt->execute([$ip, $cookie]);
if ($stmt->fetchColumn() > 0) {
    exit('You are banned from using this form.');
}

// Rate limiting
$time_now = time();
$ten_minutes_ago = $time_now - 600;
$one_minute_ago = $time_now - 60;

// Check for disabled form
if (file_exists('form_disabled.flag')) {
    exit('Form disabled due to spam protection.');
}

// Global 10/10 minute limit
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE timestamp > DATE_SUB(NOW(), INTERVAL 10 MINUTE)");
$stmt->execute();
$global_count = $stmt->fetchColumn();

if ($global_count >= EMAILS_PER_10_MIN) {
    // Disable form and alert admin
    file_put_contents('form_disabled.flag', date('Y-m-d H:i:s'));
    sendSMTPMail(ADMIN_EMAIL, '🚨 Form Auto-disabled', "More than " . EMAILS_PER_10_MIN . " emails received in 10 minutes.\nForm has been automatically disabled.\nVisit the admin panel to re-enable.");
    exit('Too many emails recently. Form temporarily disabled.');
}

// Per-IP rate limiting (2 per minute)
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE ip = ? AND timestamp > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
$stmt->execute([$ip]);
$recent_from_ip = $stmt->fetchColumn();

if ($recent_from_ip >= EMAILS_PER_MINUTE) {
    exit('Rate limit exceeded. Please wait before sending another message.');
}

// Store to database
$stmt = $pdo->prepare("INSERT INTO emails (name, email, message, site, ip, user_cookie, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->execute([$name, $email, $message, $site, $ip, $cookie]);

// Send auto-reply
$reply_sent = sendSMTPMail(
    $email, 
    "Thanks for contacting Evil Genius Creative", 
    "Hey $name,\n\nThanks for your message! We'll get back to you soon.\n\nBest regards,\nEvil Genius Creative Team"
);

// Send admin notification
$admin_sent = sendSMTPMail(
    ADMIN_EMAIL, 
    "New Contact from $name", 
    "New contact form submission:\n\nName: $name\nEmail: $email\nMessage:\n$message\n\nDetails:\nIP: $ip\nSite: $site\nTimestamp: " . date('Y-m-d H:i:s')
);

if ($reply_sent && $admin_sent) {
    echo 'Message sent successfully!';
} else {
    echo 'Message received, but there may have been an email delivery issue.';
}
?>