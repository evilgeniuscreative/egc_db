<?php
require_once "db.php";
require_once "smtp_mailer.php"; // This should use your existing SMTP config

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST['email'];
  $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if ($user) {
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + 1800); // 30 mins

    $stmt = $pdo->prepare("UPDATE admin_users SET reset_token = ?, reset_expires = ? WHERE id = ?");
    $stmt->execute([$token, $expires, $user['id']]);

    $link = "https://yourdomain.com/admin_reset_password.php?token=$token";
    $subject = "Password Reset";
    $message = "Click the following link to reset your password: $link\nThis link will expire in 30 minutes.";

    sendSMTPMail($email, $subject, $message);
  }

  echo "If the email exists, a reset link has been sent.";
}
