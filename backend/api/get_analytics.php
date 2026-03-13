<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

try {
    // 1. Total Revenue & Total Orders
    $stmt_overview = $pdo->query("SELECT SUM(amount) as total_revenue, COUNT(*) as total_orders FROM ordered");
    $overview = $stmt_overview->fetch(PDO::FETCH_ASSOC);

    // 2. Orders by Payment Method
    $stmt_methods = $pdo->query("SELECT payment_method, COUNT(*) as count, SUM(amount) as revenue FROM ordered GROUP BY payment_method");
    $methods = $stmt_methods->fetchAll(PDO::FETCH_ASSOC);

    // 3. Top 5 Selling Products
    // We need to join ordered with checkout_details to get the cart items
    // This is a bit complex because cart_items are stored as JSON in checkout_details
    // For simplicity, let's just get the most frequent checkout_id links for now
    // Actually, let's try to aggregate by product name from the JSON if possible, 
    // but a simpler way is to just fetch recent orders and aggregate in PHP if needed.
    
    // For now, let's provide the raw data structure expected by the frontend
    $stmt_recent = $pdo->query("SELECT checkout_id FROM ordered ORDER BY created_at DESC LIMIT 50");
    $recent_checkout_ids = $stmt_recent->fetchAll(PDO::FETCH_COLUMN);
    
    $product_counts = [];
    if (!empty($recent_checkout_ids)) {
        $in = str_repeat('?,', count($recent_checkout_ids) - 1) . '?';
        $stmt_items = $pdo->prepare("SELECT cart_items FROM checkout_details WHERE id IN ($in)");
        $stmt_items->execute($recent_checkout_ids);
        $all_items_json = $stmt_items->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($all_items_json as $json) {
            $items = json_decode($json, true);
            if (is_array($items)) {
                foreach ($items as $item) {
                    $name = $item['name'];
                    if (!isset($product_counts[$name])) {
                        $product_counts[$name] = ['name' => $name, 'sales' => 0, 'revenue' => 0, 'image' => $item['image']];
                    }
                    $product_counts[$name]['sales'] += $item['quantity'];
                    $product_counts[$name]['revenue'] += $item['price'] * $item['quantity'];
                }
            }
        }
    }
    
    usort($product_counts, function($a, $b) {
        return $b['sales'] - $a['sales'];
    });
    
    $top_products = array_slice(array_values($product_counts), 0, 5);

    // 4. Daily Sales (Last 7 Days)
    $daily_sales = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $stmt_day = $pdo->prepare("SELECT SUM(amount) as revenue FROM ordered WHERE DATE(created_at) = ?");
        $stmt_day->execute([$date]);
        $day_data = $stmt_day->fetch(PDO::FETCH_ASSOC);
        $daily_sales[] = [
            'date' => date('D', strtotime($date)),
            'revenue' => $day_data['revenue'] ?? 0
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'overview' => [
                'totalRevenue' => floatval($overview['total_revenue'] ?? 0),
                'totalOrders' => intval($overview['total_orders'] ?? 0),
                'avgOrderValue' => $overview['total_orders'] > 0 ? floatval($overview['total_revenue'] / $overview['total_orders']) : 0
            ],
            'paymentBreakdown' => $methods,
            'topProducts' => $top_products,
            'dailySales' => $daily_sales
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
