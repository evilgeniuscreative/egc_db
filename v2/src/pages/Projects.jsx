import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/projects.css";

const Projects = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "projects");

	return (
		<>
			<Helmet>
				<title>{`Projects | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO?.description} />
				<meta
					name="keywords"
					content={currentSEO?.keywords?.join(", ") || ""}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="projects" />
				<main className="content-wrapper">
					<Logo width={99} />

					<section className="projects-section">
						<h1 className="title">
							Experienced, multifaceted, creative, innovative.
							Full Stack and Front End Developer, Designer, and
							UX/UI Specialist.
						</h1>

						<div className="subtitle">
							I've worked on a variety of projects over the years
							and I'm proud of the progress I've made. Many of
							these projects are open-source and available for
							others to explore and contribute to. If you're
							interested in any of the projects I've worked on,
							please feel free to check out the code and suggest
							any improvements or enhancements you might have in
							mind. Collaborating with others is a great way to
							learn and grow, and I'm always open to new ideas and
							feedback.
						</div>

						<AllProjects />
					</section>

					<Footer />
				</main>
			</div>
		</>
	);
};

export default Projects;
