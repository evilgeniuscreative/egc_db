import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useApi } from "../hooks/useApi";

const CrudPage = ({
	tableName,
	title,
	fields,
	columns,
	defaultValues = {},
}) => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [editingField, setEditingField] = useState(null);
	const [formData, setFormData] = useState(defaultValues);
	const [showForm, setShowForm] = useState(false);
	const [message, setMessage] = useState(null);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: "asc",
	});
	const [searchParams, setSearchParams] = useSearchParams();
	const api = useApi();

	const loadItems = useCallback(async () => {
		try {
			const data = await api.getAll(tableName);
			setItems(data);
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		} finally {
			setLoading(false);
		}
	}, [tableName]);

	useEffect(() => {
		loadItems();
		if (searchParams.get("action") === "new") {
			setShowForm(true);
			setFormData(defaultValues);
			setSearchParams({});
		}
	}, [loadItems, searchParams]);

	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedItems = React.useMemo(() => {
		if (!sortConfig.key) return items;

		return [...items].sort((a, b) => {
			const aVal = a[sortConfig.key] ?? "";
			const bVal = b[sortConfig.key] ?? "";

			if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	}, [items, sortConfig]);

	const handleCreate = async (e) => {
		e.preventDefault();
		try {
			await api.create(tableName, formData);
			setMessage({ type: "success", text: "Created successfully!" });
			setShowForm(false);
			setFormData(defaultValues);
			loadItems();
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		}
	};

	const handleInlineEdit = async (id, field, value) => {
		try {
			await api.update(tableName, id, { [field]: value });
			setItems(
				items.map((item) =>
					item.id === id ? { ...item, [field]: value } : item,
				),
			);
			setEditingId(null);
			setEditingField(null);
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this item?"))
			return;

		try {
			await api.remove(tableName, id);
			setItems(items.filter((item) => item.id !== id));
			setMessage({ type: "success", text: "Deleted successfully!" });
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		}
	};

	const handleToggleActive = async (id, currentValue) => {
		const newValue = currentValue ? 0 : 1;
		try {
			await api.update(tableName, id, { is_active: newValue });
			setItems(
				items.map((item) =>
					item.id === id ? { ...item, is_active: newValue } : item,
				),
			);
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		}
	};

	const getSortClass = (key) => {
		if (sortConfig.key !== key) return "sortable";
		return sortConfig.direction === "asc" ? "sorted-asc" : "sorted-desc";
	};

	const renderField = (field) => {
		const value = formData[field.name] ?? "";

		switch (field.type) {
			case "textarea":
				return (
					<textarea
						className="admin-form-textarea"
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[field.name]: e.target.value,
							})
						}
						required={field.required}
					/>
				);
			case "select":
				return (
					<select
						className="admin-form-select"
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[field.name]: e.target.value,
							})
						}
						required={field.required}
					>
						<option value="">Select...</option>
						{field.options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				);
			case "checkbox":
				return (
					<div className="admin-form-checkbox">
						<input
							type="checkbox"
							checked={!!value}
							onChange={(e) =>
								setFormData({
									...formData,
									[field.name]: e.target.checked ? 1 : 0,
								})
							}
						/>
						<span>{field.checkboxLabel || "Active"}</span>
					</div>
				);
			case "date":
				return (
					<input
						type="date"
						className="admin-form-input"
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[field.name]: e.target.value,
							})
						}
						required={field.required}
					/>
				);
			default:
				return (
					<input
						type={field.type || "text"}
						className="admin-form-input"
						value={value}
						onChange={(e) =>
							setFormData({
								...formData,
								[field.name]: e.target.value,
							})
						}
						required={field.required}
						placeholder={field.placeholder}
					/>
				);
		}
	};

	const renderCell = (item, col) => {
		const value = item[col.key];

		if (col.key === "is_active") {
			return (
				<span
					className={`status-badge ${value ? "status-badge-active" : "status-badge-inactive"}`}
					onClick={() => handleToggleActive(item.id, value)}
					style={{ cursor: "pointer" }}
				>
					{value ? "Active" : "Inactive"}
				</span>
			);
		}

		if (col.editable && editingId === item.id && editingField === col.key) {
			return (
				<input
					type="text"
					className="inline-edit-input"
					defaultValue={value}
					autoFocus
					onBlur={(e) =>
						handleInlineEdit(item.id, col.key, e.target.value)
					}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleInlineEdit(item.id, col.key, e.target.value);
						} else if (e.key === "Escape") {
							setEditingId(null);
							setEditingField(null);
						}
					}}
				/>
			);
		}

		if (col.editable) {
			return (
				<span
					onClick={() => {
						setEditingId(item.id);
						setEditingField(col.key);
					}}
					style={{ cursor: "pointer" }}
					title="Click to edit"
				>
					{col.render ? col.render(value, item) : value || "—"}
				</span>
			);
		}

		return col.render ? col.render(value, item) : value || "—";
	};

	return (
		<AdminLayout>
			<div className="admin-page">
				<div className="admin-page-header">
					<h1 className="admin-page-title">{title}</h1>
					<button
						className="admin-btn admin-btn-primary"
						onClick={() => {
							setShowForm(!showForm);
							setFormData(defaultValues);
						}}
					>
						{showForm
							? "Cancel"
							: `+ Add ${title.replace(/s$/, "")}`}
					</button>
				</div>

				{message && (
					<div
						className={`admin-message admin-message-${message.type}`}
					>
						{message.text}
						<button
							onClick={() => setMessage(null)}
							style={{
								float: "right",
								background: "none",
								border: "none",
								cursor: "pointer",
							}}
						>
							×
						</button>
					</div>
				)}

				{showForm && (
					<form
						onSubmit={handleCreate}
						className="admin-form"
						style={{ marginBottom: 30 }}
					>
						{fields.map((field) => (
							<div key={field.name} className="admin-form-group">
								<label className="admin-form-label">
									{field.label}{" "}
									{field.required && (
										<span style={{ color: "red" }}>*</span>
									)}
								</label>
								{renderField(field)}
							</div>
						))}
						<div className="admin-form-actions">
							<button
								type="submit"
								className="admin-btn admin-btn-primary"
							>
								Create
							</button>
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={() => setShowForm(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				)}

				{loading ? (
					<div className="admin-loading">Loading...</div>
				) : (
					<table className="admin-table">
						<thead>
							<tr>
								{columns.map((col) => (
									<th
										key={col.key}
										className={getSortClass(col.key)}
										onClick={() => handleSort(col.key)}
									>
										{col.label}
									</th>
								))}
								<th style={{ width: 100 }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{sortedItems.length === 0 ? (
								<tr>
									<td
										colSpan={columns.length + 1}
										style={{
											textAlign: "center",
											padding: 40,
											color: "#999",
										}}
									>
										No items found. Click "+ Add" to create
										one.
									</td>
								</tr>
							) : (
								sortedItems.map((item) => (
									<tr key={item.id}>
										{columns.map((col) => (
											<td key={col.key}>
												{renderCell(item, col)}
											</td>
										))}
										<td>
											<div className="admin-table-actions">
												<button
													className="admin-table-btn admin-table-btn-delete"
													onClick={() =>
														handleDelete(item.id)
													}
													title="Delete"
												>
													✕
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>
		</AdminLayout>
	);
};

export default CrudPage;
