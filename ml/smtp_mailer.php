<?php
require_once 'config.php';

function sendSMTPMail($to, $subject, $message, $from_name = 'Evil Genius Creative') {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS;
    
    // Create proper headers for Bluehost
    $headers = "From: $from_name <$SMTP_USER>\r\n";
    $headers .= "Reply-To: $SMTP_USER\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Bluehost handles SMTP internally when using mail() function
    return mail($to, $subject, $message, $headers);
}

// Alternative socket-based SMTP function (backup method)
function sendSMTPMailSocket($to, $subject, $message, $from_name = 'Evil Genius Creative') {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS;
    
    $socket = fsockopen('ssl://' . $SMTP_HOST, $SMTP_PORT, $errno, $errstr, 30);
    if (!$socket) {
        error_log("SMTP connection failed: $errno - $errstr");
        return false;
    }
    
    try {
        // SMTP conversation
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) !== '220') {
            throw new Exception("Expected 220, got: $response");
        }
        
        fputs($socket, "EHLO " . $_SERVER['HTTP_HOST'] . "\r\n");
        fgets($socket, 515);
        
        fputs($socket, "AUTH LOGIN\r\n");
        fgets($socket, 515);
        
        fputs($socket, base64_encode($SMTP_USER) . "\r\n");
        fgets($socket, 515);
        
        fputs($socket, base64_encode($SMTP_PASS) . "\r\n");
        $auth_response = fgets($socket, 515);
        if (substr($auth_response, 0, 3) !== '235') {
            throw new Exception("Authentication failed: $auth_response");
        }
        
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
    } catch (Exception $e) {
        error_log("SMTP error: " . $e->getMessage());
        fclose($socket);
        return false;
    }
}
?>