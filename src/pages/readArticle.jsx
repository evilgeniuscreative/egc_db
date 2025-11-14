import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import myArticles from "../data/articles";

import "./styles/readArticle.css";

let ArticleStyle = styled.div``;

const ReadArticle = () => {
	const navigate = useNavigate();
	let { slug } = useParams();

	// Helper function to create URL-friendly slug from title (same as in articles.jsx)
	const createSlug = (title) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "") // Remove special characters
			.replace(/\s+/g, "-") // Replace spaces with hyphens
			.replace(/-+/g, "-") // Replace multiple hyphens with single
			.trim()
			.substring(0, 70); // Limit to 70 characters
	};

	// Find article by matching slug to custom url or auto-generated slug
	const article = myArticles.find((articleFunc) => {
		const articleData = articleFunc();
		const urlSlug = articleData.url || createSlug(articleData.title);
		return urlSlug === slug;
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [article]);

	// If article not found, redirect to 404 or articles page
	if (!article) {
		return (
			<React.Fragment>
				<Helmet>
					<title>{`Article Not Found | ${INFO.main.title}`}</title>
				</Helmet>
				<div className="page-content">
					<NavBar />
					<div className="content-wrapper">
						<div className="read-article-container">
							<h1>Article Not Found</h1>
							<p>The article you're looking for doesn't exist.</p>
							<button onClick={() => navigate("/articles")}>
								Back to Articles
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	const articleData = article();

	ArticleStyle = styled.div`
		${articleData.style}
	`;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${articleData.title} | ${INFO.main.title}`}</title>
				<meta name="description" content={articleData.description} />
				<meta
					name="keywords"
					content={articleData.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar />

				<div className="content-wrapper">
					<div className="read-article-logo-container">
						<div className="read-article-logo">
							<Logo width={99} />
						</div>
					</div>

					<div className="read-article-container">
						<div className="read-article-back">
							<img
								src="../back-button.png"
								alt="back"
								className="read-article-back-button"
								onClick={() => navigate(-1)}
							/>
						</div>

						<div className="read-article-wrapper">
							<div className="read-article-date-container">
								<div className="read-article-date">
									{articleData.date}
								</div>
							</div>

							<div className="title read-article-title">
								{articleData.title}
							</div>

							<div className="read-article-body">
								<ArticleStyle>{articleData.body}</ArticleStyle>
							</div>
						</div>
					</div>
				</div>
				<div className="page-footer">
					<Footer />
				</div>
			</div>
		</React.Fragment>
	);
};

export default ReadArticle;
