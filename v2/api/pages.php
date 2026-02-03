<?php
/**
 * Pages API endpoint
 * GET /api/pages.php?slug=homepage - Get specific page
 * GET /api/pages.php - Get all pages
 * POST /api/pages.php - Create page (requires auth)
 * PUT /api/pages.php - Update page (requires auth)
 * DELETE /api/pages.php?id=1 - Delete page (requires auth)
 */

require_once 'config.php';
require_once 'jwt_functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch pages
if ($method === 'GET') {
    try {
        $slug = $_GET['slug'] ?? null;
        $id = $_GET['id'] ?? null;
        
        if ($slug) {
            // Get specific page by slug
            $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? AND active = 1");
            $stmt->execute([$slug]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                json_out(['success' => true, 'data' => $result]);
            } else {
                json_out(['success' => false, 'error' => 'Page not found'], 404);
            }
        } elseif ($id) {
            // Get by ID
            $stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                json_out(['success' => true, 'data' => $result]);
            } else {
                json_out(['success' => false, 'error' => 'Page not found'], 404);
            }
        } else {
            // Get all pages
            $stmt = $pdo->query("SELECT * FROM pages ORDER BY slug");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_out(['success' => true, 'data' => $data]);
        }
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// POST - Create page (requires auth)
elseif ($method === 'POST') {
    $token = get_bearer_token();
    if (!$token || !verify_jwt($token)) {
        json_out(['error' => 'Unauthorized'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required = ['slug', 'title'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            json_out(['error' => "Field '$field' is required"], 400);
        }
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO pages (slug, title, description, content, meta_title, meta_desc, meta_keywords, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $input['slug'],
            $input['title'],
            $input['description'] ?? null,
            $input['content'] ?? null,
            $input['meta_title'] ?? null,
            $input['meta_desc'] ?? null,
            $input['meta_keywords'] ?? null,
            $input['active'] ?? 1,
        ]);
        
        $id = $pdo->lastInsertId();
        json_out(['success' => true, 'id' => $id, 'message' => 'Page created']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// PUT - Update page (requires auth)
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
        
        $allowed = ['slug', 'title', 'description', 'content', 'meta_title', 'meta_desc', 'meta_keywords', 'active'];
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
        $sql = "UPDATE pages SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        
        json_out(['success' => true, 'message' => 'Page updated']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

// DELETE - Delete page (requires auth)
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
        $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
        $stmt->execute([$id]);
        
        json_out(['success' => true, 'message' => 'Page deleted']);
    } catch (Exception $e) {
        json_out(['error' => $e->getMessage()], 500);
    }
}

else {
    json_out(['error' => 'Method not allowed'], 405);
}
