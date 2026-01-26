import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useApi } from "../../hooks/useApi";

export default function ArticlesPage() {
	const [items, setItems] = useState([]);
	const [sortField, setSortField] = useState("published_at");
	const [sortDirection, setSortDirection] = useState("desc");
	const api = useApi();

	useEffect(() => {
		api.getAll("articles").then(setItems);
	}, []);

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

		if (aVal == null) aVal = "";
		if (bVal == null) bVal = "";

		aVal = String(aVal).toLowerCase();
		bVal = String(bVal).toLowerCase();

		if (sortDirection === "asc") {
			return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
		} else {
			return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
		}
	});

	const handleDelete = async (id) => {
		if (window.confirm("Delete this article?")) {
			await api.remove("articles", id);
			setItems(items.filter((i) => i.id !== id));
		}
	};

	const SortableHeader = ({ field, label }) => (
		<th
			onClick={() => handleSort(field)}
			style={{
				padding: "12px",
				textAlign: "left",
				cursor: "pointer",
				userSelect: "none",
				background: sortField === field ? "#e3f2fd" : "transparent",
			}}
		>
			{label}{" "}
			{sortField === field && (sortDirection === "asc" ? "↑" : "↓")}
		</th>
	);

	return (
		<AdminLayout>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "20px",
				}}
			>
				<h1>Articles ({items.length})</h1>
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
			<div style={{ overflowX: "auto" }}>
				<table
					style={{
						width: "100%",
						background: "white",
						borderRadius: "8px",
						overflow: "hidden",
						minWidth: "800px",
					}}
				>
					<thead>
						<tr style={{ background: "#f5f5f5" }}>
							<SortableHeader field="id" label="ID" />
							<SortableHeader field="title" label="Title" />
							<SortableHeader field="slug" label="Slug" />
							<SortableHeader field="published_at" label="Date" />
							<SortableHeader field="published" label="Status" />
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
								<td
									style={{
										padding: "12px",
										fontWeight: "500",
									}}
								>
									{item.title}
								</td>
								<td
									style={{
										padding: "12px",
										fontFamily: "monospace",
										fontSize: "0.9rem",
										color: "#666",
									}}
								>
									{item.slug}
								</td>
								<td style={{ padding: "12px" }}>
									{item.published_at || "—"}
								</td>
								<td style={{ padding: "12px" }}>
									{item.published ? (
										<span
											style={{
												color: "#2e7d32",
												fontWeight: "500",
											}}
										>
											Published
										</span>
									) : (
										<span style={{ color: "#999" }}>
											Draft
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
			</div>
		</AdminLayout>
	);
}
