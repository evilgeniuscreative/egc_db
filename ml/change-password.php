<?php
require_once 'auth.php';

if (!($_SESSION['logged_in'] ?? false)) {
    header("Location: admin.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_hash = password_hash($_POST['new_password'], PASSWORD_BCRYPT);
    echo "<p>✅ Your new password hash is:</p><pre>$new_hash</pre>";
    echo "<p>Copy it into <code>auth.php</code> as the new <code>ADMIN_PASS_HASH</code>.</p>";
    exit;
}
?>

<h2>Change Admin Password</h2>
<form method="post">
    <input type="password" name="new_password" placeholder="New Password" required>
    <button type="submit">Generate Hash</button>
</form>
<p><a href="admin.php">← Back to Admin Panel</a></p>
