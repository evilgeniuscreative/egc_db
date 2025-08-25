<?php
require_once 'auth.php';

// Show login form if not logged in
if (!($_SESSION['logged_in'] ?? false)):
?>
  <h2>Admin Login</h2>
  <?php if (!empty($error)) echo "<p style='color:red;'>$error</p>"; ?>
  <form method="post">
    <input name="username" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <button name="login">Login</button>
  </form>
  <?php exit; endif; ?>
