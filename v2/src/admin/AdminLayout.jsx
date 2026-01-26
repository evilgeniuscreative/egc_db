import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./admin.css";

const nav = [
	{ path: "/admin", label: "Dashboard", exact: true },
	{ path: "/admin/projects", label: "Projects" },
	{ path: "/admin/articles", label: "Articles" },
	{ path: "/admin/animations", label: "Animations" },
	{ path: "/admin/narration", label: "Narration" },
	{ path: "/admin/socials", label: "Socials" },
	{ path: "/admin/pages", label: "Pages" },
	{ path: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }) {
	const { user, logout } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const isActive = (item) =>
		item.exact
			? location.pathname === item.path
			: location.pathname.startsWith(item.path);

	const handleLogout = () => {
		logout();
		navigate("/admin/login");
	};

	return (
		<div className="admin">
			<header className="admin-header">
				<Link to="/admin" className="admin-logo">
					EGC Admin
				</Link>
				<nav className="admin-nav">
					{nav.map((n) => (
						<Link
							key={n.path}
							to={n.path}
							className={isActive(n) ? "active" : ""}
						>
							{n.label}
						</Link>
					))}
				</nav>
				<div className="admin-user">
					<span>{user?.username}</span>
					<button onClick={handleLogout}>Logout</button>
					<a href="/" target="_blank" rel="noreferrer">
						View Site →
					</a>
				</div>
			</header>
			<main className="admin-main">{children}</main>
		</div>
	);
}
