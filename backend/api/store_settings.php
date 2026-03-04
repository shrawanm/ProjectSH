<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM store_settings");
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        echo json_encode(['status' => 'success', 'data' => $settings]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !is_array($data)) {
            die(json_encode(['status' => 'error', 'message' => 'Invalid data']));
        }

        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO store_settings (setting_key, setting_value) 
                               VALUES (?, ?) 
                               ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        
        foreach ($data as $key => $value) {
            // bool values 
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }
            $stmt->execute([$key, strval($value)]);
        }
        $pdo->commit();
        
        echo json_encode(['status' => 'success', 'message' => 'Settings updated successfully']);
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
