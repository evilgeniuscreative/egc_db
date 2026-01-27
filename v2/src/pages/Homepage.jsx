import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
	faGithub,
	faStackOverflow,
	faTwitter,
	faLinkedin,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import AllProjects from "../components/projects/allProjects";
import HomepageRolloverImage from "../components/homepage/homepageRolloverImage";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/homepage.css";

const Homepage = () => {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(99);
	const [oldLogoSize, setOldLogoSize] = useState(99);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);
			let newLogoSize = 80 - (scroll * 4) / 10;

			if (newLogoSize < oldLogoSize) {
				if (newLogoSize > 40) {
					setLogoSize(newLogoSize);
					setOldLogoSize(newLogoSize);
					setStayLogo(false);
				} else {
					setStayLogo(true);
				}
			} else {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [logoSize, oldLogoSize]);

	const currentSEO = SEO.find((item) => item.page === "home");

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		top: stayLogo ? "3vh" : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	};

	return (
		<>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="home" />
				<main className="content-wrapper">
					<div style={logoStyle}>
						<Logo width={logoSize} link={false} />
					</div>

					<section className="hero">
						<div className="hero-text">
							<h1 className="title">{INFO.homepage.title}</h1>
							<p className="subtitle">
								{INFO.homepage.description}
							</p>
						</div>
						<div className="hero-image">
							<HomepageRolloverImage />
						</div>
					</section>

					<nav
						className="social-links"
						aria-label="Social media links"
					>
						<a
							href={INFO.socials.github}
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub"
						>
							<FontAwesomeIcon icon={faGithub} />
						</a>
						<a
							href={INFO.socials.stackoverflow}
							target="_blank"
							rel="noreferrer"
							aria-label="Stack Overflow"
						>
							<FontAwesomeIcon icon={faStackOverflow} />
						</a>
						<a
							href={INFO.socials.twitter}
							target="_blank"
							rel="noreferrer"
							aria-label="Twitter"
						>
							<FontAwesomeIcon icon={faTwitter} />
						</a>
						<a
							href={INFO.socials.bluesky}
							target="_blank"
							rel="noreferrer"
							aria-label="Bluesky"
						>
							<img
								src="/images/Bluesky_Logo.svg"
								alt="Bluesky"
								width="24"
								height="24"
							/>
						</a>
						<a
							href={INFO.socials.linkedin}
							target="_blank"
							rel="noreferrer"
							aria-label="LinkedIn"
						>
							<FontAwesomeIcon icon={faLinkedin} />
						</a>
						<a
							href={INFO.socials.instagram}
							target="_blank"
							rel="noreferrer"
							aria-label="Instagram"
						>
							<FontAwesomeIcon icon={faInstagram} />
						</a>
						<a
							href={`mailto:${INFO.main.email}`}
							target="_blank"
							rel="noreferrer"
							aria-label="Email"
						>
							<FontAwesomeIcon icon={faEnvelope} />
						</a>
					</nav>

					<section className="projects-section">
						<AllProjects />
					</section>

					<Footer />
				</main>
			</div>
		</>
	);
};

export default Homepage;
