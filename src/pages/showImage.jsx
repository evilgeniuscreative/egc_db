import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import ShowTheImage from "../components/showTheImage/showTheImage";
import "./styles/showimage.css";
import INFO from "../data/user";
import SEO from "../data/seo";

const currentSEO = SEO.find((item) => item.page === "showimage");

const ShowImage = () => {
	const { id } = useParams();
	const project = INFO.projects.find((proj) => proj.id === id);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Image of | ${project ? project.title : "Image not found"}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>
			<div className="page-content">
				<NavBar active="show-image" />
				<div className="content-wrapper">
					<div className="about-logo-container">
						<div className="about-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="showimage-container">
						<div className="showimage-title">
							<h1>{project ? project.title : "Image not found"}</h1>
						</div>
						{project ? (
							<ShowTheImage project={project} />
						) : (
							<div className="showimage-error">Project not found</div>
						)}
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ShowImage;
