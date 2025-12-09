<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$uploadDir = __DIR__ . '/uploads/';
$publicDir = './api/uploads/';
$jsonFile = '../data.json';

/* -------------------------
   CARGAR JSON
-------------------------- */
if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'Archivo data.json no encontrado']);
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);

/* -------------------------
   FUNCIONES AUXILIARES
-------------------------- */

function saveJSON($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

function uploadFile($fileInputName, $uploadDir, $publicDir) {
    if (!isset($_FILES[$fileInputName]) || empty($_FILES[$fileInputName]['name'])) {
        return null; // No subieron archivo
    }

    $name = time() . "_" . basename($_FILES[$fileInputName]['name']);
    $path = $uploadDir . $name;

    if (move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $path)) {
        return $publicDir . $name;
    }

    return null;
}

/* -------------------------
   DETECTAR MÉTODO REAL
-------------------------- */

$method = $_POST['_method'] ?? $_SERVER['REQUEST_METHOD'];

/* -------------------------
   SWITCH PRINCIPAL
-------------------------- */

switch ($method) {


/* -------------------------
   GET (Listar revistas)
-------------------------- */
case 'GET':
    echo json_encode([
        "status" => "success",
        "data" => $data["issues"]
    ]);
    break;


/* -------------------------
   POST (Crear revista)
-------------------------- */
case 'POST':

    $newIssue = [
        "id" => time(),
        "number" => $_POST["number"] ?? "",
        "month"  => $_POST["month"] ?? "",
        "year"   => $_POST["year"] ?? "",
        "title"  => $_POST["title"] ?? "",
        "description" => $_POST["description"] ?? "",
        "cover" => "",
        "pdf" => ""
    ];

    // Subir portada y PDF si existen
    $coverFile = uploadFile("cover", $uploadDir, $publicDir);
    if ($coverFile) $newIssue["cover"] = $coverFile;

    $pdfFile = uploadFile("pdf", $uploadDir, $publicDir);
    if ($pdfFile) $newIssue["pdf"] = $pdfFile;

    $data["issues"][] = $newIssue;
    saveJSON($jsonFile, $data);

    echo json_encode(["status" => "success", "data" => $newIssue]);
    break;



/* -------------------------
   PUT (Editar revista)
-------------------------- */
case 'PUT':

    $id = $_POST["id"] ?? null;
    if (!$id) {
        echo json_encode(["error" => "ID requerido"]);
        exit;
    }

    foreach ($data["issues"] as &$issue) {
        if ($issue["id"] == $id) {

            // Campos editables
            $issue["number"] = $_POST["number"] ?? $issue["number"];
            $issue["month"]  = $_POST["month"]  ?? $issue["month"];
            $issue["year"]   = $_POST["year"]   ?? $issue["year"];
            $issue["title"]  = $_POST["title"]  ?? $issue["title"];
            $issue["description"] = $_POST["description"] ?? $issue["description"];

            // Reemplazar portada solo si subieron una nueva
            $newCover = uploadFile("cover", $uploadDir, $publicDir);
            if ($newCover) $issue["cover"] = $newCover;

            // Reemplazar PDF solo si subieron uno nuevo
            $newPDF = uploadFile("pdf", $uploadDir, $publicDir);
            if ($newPDF) $issue["pdf"] = $newPDF;

            saveJSON($jsonFile, $data);

            echo json_encode(["status" => "success", "data" => $issue]);
            exit;
        }
    }

    echo json_encode(["error" => "Revista no encontrada"]);
    break;



/* -------------------------
   DELETE (Eliminar revista)
-------------------------- */
case 'DELETE':

    $id = $_GET["id"] ?? null;

    if (!$id) {
        echo json_encode(["error" => "ID requerido"]);
        exit;
    }

    $before = count($data["issues"]);

    $data["issues"] = array_values(array_filter(
        $data["issues"],
        fn($i) => $i["id"] != $id
    ));

    if (count($data["issues"]) === $before) {
        echo json_encode(["error" => "Revista no encontrada"]);
        exit;
    }

    saveJSON($jsonFile, $data);

    echo json_encode(["status" => "success", "message" => "Revista eliminada"]);
    break;




/* -------------------------
   MÉTODO NO SOPORTADO
-------------------------- */
default:
    echo json_encode(["error" => "Método no soportado"]);
    break;
}
