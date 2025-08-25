<?php
session_start();
?>

<!DOCTYPE html>
<html>
<head>
  <title>Password Reset Request</title>
</head>
<body>
  <h2>Request Password Reset</h2>
  <form action="admin_send_reset.php" method="post">
    <label>Email:</label>
    <input type="email" name="email" required>
    <button type="submit">Send Reset Link</button>
  </form>
</body>
</html>
