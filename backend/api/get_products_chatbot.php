<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


function hexToColorName(string $hex): string {
    $palette = [
        'Black'        => [0,   0,   0],
        'White'        => [255, 255, 255],
        'Red'          => [220, 50,  50],
        'Dark Red'     => [139, 0,   0],
        'Pink'         => [230, 76,  122],   // #e64c7a
        'Light Pink'   => [255, 182, 193],
        'Orange'       => [255, 140, 0],
        'Yellow'       => [255, 215, 0],
        'Green'        => [34,  139, 34],
        'Olive Green'  => [107, 142, 35],
        'Teal'         => [0,   128, 128],
        'Dark Teal'    => [68,  75,  75],    // #444b4b
        'Blue'         => [46,  155, 209],   // #2e9bd1
        'Dark Blue'    => [0,   0,   139],
        'Indigo'       => [79,  70,  229],   // #4F46E5
        'Purple'       => [128, 0,   128],
        'Lavender'     => [230, 230, 250],
        'Brown'        => [139, 90,  43],
        'Dark Brown'   => [44,  33,  30],    // #2c211e
        'Beige'        => [245, 245, 220],
        'Cream'        => [255, 253, 208],
        'Grey'         => [169, 168, 167],   // #a9a8a7
        'Dark Grey'    => [105, 105, 105],
        'Light Grey'   => [211, 211, 211],
        'Silver'       => [192, 192, 192],
        'Maroon'       => [128, 0,   0],
        'Turquoise'    => [64,  224, 208],
        'Mustard'      => [255, 219, 88],
        'Navy Blue'    => [0,   0,   128],
    ];

    $hex = ltrim($hex, '#');
    if (strlen($hex) !== 6) return $hex; 

    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));

    $closest = '';
    $minDist = PHP_INT_MAX;

    foreach ($palette as $name => $rgb) {
        $dist = sqrt(
            pow($r - $rgb[0], 2) +
            pow($g - $rgb[1], 2) +
            pow($b - $rgb[2], 2)
        );
        if ($dist < $minDist) {
            $minDist = $dist;
            $closest = $name;
        }
    }

    return $closest;
}

function parseColors(mixed $colorsRaw): string {
    if (empty($colorsRaw)) return '';

    $decoded = json_decode($colorsRaw, true);
    if (!is_array($decoded) || empty($decoded)) return '';

    $names = array_map('hexToColorName', $decoded);
    $names = array_unique($names);
    return implode(', ', $names);
}

$host = "localhost";
$user = "root";
$pass = "";
$db   = "shrawanhandicraftsdb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}


function extractKeywords(string $rawQuery): array {

    $q = strtolower($rawQuery);

    $q = preg_replace('/[?!.;:()"\'\[\]{}\/]/', ' ', $q);

    $typoMap = [
        'swaater'   => 'sweater',  'sweatrs'   => 'sweater',  'sweaters'  => 'sweater',
        'mufler'    => 'muffler',  'mufflers'  => 'muffler',
        'pasmina'   => 'pashmina', 'pashmina'  => 'pashmina', 
        'pshmina'   => 'pashmina', 'pashminas' => 'pashmina',
        'cashmire'  => 'cashmere', 'cashemere' => 'cashmere',
        'shwal'     => 'shawl',    'shawls'    => 'shawl',
        'stols'     => 'stole',    'stoles'    => 'stole',
        'blankets'  => 'blanket',  'ponchos'   => 'poncho',
        'statues'   => 'statue',   'paintings' => 'painting',
        'jewelries' => 'jewelry',  'jwelry'    => 'jewelry',
        'necklaces' => 'necklace', 'bracelets' => 'bracelet',
        'scarfs'    => 'scarf',    'scarves'   => 'scarf',
        'yakwool'   => 'yak wool',
    ];
    foreach ($typoMap as $wrong => $right) {
        $q = str_replace($wrong, $right, $q);
    }

    $q = preg_replace('/\s+(and|&|\+|or)\s+/', ',', $q);
    $stopWords = [
        'do','u','you','have','i','want','would','like','to','explore',
        'please','show','me','list','get','find','tell','about','give',
        'some','any','all','the','an','is','are','what','which',
        'can','could','looking','for','need','interested','with',
        'of','my','its','this','that','these','those',
        'hi','hello','hey','namaste','ok','okay','sure','yes','no',
        'now','right','just','also','too','more','something','stuff',
        'products','product','items','item','collection','collections',
        'available','currently','stock','buy','purchase','order',
    ];
    usort($stopWords, fn($a, $b) => strlen($b) - strlen($a));
    $stopPattern = '/(?<!\w)(' . implode('|', array_map('preg_quote', $stopWords)) . ')(?!\w)/i';

    $segments = explode(',', $q);
    $keywords = [];
    foreach ($segments as $seg) {
        $seg = preg_replace($stopPattern, ' ', $seg);
        $seg = trim(preg_replace('/\s+/', ' ', $seg));
        if (strlen($seg) >= 3) {
            $keywords[] = $seg;
        }
    }

    return array_values(array_unique($keywords));
}


function cleanRow(array $row): array {
    return array_filter($row, fn($v) => $v !== null);
}


$rawQuery    = isset($_GET['query'])    ? trim($_GET['query'])    : '';
$rawKeywords = isset($_GET['keywords']) ? trim($_GET['keywords']) : '';

if (!empty($rawQuery)) {
    $keywordList = extractKeywords($rawQuery);
} elseif (!empty($rawKeywords)) {
    $keywordList = array_filter(array_map('trim', explode(',', $rawKeywords)));
} else {
    $keywordList = [];
}

// Sanitize each keyword for SQL
$keywordList = array_values(array_filter(array_map(function($k) use ($conn) {
    return $conn->real_escape_string(trim($k));
}, $keywordList)));


function isListAllIntent(string $raw): bool {
    $raw = strtolower($raw);
    $triggers = ['all', 'everything', 'full list', 'all products', 'all items',
                 'all collection', 'every', 'complete list', 'show all', 'list all',
                 'what do you have', 'what you have', 'what have you'];
    foreach ($triggers as $t) {
        if (strpos($raw, $t) !== false) return true;
    }
    return false;
}

$fetchAll = empty($keywordList) && isListAllIntent($rawQuery);

$products = [];
$columns  = ['name', 'category', 'subcategory', 'subsubcategory', 'material', 'description', 'colors'];

if ($fetchAll) {
    $allSql = "SELECT name, price, category, subcategory, subsubcategory,
                      material, stock, colors, sizes
               FROM product
               ORDER BY category, subcategory, name
               LIMIT 50";
    $allResult = $conn->query($allSql);
    if ($allResult) {
        while ($row = $allResult->fetch_assoc()) {
            $row['colors'] = parseColors($row['colors'] ?? '');
            $products[] = cleanRow($row);
        }
    }
}

if (!empty($keywordList)) {

    $andClauses = [];
    foreach ($keywordList as $kw) {
        $orConds = [];
        foreach ($columns as $col) {
            $orConds[] = "`$col` LIKE '%$kw%'";
        }
        $andClauses[] = '(' . implode(' OR ', $orConds) . ')';
    }

    $sql = "SELECT name, price, category, subcategory, subsubcategory,
                   material, stock, colors, sizes, description
            FROM product
            WHERE " . implode(' AND ', $andClauses) . "
            ORDER BY stock DESC LIMIT 20";

    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $row['colors'] = parseColors($row['colors'] ?? '');
            $products[] = cleanRow($row);
        }
    }

    if (empty($products)) {
        $orAllConds = [];
        foreach ($keywordList as $kw) {
            foreach ($columns as $col) {
                $orAllConds[] = "`$col` LIKE '%$kw%'";
            }
        }

        $sqlFallback = "SELECT name, price, category, subcategory, subsubcategory,
                               material, stock, colors, sizes, description
                        FROM product
                        WHERE " . implode(' OR ', $orAllConds) . "
                        ORDER BY stock DESC LIMIT 20";

        $result2 = $conn->query($sqlFallback);
        if ($result2) {
            while ($row = $result2->fetch_assoc()) {
                $row['colors'] = parseColors($row['colors'] ?? '');
                $products[] = cleanRow($row);
            }
        }
    }
}

$catResult = $conn->query(
    "SELECT DISTINCT category, subcategory, subsubcategory
     FROM product ORDER BY category, subcategory, subsubcategory"
);
$storeMap = [];
if ($catResult) {
    while ($row = $catResult->fetch_assoc()) {
        $path = $row['category'];
        if (!empty($row['subcategory']))    $path .= ' > ' . $row['subcategory'];
        if (!empty($row['subsubcategory'])) $path .= ' > ' . $row['subsubcategory'];
        $storeMap[] = $path;
    }
}

echo json_encode([
    "keywords_used" => $keywordList,
    "products"      => array_values($products),
    "store_map"     => array_values(array_unique($storeMap)),
], JSON_UNESCAPED_UNICODE);

$conn->close();
?>
