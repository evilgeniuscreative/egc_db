<?php
/**
 * Generic CRUD API endpoint
 * Handles: projects, articles, animations, narration_videos, social_links, page_content, site_settings, seo_settings
 * 
 * Routes:
 * GET    /ml/admin/api.php?table=projects           - List all
 * GET    /ml/admin/api.php?table=projects&id=1      - Get one
 * POST   /ml/admin/api.php?table=projects           - Create
 * PUT    /ml/admin/api.php?table=projects&id=1      - Update
 * DELETE /ml/admin/api.php?table=projects&id=1      - Delete
 * POST   /ml/admin/api.php?table=projects&action=reorder - Reorder items
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();

// Allowed tables and their configurations
$allowedTables = [
    'projects' => [
        'fields' => ['title', 'type', 'thumb', 'description', 'logos', 'link_text', 'link_url', 'sort_order', 'is_active'],
        'required' => ['title', 'type'],
        'orderBy' => 'sort_order ASC, id DESC'
    ],
    'articles' => [
        'fields' => ['slug', 'title', 'description', 'body', 'image', 'image_alt', 'keywords', 'custom_style', 'is_published', 'published_at'],
        'required' => ['slug', 'title'],
        'orderBy' => 'published_at DESC, id DESC'
    ],
    'animations' => [
        'fields' => ['title', 'description', 'video_url', 'thumb', 'sort_order', 'is_active'],
        'required' => ['title'],
        'orderBy' => 'sort_order ASC, id DESC'
    ],
    'narration_videos' => [
        'fields' => ['title', 'description', 'video_url', 'thumb', 'sort_order', 'is_active'],
        'required' => ['title'],
        'orderBy' => 'sort_order ASC, id DESC'
    ],
    'social_links' => [
        'fields' => ['platform', 'url', 'icon', 'sort_order', 'is_active'],
        'required' => ['platform', 'url'],
        'orderBy' => 'sort_order ASC'
    ],
    'page_content' => [
        'fields' => ['page_slug', 'title', 'description', 'content', 'meta_title', 'meta_description', 'meta_keywords', 'sort_order', 'is_active'],
        'required' => ['page_slug', 'title'],
        'orderBy' => 'sort_order ASC'
    ],
    'site_settings' => [
        'fields' => ['setting_key', 'setting_value', 'setting_group'],
        'required' => ['setting_key'],
        'orderBy' => 'setting_group ASC, setting_key ASC'
    ],
    'seo_settings' => [
        'fields' => ['page_slug', 'title', 'description', 'keywords', 'og_image'],
        'required' => ['page_slug'],
        'orderBy' => 'page_slug ASC'
    ]
];

// Get request parameters
$table = $_GET['table'] ?? '';
$id = $_GET['id'] ?? null;
$action = $_GET['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

// Validate table
if (!isset($allowedTables[$table])) {
    jsonResponse(['error' => 'Invalid table'], 400);
}

$config = $allowedTables[$table];
$db = getDB();

// Public read access for certain tables (no auth required)
$publicReadTables = ['projects', 'articles', 'animations', 'narration_videos', 'social_links', 'page_content', 'seo_settings', 'site_settings'];
$isPublicRead = $method === 'GET' && in_array($table, $publicReadTables);

// Require auth for non-public operations
if (!$isPublicRead) {
    requireAuth();
}

switch ($method) {
    case 'GET':
        if ($id) {
            // Get single item
            $stmt = $db->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();
            
            if (!$item) {
                jsonResponse(['error' => 'Not found'], 404);
            }
            
            jsonResponse($item);
        } else {
            // List all items
            $stmt = $db->query("SELECT * FROM $table ORDER BY {$config['orderBy']}");
            $items = $stmt->fetchAll();
            jsonResponse($items);
        }
        break;
        
    case 'POST':
        if ($action === 'reorder') {
            // Reorder items
            $data = getRequestBody();
            $items = $data['items'] ?? [];
            
            if (empty($items)) {
                jsonResponse(['error' => 'No items provided'], 400);
            }
            
            $db->beginTransaction();
            try {
                $stmt = $db->prepare("UPDATE $table SET sort_order = ? WHERE id = ?");
                foreach ($items as $index => $itemId) {
                    $stmt->execute([$index, $itemId]);
                }
                $db->commit();
                jsonResponse(['success' => true, 'message' => 'Order updated']);
            } catch (Exception $e) {
                $db->rollBack();
                jsonResponse(['error' => 'Failed to update order'], 500);
            }
        } else {
            // Create new item
            $data = getRequestBody();
            
            // Validate required fields
            foreach ($config['required'] as $field) {
                if (empty($data[$field])) {
                    jsonResponse(['error' => "Field '$field' is required"], 400);
                }
            }
            
            // Build insert query
            $fields = array_intersect_key($data, array_flip($config['fields']));
            $columns = implode(', ', array_keys($fields));
            $placeholders = implode(', ', array_fill(0, count($fields), '?'));
            
            $stmt = $db->prepare("INSERT INTO $table ($columns) VALUES ($placeholders)");
            $stmt->execute(array_values($fields));
            
            $newId = $db->lastInsertId();
            
            // Return the created item
            $stmt = $db->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$newId]);
            $item = $stmt->fetch();
            
            jsonResponse($item, 201);
        }
        break;
        
    case 'PUT':
        if (!$id) {
            jsonResponse(['error' => 'ID required'], 400);
        }
        
        $data = getRequestBody();
        
        // Build update query
        $fields = array_intersect_key($data, array_flip($config['fields']));
        
        if (empty($fields)) {
            jsonResponse(['error' => 'No valid fields to update'], 400);
        }
        
        $setClause = implode(', ', array_map(fn($k) => "$k = ?", array_keys($fields)));
        $values = array_values($fields);
        $values[] = $id;
        
        $stmt = $db->prepare("UPDATE $table SET $setClause WHERE id = ?");
        $stmt->execute($values);
        
        // Return updated item
        $stmt = $db->prepare("SELECT * FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        
        if (!$item) {
            jsonResponse(['error' => 'Not found'], 404);
        }
        
        jsonResponse($item);
        break;
        
    case 'DELETE':
        if (!$id) {
            jsonResponse(['error' => 'ID required'], 400);
        }
        
        $stmt = $db->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Not found'], 404);
        }
        
        jsonResponse(['success' => true, 'message' => 'Deleted']);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
