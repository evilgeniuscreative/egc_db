import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../admin.css";

export default function SeoPage() {
	const navigate = useNavigate();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(null);
	const [formData, setFormData] = useState({
		page: "",
		meta_title: "",
		meta_description: "",
		meta_keywords: "",
		og_title: "",
		og_description: "",
		og_image: "",
	});

	useEffect(() => {
		loadItems();
	}, []);

	const loadItems = async () => {
		try {
			const response = await fetch("http://localhost:8000/seo.php");
			const data = await response.json();
			if (data.success) {
				setItems(data.data);
			}
		} catch (error) {
			console.error("Failed to load SEO data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (item) => {
		setEditing(item.id);
		setFormData(item);
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem("egc_token");
			const url = editing
				? "http://localhost:8000/seo.php"
				: "http://localhost:8000/seo.php";
			const method = editing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(
					editing ? { ...formData, id: editing } : formData,
				),
			});

			const data = await response.json();
			if (data.success) {
				loadItems();
				setEditing(null);
				setFormData({
					page: "",
					meta_title: "",
					meta_description: "",
					meta_keywords: "",
					og_title: "",
					og_description: "",
					og_image: "",
				});
			} else {
				alert("Error: " + (data.error || "Failed to save"));
			}
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Delete this SEO entry?")) {
			try {
				const token = localStorage.getItem("egc_token");
				const response = await fetch(
					`http://localhost:8000/seo.php?id=${id}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				const data = await response.json();
				if (data.success) {
					loadItems();
				} else {
					alert("Error: " + (data.error || "Failed to delete"));
				}
			} catch (error) {
				alert("Error: " + error.message);
			}
		}
	};

	const handleCancel = () => {
		setEditing(null);
		setFormData({
			page: "",
			meta_title: "",
			meta_description: "",
			meta_keywords: "",
			og_title: "",
			og_description: "",
			og_image: "",
		});
	};

	if (loading) {
		return (
			<AdminLayout>
				<div>Loading...</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="admin-page">
				<div className="admin-header">
					<h1>SEO Metadata ({items.length})</h1>
					{!editing && (
						<button
							onClick={() => setEditing("new")}
							style={{
								padding: "10px 20px",
								background: "#00d4ff",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							+ Add SEO Entry
						</button>
					)}
				</div>

				{editing && (
					<div
						className="editor-container"
						style={{ marginBottom: "20px" }}
					>
						<h3>
							{editing === "new"
								? "New SEO Entry"
								: "Edit SEO Entry"}
						</h3>
						<div className="form-grid">
							<div className="form-group">
								<label>Page Slug *</label>
								<input
									type="text"
									value={formData.page}
									onChange={(e) =>
										setFormData({
											...formData,
											page: e.target.value,
										})
									}
									placeholder="home, about, projects, etc."
								/>
							</div>

							<div className="form-group">
								<label>Meta Title</label>
								<input
									type="text"
									value={formData.meta_title}
									onChange={(e) =>
										setFormData({
											...formData,
											meta_title: e.target.value,
										})
									}
									placeholder="Page title for search engines"
								/>
							</div>

							<div className="form-group full-width">
								<label>Meta Description</label>
								<textarea
									value={formData.meta_description}
									onChange={(e) =>
										setFormData({
											...formData,
											meta_description: e.target.value,
										})
									}
									rows="3"
									placeholder="Description for search engines"
								/>
							</div>

							<div className="form-group full-width">
								<label>Meta Keywords (comma-separated)</label>
								<textarea
									value={formData.meta_keywords}
									onChange={(e) =>
										setFormData({
											...formData,
											meta_keywords: e.target.value,
										})
									}
									rows="2"
									placeholder="keyword1, keyword2, keyword3"
								/>
							</div>

							<div className="form-group">
								<label>OG Title</label>
								<input
									type="text"
									value={formData.og_title}
									onChange={(e) =>
										setFormData({
											...formData,
											og_title: e.target.value,
										})
									}
									placeholder="Title for social media sharing"
								/>
							</div>

							<div className="form-group">
								<label>OG Image URL</label>
								<input
									type="text"
									value={formData.og_image}
									onChange={(e) =>
										setFormData({
											...formData,
											og_image: e.target.value,
										})
									}
									placeholder="/images/og-image.jpg"
								/>
							</div>

							<div className="form-group full-width">
								<label>OG Description</label>
								<textarea
									value={formData.og_description}
									onChange={(e) =>
										setFormData({
											...formData,
											og_description: e.target.value,
										})
									}
									rows="2"
									placeholder="Description for social media sharing"
								/>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								gap: "10px",
								marginTop: "20px",
							}}
						>
							<button
								onClick={handleSave}
								style={{
									padding: "10px 20px",
									background: "#00d4ff",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
									fontWeight: "500",
								}}
							>
								Save
							</button>
							<button
								onClick={handleCancel}
								style={{
									padding: "10px 20px",
									background: "#f5f5f5",
									border: "1px solid #ddd",
									borderRadius: "4px",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				)}

				<div style={{ display: "grid", gap: "20px" }}>
					{items.map((item) => (
						<div
							key={item.id}
							style={{
								background: "white",
								borderRadius: "8px",
								padding: "20px",
								border: "1px solid #e0e0e0",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "15px",
									paddingBottom: "15px",
									borderBottom: "2px solid #f5f5f5",
								}}
							>
								<h3
									style={{
										margin: 0,
										fontFamily: "monospace",
										color: "#1976d2",
										fontSize: "1.2rem",
									}}
								>
									/{item.page}
								</h3>
								<div style={{ display: "flex", gap: "8px" }}>
									<button
										onClick={() => handleEdit(item)}
										style={{
											padding: "6px 16px",
											background: "#e3f2fd",
											color: "#1976d2",
											border: "none",
											borderRadius: "4px",
											cursor: "pointer",
											fontWeight: "500",
										}}
									>
										✏️ Edit
									</button>
									<button
										onClick={() => handleDelete(item.id)}
										style={{
											padding: "6px 16px",
											background: "#ffebee",
											color: "#c62828",
											border: "none",
											borderRadius: "4px",
											cursor: "pointer",
											fontWeight: "500",
										}}
									>
										✕ Delete
									</button>
								</div>
							</div>

							<div style={{ display: "grid", gap: "15px" }}>
								<div>
									<div
										style={{
											fontSize: "0.75rem",
											fontWeight: "600",
											color: "#666",
											textTransform: "uppercase",
											marginBottom: "5px",
										}}
									>
										Meta Title
									</div>
									<div
										style={{
											fontSize: "0.95rem",
											color: "#333",
										}}
									>
										{item.meta_title || (
											<span
												style={{
													color: "#999",
													fontStyle: "italic",
												}}
											>
												Not set
											</span>
										)}
									</div>
								</div>

								<div>
									<div
										style={{
											fontSize: "0.75rem",
											fontWeight: "600",
											color: "#666",
											textTransform: "uppercase",
											marginBottom: "5px",
										}}
									>
										Meta Description
									</div>
									<div
										style={{
											fontSize: "0.95rem",
											color: "#333",
											lineHeight: "1.5",
										}}
									>
										{item.meta_description || (
											<span
												style={{
													color: "#999",
													fontStyle: "italic",
												}}
											>
												Not set
											</span>
										)}
									</div>
								</div>

								<div>
									<div
										style={{
											fontSize: "0.75rem",
											fontWeight: "600",
											color: "#666",
											textTransform: "uppercase",
											marginBottom: "5px",
										}}
									>
										Meta Keywords
									</div>
									<div
										style={{
											fontSize: "0.9rem",
											color: "#666",
											fontFamily: "monospace",
										}}
									>
										{item.meta_keywords || (
											<span
												style={{
													color: "#999",
													fontStyle: "italic",
												}}
											>
												Not set
											</span>
										)}
									</div>
								</div>

								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "15px",
										paddingTop: "10px",
										borderTop: "1px solid #f0f0f0",
									}}
								>
									<div>
										<div
											style={{
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "5px",
											}}
										>
											OG Title
										</div>
										<div
											style={{
												fontSize: "0.9rem",
												color: "#333",
											}}
										>
											{item.og_title || (
												<span
													style={{
														color: "#999",
														fontStyle: "italic",
													}}
												>
													Not set
												</span>
											)}
										</div>
									</div>

									<div>
										<div
											style={{
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "5px",
											}}
										>
											OG Image
										</div>
										<div
											style={{
												fontSize: "0.9rem",
												color: "#666",
												fontFamily: "monospace",
											}}
										>
											{item.og_image || (
												<span
													style={{
														color: "#999",
														fontStyle: "italic",
													}}
												>
													Not set
												</span>
											)}
										</div>
									</div>

									<div style={{ gridColumn: "1 / -1" }}>
										<div
											style={{
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "5px",
											}}
										>
											OG Description
										</div>
										<div
											style={{
												fontSize: "0.9rem",
												color: "#333",
											}}
										>
											{item.og_description || (
												<span
													style={{
														color: "#999",
														fontStyle: "italic",
													}}
												>
													Not set
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}
