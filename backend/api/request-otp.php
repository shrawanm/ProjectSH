<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/brevo-mailer.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');

if (!$email) {
    http_response_code(400);
    echo json_encode(["error" => "Email is required"]);
    exit;
}

//check if user exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "Email not found"]);
    exit;
}

$userId = $user['id'];
$otp = strval(rand(100000, 999999));
$expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

//insert otp
$stmt = $pdo->prepare("INSERT INTO password_resets (user_id, otp_code, expires_at, used, created_at) VALUES (?, ?, ?, 0, NOW())");
if (!$stmt->execute([$userId, $otp, $expiresAt])) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to create OTP"]);
    exit;
}

//send otp via brevo
$errorMessage = null;
if (!sendOTPEmail($email, $otp, $errorMessage)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send OTP. " . $errorMessage]);
    exit;
}
echo json_encode(["status" => "success", "message" => "OTP sent"]);
?>