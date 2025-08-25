import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Homepage from "./pages/homepage";
import About from "./pages/about";
import Projects from "./pages/projects";

import Articles from "./pages/articles";
import ReadArticle from "./pages/readArticle";
import Contact from "./pages/contact";
import GetStarted from "./pages/getstarted";     
import Animation from "./pages/animations";
import Designs from "./pages/designs";
import Notfound from "./pages/404";
import AllRegistrations from "./pages/allregistrations";
import ShowImage from "./pages/showImage";

import { TRACKING_ID } from "./data/tracking";
import "./app.css";



function App() {
	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID);
		}
	}, []);

	// const { id } = useParams();
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/about" element={<About />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/designs" element={<Designs />} />
				<Route path="/articles" element={<Articles />} />
				<Route path="/article/:slug" element={<ReadArticle />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/getstarted" element={<GetStarted />} />
				<Route path="/animation" element={<Animation />} />
				<Route path="/coar" element={<AllRegistrations />} />
				<Route path="/showimage/:id" element={<ShowImage />} />
				<Route path="*" element={<Notfound />} />
			</Routes>
		</div>
	);
}

export default App;
