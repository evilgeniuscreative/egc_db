import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles/styles.css";

const Circlesbg = () => {
	const [windowHeight, setWindowHeight] = useState("100vh");
	const containerRef = useRef(null);
	const circlesRef = useRef([]);
	const animationFrameRef = useRef();
	const scrollYRef = useRef(0);
	const circleStatesRef = useRef([
		{ size: 7, color: "var(--red)", zIndex: 10 },
		{ size: 9, color: "var(--orange)", zIndex: 9 },
		{ size: 11, color: "var(--yellow-med)", zIndex: 8 },
		{ size: 13, color: "var(--green-med)", zIndex: 7 },
		{ size: 15, color: "var(--blue-med)", zIndex: 6 },
		{ size: 17, color: "var(--indigo)", zIndex: 5 },
		{ size: 19, color: "var(--violet)", zIndex: 4 },
	]);

	// Helper function to get random speed between -3 and 3, but never close to 0
	const getRandomSpeed = () => {
		let speed = 0.5 + Math.random() * 1.5; // 0.5 to 2 pixels per frame
		return Math.random() > 0.5 ? speed : -speed; // 50% chance of negative
	};

	// Initialize circle positions and velocities
	const initializeCircles = React.useCallback(() => {
		const containerWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		circleStatesRef.current = circleStatesRef.current.map((circle) => {
			// Convert size from vw to pixels
			const sizeInPx = (circle.size * window.innerWidth) / 100;

			// Calculate random position within bounds
			// Ensure circles don't start below the viewport
			const x = Math.random() * (containerWidth - sizeInPx);
			const y = Math.random() * (viewportHeight - sizeInPx);

			return {
				...circle,
				x,
				y,
				dx: getRandomSpeed(),
				dy: getRandomSpeed(),
				sizeInPx,
			};
		});
	}, []);

	// Update circle positions based on physics
	const updateCirclePositions = useCallback(function updateCirclePositions() {
		const containerWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const currentScrollY = window.scrollY;

		// Update scroll position reference
		scrollYRef.current = currentScrollY;

		circleStatesRef.current.forEach((circle, index) => {
			// Update position based on velocity
			circle.x += circle.dx;
			circle.y += circle.dy;

			// Boundary collision detection - right/left edges
			if (circle.x + circle.sizeInPx > containerWidth) {
				circle.x = containerWidth - circle.sizeInPx;
				circle.dx = -Math.abs(circle.dx); // Ensure we bounce back left
			} else if (circle.x < 0) {
				circle.x = 0;
				circle.dx = Math.abs(circle.dx); // Ensure we bounce back right
			}

			// Boundary collision detection - top/bottom edges relative to viewport
			// Top boundary is at scroll position
			const topBoundary = 0;
			// Bottom boundary is viewport height
			const bottomBoundary = viewportHeight;

			if (circle.y + circle.sizeInPx > bottomBoundary) {
				circle.y = bottomBoundary - circle.sizeInPx;
				circle.dy = -Math.abs(circle.dy); // Ensure we bounce back up
			} else if (circle.y < topBoundary) {
				circle.y = topBoundary;
				circle.dy = Math.abs(circle.dy); // Ensure we bounce back down
			}

			// Apply the updated position to the DOM element
			if (circlesRef.current[index]) {
				circlesRef.current[
					index
				].style.transform = `translate(${circle.x}px, ${circle.y}px)`;
			}
		});

		// Continue animation loop
		animationFrameRef.current = requestAnimationFrame(
			updateCirclePositions
		);
	}, []);

	// Set up window height and resize handling
	useEffect(() => {
		const updateHeight = () => {
			const appElement = document.querySelector(".App");
			if (appElement) {
				setWindowHeight(`${appElement.offsetHeight}px`);
			}
		};

		// Initial height update
		updateHeight();

		// Update height on window resize
		window.addEventListener("resize", updateHeight);

		// Handle window resize for circle positions
		const handleResize = () => {
			const containerWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			// Ensure circles stay within new bounds after resize
			circleStatesRef.current.forEach((circle) => {
				// Update size in pixels based on new window width
				circle.sizeInPx = (circle.size * window.innerWidth) / 100;

				// Keep circles within bounds
				if (circle.x + circle.sizeInPx > containerWidth) {
					circle.x = containerWidth - circle.sizeInPx;
				}
				// Ensure circles don't go below viewport
				if (circle.y + circle.sizeInPx > viewportHeight) {
					circle.y = viewportHeight - circle.sizeInPx;
				}
			});
		};

		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", updateHeight);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Initialize and start animation
	useEffect(() => {
		// Initialize circle positions and velocities
		initializeCircles();
		updateCirclePositions();

		// Start the animation loop
		animationFrameRef.current = requestAnimationFrame(
			updateCirclePositions
		);

		// Cleanup on unmount
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [initializeCircles, updateCirclePositions]);

	return (
		<>
			<div
				id="bg-container"
				style={{ height: windowHeight }}
				ref={containerRef}
			>
				<div id="container-inside" style={{ height: windowHeight }}>
					{circleStatesRef.current.map((circle, index) => (
						<div
							key={index}
							className="circle"
							ref={(el) => (circlesRef.current[index] = el)}
							style={{
								width: `${circle.size}vw`,
								height: `${circle.size}vw`,
								background: circle.color,
								zIndex: circle.zIndex,
							}}
						></div>
					))}
				</div>
			</div>
		</>
	);
};

export default Circlesbg;
