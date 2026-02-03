import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import AdminLayout from "../AdminLayout";
import "../admin.css";

function SettingsPage() {
	const api = useApi();
	const [settings, setSettings] = useState({});
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [editingKey, setEditingKey] = useState(null);
	const [editValue, setEditValue] = useState("");

	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const response = await api.get("/api/settings.php");
			if (response.success) {
				setSettings(response.data);
			}
		} catch (error) {
			console.error("Failed to load settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (key, value) => {
		setEditingKey(key);
		setEditValue(value);
	};

	const handleSave = async (key) => {
		try {
			const response = await api.put("/api/settings.php", {
				key: key,
				value: editValue,
			});

			if (response.success) {
				setSettings({ ...settings, [key]: editValue });
				setEditingKey(null);
				setMessage("Setting updated successfully");
				setTimeout(() => setMessage(""), 3000);
			}
		} catch (error) {
			setMessage("Failed to update setting: " + error.message);
		}
	};

	const handleCancel = () => {
		setEditingKey(null);
		setEditValue("");
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="loading">Loading...</div>
			</AdminLayout>
		);
	}

	const settingsArray = Object.entries(settings).filter(
		([key]) => key !== "data_migrated",
	);

	return (
		<AdminLayout>
			<div className="admin-page">
				<div className="admin-header">
					<h1>Site Settings</h1>
				</div>

				{message && (
					<div
						className={`message ${message.includes("Failed") ? "error" : "success"}`}
					>
						{message}
					</div>
				)}

				<div className="settings-list">
					{settingsArray.map(([key, value]) => (
						<div key={key} className="setting-item">
							<div className="setting-key">{key}</div>
							<div className="setting-value">
								{editingKey === key ? (
									<div className="edit-controls">
										<input
											type="text"
											value={editValue}
											onChange={(e) =>
												setEditValue(e.target.value)
											}
											className="edit-input"
										/>
										<button
											onClick={() => handleSave(key)}
											className="btn-save"
										>
											Save
										</button>
										<button
											onClick={handleCancel}
											className="btn-cancel"
										>
											Cancel
										</button>
									</div>
								) : (
									<div className="view-controls">
										<span className="value-text">
											{value}
										</span>
										<button
											onClick={() =>
												handleEdit(key, value)
											}
											className="btn-edit"
										>
											Edit
										</button>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}

export default SettingsPage;
