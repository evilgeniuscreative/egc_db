import React from "react";
import { Helmet } from "react-helmet";

export default function SEO({
	title,
	description,
	keywords,
	image,
	type = "website",
	jsonLd,
}) {
	const url =
		typeof window !== "undefined"
			? window.location.href
			: "https://evilgeniuscreative.com";
	const img = image || "https://evilgeniuscreative.com/og-madman.jpg";

	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			{keywords && <meta name="keywords" content={keywords} />}
			<link rel="canonical" href={url} />

			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={img} />
			<meta property="og:url" content={url} />
			<meta property="og:type" content={type} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={img} />

			{jsonLd && (
				<script type="application/ld+json">
					{JSON.stringify(jsonLd)}
				</script>
			)}
		</Helmet>
	);
}
