import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useApi } from "../hooks/useApi";

const SettingsPage = () => {
	const [settings, setSettings] = useState({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState(null);
	const api = useApi();

	const settingGroups = {
		main: {
			label: "Main Site Settings",
			fields: [
				{ key: "site_title", label: "Site Title" },
				{ key: "site_name", label: "Your Name" },
				{ key: "site_logo", label: "Logo Filename" },
				{ key: "hero1", label: "Hero Image 1" },
				{ key: "hero2", label: "Hero Image 2 (Rollover)" },
				{ key: "hero_link", label: "Hero Link" },
				{ key: "email", label: "Contact Email" },
			],
		},
	};

	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const data = await api.getAll("site_settings");
			const settingsMap = {};
			data.forEach((item) => {
				settingsMap[item.setting_key] = item;
			});
			setSettings(settingsMap);
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (key, value) => {
		setSettings((prev) => ({
			...prev,
			[key]: { ...prev[key], setting_value: value, changed: true },
		}));
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const changedSettings = Object.entries(settings).filter(
				([_, val]) => val.changed,
			);

			for (const [key, setting] of changedSettings) {
				if (setting.id) {
					await api.update("site_settings", setting.id, {
						setting_value: setting.setting_value,
					});
				} else {
					await api.create("site_settings", {
						setting_key: key,
						setting_value: setting.setting_value,
						setting_group: "main",
					});
				}
			}

			setMessage({
				type: "success",
				text: "Settings saved successfully!",
			});
			loadSettings();
		} catch (error) {
			setMessage({ type: "error", text: error.message });
		} finally {
			setSaving(false);
		}
	};

	return (
		<AdminLayout>
			<div className="admin-page">
				<div className="admin-page-header">
					<h1 className="admin-page-title">Site Settings</h1>
					<button
						className="admin-btn admin-btn-primary"
						onClick={handleSave}
						disabled={saving}
					>
						{saving ? "Saving..." : "Save Changes"}
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

				{loading ? (
					<div className="admin-loading">Loading...</div>
				) : (
					<div className="admin-form">
						{Object.entries(settingGroups).map(
							([groupKey, group]) => (
								<div
									key={groupKey}
									style={{ marginBottom: 30 }}
								>
									<h2
										style={{
											fontSize: "1.1rem",
											marginBottom: 20,
											color: "#333",
										}}
									>
										{group.label}
									</h2>
									{group.fields.map((field) => (
										<div
											key={field.key}
											className="admin-form-group"
										>
											<label className="admin-form-label">
												{field.label}
											</label>
											<input
												type="text"
												className="admin-form-input"
												value={
													settings[field.key]
														?.setting_value || ""
												}
												onChange={(e) =>
													handleChange(
														field.key,
														e.target.value,
													)
												}
											/>
										</div>
									))}
								</div>
							),
						)}
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default SettingsPage;
