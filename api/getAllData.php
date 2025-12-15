<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$jsonFile = __DIR__ . '/../data.json';

if (!file_exists($jsonFile)) {
    echo json_encode(['issues'=>[], 'categories'=>[], 'notes'=>[]]);
    exit;
}

$data = file_get_contents($jsonFile);
echo $data;
