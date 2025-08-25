<?php
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $token = $_POST['token'];
  $newPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);

  $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE reset_token = ? AND reset_expires > NOW()");
  $stmt->execute([$token]);
  $user = $stmt->fetch();

  if ($user) {
    $stmt = $pdo->prepare("UPDATE admin_users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
    $stmt->execute([$newPassword, $user['id']]);
    echo "Password successfully reset!";
  } else {
    echo "Invalid or expired token.";
  }
}
