<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $notes = json_decode(file_get_contents('../data.json'), true)['notes'];
        echo json_encode($notes);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $data['id'] = count(json_decode(file_get_contents('../data.json'), true)['notes']) + 1;
        $json = json_decode(file_get_contents('../data.json'), true);
        $json['notes'][] = $data;
        file_put_contents('../data.json', json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $json = json_decode(file_get_contents('../data.json'), true);
        foreach ($json['notes'] as &$note) {
            if ($note['id'] == $data['id']) {
                $note = $data;
                break;
            }
        }
        file_put_contents('../data.json', json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;
    case 'DELETE':
        $id = $_GET['id'];
        $json = json_decode(file_get_contents('../data.json'), true);
        $json['notes'] = array_filter($json['notes'], function($note) use ($id) {
            return $note['id'] != $id;
        });
        file_put_contents('../data.json', json_encode($json, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;
}