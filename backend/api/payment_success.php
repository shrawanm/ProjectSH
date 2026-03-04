<?php
include '../config/db.php';

if (!isset($_GET['data'])) {
    die("No data received from eSewa.");
}

$data_encoded = $_GET['data'];
$data_json = base64_decode($data_encoded);
$data = json_decode($data_json, true);

if (!$data || $data['status'] !== 'COMPLETE') {
    header("Location: http://localhost:5173/payment?error=payment_failed");
    exit;
}

$product_code = $data['product_code'];
$total_amount = $data['total_amount']; 
$transaction_uuid = $data['transaction_uuid'];

$url = "https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=$product_code&total_amount=$total_amount&transaction_uuid=$transaction_uuid";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response_json = curl_exec($ch);
// curl_close($ch);

$response = json_decode($response_json, true);

if ($response && isset($response['status']) && $response['status'] === 'COMPLETE') {
    // Payment verified
    $parts = explode('-', $transaction_uuid);
    $checkout_id = intval($parts[0]);

    try {
        //fetch checkout details to get user email and amount
        $stmt_check = $pdo->prepare("SELECT user_email, total_amount FROM checkout_details WHERE id = ?");
        $stmt_check->execute([$checkout_id]);
        $checkout_row = $stmt_check->fetch(PDO::FETCH_ASSOC);

        if ($checkout_row) {
            //insert into ordered table
            $stmt_order = $pdo->prepare("INSERT INTO ordered (user_email, amount, payment_method, checkout_id) VALUES (?, ?, ?, ?)");
            $stmt_order->execute([
                $checkout_row['user_email'],
                $checkout_row['total_amount'],
                'esewa',
                $checkout_id
            ]);
        }

        // update checkout details status to pending
        $stmt = $pdo->prepare("UPDATE checkout_details SET status = 'pending' WHERE id = ?");
        $stmt->execute([$checkout_id]);

        if ($checkout_row) {
            $stmt_cart = $pdo->prepare("UPDATE cart SET status = 'pending' WHERE user_email = ?");
            $stmt_cart->execute([$checkout_row['user_email']]);
        }

        // redirect to frontend success
        header("Location: http://localhost:5173/payment?status=success");
        exit;
    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }
} else {
    // verification failed
    header("Location: http://localhost:5173/payment?error=verification_failed");
    exit;
}
?>
