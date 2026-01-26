import React from "react";
import CrudPage from "./CrudPage";

const ArticlesPage = () => {
	const fields = [
		{
			name: "slug",
			label: "URL Slug",
			required: true,
			placeholder: "my-article-title",
		},
		{ name: "title", label: "Title", required: true },
		{ name: "description", label: "Description", type: "textarea" },
		{ name: "body", label: "Body Content (HTML)", type: "textarea" },
		{
			name: "image",
			label: "Featured Image",
			placeholder: "article-image.jpg",
		},
		{ name: "image_alt", label: "Image Alt Text" },
		{
			name: "keywords",
			label: "Keywords",
			placeholder: "keyword1, keyword2, keyword3",
		},
		{ name: "custom_style", label: "Custom CSS", type: "textarea" },
		{ name: "published_at", label: "Publish Date", type: "date" },
		{
			name: "is_published",
			label: "Published",
			type: "checkbox",
			checkboxLabel: "Publish article",
		},
	];

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "title", label: "Title", editable: true },
		{ key: "slug", label: "Slug", editable: true },
		{ key: "published_at", label: "Date" },
		{ key: "is_published", label: "Status" },
	];

	const defaultValues = {
		slug: "",
		title: "",
		description: "",
		body: "",
		image: "",
		image_alt: "",
		keywords: "",
		custom_style: "",
		published_at: new Date().toISOString().split("T")[0],
		is_published: 1,
	};

	return (
		<CrudPage
			tableName="articles"
			title="Articles"
			fields={fields}
			columns={columns}
			defaultValues={defaultValues}
		/>
	);
};

export default ArticlesPage;
