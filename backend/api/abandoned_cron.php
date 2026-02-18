<?php
require_once __DIR__ . '/../config/db.php'; 
require_once __DIR__ . '/brevo-mailer.php';

$sql = "SELECT user_email, product_name, price 
        FROM cart 
        WHERE status = 'active' 
        AND email_sent = 0 
        AND added_at <= (NOW() - INTERVAL 1 MINUTE) 
        AND (last_abandoned_email IS NULL OR last_abandoned_email < CURDATE())
        GROUP BY user_email
        LIMIT 10";

try {
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($rows) > 0) {
        echo "Found " . count($rows) . " processing...<br>";

        foreach ($rows as $row) {
            $email = $row['user_email'];
            $error = "";

            $params = [
                "PRODUCT_NAME" => $row['product_name'],
                "PRICE"        => $row['price']
            ];

            if (sendTemplateEmail($email, 4, $params, $error)) {
                                $updateSql = "UPDATE cart SET 
                              email_sent = 1, 
                              last_abandoned_email = CURDATE() 
                              WHERE user_email = :email 
                              AND status = 'active'"; 
                
                $updateStmt = $pdo->prepare($updateSql);
                $updateStmt->execute(['email' => $email]);
                
                echo "Successfully sent reminder to: $email for product: {$row['product_name']}<br>";
            } else {
                echo "Failed for $email. Error: $error<br>";
            }
        }
    } else {
        echo "no new abandoned cartsfound";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}