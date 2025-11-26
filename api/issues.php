<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');


$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {

    //===============  POST  =========================

    case 'POST':

        $formData = $_FILES;
        $postData = $_POST;

        // Validaciones
        $requiredFields = ['number', 'month', 'year', 'title', 'description'];
        $missingFields = array_filter($requiredFields, fn($f) => empty($postData[$f]));

        if ($missingFields) {
            http_response_code(400);
            echo json_encode(['error' => 'Campos requeridos faltantes', 'missing_fields' => array_values($missingFields)]);
            exit;
        }

        if (!isset($formData['cover']) || !isset($formData['pdf'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Se requieren archivos cover y pdf']);
            exit;
        }

        // =======================
        //  RUTAS IMPORTANTES
        // =======================

        // Ruta física (servidor)
        $uploadDir = __DIR__ . '/uploads/';

        // Ruta pública (lo que irá al JSON)
        $publicDir = './api/uploads/';

        // Crear carpeta si no existe
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // =======================
        //    GUARDAR COVER
        // =======================

        $coverFile = $formData['cover'];
        $coverName = "cover_" . time() . "." . pathinfo($coverFile['name'], PATHINFO_EXTENSION);

        $coverPathPhysical = $uploadDir . $coverName;      // física
        $coverPathPublic   = $publicDir . $coverName;      // pública

        if (!move_uploaded_file($coverFile['tmp_name'], $coverPathPhysical)) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al subir la portada']);
            exit;
        }

        // =======================
        //    GUARDAR PDF
        // =======================

        $pdfFile = $formData['pdf'];
        $pdfName = "revista_" . time() . ".pdf";

        $pdfPathPhysical = $uploadDir . $pdfName;
        $pdfPathPublic   = $publicDir . $pdfName;

        if (!move_uploaded_file($pdfFile['tmp_name'], $pdfPathPhysical)) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al subir el PDF']);
            exit;
        }

        // =======================
        //     GUARDAR EN JSON
        // =======================

        $data = array_merge($postData, [
            'cover' => $coverPathPublic,   // SOLO guardamos ruta PÚBLICA
            'pdf'   => $pdfPathPublic,     // igual para el pdf
            'id'    => time()
        ]);

        $jsonFile = '../data.json';
        $json = json_decode(file_get_contents($jsonFile), true);

        if (!isset($json['issues']) || !is_array($json['issues'])) {
            $json['issues'] = [];
        }

        $json['issues'][] = $data;
        file_put_contents($jsonFile, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        echo json_encode(['status' => 'success', 'data' => $data]);
        exit;

    //===============  PUT  =========================

    case 'PUT':
    $formData = $_FILES;
    $postData = $_POST;
    
    // Validaciones
    $requiredFields = ['id', 'number', 'month', 'year', 'title', 'description'];
    $missingFields = array_filter($requiredFields, fn($f) => empty($postData[$f]));
    if ($missingFields) {
        http_response_code(400);
        echo json_encode(['error' => 'Campos requeridos faltantes', 'missing_fields' => array_values($missingFields)]);
        exit;
    }
    
    // Buscar la revista existente
    $jsonFile = '../data.json';
    $json = json_decode(file_get_contents($jsonFile), true);
    $issues = $json['issues'] ?? [];
    $issueIndex = array_search($postData['id'], array_column($issues, 'id'));
    
    if ($issueIndex === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Revista no encontrada']);
        exit;
    }
    
    // Actualizar datos
    $updatedData = array_merge($issues[$issueIndex], $postData);
    
    // Manejar archivos si se proporcionan
    if (isset($formData['cover'])) {
        $coverFile = $formData['cover'];
        $coverName = "cover_" . time() . "." . pathinfo($coverFile['name'], PATHINFO_EXTENSION);
        $coverPathPhysical = $uploadDir . $coverName;
        $coverPathPublic = $publicDir . $coverName;
        
        if (!move_uploaded_file($coverFile['tmp_name'], $coverPathPhysical)) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al subir la portada']);
            exit;
        }
        $updatedData['cover'] = $coverPathPublic;
    }
    
    if (isset($formData['pdf'])) {
        $pdfFile = $formData['pdf'];
        $pdfName = "revista_" . time() . ".pdf";
        $pdfPathPhysical = $uploadDir . $pdfName;
        $pdfPathPublic = $publicDir . $pdfName;
        
        if (!move_uploaded_file($pdfFile['tmp_name'], $pdfPathPhysical)) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al subir el PDF']);
            exit;
        }
        $updatedData['pdf'] = $pdfPathPublic;
    }
    
    // Actualizar el JSON
    $issues[$issueIndex] = $updatedData;
    $json['issues'] = $issues;
    file_put_contents($jsonFile, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    echo json_encode(['status' => 'success', 'data' => $updatedData]);
    exit;
    break;
}


