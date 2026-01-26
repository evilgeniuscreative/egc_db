import React from "react";
import CrudPage from "./CrudPage";

const SocialsPage = () => {
	const fields = [
		{
			name: "platform",
			label: "Platform",
			required: true,
			placeholder: "github, linkedin, twitter, etc.",
		},
		{
			name: "url",
			label: "URL",
			required: true,
			placeholder: "https://...",
		},
		{
			name: "icon",
			label: "Icon Name",
			placeholder: "faGithub, faLinkedin, etc.",
		},
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
		{ key: "platform", label: "Platform", editable: true },
		{
			key: "url",
			label: "URL",
			editable: true,
			render: (val) =>
				val ? (
					<a href={val} target="_blank" rel="noreferrer">
						{val.substring(0, 40)}...
					</a>
				) : (
					"—"
				),
		},
		{ key: "sort_order", label: "Order", editable: true },
		{ key: "is_active", label: "Status" },
	];

	const defaultValues = {
		platform: "",
		url: "",
		icon: "",
		sort_order: 0,
		is_active: 1,
	};

	return (
		<CrudPage
			tableName="social_links"
			title="Social Links"
			fields={fields}
			columns={columns}
			defaultValues={defaultValues}
		/>
	);
};

export default SocialsPage;
