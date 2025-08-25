<?php
session_start();

define('ADMIN_USER', 'mydesignguy@gmail.com');

// Password hash for ML_ADMIN_PWD
define('ADMIN_PASS_HASH', '$2y$12$miTasHygxEQ0rdG2KEU7UeLDxeDPGO/NqMn5YKsIqh8Tz2VIpxxRy');


// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if (
        $_POST['username'] === ADMIN_USER &&
        password_verify($_POST['password'], ADMIN_PASS_HASH)
    ) {
        $_SESSION['logged_in'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $error = "Invalid credentials";
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
  header('Location: dashboard_email.php');
    exit;
}
?>
