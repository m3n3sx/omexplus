<?php
/**
 * WooCommerce Product Feed API
 * 
 * Ten plik należy umieścić na serwerze VPS w katalogu:
 * /www/wwwroot/ooxo.pl/api/supplier-feed.php
 * 
 * Dostęp: https://ooxo.pl/api/supplier-feed.php?store=omexplus&key=YOUR_SECRET_KEY
 * 
 * INSTRUKCJA INSTALACJI:
 * 1. Skopiuj ten plik na VPS: scp supplier-feed.php root@vps:/www/wwwroot/ooxo.pl/api/
 * 2. Ustaw uprawnienia: chmod 644 /www/wwwroot/ooxo.pl/api/supplier-feed.php
 * 3. Zmień SECRET_KEY poniżej na własny klucz
 */

// Klucz bezpieczeństwa - ZMIEŃ NA WŁASNY!
define('SECRET_KEY', 'omex_supplier_sync_2024_secret');

// Konfiguracja sklepów WooCommerce
$stores = [
    'omexplus' => [
        'name' => 'OMEX Plus',
        'db_host' => 'localhost',
        'db_user' => 'sql_omexplus_pl',
        'db_pass' => '7d66ba884ae428',
        'db_name' => 'sql_omexplus_pl',
        'table_prefix' => 'wp_',
        'base_url' => 'https://omexplus.pl',
    ],
    'kolaiwalki' => [
        'name' => 'Kola i Walki',
        'db_host' => 'localhost',
        'db_user' => 'sql_kolaiwalki_p',
        'db_pass' => 'cb9735239120e',
        'db_name' => 'sql_kolaiwalki_p',
        'table_prefix' => 'wp_0b5b0b_',
        'base_url' => 'https://kolaiwalki.pl',
    ],
];

// Nagłówki CORS i JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Walidacja klucza
$key = $_GET['key'] ?? '';
if ($key !== SECRET_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid API key']);
    exit;
}

// Wybór sklepu
$storeKey = $_GET['store'] ?? '';
if (!isset($stores[$storeKey])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid store',
        'available_stores' => array_keys($stores)
    ]);
    exit;
}

$store = $stores[$storeKey];

try {
    // Połączenie z bazą danych
    $pdo = new PDO(
        "mysql:host={$store['db_host']};dbname={$store['db_name']};charset=utf8mb4",
        $store['db_user'],
        $store['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $prefix = $store['table_prefix'];

    // Pobierz produkty
    $sql = "
        SELECT 
            p.ID as id,
            p.post_title as name,
            p.post_name as slug,
            p.post_excerpt as short_description,
            MAX(CASE WHEN pm.meta_key = '_sku' THEN pm.meta_value END) as sku,
            MAX(CASE WHEN pm.meta_key = '_price' THEN pm.meta_value END) as price,
            MAX(CASE WHEN pm.meta_key = '_regular_price' THEN pm.meta_value END) as regular_price,
            MAX(CASE WHEN pm.meta_key = '_sale_price' THEN pm.meta_value END) as sale_price,
            MAX(CASE WHEN pm.meta_key = '_stock' THEN pm.meta_value END) as stock_quantity,
            MAX(CASE WHEN pm.meta_key = '_stock_status' THEN pm.meta_value END) as stock_status,
            MAX(CASE WHEN pm.meta_key = '_weight' THEN pm.meta_value END) as weight,
            MAX(CASE WHEN pm.meta_key = '_thumbnail_id' THEN pm.meta_value END) as thumbnail_id
        FROM {$prefix}posts p
        LEFT JOIN {$prefix}postmeta pm ON p.ID = pm.post_id
        WHERE p.post_type = 'product' 
        AND p.post_status = 'publish'
        GROUP BY p.ID
        ORDER BY p.ID
    ";

    $stmt = $pdo->query($sql);
    $rawProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Pobierz URL-e obrazków
    $thumbnailIds = array_filter(array_column($rawProducts, 'thumbnail_id'));
    $imageUrls = [];
    
    if (!empty($thumbnailIds)) {
        $placeholders = implode(',', array_fill(0, count($thumbnailIds), '?'));
        $imgSql = "
            SELECT post_id, meta_value as url 
            FROM {$prefix}postmeta 
            WHERE post_id IN ($placeholders) 
            AND meta_key = '_wp_attached_file'
        ";
        $imgStmt = $pdo->prepare($imgSql);
        $imgStmt->execute($thumbnailIds);
        
        foreach ($imgStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $imageUrls[$row['post_id']] = $store['base_url'] . '/wp-content/uploads/' . $row['url'];
        }
    }

    // Formatuj produkty
    $products = [];
    foreach ($rawProducts as $p) {
        $price = floatval($p['price'] ?: $p['regular_price'] ?: 0);
        $stock = intval($p['stock_quantity'] ?: ($p['stock_status'] === 'instock' ? 100 : 0));
        
        $products[] = [
            'id' => (int)$p['id'],
            'sku' => $p['sku'] ?: 'WOO-' . $p['id'],
            'name' => $p['name'],
            'slug' => $p['slug'],
            'description' => $p['short_description'],
            'price' => $price,
            'regular_price' => floatval($p['regular_price'] ?: $price),
            'sale_price' => $p['sale_price'] ? floatval($p['sale_price']) : null,
            'stock' => $stock,
            'in_stock' => $stock > 0 || $p['stock_status'] === 'instock',
            'weight' => $p['weight'] ? floatval($p['weight']) : null,
            'image' => $imageUrls[$p['thumbnail_id']] ?? null,
            'url' => $store['base_url'] . '/product/' . $p['slug'],
            'currency' => 'PLN',
        ];
    }

    // Odpowiedź
    echo json_encode([
        'success' => true,
        'store' => $storeKey,
        'store_name' => $store['name'],
        'store_url' => $store['base_url'],
        'products_count' => count($products),
        'generated_at' => date('c'),
        'products' => $products,
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
