import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoutes from "./admin/AdminRoutes";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import GetStarted from "./pages/GetStarted";

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
			<Route path="/" element={<Homepage />} />
			<Route path="/about" element={<About />} />
			<Route path="/contact" element={<Contact />} />
			<Route path="/projects" element={<Projects />} />
			<Route path="/getstarted" element={<GetStarted />} />
			<Route path="*" element={<div>Page not found</div>} />
		</Routes>
	);
}

export default App;
