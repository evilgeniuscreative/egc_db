import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./styles/project.css";

const truncate = (str) => {
	if (str.length > 195) {
		str = str.length > 195 ? str.substring(0, 195) : str;
		while (str.lastIndexOf(" ") !== -1 && str[str.length - 1] !== " ") {
			str = str.substring(0, str.length - 1);
		}
		str = str + " ...";
	}
	console.log("str", str);
	return str;
};

const handleMouseEnter = (e) => {
	if (typeof window !== "undefined" && window.innerWidth >= 600) {
		const target = e.currentTarget;
		const fullDesc = target.querySelector(".full-description");
		const desc = target.querySelector(".project-description");

		if (desc && fullDesc) {
			fullDesc.classList.remove("hideme");
			fullDesc.classList.add("showme");
			desc.classList.add("hideme");
		}
	}
};

const handleMouseLeave = (e) => {
	if (typeof window !== "undefined" && window.innerWidth >= 600) {
		const target = e.currentTarget;
		const fullDesc = target.querySelector(".full-description");
		const desc = target.querySelector(".project-description");

		if (desc && fullDesc) {
			desc.classList.remove("hideme");
			fullDesc.classList.add("hideme");
			fullDesc.classList.remove("showme");
		}
	}
};

const Project = (props) => {
	const { softwareLogos, title, description, linkText, link, thumb, type } = props;
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check initial window width
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 600);
		};
		
		// Set initial state
		checkMobile();
		
		// Add event listener for window resize
		window.addEventListener('resize', checkMobile);
		
		// Clean up event listener
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	}, []);

	let tempType = "All";

	switch (type) {
		case "All":
			tempType = "All";
			break;
		case "both":
			tempType = "Design & Development";
			break;
		case "devui":
			tempType = "Development & UI/UX design";
			break;
		case "print":
			tempType = "Graphic Design";
			break;
		default:
			tempType = "Design and Development";
			break;
	}

	const theLogos = softwareLogos.map((logo) => {
		const rndNum = Math.floor(Math.random() * 10000);
		return (
			<span
				className="project-logo"
				key={`${rndNum}${logo.id}`}
				title={logo.software}
			>
				<img src={logo.img} alt={logo.software} />
			</span>
		);
	});

	return (
		<React.Fragment>
			<div
				className={`project`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<Link className="project-tile" to={link} target="_blank">
					<div className="project-container">
						<div className="project-logo-wrap">{theLogos}</div>
						<div className="project-title">
							{title} ({tempType})
						</div>

						<div className="project-thumb-section">
							<div
								className="project-thumb"
								style={{ backgroundImage: `url(${thumb})` }}
							></div>
						</div>
						<div className="description-container">
							<div
								className="project-description"
								dangerouslySetInnerHTML={{
									__html: truncate(description),
								}}
							></div>
							<div
								className={`full-description ${isMobile ? 'mobile' : ''}`}
								dangerouslySetInnerHTML={{
									__html: description,
								}}
							></div>
						</div>

						<div className="project-link-section">
							<div className="project-link-text">{linkText}</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
};

export default Project;
