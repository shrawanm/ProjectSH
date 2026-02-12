<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

try {
    $sql = "INSERT INTO checkout_details 
            (user_email, first_name, last_name, phone, address, city, postal_code, country, total_amount, cart_items) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        $data['email'],
        $data['firstName'],
        $data['lastName'],
        $data['fullPhone'],
        $data['address'],
        $data['city'],
        $data['postalCode'],
        $data['country'],
        $data['totalAmount'],
        json_encode($data['cart']) 
    ]);

    $checkoutId = $pdo->lastInsertId();

    echo json_encode([
        "status" => "success", 
        "checkout_id" => $checkoutId,
        "message" => "Checkout details saved"
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>