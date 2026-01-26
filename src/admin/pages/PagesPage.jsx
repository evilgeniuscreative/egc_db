import React from "react";
import CrudPage from "./CrudPage";

const PagesPage = () => {
	const fields = [
		{
			name: "page_slug",
			label: "Page Slug",
			required: true,
			placeholder: "homepage, about, contact, etc.",
		},
		{ name: "title", label: "Title", required: true },
		{ name: "description", label: "Description", type: "textarea" },
		{ name: "content", label: "Page Content (HTML)", type: "textarea" },
		{ name: "meta_title", label: "Meta Title (SEO)" },
		{
			name: "meta_description",
			label: "Meta Description (SEO)",
			type: "textarea",
		},
		{
			name: "meta_keywords",
			label: "Meta Keywords",
			placeholder: "keyword1, keyword2",
		},
		{ name: "sort_order", label: "Sort Order", type: "number" },
		{
			name: "is_active",
			label: "Active",
			type: "checkbox",
			checkboxLabel: "Page is active",
		},
	];

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "page_slug", label: "Slug", editable: true },
		{ key: "title", label: "Title", editable: true },
		{ key: "sort_order", label: "Order", editable: true },
		{ key: "is_active", label: "Status" },
	];

	const defaultValues = {
		page_slug: "",
		title: "",
		description: "",
		content: "",
		meta_title: "",
		meta_description: "",
		meta_keywords: "",
		sort_order: 0,
		is_active: 1,
	};

	return (
		<CrudPage
			tableName="page_content"
			title="Pages"
			fields={fields}
			columns={columns}
			defaultValues={defaultValues}
		/>
	);
};

export default PagesPage;
