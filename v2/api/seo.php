<?php
/**
 * SEO Meta API endpoint
 * GET /api/seo.php?page=home - Get SEO meta for specific page
 * GET /api/seo.php - Get all SEO meta
 * POST /api/seo.php - Create SEO meta (requires auth)
 * PUT /api/seo.php - Update SEO meta (requires auth)
 * DELETE /api/seo.php?id=1 - Delete SEO meta (requires auth)
 */

require_once 'config.php';
require_once 'jwt_functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch SEO meta
if ($method === 'GET') {
    try {
        $page = $_GET['page'] ?? null;
        $id = $_GET['id'] ?? null;
        
        if ($page) {
            // Get SEO for specific page
            $stmt = $pdo->prepare("SELECT * FROM seo_meta WHERE page = ?");
            $stmt->execute([$page]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                json_out(['success' => true, 'data' => $result]);
            } else {
                json_out(['success' => false, 'error' => 'SEO meta not found'], 404);
            }
        } elseif ($id) {
            // Get by ID
            $stmt = $pdo->prepare("SELECT * FROM seo_meta WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                json_out(['success' => true, 'data' => $result]);
            } else {
                json_out(['success' => false, 'error' => 'SEO meta not found'], 404);
            }
        } else {
            // Get all SEO meta
            $stmt = $pdo->query("SELECT * FROM seo_meta ORDER BY page");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_out(['success' => true, 'data' => $data]);
        }
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// POST - Create SEO meta (requires auth)
elseif ($method === 'POST') {
    $token = get_bearer_token();
    if (!$token || !verify_jwt($token)) {
        json_out(['error' => 'Unauthorized'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required = ['page'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            json_out(['error' => "Field '$field' is required"], 400);
        }
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO seo_meta (page, meta_title, meta_description, meta_keywords, og_title, og_description, og_image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $input['page'],
            $input['meta_title'] ?? null,
            $input['meta_description'] ?? null,
            $input['meta_keywords'] ?? null,
            $input['og_title'] ?? null,
            $input['og_description'] ?? null,
            $input['og_image'] ?? null,
        ]);
        
        $id = $pdo->lastInsertId();
        json_out(['success' => true, 'id' => $id, 'message' => 'SEO meta created']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// PUT - Update SEO meta (requires auth)
elseif ($method === 'PUT') {
    $token = get_bearer_token();
    if (!$token || !verify_jwt($token)) {
        json_out(['error' => 'Unauthorized'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    
    if (!$id) {
        json_out(['error' => 'ID is required'], 400);
    }
    
    try {
        $fields = [];
        $values = [];
        
        $allowed = ['page', 'meta_title', 'meta_description', 'meta_keywords', 'og_title', 'og_description', 'og_image'];
        foreach ($allowed as $field) {
            if (isset($input[$field])) {
                $fields[] = "$field = ?";
                $values[] = $input[$field];
            }
        }
        
        if (empty($fields)) {
            json_out(['error' => 'No fields to update'], 400);
        }
        
        $values[] = $id;
        $sql = "UPDATE seo_meta SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        
        json_out(['success' => true, 'message' => 'SEO meta updated']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// DELETE - Delete SEO meta (requires auth)
elseif ($method === 'DELETE') {
    $token = get_bearer_token();
    if (!$token || !verify_jwt($token)) {
        json_out(['error' => 'Unauthorized'], 401);
    }
    
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        json_out(['error' => 'ID is required'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM seo_meta WHERE id = ?");
        $stmt->execute([$id]);
        
        json_out(['success' => true, 'message' => 'SEO meta deleted']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

else {
    json_out(['error' => 'Method not allowed'], 405);
}
