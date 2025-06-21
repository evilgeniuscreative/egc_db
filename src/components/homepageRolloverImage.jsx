import React, { useState, useRef, useEffect } from "react";
import INFO from "../data/user";
import "./common/homepageRolloverImage.css";

const HomepageRolloverImage = () => {
	const [showRollover, setShowRollover] = useState(false);
	const [autoFade, setAutoFade] = useState(false);
	const timerRef = useRef(null);

	useEffect(() => {
		if (!showRollover) {
			timerRef.current = setInterval(() => {
				setAutoFade((prev) => !prev);
			}, 5000);
		}
		return () => clearInterval(timerRef.current);
	}, [showRollover]);

	const handleMouseEnter = () => {
		setShowRollover(true);
		clearInterval(timerRef.current);
	};
	const handleMouseLeave = () => {
		setShowRollover(false);
	};

	const isRollover = showRollover || autoFade;

	return (
		<div>
			<a href={INFO.main.herolink} tabIndex={0} aria-label="Get Started">
				<div
					className="homepage-rollover-image-container"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<img
						src={`/images/${INFO.main.hero1}`}
						alt="hero main"
						className={`homepage-rollover-image${
							!isRollover ? " visible top" : " hidden"
						}`}
						draggable="false"
					/>
					<img
						src={`/images/${INFO.main.hero2}`}
						alt="hero rollover"
						className={`homepage-rollover-image${
							isRollover ? " visible top" : " hidden"
						}`}
						draggable="false"
					/>
				</div>
			</a>
			<p className="homepage-rollover-image-text">
				<a href={INFO.main.herolink}>Click the image to get started</a>
			</p>
		</div>
	);
};

export default HomepageRolloverImage;
