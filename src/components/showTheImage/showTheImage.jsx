import React from "react";
import "./style/style.css";

const showTheImage = (props) => {
	const { project } = props;

	// Determine which image property to use
	const imagePath = project.image || project.thumb || project.file;

	return (
		<div className="image-container">
			{imagePath ? (
				<img
					src={`/server_assets/images/${imagePath}`}
					alt={`${project.title}`}
					className="full-size-image"
				/>
			) : (
				<div className="image-not-found">Image not available</div>
			)}

			{project.description && (
				<div className="image-description">
					<span
						dangerouslySetInnerHTML={{
							__html: project.description,
						}}
					></span>
				</div>
			)}
		</div>
	);
};

export default showTheImage;
