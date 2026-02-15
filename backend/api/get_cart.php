<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php'; 

$email = $_GET['email'] ?? '';

if (empty($email)) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT product_id as id, product_name as name, price, image_url as image, quantity, selected_variants as variant FROM cart WHERE user_email = ?");
    $stmt->execute([$email]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cartItems = [];
    foreach ($rows as $row) {
        $row['id'] = (int)$row['id'];
        $row['price'] = (float)$row['price'];
        $row['quantity'] = (int)$row['quantity'];
        $row['variant'] = json_decode($row['variant'], true);
        $cartItems[] = $row;
    }

    echo json_encode($cartItems);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>