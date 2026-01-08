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
$userId = $input['user_id'] ?? null;
$password = $input['password'] ?? '';

if (!$userId || !$password || strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["error" => "User ID and valid password are required"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
if (!$stmt->execute([$hashed, $userId])) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to reset password"]);
    exit;
}
echo json_encode(["status" => "success", "message" => "Password reset successful"]);
