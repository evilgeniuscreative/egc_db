import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
	const { user, logout } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/admin/login");
	};

	const navItems = [
		{ path: "/admin", label: "Dashboard", exact: true },
		{ path: "/admin/projects", label: "Projects" },
		{ path: "/admin/articles", label: "Articles" },
		{ path: "/admin/animations", label: "Animations" },
		{ path: "/admin/narration", label: "Narration" },
		{ path: "/admin/pages", label: "Pages" },
		{ path: "/admin/socials", label: "Social Links" },
		{ path: "/admin/settings", label: "Settings" },
		{ path: "/admin/seo", label: "SEO" },
	];

	const isActive = (item) => {
		if (item.exact) {
			return location.pathname === item.path;
		}
		return location.pathname.startsWith(item.path);
	};

	return (
		<div className="admin-layout">
			<header className="admin-header">
				<div className="admin-header-left">
					<Link to="/admin" className="admin-logo">
						EGC Admin
					</Link>
				</div>
				<nav className="admin-nav">
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`admin-nav-link ${isActive(item) ? "active" : ""}`}
						>
							{item.label}
						</Link>
					))}
				</nav>
				<div className="admin-header-right">
					<span className="admin-user">
						Welcome, {user?.username}
					</span>
					<button onClick={handleLogout} className="admin-logout-btn">
						Logout
					</button>
					<Link to="/" className="admin-view-site" target="_blank">
						View Site →
					</Link>
				</div>
			</header>
			<main className="admin-main">{children}</main>
		</div>
	);
};

export default AdminLayout;
