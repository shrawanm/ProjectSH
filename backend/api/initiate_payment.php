<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['amount']) || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Missing amount or checkout id"]);
    exit;
}

$amount = strval($data['amount']);
$checkout_id = strval($data['id']);
$product_code = "EPAYTEST";
$secret_key = "8gBm/:&EnhH.1/q";
$transaction_uuid = $checkout_id . "-" . time();

// Signature Generation for eSewa v2
$signature_string = "total_amount=$amount,transaction_uuid=$transaction_uuid,product_code=$product_code";
$signature = base64_encode(hash_hmac('sha256', $signature_string, $secret_key, true));

echo json_encode([
    "status" => "success",
    "params" => [
        "amount" => $amount,
        "tax_amount" => "0",
        "total_amount" => $amount,
        "transaction_uuid" => $transaction_uuid,
        "product_code" => $product_code,
        "product_service_charge" => "0",
        "product_delivery_charge" => "0",
        "signed_field_names" => "total_amount,transaction_uuid,product_code",
        "signature" => $signature
    ]
]);
?>
