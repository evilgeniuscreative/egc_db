<?php
/**
 * Data Migration Script
 * Imports existing data from JS files into database
 * Run once: php migrate.php
 */

require_once __DIR__ . '/config.php';

echo "Starting data migration...\n\n";

try {
    $pdo = db();
    
    // Projects data
    $projects = [
        ['City Lights', 'web', 'images/thumb-city-lights.jpg', 'NOTE: DESKTOP ONLY. This does not function on mobile due to the complexity of the code. Exploring CSS and Javascript animation with an interactive day-to-night web app.', 'HTML5,JavaScript,CSS3', 'View Project', 'https://evilgeniuscreative.com/city_lights/', 1],
        ['Agile Metrics Explanation Animations', 'animation', 'images/thumb-animation.jpg', 'Animated introductions explaining the basics of multiple Agile Metrics data analysis and performance tracking types for Rally Software.', 'Edge Animate', 'View Project', 'https://evilgeniuscreative.com/animation/', 2],
        ['Khoros Community', 'web', 'images/thumb-khoros.jpg', 'Enterprise community platform development and customization.', 'Freemarker,JavaScript,CSS', 'Learn More', '#', 3],
        ['Adobe AEM Sites', 'web', 'images/thumb-aem.jpg', 'Adobe Experience Manager site development and component creation.', 'Java,HTL,JavaScript', 'Learn More', '#', 4],
        ['React Applications', 'web', 'images/thumb-react.jpg', 'Modern React applications with hooks, context, and state management.', 'React,JavaScript,CSS', 'View Projects', '#', 5],
        ['Vue.js Projects', 'web', 'images/thumb-vue.jpg', 'Vue.js applications with Vuex and Vue Router.', 'Vue.js,JavaScript,CSS', 'View Projects', '#', 6],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO projects (title, type, thumb, description, logos, link_text, link_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');
    foreach ($projects as $p) {
        $stmt->execute($p);
    }
    echo "✓ Migrated " . count($projects) . " projects\n";
    
    // Sample articles (you'll need to add more based on your articles.js)
    $articles = [
        ['getting-started', 'Getting Started with Modern Web Development', 'An introduction to modern web development practices and tools.', '<p>Article content here...</p>', 'images/article-1.jpg', 'Getting Started', 'web development, javascript, react', '', 1, '2024-01-01'],
        ['react-best-practices', 'React Best Practices', 'Essential patterns and practices for React development.', '<p>Article content here...</p>', 'images/article-2.jpg', 'React Best Practices', 'react, javascript, best practices', '', 1, '2024-01-15'],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO articles (slug, title, description, body, image, image_alt, keywords, custom_css, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($articles as $a) {
        $stmt->execute($a);
    }
    echo "✓ Migrated " . count($articles) . " articles\n";
    
    // Animations
    $animations = [
        ['Cumulative Flow Diagram', 'Explanation of Cumulative Flow Diagram in Agile', 'https://evilgeniuscreative.com/animation/cfd.mp4', 'images/thumb-cfd.jpg', 1],
        ['Velocity Chart', 'Understanding team velocity in Agile', 'https://evilgeniuscreative.com/animation/velocity.mp4', 'images/thumb-velocity.jpg', 2],
        ['Burndown Chart', 'How to read and use burndown charts', 'https://evilgeniuscreative.com/animation/burndown.mp4', 'images/thumb-burndown.jpg', 3],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO animations (title, description, video_url, thumb, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)');
    foreach ($animations as $a) {
        $stmt->execute($a);
    }
    echo "✓ Migrated " . count($animations) . " animations\n";
    
    // Narration videos
    $narration = [
        ['Community Tutorial 1', 'Introduction to the community platform', 'https://evilgeniuscreative.com/videos/tutorial1.mp4', 'images/thumb-tutorial1.jpg', 1],
        ['Community Tutorial 2', 'Advanced community features', 'https://evilgeniuscreative.com/videos/tutorial2.mp4', 'images/thumb-tutorial2.jpg', 2],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO narration (title, description, video_url, thumb, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)');
    foreach ($narration as $n) {
        $stmt->execute($n);
    }
    echo "✓ Migrated " . count($narration) . " narration videos\n";
    
    // Page content
    $pages = [
        ['home', 'Home', 'Experienced, multifaceted, creative, committed Full Stack and Front-End Developer', '<p>Homepage content</p>', 'Ian Kleinfeld - Full Stack Developer', 'Full Stack Developer with UX/UI expertise', 'web development, react, javascript, ux design', 1],
        ['about', 'About', 'Ian Kleinfeld, Software Developer, Front End Engineer', '<p>About content</p>', 'About Ian Kleinfeld', 'Learn about my experience and skills', 'developer, engineer, experience', 1],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO pages (slug, title, description, content, meta_title, meta_desc, meta_keywords, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($pages as $p) {
        $stmt->execute($p);
    }
    echo "✓ Migrated " . count($pages) . " pages\n";
    
    echo "\n✅ Migration complete!\n";
    echo "Total items migrated: " . (count($projects) + count($articles) + count($animations) + count($narration) + count($pages)) . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
