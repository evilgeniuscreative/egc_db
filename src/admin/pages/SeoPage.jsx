import React from "react";
import CrudPage from "./CrudPage";

const SeoPage = () => {
	const fields = [
		{
			name: "page_slug",
			label: "Page Slug",
			required: true,
			placeholder: "home, about, projects, etc.",
		},
		{ name: "title", label: "SEO Title", required: true },
		{ name: "description", label: "Meta Description", type: "textarea" },
		{
			name: "keywords",
			label: "Keywords",
			placeholder: "keyword1, keyword2, keyword3",
		},
		{
			name: "og_image",
			label: "OG Image Path",
			placeholder: "/og-image.jpg",
		},
	];

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "page_slug", label: "Page", editable: true },
		{ key: "title", label: "SEO Title", editable: true },
		{
			key: "description",
			label: "Description",
			render: (val) => (val ? val.substring(0, 50) + "..." : "—"),
		},
	];

	const defaultValues = {
		page_slug: "",
		title: "",
		description: "",
		keywords: "",
		og_image: "/og-madman.jpg",
	};

	return (
		<CrudPage
			tableName="seo_settings"
			title="SEO Settings"
			fields={fields}
			columns={columns}
			defaultValues={defaultValues}
		/>
	);
};

export default SeoPage;
