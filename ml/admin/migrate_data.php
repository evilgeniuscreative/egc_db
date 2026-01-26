<?php
/**
 * Data Migration Script
 * Migrates data from JS files to MySQL database
 * Run once after setup.php
 * DELETE THIS FILE AFTER MIGRATION IN PRODUCTION
 */

require_once __DIR__ . '/config.php';

// Only allow from localhost or with secret key
$allowSetup = (
    in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ||
    ($_GET['key'] ?? '') === 'egc_setup_2024_secret'
);

if (!$allowSetup) {
    die('Access denied. Add ?key=egc_setup_2024_secret to URL');
}

header('Content-Type: text/html; charset=utf-8');

echo "<h1>EGC Data Migration</h1>";
echo "<pre>";

$db = getDB();

// ============================================
// SITE SETTINGS (from INFO.main)
// ============================================
$siteSettings = [
    ['site_title', 'Ian Kleinfeld, Software Developer, Front End Engineer, with a deep UX, UI, and Design background', 'main'],
    ['site_name', 'Ian Kleinfeld', 'main'],
    ['site_logo', 'logo.jpg', 'main'],
    ['hero1', 'hero1.webp', 'main'],
    ['hero2', 'hero2.webp', 'main'],
    ['hero_link', '/getstarted', 'main'],
    ['email', 'ian@evilgeniuscreative.com', 'main'],
];

echo "\n<strong>Migrating Site Settings...</strong>\n";
$stmt = $db->prepare('INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
foreach ($siteSettings as $setting) {
    $stmt->execute($setting);
    echo "✓ {$setting[0]}\n";
}

// ============================================
// SOCIAL LINKS (from INFO.socials)
// ============================================
$socials = [
    ['github', 'https://github.com/evilgeniuscreative/', 'faGithub', 1],
    ['linkedin', 'https://linkedin.com/in/iankleinfeld', 'faLinkedin', 2],
    ['stackoverflow', 'https://stackoverflow.com/users/1067156/maxrocket', 'faStackOverflow', 3],
    ['twitter', 'https://twitter.com/evilgeniuscrtv', 'faTwitter', 4],
    ['instagram', 'https://www.instagram.com/evilgeniuscrtv', 'faInstagram', 5],
    ['bluesky', 'https://bsky.app/profile/evilgeniuscreative.com', 'bluesky', 6],
];

echo "\n<strong>Migrating Social Links...</strong>\n";
$stmt = $db->prepare('INSERT INTO social_links (platform, url, icon, sort_order, is_active) VALUES (?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE url = VALUES(url)');
foreach ($socials as $social) {
    $stmt->execute($social);
    echo "✓ {$social[0]}\n";
}

// ============================================
// PAGE CONTENT
// ============================================
$pages = [
    [
        'homepage',
        'Experienced, multifaceted, creative, committed Full Stack and Front-End Developer, Designer, and UX/UI Specialist.',
        'I\'m a Full Stack and front end developer, with a long UX/UI/Design history. I have 10+ years of experience who enjoys working with collaborative Agile teams, in an "we all win together" environment, with a deep passion for learning new tech and other modern magic. Serious value added.',
        '',
        'Ian Kleinfeld - Full Stack Developer',
        'Full Stack and Front End Developer with UX/UI/Design expertise. 10+ years experience in collaborative Agile teams.',
        'full stack developer, front end developer, UX designer, UI designer, React developer',
        1
    ],
    [
        'about',
        'About Ian Kleinfeld',
        'I\'m a Full Stack and Front End Developer with a long UX/UI/Design history.',
        '',
        'About - Ian Kleinfeld',
        'Learn about Ian Kleinfeld, a Full Stack Developer with extensive UX/UI design background.',
        'about, developer, designer, UX, UI',
        2
    ],
    [
        'projects',
        'Projects',
        'A collection of my work across web development, design, and more.',
        '',
        'Projects - Ian Kleinfeld',
        'Portfolio of web development and design projects by Ian Kleinfeld.',
        'portfolio, projects, web development, design',
        3
    ],
    [
        'designs',
        'Designs',
        'Print and digital design work.',
        '',
        'Designs - Ian Kleinfeld',
        'Print and digital design portfolio by Ian Kleinfeld.',
        'designs, print design, digital design, graphic design',
        4
    ],
    [
        'articles',
        'Articles',
        'Thoughts and writings on technology, development, and design.',
        '',
        'Articles - Ian Kleinfeld',
        'Articles and blog posts by Ian Kleinfeld on technology and development.',
        'articles, blog, technology, development',
        5
    ],
    [
        'animation',
        'Animation',
        'Animation and motion graphics work.',
        '',
        'Animation - Ian Kleinfeld',
        'Animation and motion graphics portfolio by Ian Kleinfeld.',
        'animation, motion graphics, video',
        6
    ],
    [
        'contact',
        'Contact',
        'Get in touch for project inquiries.',
        '',
        'Contact - Ian Kleinfeld',
        'Contact Ian Kleinfeld for web development and design projects.',
        'contact, hire, freelance, developer',
        7
    ],
    [
        'getstarted',
        'Get Started',
        'Ready to start your project? Let\'s talk.',
        '',
        'Get Started - Ian Kleinfeld',
        'Start your web development or design project with Ian Kleinfeld.',
        'get started, quote, project, hire',
        8
    ],
];

echo "\n<strong>Migrating Page Content...</strong>\n";
$stmt = $db->prepare('INSERT INTO page_content (page_slug, title, description, content, meta_title, meta_description, meta_keywords, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE title = VALUES(title)');
foreach ($pages as $page) {
    $stmt->execute($page);
    echo "✓ {$page[0]}\n";
}

// ============================================
// PROJECTS (from INFO.projects)
// ============================================
$projects = [
    ['Jeep Wrangler', 'web', 'jeep.jpg', 'Jeep Wrangler website with interactive features and responsive design.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.jeep.com/wrangler.html', 1],
    ['Jeep Gladiator', 'web', 'gladiator.jpg', 'Jeep Gladiator product page with dynamic content.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.jeep.com/gladiator.html', 2],
    ['Jeep Grand Cherokee', 'web', 'grandcherokee.jpg', 'Jeep Grand Cherokee website with premium design.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.jeep.com/grand-cherokee.html', 3],
    ['Chrysler Pacifica', 'web', 'pacifica.jpg', 'Chrysler Pacifica product showcase.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.chrysler.com/pacifica.html', 4],
    ['Ram 1500', 'web', 'ram1500.jpg', 'Ram 1500 truck website with configurator.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.ramtrucks.com/ram-1500.html', 5],
    ['Alfa Romeo Giulia', 'web', 'giulia.jpg', 'Alfa Romeo Giulia luxury car website.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.alfaromeousa.com/giulia', 6],
    ['Alfa Romeo Stelvio', 'web', 'stelvio.jpg', 'Alfa Romeo Stelvio SUV website.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.alfaromeousa.com/stelvio', 7],
    ['Dodge Charger', 'web', 'charger.jpg', 'Dodge Charger muscle car website.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.dodge.com/charger.html', 8],
    ['Dodge Challenger', 'web', 'challenger.jpg', 'Dodge Challenger iconic muscle car site.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.dodge.com/challenger.html', 9],
    ['Fiat 500', 'web', 'fiat500.jpg', 'Fiat 500 compact car website.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.fiatusa.com/500.html', 10],
    ['Maserati Ghibli', 'web', 'ghibli.jpg', 'Maserati Ghibli luxury sedan website.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.maserati.com/us/en/models/ghibli', 11],
    ['Maserati Levante', 'web', 'levante.jpg', 'Maserati Levante luxury SUV website.', 'React, JavaScript, CSS', 'Visit Site', 'https://www.maserati.com/us/en/models/levante', 12],
];

echo "\n<strong>Migrating Projects (sample - full migration needs JS parsing)...</strong>\n";
$stmt = $db->prepare('INSERT INTO projects (title, type, thumb, description, logos, link_text, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');

// Check if projects table is empty before inserting
$count = $db->query('SELECT COUNT(*) FROM projects')->fetchColumn();
if ($count == 0) {
    foreach ($projects as $project) {
        $stmt->execute($project);
        echo "✓ {$project[0]}\n";
    }
} else {
    echo "⚠ Projects table already has data, skipping sample data\n";
}

// ============================================
// ANIMATIONS (from INFO.animation)
// ============================================
$animations = [
    ['Animated Logo Intro', 'Logo animation with particle effects', 'https://www.youtube.com/embed/example1', 'anim1.jpg', 1],
    ['Product Showcase', 'Product reveal animation', 'https://www.youtube.com/embed/example2', 'anim2.jpg', 2],
    ['Explainer Video', 'Animated explainer for tech product', 'https://www.youtube.com/embed/example3', 'anim3.jpg', 3],
];

echo "\n<strong>Migrating Animations (sample)...</strong>\n";
$stmt = $db->prepare('INSERT INTO animations (title, description, video_url, thumb, sort_order, is_active) VALUES (?, ?, ?, ?, ?, 1)');

$count = $db->query('SELECT COUNT(*) FROM animations')->fetchColumn();
if ($count == 0) {
    foreach ($animations as $anim) {
        $stmt->execute($anim);
        echo "✓ {$anim[0]}\n";
    }
} else {
    echo "⚠ Animations table already has data, skipping sample data\n";
}

// ============================================
// SEO SETTINGS
// ============================================
$seoSettings = [
    ['home', 'Ian Kleinfeld - Full Stack Developer & Designer', 'Full Stack and Front End Developer with UX/UI/Design expertise. 10+ years experience.', 'full stack developer, front end developer, UX designer, React developer, JavaScript', '/og-madman.jpg'],
    ['about', 'About Ian Kleinfeld - Developer & Designer', 'Learn about Ian Kleinfeld, a Full Stack Developer with extensive design background.', 'about, developer, designer, portfolio', '/og-madman.jpg'],
    ['projects', 'Projects - Ian Kleinfeld Portfolio', 'Web development and design projects by Ian Kleinfeld.', 'portfolio, projects, web development', '/og-madman.jpg'],
    ['articles', 'Articles - Ian Kleinfeld', 'Articles on technology, development, and design.', 'articles, blog, technology', '/og-madman.jpg'],
    ['contact', 'Contact Ian Kleinfeld', 'Get in touch for project inquiries.', 'contact, hire, freelance', '/og-madman.jpg'],
];

echo "\n<strong>Migrating SEO Settings...</strong>\n";
$stmt = $db->prepare('INSERT INTO seo_settings (page_slug, title, description, keywords, og_image) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title)');
foreach ($seoSettings as $seo) {
    $stmt->execute($seo);
    echo "✓ {$seo[0]}\n";
}

echo "\n<strong>Migration complete!</strong>\n";
echo "\n⚠️ This script inserted SAMPLE data for projects/animations.\n";
echo "⚠️ For full migration, you'll need to manually import from the JS files or use the admin panel.\n";
echo "⚠️ DELETE THIS FILE (migrate_data.php) IN PRODUCTION!\n";

echo "</pre>";
