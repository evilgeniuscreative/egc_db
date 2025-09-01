import React, { useEffect, useCallback, useState } from "react";
import "./Raptorize.css";

const Raptorize = ({ delay = 5000, enabled = true }) => {
	const [isActive, setIsActive] = useState(false);

	const getCornerType = useCallback((event) => {
		const { clientX, clientY } = event;
		const { innerWidth, innerHeight } = window;

		// Define corner zones (bottom 20% of screen height, left/right 20% of width)
		const cornerHeight = innerHeight * 0.2;
		const cornerWidth = innerWidth * 0.2;
		const bottomZone = innerHeight - cornerHeight;

		const isBottomLeft = clientX <= cornerWidth && clientY >= bottomZone;
		const isBottomRight =
			clientX >= innerWidth - cornerWidth && clientY >= bottomZone;

		if (isBottomLeft) return 'left';
		if (isBottomRight) return 'right';
		return null;
	}, []);

	const triggerRaptor = useCallback(
		(event) => {
			const cornerType = getCornerType(event);
			if (!enabled || !cornerType) return;

			const screenWidth = window.innerWidth;
			const isLeftCorner = cornerType === 'left';
			
			// Create raptor element
			const raptor = document.createElement("div");
			raptor.id = "elRaptor";
			raptor.className = "raptor-element";
			
			// Set initial position and transform based on corner clicked
			const initialLeft = isLeftCorner ? -312 : screenWidth + 50;
			const transform = isLeftCorner ? 'scaleX(-1)' : 'scaleX(1)';
			
			raptor.style.cssText = `
      width: 312px;
      height: 294px;
      position: fixed;
      bottom: 0;
      left: ${initialLeft}px;
      background: url('/server_assets/images/raptor.png') no-repeat;
      background-size: contain;
      transform: ${transform};
      z-index: 9999;
      pointer-events: none;
    `;

			// Add raptor to DOM
			document.body.appendChild(raptor);

			// Play sound if available
			const audio = new Audio("/server_assets/images/raptor-sound.mp3");
			audio.volume = 0.5;
			audio.play().catch(() => {
				// Fallback to .ogg if mp3 fails
				const oggAudio = new Audio("/server_assets/images/raptor-sound.ogg");
				oggAudio.volume = 0.5;
				oggAudio.play().catch(() => {
					console.log("Raptor sound could not be played");
				});
			});

			// Animate raptor across screen
			let currentLeft = initialLeft;
			const speed = 16;
			const direction = isLeftCorner ? 1 : -1; // 1 for left-to-right, -1 for right-to-left
			
			const animateAcross = () => {
				currentLeft += speed * direction;
				raptor.style.left = currentLeft + "px";

				// Check if raptor is still on screen
				const stillOnScreen = isLeftCorner 
					? currentLeft <= screenWidth + 50 
					: currentLeft >= -362; // -312 (width) - 50 (buffer)

				if (stillOnScreen) {
					requestAnimationFrame(animateAcross);
				} else {
					// Remove raptor when it's off screen
					if (document.body.contains(raptor)) {
						document.body.removeChild(raptor);
					}
				}
			};

			animateAcross();
		},
		[enabled, getCornerType]
	);

	useEffect(() => {
		if (!enabled) return;

		let timeoutId;
		let clickHandler;

		const setupRaptor = () => {
			timeoutId = setTimeout(() => {
				setIsActive(true);
				clickHandler = (event) => {
					triggerRaptor(event);
				};
				document.addEventListener("click", clickHandler);
			}, delay);
		};

		setupRaptor();

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (clickHandler) {
				document.removeEventListener("click", clickHandler);
			}
			setIsActive(false);
		};
	}, [delay, enabled, triggerRaptor]);

	// This component doesn't render anything visible
	return null;
};

export default Raptorize;
