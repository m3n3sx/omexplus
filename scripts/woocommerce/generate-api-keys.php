<?php
/**
 * Generate WooCommerce REST API Keys
 * 
 * Uruchom na serwerze:
 * php /www/wwwroot/omexplus.pl/generate-api-keys.php
 * php /www/wwwroot/kolaiwalki.pl/generate-api-keys.php
 * 
 * Lub skopiuj ten plik do katalogu WordPress i uruchom przez przeglądarkę (usuń po użyciu!)
 */

// Load WordPress
require_once dirname(__FILE__) . '/wp-load.php';

// Check if WooCommerce is active
if (!class_exists('WooCommerce')) {
    die('WooCommerce is not active');
}

// Generate random keys
function generate_api_key() {
    return 'ck_' . bin2hex(random_bytes(20));
}

function generate_api_secret() {
    return 'cs_' . bin2hex(random_bytes(20));
}

$consumer_key = generate_api_key();
$consumer_secret = generate_api_secret();

// Hash the secret for storage
$consumer_secret_hash = wp_hash_password($consumer_secret);

// Get admin user
$admin_user = get_users(['role' => 'administrator', 'number' => 1]);
$user_id = $admin_user[0]->ID ?? 1;

global $wpdb;

// Insert API key into database
$result = $wpdb->insert(
    $wpdb->prefix . 'woocommerce_api_keys',
    [
        'user_id' => $user_id,
        'description' => 'OMEX Dropship Integration - ' . date('Y-m-d H:i:s'),
        'permissions' => 'read',
        'consumer_key' => wc_api_hash($consumer_key),
        'consumer_secret' => $consumer_secret_hash,
        'truncated_key' => substr($consumer_key, -7),
        'last_access' => null,
    ],
    ['%d', '%s', '%s', '%s', '%s', '%s', '%s']
);

if ($result) {
    echo "=== WooCommerce API Keys Generated ===\n\n";
    echo "Store URL: " . get_site_url() . "\n";
    echo "Consumer Key: " . $consumer_key . "\n";
    echo "Consumer Secret: " . $consumer_secret . "\n\n";
    echo "IMPORTANT: Save these keys! The secret cannot be retrieved later.\n";
    echo "Use these in OMEX Admin -> Dostawcy -> [Supplier] -> WooCommerce Config\n";
} else {
    echo "Error creating API keys: " . $wpdb->last_error . "\n";
}
