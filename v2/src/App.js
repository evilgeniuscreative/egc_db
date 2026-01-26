import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
	return (
		<Routes>
			<Route
				path="/admin/*"
				element={
					<AuthProvider>
						<AdminRoutes />
					</AuthProvider>
				}
			/>
			<Route path="*" element={<div>Public site coming soon</div>} />
		</Routes>
	);
}

export default App;
