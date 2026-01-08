<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/../config/db.php';
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$otp = trim($input['otp'] ?? '');
if (!$email || !$otp) {
    http_response_code(400);
    echo json_encode(["error" => "Email and OTP are required"]);
    exit;
}

//gets user
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "Email not found"]);
    exit;
}

//check otp
$stmt = $pdo->prepare("
    SELECT id, expires_at, used 
    FROM password_resets 
    WHERE user_id = ? AND otp_code = ? 
    ORDER BY created_at DESC LIMIT 1
");
$stmt->execute([$user['id'], $otp]);
$otpRow = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$otpRow) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid OTP"]);
    exit;
}
if ($otpRow['used']) {
    http_response_code(400);
    echo json_encode(["error" => "OTP already used"]);
    exit;
}
if (strtotime($otpRow['expires_at']) < time()) {
    http_response_code(400);
    echo json_encode(["error" => "OTP expired"]);
    exit;
}
//mark OTP as used
$stmt = $pdo->prepare("UPDATE password_resets SET used = 1 WHERE id = ?");
$stmt->execute([$otpRow['id']]);
echo json_encode(["status" => "success", "user_id" => $user['id']]);
?>