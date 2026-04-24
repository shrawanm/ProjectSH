<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include '../config/db.php';
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    exit;
}
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = isset($data['username']) ? trim($data['username']) : '';
    $password = isset($data['password']) ? $data['password'] : '';
    if (empty($username) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Username and password are required'
        ]);
        exit;
    }
    try {
        $createTableQuery = "CREATE TABLE IF NOT EXISTS admininfo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $pdo->exec($createTableQuery);

        $checkAdmin = $pdo->prepare("SELECT * FROM admininfo WHERE username = ?");
        $checkAdmin->execute(['admin']);
        $adminExists = $checkAdmin->fetch(PDO::FETCH_ASSOC);

        if (!$adminExists) {
            $insertAdmin = $pdo->prepare("INSERT INTO admininfo (username, password) VALUES (?, ?)");
            $insertAdmin->execute(['admin', 'admin123']);
        }
        $stmt = $pdo->prepare("SELECT * FROM admininfo WHERE username = ? AND password = ?");
        $stmt->execute([$username, $password]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($admin) {
            $token = bin2hex(random_bytes(32));
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'token' => $token
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid username or password'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Login error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}
?>
