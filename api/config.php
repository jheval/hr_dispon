<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$dbPath = __DIR__ . '/../db/reservations.sqlite';

try {
    if (!extension_loaded('sqlite3')) {
        throw new Exception('SQLite3 extension is not installed. Please check your PHP configuration.');
    }

    // Create db directory if it doesn't exist
    if (!is_dir(dirname($dbPath))) {
        mkdir(dirname($dbPath), 0777, true);
    }

    // Use SQLite3
    $database = new SQLite3($dbPath);
    $database->enableExceptions(true);
    
    // Test database connection
    $database->exec('SELECT 1');
    
    // Create table if not exists
    $database->exec("
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            week TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

} catch(Exception $e) {
    die(json_encode([
        'success' => false, 
        'error' => $e->getMessage(),
        'details' => [
            'sqlite_enabled' => extension_loaded('sqlite3'),
            'php_version' => PHP_VERSION,
            'extensions' => get_loaded_extensions()
        ]
    ]));
}
?>