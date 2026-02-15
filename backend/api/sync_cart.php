<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email'])) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit;
}

$action = $data['action'];
$email = $data['email'];
$product_id = $data['id'];
$variants = json_encode($data['variant'] ?? $data['selected_variants']);

try {
    if ($action === 'add' || $action === 'update') {
        $qty = $data['quantity'];

        // Check if exists
        $checkStmt = $pdo->prepare("SELECT id FROM cart WHERE user_email = ? AND product_id = ? AND selected_variants = ?");
        $checkStmt->execute([$email, $product_id, $variants]);
        
        if ($checkStmt->fetch()) {
            // Update
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_email = ? AND product_id = ? AND selected_variants = ?");
            $stmt->execute([$qty, $email, $product_id, $variants]);
        } else {
            // Insert
            $name = $data['name'];
            $price = $data['price'];
            $image = $data['image'];
            $stmt = $pdo->prepare("INSERT INTO cart (user_email, product_id, product_name, price, quantity, selected_variants, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$email, $product_id, $name, $price, $qty, $variants, $image]);
        }
    } elseif ($action === 'remove') {
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_email = ? AND product_id = ? AND selected_variants = ?");
        $stmt->execute([$email, $product_id, $variants]);
    }

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>