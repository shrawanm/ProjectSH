<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 0);
error_reporting(0);

require_once "../config/db.php"; 

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data["email"] ?? "");
$google_id = $data["google_id"] ?? "";
$avatar = $data["avatar"] ?? null;

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Google email missing."]);
    exit;
}

// Check if user exists by email
$stmt = $pdo->prepare("SELECT id, name, email, avatar FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $update = $pdo->prepare("UPDATE users SET google_id = ?, avatar = ? WHERE id = ?");
    $update->execute([$google_id, $avatar, $user['id']]);
    
    echo json_encode([
        "status" => "success",
        "message" => "Login successful.",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "avatar" => $avatar 
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No account found with this email. Please sign up first!"
    ]);
}
?>