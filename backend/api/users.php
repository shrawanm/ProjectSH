<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$host = 'localhost';
$dbname = 'shrawanhandicraftsdb';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT 
                id, 
                name, 
                email, 
                google_id, 
                avatar, 
                created_at 
            FROM users 
            ORDER BY created_at DESC
        ");
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($users as &$user) {
            $user['registration_method'] = !empty($user['google_id']) ? 'Google' : 'Email';
            $user['status'] = 'Active'; 
        }
        echo json_encode($users);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch users: ' . $e->getMessage()]);
    }
}

elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($userId <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid user ID']);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
            exit();
        }
        
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'User deleted successfully',
            'deleted_user' => $user['name']
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete user: ' . $e->getMessage()]);
    }
}

else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>