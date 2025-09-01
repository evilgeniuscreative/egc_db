<?php
/**
 * Filename: submit.php
 * Location: /web/root/
 * 
 * Root-level form submission handler for getstarted.jsx
 * Redirects to the main ml/submit.php handler
 * 
 * This file exists because getstarted.jsx submits to /submit.php
 * while contact.jsx submits to /ml/submit.php
 */

// Simply include the main submit handler
require_once 'ml/submit.php';
?>
