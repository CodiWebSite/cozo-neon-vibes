<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Sanitize input data
$name = htmlspecialchars(trim($data['name']));
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars(trim($data['phone'])) : '';
$event_type = isset($data['event_type']) ? htmlspecialchars(trim($data['event_type'])) : '';
$event_date = isset($data['event_date']) ? htmlspecialchars(trim($data['event_date'])) : '';
$message = htmlspecialchars(trim($data['message']));

// Validate email
if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

// SMTP Configuration
$smtp_host = 'mail.dj-cozo.ro';
$smtp_port = 465;
$smtp_username = 'contact@dj-cozo.ro';
$smtp_password = 'DjCozo2000';
$from_email = 'contact@dj-cozo.ro';
$to_email = 'contact@dj-cozo.ro';

// Email content
$subject = "Mesaj nou de pe site - DJ Cozo";
$email_body = "
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
        .message-box { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; margin-top: 10px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🎵 Mesaj nou de pe DJ Cozo</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Nume:</div>
                <div class='value'>{$name}</div>
            </div>
            
            <div class='field'>
                <div class='label'>📧 Email:</div>
                <div class='value'>{$email}</div>
            </div>
            
            " . ($phone ? "
            <div class='field'>
                <div class='label'>📞 Telefon:</div>
                <div class='value'>{$phone}</div>
            </div>
            " : "") . "
            
            " . ($event_type ? "
            <div class='field'>
                <div class='label'>🎉 Tip Eveniment:</div>
                <div class='value'>{$event_type}</div>
            </div>
            " : "") . "
            
            " . ($event_date ? "
            <div class='field'>
                <div class='label'>📅 Data Eveniment:</div>
                <div class='value'>{$event_date}</div>
            </div>
            " : "") . "
            
            <div class='field'>
                <div class='label'>💬 Mesaj:</div>
                <div class='message-box'>{$message}</div>
            </div>
            
            <hr style='margin: 20px 0; border: none; border-top: 1px solid #ddd;'>
            <p style='color: #666; font-size: 12px;'>
                📧 Email trimis automat de pe site-ul DJ Cozo<br>
                🕒 Data: " . date('d.m.Y H:i:s') . "
            </p>
        </div>
    </div>
</body>
</html>
";

// Create email headers
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: DJ Cozo Website <' . $from_email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
);

// Try to send email using PHP mail() function first
$mail_sent = false;

// Configure PHP mail settings for SMTP
ini_set('SMTP', $smtp_host);
ini_set('smtp_port', $smtp_port);
ini_set('sendmail_from', $from_email);

// Try sending with mail() function
if (mail($to_email, $subject, $email_body, implode("\r\n", $headers))) {
    $mail_sent = true;
} else {
    // If mail() fails, try with a simple SMTP implementation
    try {
        // Create socket connection
        $socket = fsockopen('ssl://' . $smtp_host, $smtp_port, $errno, $errstr, 30);
        
        if (!$socket) {
            throw new Exception("Could not connect to SMTP server: $errstr ($errno)");
        }
        
        // SMTP conversation
        $response = fgets($socket, 512);
        
        // EHLO
        fputs($socket, "EHLO " . $_SERVER['HTTP_HOST'] . "\r\n");
        $response = fgets($socket, 512);
        
        // AUTH LOGIN
        fputs($socket, "AUTH LOGIN\r\n");
        $response = fgets($socket, 512);
        
        // Username
        fputs($socket, base64_encode($smtp_username) . "\r\n");
        $response = fgets($socket, 512);
        
        // Password
        fputs($socket, base64_encode($smtp_password) . "\r\n");
        $response = fgets($socket, 512);
        
        // MAIL FROM
        fputs($socket, "MAIL FROM: <$from_email>\r\n");
        $response = fgets($socket, 512);
        
        // RCPT TO
        fputs($socket, "RCPT TO: <$to_email>\r\n");
        $response = fgets($socket, 512);
        
        // DATA
        fputs($socket, "DATA\r\n");
        $response = fgets($socket, 512);
        
        // Email content
        $email_content = "Subject: $subject\r\n";
        $email_content .= implode("\r\n", $headers) . "\r\n\r\n";
        $email_content .= $email_body . "\r\n.\r\n";
        
        fputs($socket, $email_content);
        $response = fgets($socket, 512);
        
        // QUIT
        fputs($socket, "QUIT\r\n");
        fclose($socket);
        
        $mail_sent = true;
        
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
    }
}

// Send response
if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email',
        'message' => 'Please try again or contact directly'
    ]);
}
?>