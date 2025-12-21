<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}
$servername = "localhost";
$username = "root";
$password_db = "";
$dbname = "shrawanhandicraftsdb";

$conn = new mysqli($servername, $username, $password_db, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

//gets post data
$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$google_id = $data['google_id'] ?? null;
$is_google_auth = $data['is_google_auth'] ?? false;

if (!$is_google_auth && (!$name || !$email || !$password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

if (!$is_google_auth) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email address format"]);
        exit;
    }

    // Domain MX check
    $domain = substr(strrchr($email, "@"), 1);
    if (!$domain || !checkdnsrr($domain, "MX")) {
        echo json_encode(["status" => "error", "message" => "Email domain does not exist"]);
        exit;
    }
}
$stmt = $conn->prepare("SELECT id, google_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$existingUser = $result->fetch_assoc();
$stmt->close();
if ($existingUser) {
    //If user exists log them in
    if ($is_google_auth) {
        if (empty($existingUser['google_id'])) {
            $update = $conn->prepare("UPDATE users SET google_id = ? WHERE id = ?");
            $update->bind_param("si", $google_id, $existingUser['id']);
            $update->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Logged in successfully with Google",
            "user" => [
                "id" => $existingUser['id'],
                "name" => $name,
                "email" => $email,
                "role" => "user"
            ]
        ]);
        exit;
    } else {
        echo json_encode(["status" => "error", "message" => "Email already registered"]);
        exit;
    }
}
$hashedPassword = !empty($password) ? password_hash($password, PASSWORD_BCRYPT) : null;
$stmt = $conn->prepare("INSERT INTO users (name, email, password, google_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $hashedPassword, $google_id);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "avatar" => null,
            "role" => "user"
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to register user"]);
}
$stmt->close();
$conn->close();
