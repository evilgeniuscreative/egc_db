<?php
/**
 * Data Migration Script
 * Migrates data from static JS files to database
 * Run once: php migrate_data.php
 */

define('API_ACCESS', true);
require_once 'config.php';

header('Content-Type: application/json');

$pdo = db();

// Check if already migrated
$check = $pdo->query("SELECT COUNT(*) FROM settings WHERE k = 'data_migrated'")->fetchColumn();
if ($check > 0) {
    die(json_encode(['error' => 'Data already migrated. Delete the data_migrated setting to re-run.']));
}

try {
    $pdo->beginTransaction();
    
    // 1. Migrate main/hero settings from user.js
    $settings = [
        ['k' => 'site_title', 'v' => 'Ian Kleinfeld, Software Developer, Front End Engineer, with a deep UX, UI, and Design background'],
        ['k' => 'site_name', 'v' => 'Ian Kleinfeld'],
        ['k' => 'site_logo', 'v' => 'logo.jpg'],
        ['k' => 'hero_image_1', 'v' => 'hero1.webp'],
        ['k' => 'hero_image_2', 'v' => 'hero2.webp'],
        ['k' => 'hero_link', 'v' => '/getstarted'],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)");
    foreach ($settings as $setting) {
        $stmt->execute([$setting['k'], $setting['v']]);
    }
    
    // 2. Migrate socials from user.js
    $socials = [
        ['platform' => 'github', 'url' => 'https://github.com/evilgeniuscreative/', 'icon' => 'faGithub', 'sort_order' => 1],
        ['platform' => 'linkedin', 'url' => 'https://linkedin.com/in/iankleinfeld', 'icon' => 'faLinkedin', 'sort_order' => 2],
        ['platform' => 'stackoverflow', 'url' => 'https://stackoverflow.com/users/1067156/maxrocket', 'icon' => 'faStackOverflow', 'sort_order' => 3],
        ['platform' => 'twitter', 'url' => 'https://twitter.com/evilgeniuscrtv', 'icon' => 'faTwitter', 'sort_order' => 4],
        ['platform' => 'instagram', 'url' => 'https://www.instagram.com/evilgeniuscrtv', 'icon' => 'faInstagram', 'sort_order' => 5],
        ['platform' => 'bluesky', 'url' => 'https://bsky.app/profile/evilgeniuscreative.com', 'icon' => 'faBluesky', 'sort_order' => 6],
        ['platform' => 'email', 'url' => 'mailto:mydesignguy@gmail.com', 'icon' => 'faEnvelope', 'sort_order' => 7],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO socials (platform, url, icon, sort_order, active) VALUES (?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE url = VALUES(url), icon = VALUES(icon), sort_order = VALUES(sort_order)");
    foreach ($socials as $social) {
        $stmt->execute([$social['platform'], $social['url'], $social['icon'], $social['sort_order']]);
    }
    
    // 3. Migrate page content from user.js
    $pages = [
        [
            'slug' => 'homepage',
            'title' => 'Experienced, multifaceted, creative, committed Full Stack and Front-End Developer, Designer, and UX/UI Specialist.',
            'description' => 'I\'m a Full Stack and front end developer, with a long UX/UI/Design history. I have 10+ years of experience who enjoys working with collaborative Agile teams, in an "we all win together" environment, with a deep passion for learning new tech and other modern magic. Serious value added.',
            'content' => '',
        ],
        [
            'slug' => 'about',
            'title' => 'Ian Kleinfeld, Software Developer, Front End Engineer, with a deep UX, UI, and Design background.',
            'description' => 'I can\'t even remember how many projects I\'ve worked on over the years for private clients or companies or just for fun. But I always learn a lot of new skills and I love it. Each project is a chance to learn something new about technology, design, people, business, and more. Over the years, I\'ve learned everything from the most basic HTML and CSS to arcane and nearly archaic languages like Freemarker, to battleship size CMSs like Khoros Community or Adobe AEM, to cutting edge web dev modern stacks like React, and Vue, with or without Typescript.',
            'content' => '',
        ],
        [
            'slug' => 'animations',
            'title' => 'Animations for Rally Software explaining Agile Metrics',
            'description' => 'A series of animations explaining agile metrics for rally software, to give an idea of how each major agile metric is explaining measured and relates to team performance.',
            'content' => '',
        ],
        [
            'slug' => 'articles',
            'title' => 'Articles',
            'description' => 'Chronological collection of my long-form thoughts on programming, leadership, product design, and more.',
            'content' => '',
        ],
        [
            'slug' => 'narration',
            'title' => 'A series of video tutorials on how best to use the community.',
            'description' => 'All of the videos were written, produced, voiced, and created by me, single-handedly. In this case, I used Camtasia. I am also fluent in Adobe Premier, Audition, Adobe Animate, and iMovie.',
            'content' => '',
        ],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO pages (slug, title, description, content, active) VALUES (?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)");
    foreach ($pages as $page) {
        $stmt->execute([$page['slug'], $page['title'], $page['description'], $page['content']]);
    }
    
    // 4. Migrate SEO data from seo.js
    $seo_data = [
        [
            'page' => 'home',
            'meta_title' => 'Ian Kleinfeld - Web Designer & Web Developer | Custom Website Design',
            'meta_description' => 'Ian Kleinfeld - Professional web designer and web developer specializing in website design, full-stack development, UX/UI design, and brand strategy. 10+ years building custom websites and web applications.',
            'meta_keywords' => 'web designer, web developer, website designer, website developer, web design, website design, web development, website development, programmer, full stack developer, front-end developer, UX designer, UI designer, graphic designer, brand strategy, Ian Kleinfeld, Evil Genius Creative',
        ],
        [
            'page' => 'about',
            'meta_title' => 'About Ian Kleinfeld - Web Designer & Developer',
            'meta_description' => 'About Ian Kleinfeld - Experienced web designer, web developer, and UX/UI specialist. Full-stack programmer with 10+ years creating websites, web applications, and digital experiences for brands worldwide.',
            'meta_keywords' => 'web designer, web developer, website designer, programmer, full stack developer, front-end developer, UX designer, UI designer, graphic designer, Ian Kleinfeld, Evil Genius Creative',
        ],
        [
            'page' => 'projects',
            'meta_title' => 'Web Design Portfolio - Ian Kleinfeld',
            'meta_description' => 'Web design and development portfolio showcasing custom websites, web applications, UX/UI design projects, and brand strategy work. View examples of professional website design and programming projects.',
            'meta_keywords' => 'web design portfolio, website design portfolio, web development portfolio, web designer portfolio, website examples, web design projects, website projects, UX design, UI design, programmer portfolio, Ian Kleinfeld',
        ],
        [
            'page' => 'contact',
            'meta_title' => 'Contact Ian Kleinfeld - Web Designer & Developer',
            'meta_description' => 'Contact Ian Kleinfeld for web design, website development, and UX/UI design services. Professional web developer and designer available for custom website projects, web applications, and brand strategy consulting.',
            'meta_keywords' => 'contact web designer, hire web developer, website designer contact, web design services, website development services, custom website design, web developer for hire, UX designer, UI designer, Ian Kleinfeld, Evil Genius Creative',
        ],
        [
            'page' => 'getstarted',
            'meta_title' => 'Get Started - Free Consultation | Ian Kleinfeld',
            'meta_description' => 'Get started with a free, no-obligation consultation or quote today.',
            'meta_keywords' => 'Web design, Web development, Website design, Website development, Website, Web designer, Web developer, Web company, Build website, Get started, Consultation, Website Quote, Ian Kleinfeld',
        ],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO seo_meta (page, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE meta_title = VALUES(meta_title), meta_description = VALUES(meta_description), meta_keywords = VALUES(meta_keywords)");
    foreach ($seo_data as $seo) {
        $stmt->execute([$seo['page'], $seo['meta_title'], $seo['meta_description'], $seo['meta_keywords']]);
    }
    
    // Mark as migrated
    $pdo->prepare("INSERT INTO settings (k, v) VALUES ('data_migrated', ?)")->execute([date('Y-m-d H:i:s')]);
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Data migration completed successfully',
        'migrated' => [
            'settings' => count($settings),
            'socials' => count($socials),
            'pages' => count($pages),
            'seo_meta' => count($seo_data),
        ]
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Migration failed: ' . $e->getMessage()]);
}
