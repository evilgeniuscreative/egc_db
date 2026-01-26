<?php
/**
 * Generic CRUD API
 * Usage: crud.php?t=projects (table name)
 * 
 * GET    ?t=projects         - List all
 * GET    ?t=projects&id=1    - Get one
 * POST   ?t=projects         - Create (auth required)
 * PUT    ?t=projects&id=1    - Update (auth required)
 * DELETE ?t=projects&id=1    - Delete (auth required)
 */

require_once __DIR__ . '/config.php';
headers();

// Table configs: allowed fields, required fields, order
$tables = [
    'projects' => [
        'fields' => ['title', 'type', 'thumb', 'description', 'logos', 'link_text', 'link_url', 'sort_order', 'active'],
        'required' => ['title'],
        'order' => 'sort_order ASC, id DESC'
    ],
    'articles' => [
        'fields' => ['slug', 'title', 'description', 'body', 'image', 'image_alt', 'keywords', 'custom_css', 'published', 'published_at'],
        'required' => ['slug', 'title'],
        'order' => 'published_at DESC, id DESC'
    ],
    'animations' => [
        'fields' => ['title', 'description', 'video_url', 'thumb', 'sort_order', 'active'],
        'required' => ['title'],
        'order' => 'sort_order ASC'
    ],
    'narration' => [
        'fields' => ['title', 'description', 'video_url', 'thumb', 'sort_order', 'active'],
        'required' => ['title'],
        'order' => 'sort_order ASC'
    ],
    'socials' => [
        'fields' => ['platform', 'url', 'icon', 'sort_order', 'active'],
        'required' => ['platform', 'url'],
        'order' => 'sort_order ASC'
    ],
    'pages' => [
        'fields' => ['slug', 'title', 'description', 'content', 'meta_title', 'meta_desc', 'meta_keywords', 'active'],
        'required' => ['slug', 'title'],
        'order' => 'slug ASC'
    ],
    'settings' => [
        'fields' => ['k', 'v'],
        'required' => ['k'],
        'order' => 'k ASC'
    ]
];

$table = $_GET['t'] ?? '';
$id = $_GET['id'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($tables[$table])) {
    json_out(['error' => 'Invalid table'], 400);
}

$cfg = $tables[$table];
$pdo = db();

// Public read for GET, auth required for mutations
if ($method !== 'GET') {
    auth();
}

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $row ? json_out($row) : json_out(['error' => 'Not found'], 404);
        } else {
            $stmt = $pdo->query("SELECT * FROM $table ORDER BY {$cfg['order']}");
            json_out($stmt->fetchAll());
        }
        break;
        
    case 'POST':
        $data = input();
        
        // Validate required
        foreach ($cfg['required'] as $f) {
            if (empty($data[$f])) {
                json_out(['error' => "Field '$f' required"], 400);
            }
        }
        
        // Filter to allowed fields
        $fields = array_intersect_key($data, array_flip($cfg['fields']));
        if (empty($fields)) {
            json_out(['error' => 'No valid fields'], 400);
        }
        
        $cols = implode(', ', array_keys($fields));
        $placeholders = implode(', ', array_fill(0, count($fields), '?'));
        
        $stmt = $pdo->prepare("INSERT INTO $table ($cols) VALUES ($placeholders)");
        $stmt->execute(array_values($fields));
        
        $newId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
        $stmt->execute([$newId]);
        json_out($stmt->fetch(), 201);
        break;
        
    case 'PUT':
        if (!$id) json_out(['error' => 'ID required'], 400);
        
        $data = input();
        $fields = array_intersect_key($data, array_flip($cfg['fields']));
        
        if (empty($fields)) {
            json_out(['error' => 'No valid fields'], 400);
        }
        
        $set = implode(', ', array_map(fn($k) => "$k = ?", array_keys($fields)));
        $vals = array_values($fields);
        $vals[] = $id;
        
        $stmt = $pdo->prepare("UPDATE $table SET $set WHERE id = ?");
        $stmt->execute($vals);
        
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $row ? json_out($row) : json_out(['error' => 'Not found'], 404);
        break;
        
    case 'DELETE':
        if (!$id) json_out(['error' => 'ID required'], 400);
        
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        
        $stmt->rowCount() > 0 
            ? json_out(['success' => true]) 
            : json_out(['error' => 'Not found'], 404);
        break;
        
    default:
        json_out(['error' => 'Method not allowed'], 405);
}
