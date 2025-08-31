<?php
/**
 * Filename: recaptcha_config.php
 * Location: /web/root/
 * 
 * API endpoint to provide reCAPTCHA site key to frontend applications
 * 
 * Variables:
 * - RECAPTCHA_SITE_KEY: Public site key from .env file (safe to expose)
 * 
 * Returns:
 * - JSON object containing the public site key for frontend use
 * 
 * Instructions:
 * 1. Called by React components to get reCAPTCHA site key
 * 2. Returns only public site key (secret key stays secure on server)
 * 3. Enables CORS for frontend access
 * 4. Used by contact forms to load reCAPTCHA v3 dynamically
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only return the public site key (safe to expose)
echo json_encode([
    'siteKey' => R6LeJArErAAAAACj8P0jXHJu0D9FWOY6kkC3xiinh
]);
?>