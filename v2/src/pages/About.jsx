import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/about.css";

const About = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "about");

	return (
		<>
			<Helmet>
				<title>{`About | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<main className="content-wrapper">
					<Logo width={99} />

					<section className="about-hero">
						<div className="about-text">
							<h1 className="title">{INFO.about.title}</h1>
							<p className="subtitle">{INFO.about.description}</p>
						</div>
						<div className="about-image">
							<img src="about.jpg" alt="Ian Kleinfeld" />
						</div>
					</section>

					<Socials />
					<Footer />
				</main>
			</div>
		</>
	);
};

export default About;
