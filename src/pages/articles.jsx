import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Article from "../components/articles/article";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";
import myArticles from "../data/articles";

import "./styles/articles.css";

const Articles = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "articles");

	// Helper function to create URL-friendly slug from title
	const createSlug = (title) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "") // Remove special characters
			.replace(/\s+/g, "-") // Replace spaces with hyphens
			.replace(/-+/g, "-") // Replace multiple hyphens with single
			.trim()
			.substring(0, 70); // Limit to 70 characters
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Articles | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="articles" />
				<div className="content-wrapper">
					<div className="articles-logo-container">
						<div className="articles-logo">
							<Logo width={99} />
						</div>
					</div>

					<div className="articles-main-container">
						<div className="title articles-title">
							{INFO.articles.title}
						</div>

						<div className="subtitle articles-subtitle">
							{INFO.articles.description}
						</div>

						<div className="articles-container">
							<div className="articles-wrapper">
								{myArticles.map((article, index) => {
									const articleData = article();
									// Use custom url if provided, otherwise generate slug from title
									const urlSlug =
										articleData.url ||
										createSlug(articleData.title);
									return (
										<div
											className="articles-article"
											key={(index + 1).toString()}
										>
											<Article
												key={(index + 1).toString()}
												date={articleData.date}
												title={articleData.title}
												description={
													articleData.description
												}
												link={"/article/" + urlSlug}
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<div className="socials-container">
						<Socials />
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Articles;
