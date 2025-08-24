import React from "react";
import Animation from "../components/animation/animation";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import "./styles/animations.css";
import INFO from "../data/user";
import SEO from "../data/seo";

const currentSEO = SEO.find((item) => item.page === "animations");

const Animations = () => {
	return (
		<React.Fragment>
			<Helmet>
				<title>{`Animations | ${INFO.animations.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>
			<div className="page-content">
				<NavBar active="animation" />
				<div className="content-wrapper">
					<div className="about-logo-container">
						<div className="about-logo">
							<Logo width={99} />
						</div>
					</div>

					<div className="animation-container">
						<div className="title animation-title">
							{INFO.animations.title}
						</div>
						<div className="description animations-description">
							{INFO.animations.description}
						</div>
						<div className="animation-items-container">
							{INFO.animation &&
								INFO.animation.map((animation, index) => (
									<Animation
										key={index}
										title={animation.title}
										description={animation.description}
										link={animation.link}
										thumb={animation.thumb}
									/>
								))}
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Animations;
