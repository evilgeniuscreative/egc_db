import React from "react";
import CrudPage from "./CrudPage";

const NarrationPage = () => {
	const fields = [
		{ name: "title", label: "Title", required: true },
		{ name: "description", label: "Description", type: "textarea" },
		{
			name: "video_url",
			label: "Video URL",
			placeholder: "https://www.youtube.com/embed/...",
		},
		{
			name: "thumb",
			label: "Thumbnail Image",
			placeholder: "narration-thumb.jpg",
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
		{ key: "title", label: "Title", editable: true },
		{
			key: "video_url",
			label: "Video",
			render: (val) =>
				val ? (
					<a href={val} target="_blank" rel="noreferrer">
						View →
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
		description: "",
		video_url: "",
		thumb: "",
		sort_order: 0,
		is_active: 1,
	};

	return (
		<CrudPage
			tableName="narration_videos"
			title="Narration Videos"
			fields={fields}
			columns={columns}
			defaultValues={defaultValues}
		/>
	);
};

export default NarrationPage;
