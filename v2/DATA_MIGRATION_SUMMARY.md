# Data Migration Implementation Summary

## ✅ Completed Work

### 1. Database Schema Updates
**File**: `/v2/api/schema.sql`

Added new `seo_meta` table:
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
```

### 2. New API Endpoints Created

#### `/v2/api/settings.php`
- **GET** `/api/settings.php` - Get all settings
- **GET** `/api/settings.php?key=site_name` - Get specific setting
- **PUT** `/api/settings.php` - Update a setting (auth required)

#### `/v2/api/seo.php`
- **GET** `/api/seo.php` - Get all SEO metadata
- **GET** `/api/seo.php?page=home` - Get SEO for specific page
- **POST** `/api/seo.php` - Create SEO metadata (auth required)
- **PUT** `/api/seo.php` - Update SEO metadata (auth required)
- **DELETE** `/api/seo.php?id=1` - Delete SEO metadata (auth required)

#### `/v2/api/pages.php`
- **GET** `/api/pages.php` - Get all pages
- **GET** `/api/pages.php?slug=homepage` - Get specific page
- **POST** `/api/pages.php` - Create page (auth required)
- **PUT** `/api/pages.php` - Update page (auth required)
- **DELETE** `/api/pages.php?id=1` - Delete page (auth required)

### 3. Migration Script
**File**: `/v2/api/migrate_data.php`

Migrates data from static JS files to database:
- Site settings (logo, hero images, etc.) → `settings` table
- Social media links → `socials` table
- Page content (homepage, about, etc.) → `pages` table
- SEO metadata → `seo_meta` table

### 4. New Admin UI Pages

#### `/v2/src/admin/pages/SettingsPage.jsx`
- Displays all site settings in a clean grid layout
- Inline editing for each setting
- Real-time updates via API
- Success/error messaging

#### `/v2/src/admin/pages/SeoPage.jsx`
- Full CRUD interface for SEO metadata
- Uses existing CrudPage component
- Manages meta titles, descriptions, keywords, and OG tags

### 5. Admin Routes Updated
**File**: `/v2/src/admin/AdminRoutes.jsx`

Added routes:
- `/admin/settings` → SettingsPage
- `/admin/seo` → SeoPage

### 6. Dashboard Updated
**File**: `/v2/src/admin/Dashboard.jsx`

Now displays counts/links for:
- Projects
- Articles
- Animations
- Narration
- Pages
- Socials
- Settings (⚙️ icon)
- SEO (🔍 icon)

### 7. CSS Styles Added
**File**: `/v2/src/admin/admin.css`

Added comprehensive styles for:
- Settings page layout
- Inline editing controls
- Success/error messages
- Loading states
- Buttons and form controls

## 📋 Data Structure Mapping

### From `user.js`:
```javascript
INFO.main → settings table
  - title → site_title
  - name → site_name
  - logo → site_logo
  - hero1 → hero_image_1
  - hero2 → hero_image_2
  - herolink → hero_link

INFO.socials → socials table
  - github, linkedin, etc. → platform, url, icon

INFO.homepage → pages table (slug: 'homepage')
INFO.about → pages table (slug: 'about')
INFO.animations → pages table (slug: 'animations')
INFO.articles → pages table (slug: 'articles')
INFO.narration_videos → pages table (slug: 'narration')
```

### From `seo.js`:
```javascript
SEO array → seo_meta table
  - page → page
  - description → meta_description
  - keywords (array) → meta_keywords (comma-separated)
```

## 🚀 Next Steps (To Be Completed)

### Step 1: Run Migration
```bash
cd /Users/iankleinfeld/Documents/Web/egc_portfolio/v2/api
php migrate_data.php
```

Expected output:
```json
{
  "success": true,
  "message": "Data migration completed successfully",
  "migrated": {
    "settings": 6,
    "socials": 7,
    "pages": 5,
    "seo_meta": 5
  }
}
```

### Step 2: Update Public Pages to Use API

The following pages need to be updated to fetch from API instead of importing static JS:

#### Homepage.jsx
```javascript
// OLD:
import INFO from "../data/user";

// NEW:
const [pageData, setPageData] = useState(null);
const [settings, setSettings] = useState(null);

useEffect(() => {
  fetch('/api/pages.php?slug=homepage')
    .then(r => r.json())
    .then(data => setPageData(data.data));
  
  fetch('/api/settings.php')
    .then(r => r.json())
    .then(data => setSettings(data.data));
}, []);
```

#### About.jsx, Projects.jsx, etc.
Similar pattern - fetch page content from `/api/pages.php?slug={page}`

#### SEO Component
Create a new `<SEO>` component that fetches from `/api/seo.php?page={page}` and applies meta tags dynamically using `react-helmet`.

### Step 3: Test Admin Interfaces

Visit and test:
1. http://localhost:3000/admin/settings - Edit site settings
2. http://localhost:3000/admin/seo - Manage SEO metadata
3. http://localhost:3000/admin/pages - View all pages
4. http://localhost:3000/admin/socials - Manage social links

### Step 4: Verify Public Pages

After updating public pages to use API:
1. Check homepage displays correct content
2. Verify SEO meta tags in page source
3. Test social links
4. Confirm hero images load correctly

## 📁 Files Created/Modified

### Created:
- `/v2/api/migrate_data.php`
- `/v2/api/settings.php`
- `/v2/api/seo.php`
- `/v2/api/pages.php`
- `/v2/src/admin/pages/SettingsPage.jsx`
- `/v2/src/admin/pages/SeoPage.jsx`
- `/v2/MIGRATION_GUIDE.md`
- `/v2/DATA_MIGRATION_SUMMARY.md`

### Modified:
- `/v2/api/schema.sql` - Added seo_meta table
- `/v2/src/admin/AdminRoutes.jsx` - Added settings and SEO routes
- `/v2/src/admin/Dashboard.jsx` - Added new data type counts
- `/v2/src/admin/admin.css` - Added styles for new pages
- `/v2/src/data/seo.js` - Improved SEO keywords (already done earlier)
- `/v2/public/index.html` - Enhanced SEO meta tags (already done earlier)

## 🎯 Benefits

1. **Centralized Data Management**: All content in database, editable via admin UI
2. **No Code Changes for Content**: Update text, links, SEO without touching code
3. **Better SEO Control**: Dedicated interface for managing meta tags per page
4. **Scalability**: Easy to add new pages, settings, or content types
5. **Version Control**: Database changes tracked, no JS file commits for content
6. **Multi-user Ready**: Multiple admins can manage content simultaneously

## ⚠️ Important Notes

- The migration script checks for `data_migrated` setting to prevent duplicate runs
- To re-run migration: `DELETE FROM settings WHERE k = 'data_migrated';`
- All API endpoints require authentication except GET requests
- Static JS files (`user.js`, `seo.js`) can be deprecated after migration
- Consider adding a "Revert to Static" option if needed during transition
