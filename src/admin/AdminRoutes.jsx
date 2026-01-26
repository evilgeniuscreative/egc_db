import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import ArticlesPage from "./pages/ArticlesPage";
import AnimationsPage from "./pages/AnimationsPage";
import NarrationPage from "./pages/NarrationPage";
import SocialsPage from "./pages/SocialsPage";
import PagesPage from "./pages/PagesPage";
import SettingsPage from "./pages/SettingsPage";
import SeoPage from "./pages/SeoPage";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/admin/login" replace />;
	}

	return children;
};

const AdminRoutes = () => {
	return (
		<AuthProvider>
			<Routes>
				<Route path="login" element={<Login />} />
				<Route
					path=""
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="projects"
					element={
						<ProtectedRoute>
							<ProjectsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="articles"
					element={
						<ProtectedRoute>
							<ArticlesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="animations"
					element={
						<ProtectedRoute>
							<AnimationsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="narration"
					element={
						<ProtectedRoute>
							<NarrationPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="socials"
					element={
						<ProtectedRoute>
							<SocialsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="pages"
					element={
						<ProtectedRoute>
							<PagesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="settings"
					element={
						<ProtectedRoute>
							<SettingsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="seo"
					element={
						<ProtectedRoute>
							<SeoPage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/admin" replace />} />
			</Routes>
		</AuthProvider>
	);
};

export default AdminRoutes;
