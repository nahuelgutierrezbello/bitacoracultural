<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$uploadDir = __DIR__ . '/uploads/';
$publicDir = '/bitacoracultural/api/uploads/';
$jsonFile = '../data.json';

if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'Archivo data.json no encontrado']);
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);

/* Subida de imagen */
function uploadFile($fileInputName, $uploadDir, $publicDir) {
    if (!isset($_FILES[$fileInputName]) || empty($_FILES[$fileInputName]['name'])) {
        return null;
    }

    $name = time() . "_" . basename($_FILES[$fileInputName]['name']);
    $path = $uploadDir . $name;

    if (move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $path)) {
        return $publicDir . $name;
    }

    return null;
}

switch ($_SERVER['REQUEST_METHOD']) {

    /* ================= GET ================= */
    case 'GET':
        echo json_encode($data['notes'] ?? []);
        break;

    /* ================= POST (CREAR / EDITAR) ================= */
    case 'POST':

        // ✏️ EDITAR
        if (isset($_POST['id'])) {
            $id = intval($_POST['id']);
            $found = false;

            foreach ($data['notes'] as &$note) {
                if ($note['id'] === $id) {

                    $note['title'] = $_POST['title'] ?? $note['title'];
                    $note['category'] = intval($_POST['category'] ?? $note['category']);
                    $note['description'] = $_POST['description'] ?? $note['description'];
                    $note['content'] = $_POST['content'] ?? $note['content'];
                    $note['author'] = $_POST['author'] ?? $note['author'];

                    $newImage = uploadFile('imageFile', $uploadDir, $publicDir);
                    if ($newImage) {
                        $note['image'] = $newImage;
                    }

                    $found = true;
                    break;
                }
            }

            if (!$found) {
                http_response_code(404);
                echo json_encode(['error' => 'Nota no encontrada']);
                exit;
            }

            file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success']);
            exit;
        }

        // ➕ CREAR
        $imagePath = uploadFile('imageFile', $uploadDir, $publicDir);

        $newNote = [
            'id' => time(),
            'title' => $_POST['title'] ?? '',
            'category' => intval($_POST['category'] ?? 0),
            'description' => $_POST['description'] ?? '',
            'content' => $_POST['content'] ?? '',
            'author' => $_POST['author'] ?? 'Redacción Bitácora Cultural',
            'image' => $imagePath,
            'date' => date('Y-m-d'),
            'views' => 0
        ];

        $data['notes'][] = $newNote;
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));

        echo json_encode(['status' => 'success', 'data' => $newNote]);
        break;

    /* ================= DELETE ================= */
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        $data['notes'] = array_values(
            array_filter($data['notes'], fn($n) => $n['id'] !== $id)
        );
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
        break;

    default:
        echo json_encode(['error' => 'Método no soportado']);
}
