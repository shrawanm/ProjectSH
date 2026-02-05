<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include '../config/db.php';
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'OPTIONS') {
    exit;
}

if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $subcategory = isset($_GET['subcategory']) ? $_GET['subcategory'] : null;
    $subsubcategory = isset($_GET['subsubcategory']) ? $_GET['subsubcategory'] : null;

    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM product WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        } elseif ($subsubcategory) {
            $stmt = $pdo->prepare("SELECT * FROM product WHERE subsubcategory = ? ORDER BY id DESC");
            $stmt->execute([$subsubcategory]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } elseif ($subcategory) {
            $stmt = $pdo->prepare("SELECT * FROM product WHERE subcategory = ? ORDER BY id DESC");
            $stmt->execute([$subcategory]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } elseif ($category) {
            $stmt = $pdo->prepare("SELECT * FROM product WHERE category = ? ORDER BY id DESC");
            $stmt->execute([$category]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $pdo->query("SELECT * FROM product ORDER BY id DESC");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        if ($result) {
            if ($id) {
                // Single product formatting
                $result['variants'] = [
                    'colors' => json_decode($result['colors'] ?? '[]', true),
                    'sizes' => json_decode($result['sizes'] ?? '[]', true)
                ];
            } else {
                // List of products formatting
                foreach ($result as &$p) {
                    $p['variants'] = [
                        'colors' => json_decode($p['colors'] ?? '[]', true),
                        'sizes' => json_decode($p['sizes'] ?? '[]', true)
                    ];
                }
            }
        }

        echo json_encode($result);
        exit;

    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

switch ($method) {
    case 'POST':
        $stmt = $pdo->prepare("INSERT INTO product 
            (name, price, category, subcategory, subsubcategory, image, description, material, stock, colors, sizes) 
            VALUES (:name, :price, :category, :subcategory, :subsubcategory, :image, :description, :material, :stock, :colors, :sizes)");
        try {
            $stmt->execute([
                ':name' => $data['name'],
                ':price' => $data['price'],
                ':category' => $data['category'],
                ':subcategory' => $data['subcategory'],
                ':subsubcategory' => $data['subsubcategory'] ?? null,
                ':image' => $data['image'],
                ':description' => $data['description'] ?? '',
                ':material' => $data['material'] ?? '',
                ':stock' => $data['stock'] ?? 0,
                ':colors' => json_encode($data['variants']['colors'] ?? []),
                ':sizes' => json_encode($data['variants']['sizes'] ?? [])
            ]);
            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'PUT':
        $stmt = $pdo->prepare("UPDATE product SET 
            name=:name, price=:price, category=:category, subcategory=:subcategory, subsubcategory=:subsubcategory, 
            image=:image, description=:description, material=:material, stock=:stock, colors=:colors, sizes=:sizes 
            WHERE id=:id");
        try {
            $stmt->execute([
                ':id' => $data['id'],
                ':name' => $data['name'],
                ':price' => $data['price'],
                ':category' => $data['category'],
                ':subcategory' => $data['subcategory'],
                ':subsubcategory' => $data['subsubcategory'] ?? null,
                ':image' => $data['image'],
                ':description' => $data['description'] ?? '',
                ':material' => $data['material'] ?? '',
                ':stock' => $data['stock'] ?? 0,
                ':colors' => json_encode($data['variants']['colors'] ?? []),
                ':sizes' => json_encode($data['variants']['sizes'] ?? [])
            ]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM product WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["status" => "success"]);
        }
        break;
}
?>