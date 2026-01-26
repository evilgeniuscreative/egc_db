import React from "react";
import CrudPage from "./CrudPage";

const ProjectsPage = () => {
	const fields = [
		{ name: "title", label: "Title", required: true },
		{
			name: "type",
			label: "Type",
			type: "select",
			required: true,
			options: [
				{ value: "web", label: "Web" },
				{ value: "print", label: "Print" },
				{ value: "animation", label: "Animation" },
				{ value: "other", label: "Other" },
			],
		},
		{
			name: "thumb",
			label: "Thumbnail Image",
			placeholder: "filename.jpg",
		},
		{ name: "description", label: "Description", type: "textarea" },
		{
			name: "logos",
			label: "Technologies/Logos",
			placeholder: "React, JavaScript, CSS",
		},
		{ name: "link_text", label: "Link Text", placeholder: "Visit Site" },
		{ name: "link_url", label: "Link URL", placeholder: "https://..." },
		{ name: "sort_order", label: "Sort Order", type: "number" },
		{
			name: "is_active",
			label: "Active",
			type: "checkbox",
			checkboxLabel: "Show on site",
		},
	];

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "title", label: "Title", editable: true },
		{ key: "type", label: "Type", editable: true },
		{ key: "thumb", label: "Thumbnail" },
		{
			key: "link_url",
			label: "Link",
			render: (val) =>
				val ? (
					<a href={val} target="_blank" rel="noreferrer">
						→
					</a>
				) : (
					"—"
				),
		},
		{ key: "sort_order", label: "Order", editable: true },
		{ key: "is_active", label: "Status" },
	];

	const defaultValues = {
		title: "",
		type: "web",
		thumb: "",
		description: "",
		logos: "",
		link_text: "Visit Site",
		link_url: "",
		sort_order: 0,
		is_active: 1,
	};

	return (
		<CrudPage
			tableName="projects"
			title="Projects"
			fields={fields}
			columns={columns}
			defaultValues={defaultValues}
		/>
	);
};

export default ProjectsPage;
