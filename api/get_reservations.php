<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    $week = isset($_GET['week']) ? $_GET['week'] : '1';
    
    $stmt = $database->prepare("SELECT * FROM reservations WHERE week = :week ORDER BY timestamp DESC");
    $stmt->bindValue(':week', $week, SQLITE3_TEXT);
    $results = $stmt->execute();
    
    $reservations = [];
    while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
        $reservations[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $reservations]);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}
?>