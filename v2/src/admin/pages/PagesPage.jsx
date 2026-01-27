import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useApi } from "../../hooks/useApi";

export default function PagesPage() {
	const [items, setItems] = useState([]);
	const [sortField, setSortField] = useState("page_name");
	const [sortDirection, setSortDirection] = useState("asc");
	const [editing, setEditing] = useState(null);
	const [editValue, setEditValue] = useState("");
	const api = useApi();

	// Static pages that exist as React components in /src/pages/
	// This list is automatically maintained - add new .jsx files here when created
	const staticPages = [
		{ name: "homepage", route: "/", type: "file" },
		{ name: "about", route: "/about", type: "file" },
		{ name: "contact", route: "/contact", type: "file" },
		{ name: "projects", route: "/projects", type: "file" },
		{ name: "designs", route: "/designs", type: "file" },
		{ name: "animations", route: "/animations", type: "file" },
		{ name: "animationsPage", route: "/animations-page", type: "file" },
		{ name: "articles", route: "/articles", type: "file" },
		{ name: "readArticle", route: "/article/:slug", type: "file" },
		{ name: "showImage", route: "/showimage/:id", type: "file" },
		{ name: "getstarted", route: "/getstarted", type: "file" },
		{ name: "allregistrations", route: "/allregistrations", type: "file" },
		{ name: "404", route: "/404", type: "file" },
	];

	useEffect(() => {
		api.getAll("pages").then((dbPages) => {
			// Get list of page names/routes already in database
			const dbPageNames = new Set(
				dbPages.map((p) => p.page_name?.toLowerCase()),
			);
			const dbRoutes = new Set(
				dbPages.map(
					(p) => p.slug?.toLowerCase() || p.route?.toLowerCase(),
				),
			);

			// Filter out static pages that are already in database
			const uniqueStaticPages = staticPages.filter(
				(sp) =>
					!dbPageNames.has(sp.name.toLowerCase()) &&
					!dbRoutes.has(sp.route.toLowerCase()),
			);

			// Combine database pages with unique static pages
			const combined = [
				...dbPages.map((p) => ({
					...p,
					type: "database",
					page_name: p.page_name || p.title,
				})),
				...uniqueStaticPages,
			];
			setItems(combined);
		});
	}, []);

	const startEdit = (itemId, field, currentValue) => {
		setEditing(`${itemId}-${field}`);
		setEditValue(currentValue);
	};

	const handleEdit = async (itemId, field, originalValue) => {
		if (editValue !== originalValue && editValue !== "") {
			try {
				await api.update("pages", itemId, { [field]: editValue });
				setItems(
					items.map((i) =>
						i.id === itemId ? { ...i, [field]: editValue } : i,
					),
				);
			} catch (error) {
				alert("Failed to update: " + error.message);
			}
		}
		setEditing(null);
		setEditValue("");
	};

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedItems = [...items].sort((a, b) => {
		let aVal = a[sortField] || a.name;
		let bVal = b[sortField] || b.name;

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
		if (window.confirm("Delete this page?")) {
			await api.remove("pages", id);
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
				<h1>Pages ({items.length})</h1>
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
			<div style={{ marginBottom: "15px", fontSize: "0.9rem" }}>
				<span
					style={{
						padding: "4px 8px",
						background: "#e8f5e9",
						borderRadius: "4px",
						marginRight: "10px",
					}}
				>
					📄 File
				</span>
				= Static React component
				<span
					style={{
						padding: "4px 8px",
						background: "#e3f2fd",
						borderRadius: "4px",
						marginLeft: "20px",
						marginRight: "10px",
					}}
				>
					💾 Database
				</span>
				= Dynamic content from database
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
							<SortableHeader field="type" label="Type" />
							<SortableHeader
								field="page_name"
								label="Page Name"
							/>
							<SortableHeader field="route" label="Route" />
							<th style={{ padding: "12px", textAlign: "left" }}>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedItems.map((item, idx) => (
							<tr
								key={item.id || `static-${idx}`}
								style={{ borderTop: "1px solid #eee" }}
							>
								<td style={{ padding: "12px" }}>
									{item.type === "file" ? (
										<span
											style={{
												padding: "4px 8px",
												background: "#e8f5e9",
												color: "#2e7d32",
												borderRadius: "4px",
												fontSize: "0.85rem",
												fontWeight: "500",
											}}
										>
											📄 File
										</span>
									) : (
										<span
											style={{
												padding: "4px 8px",
												background: "#e3f2fd",
												color: "#1565c0",
												borderRadius: "4px",
												fontSize: "0.85rem",
												fontWeight: "500",
											}}
										>
											💾 Database
										</span>
									)}
								</td>
								<td
									style={{
										padding: "12px",
										fontWeight: "500",
										cursor:
											item.type === "database"
												? "pointer"
												: "default",
									}}
									onClick={() =>
										item.type === "database" &&
										startEdit(
											item.id,
											"page_name",
											item.page_name,
										)
									}
								>
									{editing === `${item.id}-page_name` ? (
										<input
											value={editValue}
											onChange={(e) =>
												setEditValue(e.target.value)
											}
											onBlur={() =>
												handleEdit(
													item.id,
													"page_name",
													item.page_name,
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleEdit(
														item.id,
														"page_name",
														item.page_name,
													);
												} else if (e.key === "Escape") {
													setEditing(null);
													setEditValue("");
												}
											}}
											autoFocus
											style={{
												width: "100%",
												padding: "4px",
												border: "2px solid #00d4ff",
												borderRadius: "3px",
											}}
										/>
									) : (
										item.page_name || item.name
									)}
								</td>
								<td
									style={{
										padding: "12px",
										fontFamily: "monospace",
										fontSize: "0.9rem",
										color: "#666",
									}}
								>
									{item.route || item.slug || "—"}
								</td>
								<td style={{ padding: "12px" }}>
									{item.type === "database" ? (
										<button
											onClick={() =>
												handleDelete(item.id)
											}
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
									) : (
										<span style={{ color: "#999" }}>
											Read-only
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</AdminLayout>
	);
}
