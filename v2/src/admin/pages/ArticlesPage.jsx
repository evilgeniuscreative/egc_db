import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useApi } from "../../hooks/useApi";

export default function ArticlesPage() {
	const [items, setItems] = useState([]);
	const [sortField, setSortField] = useState("published_at");
	const [sortDirection, setSortDirection] = useState("desc");
	const [editing, setEditing] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		description: "",
		body: "",
		image: "",
		image_alt: "",
		keywords: "",
		custom_css: "",
		published: 1,
		published_at: new Date().toISOString().split("T")[0],
	});
	const api = useApi();

	useEffect(() => {
		api.getAll("articles").then(setItems);
	}, []);

	const startEdit = (itemId, field, currentValue) => {
		setEditing(`${itemId}-${field}`);
		setEditValue(currentValue);
	};

	const handleEdit = async (itemId, field, originalValue) => {
		if (editValue !== originalValue && editValue !== "") {
			try {
				await api.update("articles", itemId, { [field]: editValue });
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

	const handleCreate = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.slug) {
			alert("Title and slug are required");
			return;
		}
		try {
			const newItem = await api.create("articles", formData);
			setItems([...items, newItem]);
			setShowForm(false);
			setFormData({
				title: "",
				slug: "",
				description: "",
				body: "",
				image: "",
				image_alt: "",
				keywords: "",
				custom_css: "",
				published: 1,
				published_at: new Date().toISOString().split("T")[0],
			});
		} catch (error) {
			alert("Failed to create: " + error.message);
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
					onClick={() => setShowForm(!showForm)}
					style={{
						padding: "10px 20px",
						background: "#00d4ff",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					{showForm ? "✕ Cancel" : "+ Add Article"}
				</button>
			</div>

			{showForm && (
				<form
					onSubmit={handleCreate}
					style={{
						background: "white",
						padding: "20px",
						borderRadius: "8px",
						marginBottom: "20px",
					}}
				>
					<h3 style={{ marginTop: 0 }}>Add New Article</h3>
					<div style={{ display: "grid", gap: "15px" }}>
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
								}}
							>
								Title *
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
								required
								style={{
									width: "100%",
									padding: "8px",
									border: "1px solid #ddd",
									borderRadius: "4px",
								}}
							/>
						</div>
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
								}}
							>
								Slug *
							</label>
							<input
								type="text"
								value={formData.slug}
								onChange={(e) =>
									setFormData({
										...formData,
										slug: e.target.value,
									})
								}
								required
								placeholder="article-url-slug"
								style={{
									width: "100%",
									padding: "8px",
									border: "1px solid #ddd",
									borderRadius: "4px",
									fontFamily: "monospace",
								}}
							/>
						</div>
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
								}}
							>
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								rows="2"
								style={{
									width: "100%",
									padding: "8px",
									border: "1px solid #ddd",
									borderRadius: "4px",
								}}
							/>
						</div>
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
								}}
							>
								Body (HTML)
							</label>
							<textarea
								value={formData.body}
								onChange={(e) =>
									setFormData({
										...formData,
										body: e.target.value,
									})
								}
								rows="5"
								style={{
									width: "100%",
									padding: "8px",
									border: "1px solid #ddd",
									borderRadius: "4px",
									fontFamily: "monospace",
								}}
							/>
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "15px",
							}}
						>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "5px",
									}}
								>
									Image
								</label>
								<input
									type="text"
									value={formData.image}
									onChange={(e) =>
										setFormData({
											...formData,
											image: e.target.value,
										})
									}
									placeholder="image.jpg"
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</div>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "5px",
									}}
								>
									Image Alt Text
								</label>
								<input
									type="text"
									value={formData.image_alt}
									onChange={(e) =>
										setFormData({
											...formData,
											image_alt: e.target.value,
										})
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</div>
						</div>
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
								}}
							>
								Keywords (comma-separated)
							</label>
							<input
								type="text"
								value={formData.keywords}
								onChange={(e) =>
									setFormData({
										...formData,
										keywords: e.target.value,
									})
								}
								placeholder="keyword1,keyword2,keyword3"
								style={{
									width: "100%",
									padding: "8px",
									border: "1px solid #ddd",
									borderRadius: "4px",
								}}
							/>
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "15px",
							}}
						>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "5px",
									}}
								>
									Published Date
								</label>
								<input
									type="date"
									value={formData.published_at}
									onChange={(e) =>
										setFormData({
											...formData,
											published_at: e.target.value,
										})
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</div>
							<div>
								<label
									style={{
										display: "flex",
										alignItems: "center",
										marginTop: "30px",
									}}
								>
									<input
										type="checkbox"
										checked={formData.published === 1}
										onChange={(e) =>
											setFormData({
												...formData,
												published: e.target.checked
													? 1
													: 0,
											})
										}
										style={{ marginRight: "8px" }}
									/>
									Published
								</label>
							</div>
						</div>
					</div>
					<button
						type="submit"
						style={{
							marginTop: "20px",
							padding: "10px 20px",
							background: "#00d4ff",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontWeight: "500",
						}}
					>
						Create Article
					</button>
				</form>
			)}
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
										cursor: "pointer",
									}}
									onClick={() =>
										startEdit(item.id, "title", item.title)
									}
								>
									{editing === `${item.id}-title` ? (
										<input
											value={editValue}
											onChange={(e) =>
												setEditValue(e.target.value)
											}
											onBlur={() =>
												handleEdit(
													item.id,
													"title",
													item.title,
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleEdit(
														item.id,
														"title",
														item.title,
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
										item.title
									)}
								</td>
								<td
									style={{
										padding: "12px",
										fontFamily: "monospace",
										fontSize: "0.9rem",
										color: "#666",
										cursor: "pointer",
									}}
									onClick={() =>
										startEdit(item.id, "slug", item.slug)
									}
								>
									{editing === `${item.id}-slug` ? (
										<input
											value={editValue}
											onChange={(e) =>
												setEditValue(e.target.value)
											}
											onBlur={() =>
												handleEdit(
													item.id,
													"slug",
													item.slug,
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleEdit(
														item.id,
														"slug",
														item.slug,
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
												fontFamily: "monospace",
											}}
										/>
									) : (
										item.slug
									)}
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
