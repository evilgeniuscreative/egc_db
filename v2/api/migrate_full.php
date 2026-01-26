<?php
/**
 * Complete Data Migration from user.js and articles.js
 * Run: php api/migrate_full.php
 */

require_once __DIR__ . '/config.php';

echo "Starting FULL data migration...\n\n";

try {
    $pdo = db();
    
    // Don't clear - we'll check for duplicates instead
    echo "Checking existing data...\n";
    $existingProjects = $pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn();
    $existingArticles = $pdo->query('SELECT COUNT(*) FROM articles')->fetchColumn();
    $existingAnimations = $pdo->query('SELECT COUNT(*) FROM animations')->fetchColumn();
    echo "Current: $existingProjects projects, $existingArticles articles, $existingAnimations animations\n\n";
    
    // Helper function to extract logos as comma-separated string
    function extractLogos($logos) {
        $names = [];
        foreach ($logos as $logo) {
            $names[] = $logo['software'];
        }
        return implode(',', $names);
    }
    
    // ALL 31 PROJECTS from user.js
    $projects = [
        ['City Lights', 'web', 'images/thumb-city-lights.jpg', 'NOTE: DESKTOP ONLY. Exploring CSS and Javascript animation with an interactive day-to-night web app.', 'HTML5,JavaScript,CSS3', 'View Project', 'https://evilgeniuscreative.com/city_lights/', 1],
        ['Agile Metrics Explanation Animations', 'animation', 'images/thumb-animation.jpg', 'Animated introductions explaining the basics of multiple Agile Metrics for Rally Software.', 'Edge Animate', 'View Project', '/animation', 2],
        ['Intuit Turbotax Out-of-Product-Help Community', 'web', 'images/thumb-intuit.jpg', 'Enhancing the Intuit Khoros Community with React, GraphQL, A/B/C/D testing, Splunk queries.', 'Khoros,React,Splunk,GraphQL,Freemarker,jQuery,JSON,SCSS,API', 'View Project', 'https://ttlc.intuit.com/community/lower-your-debt/discussion/how-or-what-can-i-do-to-lower-my-debts/00/1882396', 3],
        ['Vue vs Google Maps using NCDOT data', 'web', 'images/thumb-ncdot.jpg', 'Project pulling data from NC DOT open APIs showing traffic and construction incidents via Google Maps.', 'Vue,HTML,SCSS,API', 'View Project', 'https://evilgeniuscreative.com/demo_ncdot/', 4],
        ['Voice Actor demo site', 'web', 'images/thumb-vobi.png', 'Voice Acting site built in React 19 + Typescript with Waveform audio player.', 'React,HTML5,SCSS,Javascript', 'View Project', 'https://voiceoverbyian.com', 5],
        ['Fidelity Net Benefits Homepage', 'web', 'images/thumb-fidelity.jpg', 'Fidelity net benefits designs and markups in JavaScript, jQuery, Backbone.js, and SCSS.', 'HTML5,SCSS,Javascript,API', 'View Site demo', 'https://evilgeniuscreative.com/Fidelity/', 6],
        ['Cisco OAuth Registry', 'web', 'images/thumb-coar.jpg', 'Working mockup for Cisco OAuth Registry built in Angular 1.x with Typescript.', 'AngularJS,Typescript,Less,API', 'View Example', 'https://evilgeniuscreative.com/portfolio/COAR/index.php', 7],
        ['EA Answers Community Mega Menu', 'web', 'images/thumb-ea.jpg', 'Complex "All Boards" mega menu with data from site structure, JSON, and Freemarker algorithms.', 'Khoros,Freemarker,jQuery,JSON,SCSS,API', 'View Screenshot', 'showimage/EA', 8],
        ['Best Diners in Town: Atlanta', 'print', 'images/thumb-bdit.jpg', 'Magazine introducing Atlanta Restaurants. Designed entire magazine.', 'Adobe InDesign', 'View Magazine', 'http://evilgeniuscreative.com/portfolio/pdf/bdit.php', 9],
        ['Coffee Price Report', 'print', 'images/thumb-coffee-report.jpg', 'Coffee Futures report for investors based on weather and farming data.', 'Adobe InDesign', 'View Report', 'http://evilgeniuscreative.com/portfolio/pdf/coffee.php', 10],
        ['JMP User Community', 'web', 'images/thumb-jmpcom.jpg', 'Custom React component allowing users to sort articles by up to six different labels.', 'Khoros,React,Vue,Angular,Typescript,Freemarker,Javascript,jQuery,API', 'View Site', 'https://community.jmp.com', 11],
        ['Roku Community Homepage Tiles', 'web', 'images/thumb-roku.jpg', 'New icon designs and functionality for Roku community homepage navigation tiles.', 'Khoros,Freemarker,SCSS', 'View Site', 'https://community.roku.com', 12],
        ['The Future of Farming Poster', 'print', 'images/thumb-farming.jpg', 'Poster for aWhere conference in Nairobi on Farming Tech (2015).', 'Adobe InDesign', 'View Poster', 'showimage/FARMING', 13],
        ['Brunswick Boating Communities', 'web', 'images/thumb-brunswick.jpg', 'Four Khoros Communities for Brunswick: Sea Ray Boats, Mercury Racing, Boston Whaler, and Ripl.', 'Khoros,Freemarker,SCSS', 'View Site', 'https://community.brunswick.com/', 14],
        ['Weather and crop cycle infographic', 'print', 'images/thumb-awhere-cycle.jpg', 'Infographic depicting farm planning and weather products (2015).', 'Adobe Illustrator', 'View Poster', 'showimage/FARMPLAN', 15],
        ['Donut Arc Chart', 'web', 'images/thumb-grannyarc.png', 'Simple donut chart showing the number of cats per grandmother.', 'D3.js,HTML5', 'View Chart', 'https://evilgeniuscreative.com/portfolio/d3ex/grannies.html', 16],
        ['Macmillan Communities redesign', 'web', 'images/thumb-mcmillan.jpg', 'Custom menu slide-out wrapping entire page, populated by site structure and JSON.', 'Khoros,Freemarker,SCSS,Javascript', 'View Site', 'https://community.macmillanlearning.com/t5/macmillan-community/ct-p/college', 17],
        ['Sephora Community custom emails', 'web', 'images/thumb-sephora.jpg', 'Customized all Velocity-based Sephora Khoros Community emails.', 'Khoros,Velocity,Freemarker,SCSS', 'View Site', 'https://community.sephora.com', 18],
        ['Verizon Community custom menu', 'web', 'images/thumb-verizon.jpg', 'Custom JavaScript and HTML menu in Verizon Khoros Community.', 'Khoros,HTML5,Javascript', 'View Site', 'https://community.verizon.com', 19],
        ['Splunk Community customization', 'web', 'images/thumb-splunk.jpg', 'Modified user profile to show customized content lists based on preferences.', 'Khoros,Javascript,HTML5,API', 'View Site', 'https://community.splunk.com', 20],
        ['Invoca customized sign in process', 'web', 'images/thumb-invoca.jpg', 'Customized sign in allowing users to register and sign in in one step.', 'Khoros,Javascript,Freemarker', 'View Site', 'https://community.invoca.com', 21],
        ['Zoom homepage tiles display', 'web', 'images/thumb-zoom.jpg', 'Customized JSON-fed tile display for homepage.', 'Khoros,Javascript,Freemarker,SCSS', 'View Site', 'https://community.zoom.com', 22],
        ['Salesforce integration', 'web', 'images/thumb-sisense.jpg', 'Integrated Salesforce ticket tracking system into Sisense Community.', 'Khoros,Salesforce,Javascript,XML', 'View Site', 'https://community.sisense.com', 23],
        ['JAMF Community consulting', 'web', 'images/thumb-jamf.jpg', 'Two months of tutorials with JAMF staff on Community customization.', 'Khoros,HTML5,Freemarker,SCSS', 'View Site', 'https://community.jamf.com', 24],
        ['ESP Nutrition e-Commerce Site', 'web', 'images/thumb-ESP.png', 'Nutritional supplement e-commerce site in WordPress with custom plugins (2011).', 'Wordpress,PHP', 'View Screenshot', 'showimage/ESP', 25],
        ['Xactly Community customizations', 'web', 'images/thumb-xactly.jpg', 'Advanced sign in process, automated data filling, improved event management.', 'Khoros,Freemarker,Javascript', 'View Site', 'https://community.xactlycorp.com', 26],
        ['aWhere: Weather app and Style Guide', 'web', 'images/thumb-awhere-weather-app.jpg', 'Weather app from Angular and D3.js for farmers in developing countries (2015).', 'AngularJS,D3js,SCSS,HTML5,API', 'View Screenshot', 'showimage/WEATHERAPP', 27],
        ['JMP.com AEM site work', 'web', 'images/thumb-jmp.jpg', 'Created pages, forms, and customizations in JMP AEM company site.', 'AEM,Less,Javascript,API', 'View Site', 'https://jmp.com', 28],
        ['AEM Discovery Summit site', 'web', 'images/thumb-jds.jpg', 'Created original Discovery Summit site in AEM.', 'AEM,Less,Javascript', 'View Site', 'https://discoverysummit.jmp', 29],
        ['Capital Broadcasting Company', 'web', 'images/thumb-cbc.jpg', 'Design for CBC Raleigh site renewal (2014).', 'HTML,SASS,Javascript', 'View Screenshot', 'showimage/CBC', 30],
        ['Danser Guitar Works', 'web', 'images/thumb-danser.jpg', 'Guitar-shaped WordPress theme for custom luthier (2014).', 'Wordpress,SASS,Javascript,PHP', 'View Screenshot', 'showimage/DANSER', 31],
        ['Los Olivos Online Store', 'web', 'images/thumb-los-olivos.jpg', 'Raw foods online shopping site with WordPress Shopp plugin (2013).', 'Wordpress,PHP', 'View Screenshot', 'showimage/LOSOLIVOS', 32],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO projects (title, type, thumb, description, logos, link_text, link_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');
    $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM projects WHERE title = ?');
    $inserted = 0;
    foreach ($projects as $p) {
        $checkStmt->execute([$p[0]]);
        if ($checkStmt->fetchColumn() == 0) {
            $stmt->execute($p);
            $inserted++;
        }
    }
    echo "✓ Inserted $inserted new projects (skipped " . (count($projects) - $inserted) . " existing)\n";
    
    // 7 ANIMATIONS from user.js
    $animations = [
        ['Percentiles', 'What Percentiles are and how they relate to Agile Metrics', 'https://evilgeniuscreative.com/portfolio/PERCENTILES/percentiles.html', 'images/thumb-percentiles.png', 1],
        ['Polar Charts', 'What are polar charts and how can we use them in Agile Metrics?', 'https://evilgeniuscreative.com/portfolio/POLAR/polar.html', 'images/thumb-polar.png', 2],
        ['Predictability', 'What part does Predictability have in Agile Metrics', 'https://evilgeniuscreative.com/portfolio/PREDICTABILITY/predictability.html', 'images/thumb-predictability.png', 3],
        ['Productivity', 'How do we best track Productivity in Agile Metrics?', 'https://evilgeniuscreative.com/portfolio/PRODUCTIVITY/productivity.html', 'images/thumb-productivity.png', 4],
        ['Quality', 'What does Quality mean in the context of Agile Metrics', 'https://evilgeniuscreative.com/portfolio/QUALITY/quality.html', 'images/thumb-quality.png', 5],
        ['Responsiveness', 'What is Responsiveness in Agile Metrics and why we should track it', 'https://evilgeniuscreative.com/portfolio/RESPONSIVENESS/responsiveness.html', 'images/thumb-responsiveness.png', 6],
        ['Overall', 'All metrics displayed as a group for bigger overview of team performance', 'https://evilgeniuscreative.com/portfolio/OVERALL/overall.html', 'images/thumb-overall.png', 7],
    ];
    
    $stmt = $pdo->prepare('INSERT INTO animations (title, description, video_url, thumb, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)');
    $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM animations WHERE title = ?');
    $inserted = 0;
    foreach ($animations as $a) {
        $checkStmt->execute([$a[0]]);
        if ($checkStmt->fetchColumn() == 0) {
            $stmt->execute($a);
            $inserted++;
        }
    }
    echo "✓ Inserted $inserted new animations (skipped " . (count($animations) - $inserted) . " existing)\n";
    
    // 2 ARTICLES from articles.js
    $articles = [
        [
            'open-letter-to-youtube-google-and-vimeo',
            'An Open Letter to Mr. Tim Cook, Mr. Sundar Pichai, and Mr. Philip D. Moyer',
            'YouTube and Google have for decades been intransigent about creating effective child safety features, creating dangerous gaps that expose children to inappropriate content while maximizing advertising revenue.',
            '<p>YouTube and Google have for decades been intransigent about creating effective child safety features, creating dangerous gaps that expose children to inappropriate content while maximizing advertising revenue through forced content exposure.</p><p>They have repeatedly refused to allow blocking of channels and keywords in adult accounts simply to force people to see what they don\'t want to and therefore make more advertising money—at the expense of children\'s psychological safety.</p>',
            'YouTubeOpenLetterChildSafety.jpg',
            'YouTube child safety concerns',
            'Google child safety,YouTube child safety,Vimeo child safety,YouTube greed',
            '',
            1,
            '2025-08-22'
        ],
        [
            'nano-command-for-mac-os',
            'NANO Command for MAC OS and Keyboards / NANO Keyboard shortcuts',
            'Complete guide to NANO text editor keyboard shortcuts for Mac OS.',
            '<p>A comprehensive guide to using the NANO text editor on Mac OS, including all keyboard shortcuts and commands.</p><p>NANO is a simple, user-friendly text editor that comes pre-installed on most Unix-based systems including Mac OS.</p>',
            'nano-keyboard.jpg',
            'NANO editor keyboard shortcuts',
            'NANO,Mac OS,keyboard shortcuts,text editor,terminal',
            '',
            1,
            '2025-01-15'
        ]
    ];
    
    $stmt = $pdo->prepare('INSERT INTO articles (slug, title, description, body, image, image_alt, keywords, custom_css, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM articles WHERE slug = ?');
    $inserted = 0;
    foreach ($articles as $a) {
        $checkStmt->execute([$a[0]]);
        if ($checkStmt->fetchColumn() == 0) {
            $stmt->execute($a);
            $inserted++;
        }
    }
    echo "✓ Inserted $inserted new articles (skipped " . (count($articles) - $inserted) . " existing)\n";
    
    echo "\n✅ FULL Migration complete!\n";
    echo "Total items: " . (count($projects) + count($animations) + count($articles)) . "\n";
    echo "\nProjects: " . count($projects) . "\n";
    echo "Animations: " . count($animations) . "\n";
    echo "Articles: " . count($articles) . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
