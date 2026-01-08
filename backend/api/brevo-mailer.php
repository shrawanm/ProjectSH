<?php
function sendOTPEmail(string $toEmail, string $otpCode, ?string &$errorMessage = null): bool
{
    $apiKey = ''; 
    $url = 'https://api.brevo.com/v3/smtp/email';

    $data = [
        "sender" => [
            "name" => "Shrawan Handicrafts",
            "email" => "shrawanhandicraftss@gmail.com" 
        ],
        "to" => [
            ["email" => $toEmail]
        ],
        "subject" => "Your OTP Code",
        "htmlContent" => "<p>Your OTP code is <b>{$otpCode}</b>. It is valid for 5 minutes.</p>"
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'api-key: ' . $apiKey,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    // curl_close($ch);

    if ($response === false) {
        $errorMessage = "cURL error: " . $curlError;
        return false;
    }

    $decoded = json_decode($response, true);

    if ($httpCode !== 200 && $httpCode !== 201) {
        $errorMessage = "Brevo API error (HTTP $httpCode): " . ($decoded['message'] ?? $response);
        return false;
    }

    return true;
}
?>