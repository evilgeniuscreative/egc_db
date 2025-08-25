<?php
require_once "db.php";

$token = $_GET['token'] ?? '';
$stmt = $pdo->prepare("SELECT * FROM admin_users WHERE reset_token = ? AND reset_expires > NOW()");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
  die("Invalid or expired token.");
}
?>

<form action="admin_do_reset.php" method="post">
  <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
  <label>New Password:</label>
  <input type="password" name="password" required>
  <button type="submit">Reset Password</button>
</form>
