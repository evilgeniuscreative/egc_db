<?php
/**
 * Remove duplicate entries from database
 */

require_once __DIR__ . '/config.php';

echo "Removing duplicates...\n\n";

try {
    $pdo = db();
    
    // Find and remove duplicate projects (keep the one with lowest ID)
    echo "Checking projects...\n";
    $result = $pdo->query("
        SELECT title, COUNT(*) as cnt, GROUP_CONCAT(id ORDER BY id) as ids
        FROM projects 
        GROUP BY title 
        HAVING cnt > 1
    ");
    
    $removed = 0;
    foreach ($result as $row) {
        $ids = explode(',', $row['ids']);
        array_shift($ids); // Keep first one
        if (!empty($ids)) {
            $pdo->exec("DELETE FROM projects WHERE id IN (" . implode(',', $ids) . ")");
            $removed += count($ids);
            echo "  Removed " . count($ids) . " duplicate(s) of: {$row['title']}\n";
        }
    }
    echo "✓ Removed $removed duplicate projects\n\n";
    
    // Find and remove duplicate animations
    echo "Checking animations...\n";
    $result = $pdo->query("
        SELECT title, COUNT(*) as cnt, GROUP_CONCAT(id ORDER BY id) as ids
        FROM animations 
        GROUP BY title 
        HAVING cnt > 1
    ");
    
    $removed = 0;
    foreach ($result as $row) {
        $ids = explode(',', $row['ids']);
        array_shift($ids); // Keep first one
        if (!empty($ids)) {
            $pdo->exec("DELETE FROM animations WHERE id IN (" . implode(',', $ids) . ")");
            $removed += count($ids);
            echo "  Removed " . count($ids) . " duplicate(s) of: {$row['title']}\n";
        }
    }
    echo "✓ Removed $removed duplicate animations\n\n";
    
    // Find and remove duplicate articles
    echo "Checking articles...\n";
    $result = $pdo->query("
        SELECT slug, COUNT(*) as cnt, GROUP_CONCAT(id ORDER BY id) as ids
        FROM articles 
        GROUP BY slug 
        HAVING cnt > 1
    ");
    
    $removed = 0;
    foreach ($result as $row) {
        $ids = explode(',', $row['ids']);
        array_shift($ids); // Keep first one
        if (!empty($ids)) {
            $pdo->exec("DELETE FROM articles WHERE id IN (" . implode(',', $ids) . ")");
            $removed += count($ids);
            echo "  Removed " . count($ids) . " duplicate(s) of: {$row['slug']}\n";
        }
    }
    echo "✓ Removed $removed duplicate articles\n\n";
    
    // Show final counts
    $projects = $pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn();
    $animations = $pdo->query('SELECT COUNT(*) FROM animations')->fetchColumn();
    $articles = $pdo->query('SELECT COUNT(*) FROM articles')->fetchColumn();
    
    echo "✅ Final counts:\n";
    echo "Projects: $projects\n";
    echo "Animations: $animations\n";
    echo "Articles: $articles\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
