import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useApi } from "../../hooks/useApi";

export default function SocialsPage() {
	const [items, setItems] = useState([]);
	const [sortField, setSortField] = useState("sort_order");
	const [sortDirection, setSortDirection] = useState("asc");
	const [editing, setEditing] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		platform: "",
		url: "",
		icon: "",
		sort_order: 0,
		active: 1,
	});
	const api = useApi();

	useEffect(() => {
		api.getAll("socials").then(setItems);
	}, []);

	const startEdit = (itemId, field, currentValue) => {
		setEditing(`${itemId}-${field}`);
		setEditValue(currentValue);
	};

	const handleEdit = async (itemId, field, originalValue) => {
		if (editValue !== originalValue && editValue !== "") {
			try {
				await api.update("socials", itemId, { [field]: editValue });
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

		if (typeof aVal === "number" && typeof bVal === "number") {
			return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
		}

		aVal = String(aVal).toLowerCase();
		bVal = String(bVal).toLowerCase();

		if (sortDirection === "asc") {
			return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
		} else {
			return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
		}
	});

	const handleDelete = async (id) => {
		if (window.confirm("Delete this social link?")) {
			await api.remove("socials", id);
			setItems(items.filter((i) => i.id !== id));
		}
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		if (!formData.platform || !formData.url) {
			alert("Platform and URL are required");
			return;
		}
		try {
			const newItem = await api.create("socials", formData);
			setItems([...items, newItem]);
			setShowForm(false);
			setFormData({
				platform: "",
				url: "",
				icon: "",
				sort_order: 0,
				active: 1,
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
				<h1>Social Links ({items.length})</h1>
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
					{showForm ? "✕ Cancel" : "+ Add Social"}
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
					<h3 style={{ marginTop: 0 }}>Add New Social Link</h3>
					<div style={{ display: "grid", gap: "15px" }}>
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
								}}
							>
								Platform *
							</label>
							<input
								type="text"
								value={formData.platform}
								onChange={(e) =>
									setFormData({
										...formData,
										platform: e.target.value,
									})
								}
								required
								placeholder="GitHub, LinkedIn, Twitter, etc."
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
								URL *
							</label>
							<input
								type="url"
								value={formData.url}
								onChange={(e) =>
									setFormData({
										...formData,
										url: e.target.value,
									})
								}
								required
								placeholder="https://..."
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
								Icon Class
							</label>
							<input
								type="text"
								value={formData.icon}
								onChange={(e) =>
									setFormData({
										...formData,
										icon: e.target.value,
									})
								}
								placeholder="fab fa-github"
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
									Sort Order
								</label>
								<input
									type="number"
									value={formData.sort_order}
									onChange={(e) =>
										setFormData({
											...formData,
											sort_order:
												parseInt(e.target.value) || 0,
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
										checked={formData.active === 1}
										onChange={(e) =>
											setFormData({
												...formData,
												active: e.target.checked
													? 1
													: 0,
											})
										}
										style={{ marginRight: "8px" }}
									/>
									Active
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
						Create Social Link
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
							<SortableHeader field="platform" label="Platform" />
							<SortableHeader field="url" label="URL" />
							<SortableHeader field="sort_order" label="Order" />
							<SortableHeader field="active" label="Active" />
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
										startEdit(
											item.id,
											"platform",
											item.platform,
										)
									}
								>
									{editing === `${item.id}-platform` ? (
										<input
											value={editValue}
											onChange={(e) =>
												setEditValue(e.target.value)
											}
											onBlur={() =>
												handleEdit(
													item.id,
													"platform",
													item.platform,
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleEdit(
														item.id,
														"platform",
														item.platform,
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
										item.platform
									)}
								</td>
								<td
									style={{
										padding: "12px",
										fontSize: "0.9rem",
										color: "#666",
									}}
								>
									<a
										href={item.url}
										target="_blank"
										rel="noreferrer"
										style={{ color: "#00d4ff" }}
									>
										{item.url?.substring(0, 40)}...
									</a>
								</td>
								<td
									style={{
										padding: "12px",
										cursor: "pointer",
									}}
									onClick={() =>
										startEdit(
											item.id,
											"sort_order",
											item.sort_order,
										)
									}
								>
									{editing === `${item.id}-sort_order` ? (
										<input
											type="number"
											value={editValue}
											onChange={(e) =>
												setEditValue(e.target.value)
											}
											onBlur={() =>
												handleEdit(
													item.id,
													"sort_order",
													item.sort_order,
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleEdit(
														item.id,
														"sort_order",
														item.sort_order,
													);
												} else if (e.key === "Escape") {
													setEditing(null);
													setEditValue("");
												}
											}}
											autoFocus
											style={{
												width: "60px",
												padding: "4px",
												border: "2px solid #00d4ff",
												borderRadius: "3px",
											}}
										/>
									) : (
										item.sort_order
									)}
								</td>
								<td style={{ padding: "12px" }}>
									{item.active ? "✓" : "—"}
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
