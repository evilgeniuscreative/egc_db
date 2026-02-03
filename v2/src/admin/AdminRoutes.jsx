import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CrudPage from "./CrudPage";
import ProjectsPage from "./pages/ProjectsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlesEditor from "./pages/ArticlesEditor";
import AnimationsPage from "./pages/AnimationsPage";
import PagesPage from "./pages/PagesPage";
import PagesEditor from "./pages/PagesEditor";
import SocialsPage from "./pages/SocialsPage";
import SettingsPage from "./pages/SettingsPage";
import SeoPage from "./pages/SeoPage";

function Protected({ children }) {
	const { isAuth, loading } = useAuth();
	if (loading) return <div>Loading...</div>;
	if (!isAuth) return <Navigate to="/admin/login" replace />;
	return children;
}

export default function AdminRoutes() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route
				path=""
				element={
					<Protected>
						<Dashboard />
					</Protected>
				}
			/>
			<Route
				path="projects"
				element={
					<Protected>
						<ProjectsPage />
					</Protected>
				}
			/>
			<Route
				path="articles"
				element={
					<Protected>
						<ArticlesPage />
					</Protected>
				}
			/>
			<Route
				path="articles/edit/:id"
				element={
					<Protected>
						<ArticlesEditor />
					</Protected>
				}
			/>
			<Route
				path="animations"
				element={
					<Protected>
						<AnimationsPage />
					</Protected>
				}
			/>
			<Route
				path="narration"
				element={
					<Protected>
						<CrudPage table="narration" title="Narration" />
					</Protected>
				}
			/>
			<Route
				path="socials"
				element={
					<Protected>
						<SocialsPage />
					</Protected>
				}
			/>
			<Route
				path="pages"
				element={
					<Protected>
						<PagesPage />
					</Protected>
				}
			/>
			<Route
				path="pages/edit/:id"
				element={
					<Protected>
						<PagesEditor />
					</Protected>
				}
			/>
			<Route
				path="settings"
				element={
					<Protected>
						<SettingsPage />
					</Protected>
				}
			/>
			<Route
				path="seo"
				element={
					<Protected>
						<SeoPage />
					</Protected>
				}
			/>
		</Routes>
	);
}
