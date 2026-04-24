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

if ($method === 'GET') {
    $query = isset($_GET['q']) ? trim($_GET['q']) : '';

    if (empty($query)) {
        echo json_encode([
            'success' => false,
            'message' => 'Search query is required',
            'results' => []
        ]);
        exit;
    }

    try {
        //this splits query into keywords
        $keywords = array_filter(explode(' ', strtolower($query)));

        if (empty($keywords)) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid search query',
                'results' => []
            ]);
            exit;
        }
        $stmt = $pdo->query("SELECT * FROM product ORDER BY id DESC");
        $allProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //filters products by keyword matching
        $results = [];
        foreach ($allProducts as $product) {
            $searchableText = strtolower(
                $product['name'] . ' ' .
                $product['category'] . ' ' .
                $product['subcategory'] . ' ' .
                ($product['material'] ?? '') . ' ' .
                ($product['description'] ?? '')
            );
            $allKeywordsMatch = true;
            foreach ($keywords as $keyword) {
                if (strpos($searchableText, $keyword) === false) {
                    $allKeywordsMatch = false;
                    break;
                }
            }
            if ($allKeywordsMatch) {
                $product['variants'] = [
                    'colors' => json_decode($product['colors'] ?? '[]', true),
                    'sizes' => json_decode($product['sizes'] ?? '[]', true)
                ];
                $results[] = $product;
            }
        }
        echo json_encode([
            'success' => true,
            'message' => count($results) . ' product(s) found',
            'results' => $results,
            'query' => $query
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Search error: ' . $e->getMessage(),
            'results' => []
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method',
        'results' => []
    ]);
}
?>
