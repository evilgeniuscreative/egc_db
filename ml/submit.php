<?php
require_once 'config.php';
require_once 'db.php';
require_once 'smtp_mailer.php';
session_start();

$ip = $_SERVER['REMOTE_ADDR'];
$cookie = $_COOKIE[COOKIE_NAME] ?? null;

// Domain enforcement
$referrer = parse_url($_SERVER['HTTP_REFERER'] ?? '', PHP_URL_HOST);
if (!in_array($referrer, $allowed_domains)) {
    http_response_code(403);
    exit('Unauthorized referrer');
}

// Form inputs with sanitization
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);
$recaptcha = $_POST['g-recaptcha-response'] ?? '';
$site = $referrer ?? 'unknown';

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

// Rate limiting
$time_now = time();
$ten_minutes_ago = $time_now - 600;
$one_minute_ago = $time_now - 60;

// Check for disabled form
$form_status = file_exists('form_disabled.flag');
if ($form_status) exit('Form disabled due to spam protection.');

// Global 10/10 limit
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE timestamp > FROM_UNIXTIME(:ten_min)");
$stmt->execute(['ten_min' => $ten_minutes_ago]);
$global_count = $stmt->fetchColumn();

if ($global_count >= EMAILS_PER_10_MIN) {
    // Disable and alert
    file_put_contents('form_disabled.flag', '1');
    mail(ADMIN_EMAIL, '🚨 Form Auto-disabled', "More than 10 emails received in 10 minutes.\nVisit admin panel to re-enable.");
    exit('Too many emails recently. Form disabled.');
}

// Per-IP rate limiting
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE ip = :ip AND timestamp > FROM_UNIXTIME(:min_ago)");
$stmt->execute(['ip' => $ip, 'min_ago' => $one_minute_ago]);
$recent_from_ip = $stmt->fetchColumn();

if ($recent_from_ip >= EMAILS_PER_MINUTE || isset($_COOKIE[COOKIE_NAME])) {
    exit('Rate limit exceeded or you are banned.');
}

// Store to DB
$stmt = $pdo->prepare("INSERT INTO emails (name, email, message, site, ip, user_cookie, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->execute([$name, $email, $message, $site, $ip, $cookie]);

// Auto-reply using SMTP
sendSMTPMail($email, "Thanks for contacting Evil Genius Creative", "Hey $name,\n\nThanks for your message! We'll get back soon.");

// Admin copy using SMTP
sendSMTPMail(ADMIN_EMAIL, "New Contact from $name", "Name: $name\nEmail: $email\nMessage:\n$message\nIP: $ip\nSite: $site");

echo 'Success';
?>
