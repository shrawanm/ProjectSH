<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include '../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
function getColorFamily($hexCode) {
    if (!$hexCode || !preg_match('/^#[0-9A-F]{6}$/i', $hexCode)) {
        return 'neutral';
    }
    $hex = ltrim($hexCode, '#');
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));
    //checks grayscale
    if (abs($r - $g) < 30 && abs($g - $b) < 30 && abs($r - $b) < 30) {
        return 'neutral';
    }
    $warmthScore = ($r - $b) + ($g - $b) / 2;
    if ($warmthScore > 30) {
        return 'warm';  
    } elseif ($warmthScore < -30) {
        return 'cool';  
    } else {
        return 'neutral';
    }
}
//normalizes the product colors
function normalizeProduct($product) {
    $colorFamilies = [];
    if (!empty($product['colors'])) {
        $colors = is_array($product['colors']) ? $product['colors'] : json_decode($product['colors'], true);
        if (is_array($colors)) {
            foreach ($colors as $color) {
                $colorFamilies[] = getColorFamily($color);
            }
        }
    }
        if (empty($colorFamilies)) {
        $colorFamilies = ['neutral'];
    }
    
    return [
        'id' => $product['id'],
        'name' => $product['name'],
        'category' => strtolower(trim($product['category'] ?? '')),
        'material' => strtolower(trim($product['material'] ?? '')),
        'subcategory' => strtolower(trim($product['subcategory'] ?? '')),
        'subsubcategory' => strtolower(trim($product['subsubcategory'] ?? '')),
        'price' => (float)$product['price'],
        'color_families' => $colorFamilies
    ];
}

//calculating similarity between two products
function cosineSimilarity($currentProduct, $comparisonProduct, $priceRange) {
    $dotProduct = 0;
    $magnitudeA = 0;
    $magnitudeB = 0;
    
    //Category match
    $catMatch = ($currentProduct['category'] === $comparisonProduct['category']) ? 1.0 : 0.0;
    $dotProduct += $catMatch * 1.0;
    $magnitudeA += 1.0 * 1.0;
    $magnitudeB += 1.0 * 1.0;
    
    //material match 
    $matMatch = 0.0;
    if ($currentProduct['material'] && $comparisonProduct['material']) {
        $matMatch = ($currentProduct['material'] === $comparisonProduct['material']) ? 1.0 : 0.0;
    }
    $dotProduct += $matMatch * 0.9;
    $magnitudeA += 0.9 * 0.9;
    $magnitudeB += 0.9 * 0.9;
    
    //subcategory match
    $subMatch = 0.0;
    if (($currentProduct['subcategory'] === '' && $comparisonProduct['subcategory'] === '') || 
        ($currentProduct['subcategory'] === $comparisonProduct['subcategory'])) {
        $subMatch = 1.0;
    }
    $dotProduct += $subMatch * 0.8;
    $magnitudeA += 0.8 * 0.8;
    $magnitudeB += 0.8 * 0.8;
    
    //price similarity 
    $priceSimilarity = 0.0;
    if ($priceRange > 0) {
        $priceDiff = abs($currentProduct['price'] - $comparisonProduct['price']);
        $priceSimilarity = max(0, 1 - ($priceDiff / $priceRange));
    }
    $dotProduct += $priceSimilarity * 0.7;
    $magnitudeA += 0.7 * 0.7;
    $magnitudeB += 0.7 * 0.7;
    
    //color family match
    $colorMatch = 0.0;
    foreach ($currentProduct['color_families'] as $currentColor) {
        $bestMatch = 0.0;
        foreach ($comparisonProduct['color_families'] as $compColor) {
            if ($currentColor === $compColor) {
                $bestMatch = 1.0;
                break;
            } elseif ($currentColor === 'neutral' || $compColor === 'neutral') {
                $bestMatch = 0.3; // Neutral matches anything partially
            }
        }
        $colorMatch += $bestMatch;
    }
    $colorMatch = $colorMatch / max(1, count($currentProduct['color_families'])); // Average
    $dotProduct += $colorMatch * 0.5;
    $magnitudeA += 0.5 * 0.5;
    $magnitudeB += 0.5 * 0.5;
    
    //subsubcategory match 
    $subsubMatch = 0.0;
    if (($currentProduct['subsubcategory'] === '' && $comparisonProduct['subsubcategory'] === '') || 
        ($currentProduct['subsubcategory'] === $comparisonProduct['subsubcategory'])) {
        $subsubMatch = 0.3; 
    }
    $dotProduct += $subsubMatch * 0.3;
    $magnitudeA += 0.3 * 0.3;
    $magnitudeB += 0.3 * 0.3;
    
    // Calculate cosine similarity
    if ($magnitudeA > 0 && $magnitudeB > 0) {
        $magnitude = sqrt($magnitudeA) * sqrt($magnitudeB);
        $similarity = $dotProduct / $magnitude;
        return max(0, min(1, $similarity)); 
    }
    
    return 0;
}

try {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    if (!$id) {
        echo json_encode(['error' => 'Product ID is required', 'success' => false]);
        exit;
    }
    
    // Fetch current product from database
    $stmt = $pdo->prepare("SELECT * FROM product WHERE id = ?");
    $stmt->execute([$id]);
    $currentProduct = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$currentProduct) {
        echo json_encode(['error' => 'Product not found', 'success' => false]);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM product WHERE id != ? ORDER BY id DESC");
    $stmt->execute([$id]);
    $allProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($allProducts)) {
        echo json_encode([
            'success' => true,
            'current_product' => [
                'id' => $currentProduct['id'],
                'name' => $currentProduct['name'],
                'category' => $currentProduct['category'],
                'subcategory' => $currentProduct['subcategory'] ?? ''
            ],
            'recommendations' => [],
            'total_similar_products' => 0
        ]);
        exit;
    }
        $currentNormalized = normalizeProduct($currentProduct);
    $priceRange = $currentProduct['price'] * 0.4; // 20% above + 20% below
    if ($priceRange === 0) {
        $priceRange = 100; 
    }
    $similarities = [];
    foreach ($allProducts as $product) {
        $comparisonNormalized = normalizeProduct($product);
        $score = cosineSimilarity($currentNormalized, $comparisonNormalized, $priceRange);
        
        //includes products with score greater thn 0.4
        if ($score > 0.4) {
            $similarities[] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'category' => $product['category'],
                'subcategory' => $product['subcategory'] ?? '',
                'image' => $product['image'],
                'price' => (float)$product['price'],
                'material' => $product['material'] ?? '',
                'similarity_score' => round($score * 100, 1) 
            ];
        }
    }
    
    // Sort by similarity score 
    usort($similarities, function($a, $b) {
        return $b['similarity_score'] <=> $a['similarity_score'];
    });
        $recommendations = array_slice($similarities, 0, 3);
    
    echo json_encode([
        'success' => true,
        'current_product' => [
            'id' => $currentProduct['id'],
            'name' => $currentProduct['name'],
            'category' => $currentProduct['category'],
            'subcategory' => $currentProduct['subcategory'] ?? ''
        ],
        'recommendations' => $recommendations,
        'total_similar_products' => count($similarities)
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage(), 'success' => false]);
    exit;
}
?>
