import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { useApi } from "../hooks/useApi";

export default function CrudPage({ table, title }) {
	const [items, setItems] = useState([]);
	const [editing, setEditing] = useState(null);
	const [sortField, setSortField] = useState("id");
	const [sortDirection, setSortDirection] = useState("asc");
	const api = useApi();

	useEffect(() => {
		api.getAll(table).then(setItems);
	}, [table]);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedItems = [...items].sort((a, b) => {
		let aVal = a[sortField];
		let bVal = b[sortField];

		// Handle null/undefined
		if (aVal == null) aVal = "";
		if (bVal == null) bVal = "";

		// Convert to string for comparison
		aVal = String(aVal).toLowerCase();
		bVal = String(bVal).toLowerCase();

		if (sortDirection === "asc") {
			return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
		} else {
			return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
		}
	});

	const handleDelete = async (id) => {
		if (window.confirm("Delete?")) {
			await api.remove(table, id);
			setItems(items.filter((i) => i.id !== id));
		}
	};

	const handleEdit = (item, field, value) => {
		api.update(table, item.id, { [field]: value }).then(() => {
			setItems(
				items.map((i) =>
					i.id === item.id ? { ...i, [field]: value } : i,
				),
			);
			setEditing(null);
		});
	};

	return (
		<AdminLayout>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "20px",
				}}
			>
				<h1>{title}</h1>
				<button
					style={{
						padding: "10px 20px",
						background: "#00d4ff",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					+ Add
				</button>
			</div>
			<table
				style={{
					width: "100%",
					background: "white",
					borderRadius: "8px",
					overflow: "hidden",
				}}
			>
				<thead>
					<tr style={{ background: "#f5f5f5" }}>
						<th
							onClick={() => handleSort("id")}
							style={{
								padding: "12px",
								textAlign: "left",
								cursor: "pointer",
								userSelect: "none",
							}}
						>
							ID{" "}
							{sortField === "id" &&
								(sortDirection === "asc" ? "↑" : "↓")}
						</th>
						<th
							onClick={() => handleSort("title")}
							style={{
								padding: "12px",
								textAlign: "left",
								cursor: "pointer",
								userSelect: "none",
							}}
						>
							Title{" "}
							{sortField === "title" &&
								(sortDirection === "asc" ? "↑" : "↓")}
						</th>
						<th style={{ padding: "12px", textAlign: "left" }}>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedItems.map((item) => (
						<tr
							key={item.id}
							style={{ borderTop: "1px solid #eee" }}
						>
							<td style={{ padding: "12px" }}>{item.id}</td>
							<td style={{ padding: "12px" }}>
								{editing === `${item.id}-title` ? (
									<input
										defaultValue={item.title}
										onBlur={(e) =>
											handleEdit(
												item,
												"title",
												e.target.value,
											)
										}
										autoFocus
										style={{
											padding: "4px",
											border: "1px solid #00d4ff",
										}}
									/>
								) : (
									<span
										onClick={() =>
											setEditing(`${item.id}-title`)
										}
										style={{ cursor: "pointer" }}
									>
										{item.title ||
											item.k ||
											item.platform ||
											"—"}
									</span>
								)}
							</td>
							<td style={{ padding: "12px" }}>
								<button
									onClick={() => handleDelete(item.id)}
									style={{
										padding: "4px 8px",
										background: "#ffebee",
										color: "#c62828",
										border: "none",
										borderRadius: "3px",
										cursor: "pointer",
									}}
								>
									✕
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</AdminLayout>
	);
}
