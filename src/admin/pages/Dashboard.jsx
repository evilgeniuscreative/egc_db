import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useApi } from "../hooks/useApi";
import "./Dashboard.css";

const Dashboard = () => {
	const [stats, setStats] = useState({
		projects: 0,
		articles: 0,
		animations: 0,
		narration: 0,
	});
	const [loading, setLoading] = useState(true);
	const api = useApi();

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			const [projects, articles, animations, narration] =
				await Promise.all([
					api.getAll("projects"),
					api.getAll("articles"),
					api.getAll("animations"),
					api.getAll("narration_videos"),
				]);

			setStats({
				projects: projects.length,
				articles: articles.length,
				animations: animations.length,
				narration: narration.length,
			});
		} catch (error) {
			console.error("Failed to load stats:", error);
		} finally {
			setLoading(false);
		}
	};

	const cards = [
		{
			label: "Projects",
			count: stats.projects,
			path: "/admin/projects",
			color: "#00d4ff",
		},
		{
			label: "Articles",
			count: stats.articles,
			path: "/admin/articles",
			color: "#ff6b6b",
		},
		{
			label: "Animations",
			count: stats.animations,
			path: "/admin/animations",
			color: "#ffd93d",
		},
		{
			label: "Narration",
			count: stats.narration,
			path: "/admin/narration",
			color: "#6bcb77",
		},
	];

	return (
		<AdminLayout>
			<div className="dashboard">
				<h1 className="dashboard-title">Dashboard</h1>

				{loading ? (
					<div className="admin-loading">Loading...</div>
				) : (
					<>
						<div className="dashboard-cards">
							{cards.map((card) => (
								<Link
									to={card.path}
									key={card.label}
									className="dashboard-card"
								>
									<div
										className="dashboard-card-count"
										style={{ color: card.color }}
									>
										{card.count}
									</div>
									<div className="dashboard-card-label">
										{card.label}
									</div>
								</Link>
							))}
						</div>

						<div className="dashboard-quick-actions">
							<h2>Quick Actions</h2>
							<div className="dashboard-actions-grid">
								<Link
									to="/admin/projects?action=new"
									className="dashboard-action"
								>
									+ Add Project
								</Link>
								<Link
									to="/admin/articles?action=new"
									className="dashboard-action"
								>
									+ Add Article
								</Link>
								<Link
									to="/admin/animations?action=new"
									className="dashboard-action"
								>
									+ Add Animation
								</Link>
								<Link
									to="/admin/settings"
									className="dashboard-action"
								>
									Site Settings
								</Link>
							</div>
						</div>
					</>
				)}
			</div>
		</AdminLayout>
	);
};

export default Dashboard;
