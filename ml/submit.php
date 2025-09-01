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

// Load configuration files and start session
require_once 'config.php';      // Environment variables and constants
require_once 'db.php';          // Database connection ($pdo)
require_once 'smtp_mailer.php'; // Email sending functions
session_start();                // Start PHP session for tracking

// SECURITY: Get user information for tracking and validation
$ip = $_SERVER['REMOTE_ADDR'];                // User's IP address for rate limiting
$cookie = $_COOKIE[COOKIE_NAME] ?? null;      // Tracking cookie for ban system

// SECURITY: Domain whitelist enforcement - only allow submissions from approved domains
$referrer = parse_url($_SERVER['HTTP_REFERER'] ?? '', PHP_URL_HOST);
if (!in_array($referrer, $ALLOWED_SITES)) {
    http_response_code(403);
    exit('Unauthorized referrer');
}

// INPUT PROCESSING: Extract and sanitize form data from POST request
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);     // User's name
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);    // User's email
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING); // Form message content
$recaptcha = $_POST['g-recaptcha-response'] ?? '';                     // reCAPTCHA token
$site = $referrer ?? 'unknown';                                       // Which site sent the form

// VALIDATION: Check that all required fields are present
if (empty($name) || empty($email) || empty($message)) {
    exit('All fields are required');
}

// VALIDATION: Verify email format is valid
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Invalid email address');
}

// SECURITY: reCAPTCHA v3 verification - check if token exists
if (empty($recaptcha)) {
    exit('reCAPTCHA token missing');
}

// SECURITY: reCAPTCHA v3 verification - validate with Google's API
$captcha_url = "https://www.google.com/recaptcha/api/siteverify";
$captcha_data = array(
    'secret' => RECAPTCHA_SECRET,    // Server-side secret key
    'response' => $recaptcha,        // Token from frontend
    'remoteip' => $ip               // User's IP for additional validation
);

// Send verification request to Google and decode response
$captcha_response = file_get_contents($captcha_url . '?' . http_build_query($captcha_data));
$captcha_result = json_decode($captcha_response, true);

// Check if reCAPTCHA verification was successful
if (!$captcha_result['success']) {
    exit('reCAPTCHA verification failed');
}

// SECURITY: reCAPTCHA v3 score check (0.0 = bot, 1.0 = human)
if ($captcha_result['score'] < 0.5) {
    // Log suspicious activity for monitoring
    error_log("Low reCAPTCHA score: " . $captcha_result['score'] . " from IP: $ip");
    exit('Security check failed. Please try again.');
}

// SECURITY: Verify the action matches expected form types
$expected_actions = ['contact_form', 'getstarted_form'];
if (!in_array($captcha_result['action'], $expected_actions)) {
    exit('Invalid reCAPTCHA action');
}

// SECURITY: Check if user is banned (by IP or tracking cookie)
$stmt = $pdo->prepare("SELECT COUNT(*) FROM bans WHERE ip = ? OR cookie_hash = ?");
$stmt->execute([$ip, $cookie]);
if ($stmt->fetchColumn() > 0) {
    exit('You are banned from using this form.');
}

// RATE LIMITING: Set up time windows for submission limits
$time_now = time();
$ten_minutes_ago = $time_now - 600;  // 10 minutes in seconds
$one_minute_ago = $time_now - 60;    // 1 minute in seconds

// SPAM PROTECTION: Check if form is temporarily disabled
if (file_exists('form_disabled.flag')) {
    exit('Form disabled due to spam protection.');
}

// RATE LIMITING: Global submission limit (prevents site-wide spam attacks)
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE timestamp > DATE_SUB(NOW(), INTERVAL 10 MINUTE)");
$stmt->execute();
$global_count = $stmt->fetchColumn();

if ($global_count >= EMAILS_PER_10_MIN) {
    // Auto-disable form and notify admin of potential attack
    file_put_contents('form_disabled.flag', date('Y-m-d H:i:s'));
    sendSMTPMail(ADMIN_EMAIL, '🚨 Form Auto-disabled', "More than " . EMAILS_PER_10_MIN . " emails received in 10 minutes.\nForm has been automatically disabled.\nVisit the admin panel to re-enable.\n\nreCAPTCHA Score: " . $captcha_result['score']);
    exit('Too many emails recently. Form temporarily disabled.');
}

// RATE LIMITING: Per-IP submission limit (prevents individual user spam)
$stmt = $pdo->prepare("SELECT COUNT(*) FROM emails WHERE ip = ? AND timestamp > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
$stmt->execute([$ip]);
$recent_from_ip = $stmt->fetchColumn();

if ($recent_from_ip >= EMAILS_PER_MINUTE) {
    exit('Rate limit exceeded. Please wait before sending another message.');
}

// DATABASE: Store submission with reCAPTCHA score for spam analysis
$stmt = $pdo->prepare("INSERT INTO emails (name, email, message, site, ip, user_cookie, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->execute([$name, $email, $message . "\n\n[reCAPTCHA Score: " . $captcha_result['score'] . "]", $site, $ip, $cookie]);

// EMAIL FORMATTING: Detect which form was submitted and format emails accordingly
$is_getstarted_form = strpos($message, 'PROJECT INQUIRY - Get Started Form') !== false;

if ($is_getstarted_form) {
    // GET STARTED FORM: Use pre-formatted message from frontend
    $formatted_admin_message = $message; // Already well-formatted from getstarted.jsx
    $formatted_user_message = "<h3>Hi $name,\n\nThanks for your project inquiry! We'll get back to you as soon as possible, usually within two business days at the most.\n\nBest regards,\nEvil Genius Creative Team</h3>\n\n----------------------------\n<h3>Your original submission:</h3>\n\n$message";
} else {
    // CONTACT FORM: Format simple contact message with bold labels
    $formatted_admin_message = "CONTACT FORM SUBMISSION\n\n<strong>Name:</strong> $name\n<strong>Email:</strong> $email\n<strong>Message:</strong>\n$message\n\n<strong>Details:</strong>\n<strong>IP:</strong> $ip\n<strong>Site:</strong> $site\n<strong>reCAPTCHA Score:</strong> " . $captcha_result['score'] . "\n<strong>Timestamp:</strong> " . date('Y-m-d H:i:s');
    $formatted_user_message = "Hi $name,\n\nThanks for your message! We'll get back to you as soon as possible, usually within two business days at the most.\n\nBest regards,\nEvil Genius Creative Team\n\n----------------------------\nYour original message:\n\n<strong>Message:</strong>\n$message";
}

// AUTO-REPLY EMAIL: Send confirmation email to user with delivery tracking
error_log("Attempting auto-reply to: $email for user: $name");

// EMAIL HEADERS: Set up delivery confirmation and bounce handling
$reply_headers = "From: Evil Genius Creative <" . ADMIN_EMAIL . ">\r\n";           // Sender identity
$reply_headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";                            // Where replies go
$reply_headers .= "Return-Path: " . ADMIN_EMAIL . "\r\n";                        // Where bounces go
$reply_headers .= "Disposition-Notification-To: " . ADMIN_EMAIL . "\r\n";        // Request read receipt
$reply_headers .= "X-Confirm-Reading-To: " . ADMIN_EMAIL . "\r\n";              // Additional confirmation
$reply_headers .= "Content-Type: text/html; charset=UTF-8\r\n";                 // HTML email format
$reply_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$reply_sent = mail(
    $email,
    "Thanks for contacting Evil Genius Creative - Ian Kleinfeld, Owner - +1(919)357-6004 GMT-4 (EST)",
    $formatted_user_message,
    $reply_headers
);

// Log detailed delivery attempt
if ($reply_sent) {
    error_log("Auto-reply SENT successfully to: $email for user: $name");
    
    // Store delivery attempt in database for tracking
    $stmt = $pdo->prepare("INSERT INTO emails (name, email, message, site, ip, user_cookie, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute(["AUTO-REPLY", $email, "Auto-reply sent to: $name", "delivery-log", $ip, $cookie]);
} else {
    error_log("Auto-reply FAILED to send to: $email for user: $name - Possible bounce or invalid email");
    
    // Store failed delivery attempt
    $stmt = $pdo->prepare("INSERT INTO emails (name, email, message, site, ip, user_cookie, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute(["AUTO-REPLY-FAILED", $email, "Auto-reply FAILED to: $name - Email may be invalid", "delivery-log", $ip, $cookie]);
}

// Send admin notification
$admin_sent = sendSMTPMail(
    ADMIN_EMAIL, 
    "New Contact from $name", 
    $formatted_admin_message
);

if ($admin_sent) {
    if ($reply_sent) {
        echo 'Message sent successfully!';
    } else {
        echo 'Message received successfully! (Auto-reply may have failed - please check your email address)';
    }
} else {
    echo 'Message received, but there may have been an email delivery issue.';
}
?>