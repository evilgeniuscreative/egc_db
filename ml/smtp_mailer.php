<?php
require_once 'config.php';

function sendSMTPMail($to, $subject, $message, $from_name = 'Evil Genius Creative') {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS;
    
    // Create proper headers
    $headers = "From: $from_name <$SMTP_USER>\r\n";
    $headers .= "Reply-To: $SMTP_USER\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // For Bluehost, use mail() with proper headers
    // Note: Bluehost handles SMTP internally when using mail() function
    return mail($to, $subject, $message, $headers);
}

// Alternative SMTP function using socket connection (if needed)
function sendSMTPMailAdvanced($to, $subject, $message, $from_name = 'Evil Genius Creative') {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS;
    
    $socket = fsockopen('ssl://' . $SMTP_HOST, $SMTP_PORT, $errno, $errstr, 30);
    if (!$socket) {
        return false;
    }
    
    // SMTP conversation
    fgets($socket, 515);
    fputs($socket, "EHLO " . $SMTP_HOST . "\r\n");
    fgets($socket, 515);
    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($SMTP_USER) . "\r\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($SMTP_PASS) . "\r\n");
    fgets($socket, 515);
    fputs($socket, "MAIL FROM: <$SMTP_USER>\r\n");
    fgets($socket, 515);
    fputs($socket, "RCPT TO: <$to>\r\n");
    fgets($socket, 515);
    fputs($socket, "DATA\r\n");
    fgets($socket, 515);
    
    $email_content = "From: $from_name <$SMTP_USER>\r\n";
    $email_content .= "To: $to\r\n";
    $email_content .= "Subject: $subject\r\n";
    $email_content .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $email_content .= $message . "\r\n.\r\n";
    
    fputs($socket, $email_content);
    fgets($socket, 515);
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return true;
}