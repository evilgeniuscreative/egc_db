// Run after build to generate sitemap.xml
const fs = require("fs");
const path = require("path");

const baseUrl = "https://evilgeniuscreative.com";
const routes = [
	{ path: "/", priority: "1.0", changefreq: "weekly" },
	{ path: "/about", priority: "0.8", changefreq: "monthly" },
	{ path: "/projects", priority: "0.9", changefreq: "weekly" },
	{ path: "/articles", priority: "0.8", changefreq: "weekly" },
	{ path: "/designs", priority: "0.7", changefreq: "monthly" },
	{ path: "/animation", priority: "0.7", changefreq: "monthly" },
	{ path: "/contact", priority: "0.6", changefreq: "monthly" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>`;

fs.writeFileSync(path.join(__dirname, "../../public/sitemap.xml"), xml);
console.log("✓ sitemap.xml generated");
