<?php
// filepath: d:\Proyectos_Dev\hr_dispon\api\save_reservation.php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

require_once 'config.php';

try {
    // Get POST data
    $input = file_get_contents('php://input');
    if (!$input) {
        throw new Exception('No input data received');
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }

    // Validate all required fields
    if (!isset($data['name']) || !isset($data['phone']) || 
        !isset($data['week']) || !isset($data['timeSlot']) || 
        !isset($data['dayIndex'])) {
        throw new Exception('Missing required fields');
    }

    // Insert into database
    $stmt = $database->prepare('INSERT INTO reservations (name, phone, week, timeSlot, dayIndex, timestamp) 
                               VALUES (:name, :phone, :week, :timeSlot, :dayIndex, datetime("now"))');
    
    $stmt->bindValue(':name', $data['name'], SQLITE3_TEXT);
    $stmt->bindValue(':phone', $data['phone'], SQLITE3_TEXT);
    $stmt->bindValue(':week', $data['week'], SQLITE3_TEXT);
    $stmt->bindValue(':timeSlot', $data['timeSlot'], SQLITE3_TEXT);
    $stmt->bindValue(':dayIndex', $data['dayIndex'], SQLITE3_INTEGER);
    
    $result = $stmt->execute();
    
    if ($result === false) {
        throw new Exception('Failed to save reservation');
    }

    echo json_encode(['success' => true]);

} catch(Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}
?>