import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useApi } from "../hooks/useApi";

export default function Dashboard() {
	const [stats, setStats] = useState({});
	const api = useApi();

	useEffect(() => {
		Promise.all([
			api.getAll("projects"),
			api.getAll("articles"),
			api.getAll("animations"),
			api.getAll("narration"),
		]).then(([p, a, an, n]) => {
			setStats({
				projects: p.length,
				articles: a.length,
				animations: an.length,
				narration: n.length,
			});
		});
	}, []);

	return (
		<AdminLayout>
			<h1>Dashboard</h1>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "20px",
					marginTop: "20px",
				}}
			>
				{Object.entries(stats).map(([k, v]) => (
					<Link
						key={k}
						to={`/admin/${k}`}
						style={{
							background: "white",
							padding: "30px",
							borderRadius: "8px",
							textDecoration: "none",
							textAlign: "center",
						}}
					>
						<div
							style={{
								fontSize: "3rem",
								fontWeight: "700",
								color: "#00d4ff",
							}}
						>
							{v}
						</div>
						<div
							style={{
								color: "#666",
								textTransform: "capitalize",
							}}
						>
							{k}
						</div>
					</Link>
				))}
			</div>
		</AdminLayout>
	);
}
