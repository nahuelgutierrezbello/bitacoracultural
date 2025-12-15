<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // No mostrar errores en pantalla

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$dataFile = dirname(__DIR__) . '/data.json';

if (!file_exists($dataFile)) {
    echo json_encode(['error' => 'No se encontró data.json']);
    exit;
}

// Cargar JSON
$json = json_decode(file_get_contents($dataFile), true);
if (!isset($json['categories'])) {
    $json['categories'] = [];
}

// Detectar método real
$method = $_SERVER['REQUEST_METHOD'];

// Leer datos de PUT/POST
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        echo json_encode(['status' => 'success', 'data' => $json['categories']]);
        break;

    case 'POST':
        if (!$input || !isset($input['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre de categoría requerido']);
            exit;
        }

        $ids = array_column($json['categories'], 'id');
        $input['id'] = $ids ? max($ids) + 1 : 1;

        $json['categories'][] = $input;
        file_put_contents($dataFile, json_encode($json, JSON_PRETTY_PRINT));

        echo json_encode(['status' => 'success', 'data' => $input]);
        break;

    case 'PUT':
        if (!$input || !isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de categoría requerido']);
            exit;
        }

        $found = false;
        foreach ($json['categories'] as &$category) {
            if ($category['id'] == $input['id']) {
                $category['name'] = $input['name'] ?? $category['name'];
                $category['description'] = $input['description'] ?? $category['description'];
                $category['icon'] = $input['icon'] ?? $category['icon'];
                $found = true;
                break;
            }
        }

        if (!$found) {
            http_response_code(404);
            echo json_encode(['error' => 'Categoría no encontrada']);
            exit;
        }

        file_put_contents($dataFile, json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            exit;
        }

        $json['categories'] = array_values(
            array_filter($json['categories'], fn($c) => $c['id'] != $id)
        );

        file_put_contents($dataFile, json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;

    default:
        echo json_encode(['error' => 'Método no soportado']);
        break;
}
