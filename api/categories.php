<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $categories = json_decode(file_get_contents('../data.json'), true)['categories'];
        echo json_encode($categories);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $data['id'] = count(json_decode(file_get_contents('../data.json'), true)['categories']) + 1;
        $json = json_decode(file_get_contents('../data.json'), true);
        $json['categories'][] = $data;
        file_put_contents('../data.json', json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $json = json_decode(file_get_contents('../data.json'), true);
        foreach ($json['categories'] as &$category) {
            if ($category['id'] == $data['id']) {
                $category = $data;
                break;
            }
        }
        file_put_contents('../data.json', json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;
    case 'DELETE':
        $id = $_GET['id'];
        $json = json_decode(file_get_contents('../data.json'), true);
        $json['categories'] = array_filter($json['categories'], function($category) use ($id) {
            return $category['id'] != $id;
        });
        file_put_contents('../data.json', json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;
}