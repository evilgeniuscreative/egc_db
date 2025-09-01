<?php
/**
 * Filename: submit.php
 * Location: /web/root/
 * 
 * Contact form submission handler with reCAPTCHA v3, rate limiting, and SMTP
 * 
 * Variables:
 * - $ip: User's IP address for rate limiting and logging
 * - $cookie: User's tracking cookie from COOKIE_NAME constant
 * - $referrer: HTTP referrer domain for security validation
 * - $name, $email, $message: Sanitized form inputs
 * - $recaptcha: reCAPTCHA v3 token from frontend
 * - $site: Referring domain name
 * 
 * Security Features:
 * - Domain whitelist validation (ALLOWED_SITES)
 * - reCAPTCHA v3 with score threshold (0.5 minimum)
 * - Rate limiting: 2 emails/minute per IP, 10 emails/10min globally
 * - IP and cookie banning system
 * - Auto-disable form on high volume
 * 
 * Instructions:
 * 1. Ensure .env file has all required variables
 * 2. Database tables must exist (emails, bans)
 * 3. Form must include g-recaptcha-response token
 * 4. Frontend must call with action 'contact_form' or 'getstarted_form'
 * 5. Sends auto-reply to user and notification to admin
 */

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

// reCAPTCHA v3 verification
if (empty($recaptcha)) {
    exit('reCAPTCHA token missing');
}

$captcha_url = "https://www.google.com/recaptcha/api/siteverify";
$captcha_data = array(
    'secret' => RECAPTCHA_SECRET,
    'response' => $recaptcha,
    'remoteip' => $ip
);

$captcha_response = file_get_contents($captcha_url . '?' . http_build_query($captcha_data));
$captcha_result = json_decode($captcha_response, true);

if (!$captcha_result['success']) {
    exit('reCAPTCHA verification failed');
}

// v3 specific checks
if ($captcha_result['score'] < 0.5) {
    // Log low score attempt for analysis
    error_log("Low reCAPTCHA score: " . $captcha_result['score'] . " from IP: $ip");
    exit('Security check failed. Please try again.');
}

// Verify the action matches what was sent from frontend
$expected_actions = ['contact_form', 'getstarted_form'];
if (!in_array($captcha_result['action'], $expected_actions)) {
    exit('Invalid reCAPTCHA action');
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
    sendSMTPMail(ADMIN_EMAIL, '🚨 Form Auto-disabled', "More than " . EMAILS_PER_10_MIN . " emails received in 10 minutes.\nForm has been automatically disabled.\nVisit the admin panel to re-enable.\n\nreCAPTCHA Score: " . $captcha_result['score']);
    exit('Too many emails recently. Form temporarily disabled.');
}

// Per-IP rate limiting (2 per minute)
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE ip = ? AND timestamp > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
$stmt->execute([$ip]);
$recent_from_ip = $stmt->fetchColumn();

if ($recent_from_ip >= EMAILS_PER_MINUTE) {
    exit('Rate limit exceeded. Please wait before sending another message.');
}

// Store to database (include reCAPTCHA score for analysis)
$stmt = $pdo->prepare("INSERT INTO emails (name, email, message, site, ip, user_cookie, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->execute([$name, $email, $message . "\n\n[reCAPTCHA Score: " . $captcha_result['score'] . "]", $site, $ip, $cookie]);

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
    "New contact form submission:\n\nName: $name\nEmail: $email\nMessage:\n$message\n\nDetails:\nIP: $ip\nSite: $site\nreCAPTCHA Score: " . $captcha_result['score'] . "\nTimestamp: " . date('Y-m-d H:i:s')
);

if ($reply_sent && $admin_sent) {
    echo 'Message sent successfully!';
} else {
    echo 'Message received, but there may have been an email delivery issue.';
}
?>