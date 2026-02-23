<?php
set_error_handler(function($errno, $errstr) {
    echo stripslashes(json_encode(['error' => $errstr]));
    exit;
});

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../config/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!isset($data['id']) || !isset($data['status'])) {
    http_response_code(400);
    echo stripslashes(json_encode(['error' => 'Missing id or status']));
    exit;
}

$id = intval($data['id']);
$status = $data['status'];

$allowed = ['active', 'pending', 'delivered'];
if (!in_array($status, $allowed)) {
    http_response_code(400);
    echo stripslashes(json_encode(['error' => 'Invalid status']));
    exit;
}
try {
    // Update checkout_details
    $stmt = $pdo->prepare("UPDATE checkout_details SET status = :status WHERE id = :id");
    $stmt->execute([':status' => $status, ':id' => $id]);

    // Also update all cart rows for this user
    if (!empty($data['user_email'])) {
        $stmt2 = $pdo->prepare("UPDATE cart SET status = :status WHERE user_email = :user_email");
        $stmt2->execute([':status' => $status, ':user_email' => $data['user_email']]);
    }

    $rowsAffected = $stmt->rowCount();
    echo stripslashes(json_encode(['success' => true, 'rows_affected' => $rowsAffected]));
} catch (PDOException $e) {
    http_response_code(500);
    echo stripslashes(json_encode(['error' => $e->getMessage()]));
}
