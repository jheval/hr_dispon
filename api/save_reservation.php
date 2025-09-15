<?php
// filepath: d:\Proyectos_Dev\hr_dispon\api\save_reservation.php

error_reporting(0); // Disable error reporting
ini_set('display_errors', 0); // Don't display errors
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    if (!isset($database)) {
        throw new Exception('Database connection failed');
    }

    $input = file_get_contents('php://input');
    if (!$input) {
        throw new Exception('No input data received');
    }

    $data = json_decode($input, true);
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    if (!isset($data['name']) || !isset($data['phone']) || !isset($data['week'])) {
        throw new Exception('Missing required fields');
    }

    $stmt = $database->prepare('INSERT INTO reservations (name, phone, week, timestamp) VALUES (:name, :phone, :week, datetime("now"))');
    
    $stmt->bindValue(':name', $data['name'], SQLITE3_TEXT);
    $stmt->bindValue(':phone', $data['phone'], SQLITE3_TEXT);
    $stmt->bindValue(':week', $data['week'], SQLITE3_TEXT);
    
    $result = $stmt->execute();
    
    if ($result === false) {
        throw new Exception('Failed to save reservation');
    }

    echo json_encode(['success' => true]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}
?>