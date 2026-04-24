<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../config/db.php';

$email = isset($_GET['email']) ? $_GET['email'] : null;

if (!$email) {
    echo json_encode(["status" => "error", "message" => "No email provided"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM checkout_details WHERE user_email = ? ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode([
            "status" => "success",
            "data" => [
                "id"         => $row['id'],
                "email"      => $row['user_email'],
                "firstName"  => $row['first_name'],
                "lastName"   => $row['last_name'],
                "phone"      => $row['phone'],
                "address"    => $row['address'],
                "city"       => $row['city'],
                "postalCode" => $row['postal_code'],
                "country"    => $row['country'],
            ]
        ]);
    } else {
        echo json_encode(["status" => "not_found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
