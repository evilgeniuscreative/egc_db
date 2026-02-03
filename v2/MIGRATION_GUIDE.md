# Data Migration Guide

## Overview
This guide will help you migrate data from static JS files (`/data/*.js`) to the database and configure the admin CRUD interfaces.

## Step 1: Create the SEO Meta Table

Run this SQL in your database:

```sql
CREATE TABLE IF NOT EXISTS seo_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(50) NOT NULL UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_seo_page ON seo_meta(page);
```

## Step 2: Run the Migration Script

Navigate to the API directory and run:

```bash
cd /Users/iankleinfeld/Documents/Web/egc_portfolio/v2/api
php migrate_data.php
```

This will populate:
- **settings** table with site configuration (logo, hero images, etc.)
- **socials** table with social media links
- **pages** table with page content (homepage, about, etc.)
- **seo_meta** table with SEO metadata for each page

## Step 3: Access Admin Interfaces

After migration, you can manage all data through the admin panel:

- **Settings**: http://localhost:3000/admin/settings
- **SEO Metadata**: http://localhost:3000/admin/seo
- **Pages**: http://localhost:3000/admin/pages
- **Socials**: http://localhost:3000/admin/socials
- **Projects**: http://localhost:3000/admin/projects
- **Articles**: http://localhost:3000/admin/articles
- **Animations**: http://localhost:3000/admin/animations
- **Narration**: http://localhost:3000/admin/narration

## Step 4: Update Public Pages to Use API

After migration, the public pages need to be updated to fetch data from the API instead of importing static JS files. This is the next step.

## What Was Created

### New API Endpoints:
1. `/api/settings.php` - Manage site settings (GET, PUT)
2. `/api/seo.php` - Manage SEO metadata (GET, POST, PUT, DELETE)
3. `/api/pages.php` - Manage page content (GET, POST, PUT, DELETE)

### New Admin Pages:
1. `SettingsPage.jsx` - Edit site settings with inline editing
2. `SeoPage.jsx` - Full CRUD for SEO metadata
3. Updated `AdminRoutes.jsx` to include new routes
4. Updated `Dashboard.jsx` to show all data types

## Troubleshooting

If migration fails:
1. Check database connection in `/api/config.php`
2. Ensure database user has CREATE/INSERT permissions
3. Check PHP error logs
4. To re-run migration, delete the `data_migrated` setting from the database:
   ```sql
   DELETE FROM settings WHERE k = 'data_migrated';
   ```

## Next Steps

After successful migration:
1. Update public pages to fetch from API
2. Test all admin CRUD interfaces
3. Verify SEO metadata is being applied to pages
4. Remove or deprecate static JS data files
