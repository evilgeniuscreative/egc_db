# EGC Portfolio v2

Optimized React app with PHP/MySQL backend and admin panel.

## Structure

```
v2/
├── api/                    # PHP backend
│   ├── config.php         # DB config, JWT, helpers
│   ├── schema.sql         # Database schema
│   ├── setup.php          # Run once to create tables
│   ├── auth.php           # Login/verify endpoint
│   ├── crud.php           # Generic CRUD for all tables
│   └── .htaccess          # Protect config files
├── src/
│   ├── admin/             # Admin panel components
│   ├── components/        # Reusable components
│   ├── pages/             # Public pages
│   ├── context/           # AuthContext
│   ├── hooks/             # useApi hook
│   └── styles/            # CSS
└── public/                # Static assets
```

## Database

- **Name**: `evilgeo2_egc`
- **User**: `evilgeo2_iana`
- **Tables**: projects, articles, animations, narration, socials, pages, settings, admin_users

## Setup Steps

1. Upload `/v2/api/` to server
2. Visit `/v2/api/setup.php?key=egc_setup_2024`
3. Delete `setup.php` after success
4. Admin login: `ian` / `aB26354!`

## API Endpoints

- `POST /v2/api/auth.php` - Login
- `GET /v2/api/auth.php` - Verify token
- `GET /v2/api/crud.php?t=projects` - List all projects
- `GET /v2/api/crud.php?t=projects&id=1` - Get one project
- `POST /v2/api/crud.php?t=projects` - Create (auth required)
- `PUT /v2/api/crud.php?t=projects&id=1` - Update (auth required)
- `DELETE /v2/api/crud.php?t=projects&id=1` - Delete (auth required)

Replace `projects` with: articles, animations, narration, socials, pages, settings

## Admin Routes

- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/projects` - Manage projects
- `/admin/articles` - Manage articles
- `/admin/animations` - Manage animations
- `/admin/narration` - Manage narration videos
- `/admin/socials` - Manage social links
- `/admin/pages` - Manage page content
- `/admin/settings` - Site settings

## SEO Features (To Be Implemented)

- react-snap for prerendering
- JSON-LD structured data
- sitemap.xml generation
- robots.txt
- Optimized meta tags per page

## Status

✅ PHP API backend complete
✅ Database schema complete
✅ Auth system complete
⏳ React admin UI in progress
⏳ Public pages to be migrated
⏳ SEO optimizations pending
