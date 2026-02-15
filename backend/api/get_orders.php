<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM checkout_details ORDER BY created_at DESC");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($orders as &$order) {
        $order['cart_items'] = json_decode($order['cart_items'], true);
    }
    echo json_encode($orders);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>