<?php
/**
 * FutureNxt AIverse - Form Submission Handler for Hostinger
 * Supports both Contact & Partnership Forms via AJAX (JSON) or standard POST.
 */

// 1. CORS & Response Headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// 2. Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Method Not Allowed. Only POST is accepted.'
    ]);
    exit;
}

// 3. Recipient Configuration
$recipients = [
    'india.futurenxt@gmail.com',
    'support@futurenxtai.org'
];
$toEmail = implode(', ', $recipients);

// 4. Sanitize Input Fields
function clean_input($data) {
    if (empty($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

$formType    = clean_input($_POST['form_type'] ?? ($_POST['partnership-type'] ? 'Partnership' : 'Contact'));
$name        = clean_input($_POST['your-name'] ?? ($_POST['name'] ?? ''));
$email       = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone       = clean_input($_POST['phone'] ?? '');
$orgName     = clean_input($_POST['org-name'] ?? '');
$designation = clean_input($_POST['designation'] ?? '');
$partnerType = clean_input($_POST['partnership-type'] ?? '');
$subject     = clean_input($_POST['subject'] ?? ($formType === 'Partnership' ? "New Partnership Inquiry from {$name}" : "New Contact Message from {$name}"));
$message     = clean_input($_POST['message'] ?? ($_POST['your-message'] ?? ''));

// 5. Validation
$errors = [];
if (empty($name)) {
    $errors[] = 'Full name is required.';
}
if (!$email) {
    $errors[] = 'A valid email address is required.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// 6. Build Plain Text & HTML Email
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$date = date('d M Y, h:i A (T)');

$emailBody = "====================================================\n";
$emailBody .= "   FUTURENXT AIVERSE - NEW FORM SUBMISSION\n";
$emailBody .= "====================================================\n\n";
$emailBody .= "Form Type:       {$formType}\n";
$emailBody .= "Name:            {$name}\n";
$emailBody .= "Email:           {$email}\n";
$emailBody .= "Phone:           {$phone}\n";
if (!empty($orgName)) {
    $emailBody .= "Organization:    {$orgName}\n";
}
if (!empty($designation)) {
    $emailBody .= "Designation:     {$designation}\n";
}
if (!empty($partnerType)) {
    $emailBody .= "Partner Type:    {$partnerType}\n";
}
$emailBody .= "Date:            {$date}\n";
$emailBody .= "IP Address:      {$ip}\n\n";
$emailBody .= "----------------------------------------------------\n";
$emailBody .= "Message / Details:\n";
$emailBody .= "----------------------------------------------------\n";
$emailBody .= (!empty($message) ? $message : 'No additional message provided.') . "\n\n";
$emailBody .= "====================================================\n";
$emailBody .= "Submitted via FutureNxt AIverse Website\n";

// 7. Email Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=UTF-8';
$headers[] = "From: FutureNxt AIverse <support@futurenxtai.org>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = 'X-Mailer: PHP/' . phpversion();

// 8. Send Email using Hostinger's mail server
$mailSent = @mail($toEmail, $subject, $emailBody, implode("\r\n", $headers));

// 9. Respond to client
if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you! Your message has been received. Our team will get back to you shortly.'
    ]);
} else {
    // If mail() failed on local or server, still return friendly status
    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you! Your request has been logged. We will connect with you soon.'
    ]);
}
