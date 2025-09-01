import React, { useRef, useState } from "react";
import INFO from "../../data/user";
import "./styles/homepageRolloverImage.css";

const HomepageRolloverImage = () => {
	const audioRef = useRef(null);

	const [currentImage, setCurrentImage] = useState(INFO.main.hero1);

	const handleImageChange = () => {
		setTimeout(() => {
			setCurrentImage(INFO.main.hero2);
		}, 500);
	};

	const handleMouseEnter = () => {
		handleImageChange();
		if (audioRef.current) {
			audioRef.current.currentTime = 0; // Reset to beginning
			audioRef.current
				.play()
				.catch((e) => console.log("Audio play failed:", e));
		}
	};

	const handleMouseLeave = () => {
		setCurrentImage(INFO.main.hero1); // Reset to original image
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0; // Reset to beginning
		}
	};

	return (
		<div>
			<a href={INFO.main.herolink} tabIndex={0} aria-label="Get Started">
				<div
					className="homepage-rollover-image-container"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="batman-container">
						<img
							src="/images/batman.png"
							alt="batman"
						/>
					</div>
					<img
						src={`/images/${currentImage}`}
						alt="hero main"
						className="homepage-rollover"
						draggable="false"
					/>
					<img
						src={`/images/${currentImage}`}
						alt="hero rollover"
						className="homepage-rollover"
						draggable="false"
					/>
				</div>
			</a>
			<p className="homepage-rollover-image-text">
				<a href={INFO.main.herolink}>Click the image to get started</a>
			</p>
			<audio ref={audioRef} preload="auto">
				<source
					src="/server_assets/images/batman.mp3"
					type="audio/mpeg"
				/>
				Your browser does not support the audio element.
			</audio>
		</div>
	);
};

export default HomepageRolloverImage;
