// Configuration
const CYCLE_DURATION = 120000; // Milliseconds for one 24-hour cycle (2 minutes)
const DEBUG = true; // Enable/disable debug logging
const INIT_TIMEOUT = 45000; // 45 second timeout for initialization (increased)

// Send heartbeats to watchdog if we're in an iframe
function sendHeartbeat() {
	try {
		if (window.parent && window.parent !== window) {
			window.parent.postMessage("heartbeat", "*");
		}
	} catch (e) {
		// Silently fail if postMessage is not available
	}
}

// Start sending heartbeats every 5 seconds
const heartbeatInterval = setInterval(sendHeartbeat, 1000);
sendHeartbeat(); // Send initial heartbeat

// Helper for debug logging
function log(message) {
	try {
		if (DEBUG) {
			console.log(`[CityLights] ${message}`);
		}
	} catch (e) {
		// Silently fail if console is not available
	}
}

function setLoadingText(text) {
	if (this.loadingText) {
		this.loadingText.textContent = text;
		log(`Loading step: ${text}`);
	}
}

(function setupErrorHandling() {
	const errorLog = document.getElementById("error-log");
	const errorSidebar = document.getElementById("error-sidebar");
	const showErrorsBtn = document.getElementById("show-errors");
	const clearErrorsBtn = document.getElementById("clear-errors");
	const toggleSidebarBtn = document.getElementById("toggle-sidebar");

	if (errorLog && errorSidebar && showErrorsBtn) {
		errorSidebar.style.display = "block";

		const originalConsoleError = console.error;

		console.error = function () {
			originalConsoleError.apply(console, arguments);

			const errorMsg = Array.from(arguments)
				.map((arg) => {
					if (arg instanceof Error) {
						return `${arg.name}: ${arg.message}\n${arg.stack}`;
					}
					return typeof arg === "object"
						? JSON.stringify(arg, null, 2)
						: String(arg);
				})
				.join(" ");

			const errorEntry = document.createElement("div");
			errorEntry.className = "error-entry";
			errorEntry.innerHTML = `<hr><p><strong>${new Date().toLocaleTimeString()}</strong>: ${errorMsg}</p>`;
			errorLog.appendChild(errorEntry);

			errorSidebar.style.display = "block";
			showErrorsBtn.style.display = "none";
		};

		window.addEventListener("error", function (event) {
			console.error(
				`Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`
			);
			event.preventDefault();
		});

		window.addEventListener("unhandledrejection", function (event) {
			console.error("Unhandled Promise Rejection:", event.reason);
		});

		if (clearErrorsBtn) {
			clearErrorsBtn.addEventListener("click", function () {
				errorLog.innerHTML = "";
			});
		}

		if (toggleSidebarBtn) {
			toggleSidebarBtn.addEventListener("click", function () {
				errorSidebar.style.display = "none";
				showErrorsBtn.style.display = "block";
			});
		}

		if (showErrorsBtn) {
			showErrorsBtn.addEventListener("click", function () {
				errorSidebar.style.display = "block";
				showErrorsBtn.style.display = "none";
			});
		}
	}
})();

function monitorInitialization() {
	let lastLoadingMessage = "";
	let lastChangeTime = Date.now();

	const monitorInterval = setInterval(() => {
		const loadingText = document.querySelector(".loading-text");
		if (!loadingText) {
			clearInterval(monitorInterval);
			return;
		}

		const currentMessage = loadingText.textContent;
		const loadingOverlay = document.getElementById("loading-overlay");
		if (loadingOverlay && loadingOverlay.style.display === "none") {
			clearInterval(monitorInterval);
			return;
		}

		if (currentMessage === lastLoadingMessage) {
			const timeSinceChange = Date.now() - lastChangeTime;
			if (timeSinceChange > 10000) {
				console.warn(
					`Loading appears stuck at "${currentMessage}" for ${Math.round(
						timeSinceChange / 1000
					)} seconds`
				);

				if (timeSinceChange > 15000) {
					const emergencyBtn =
						document.getElementById("emergency-refresh");
					if (emergencyBtn) {
						emergencyBtn.classList.add("visible");
						loadingText.textContent = `Stuck at: ${currentMessage}. Consider refreshing.`;
					}
				}
			}
		} else {
			lastLoadingMessage = currentMessage;
			lastChangeTime = Date.now();
		}
	}, 1000);

	return monitorInterval;
}

monitorInitialization();

let activeScene = null;

document.addEventListener("DOMContentLoaded", () => {
	log("Document loaded, initializing scene");

	const loadingOverlay = document.getElementById("loading-overlay");
	if (loadingOverlay) {
		loadingOverlay.style.display = "flex";
	}

	if (activeScene) {
		log("Cleaning up previous scene instance");
		try {
			activeScene.cleanup();
		} catch (error) {
			console.error("Error cleaning up scene:", error);
		}
		activeScene = null;
	}

	setTimeout(() => {
		try {
			activeScene = new CityScene();
			log("Scene initialized successfully");
		} catch (error) {
			console.error("Error initializing scene:", error);
			if (loadingOverlay) {
				loadingOverlay.style.display = "none";
			}
		}
	}, 300);
});

function initScene() {
	log("Initializing new scene");

	if (activeScene) {
		log("Cleaning up existing scene");
		try {
			activeScene.cleanup();
		} catch (e) {
			log(`Error cleaning up: ${e.message}`);
		}
		activeScene = null;
	}

	try {
		activeScene = new CityScene();
		log("Scene initialized successfully");
	} catch (e) {
		log(`Error creating scene: ${e.message}`);
		console.error(e);
	}
}

class CityScene {
	constructor(options = {}) {
		this.options = Object.assign(
			{
				cycleDuration: 240000,
				buildingCount: 15 + Math.floor(Math.random() * 10),
				houseCount: 10 + Math.floor(Math.random() * 5),
				minClouds: 3,
				maxClouds: 8,
				starCount: 100,
			},
			options
		);

		this.isInitialized = false;
		this.loadingComplete = false;
		this.isPlaying = true;
		this.isPaused = false;
		this.startTime = Date.now();
		this.pausedAt = null;
		this.clouds = [];
		this.stars = [];
		this.lastWindowUpdate = 0;
		this.speedSlider = null;
		this.speedDisplay = null;
		this.lampLights = null;
		this.lampDowns = null;
		this.nightLayer = null;
		this.dayLayer = null;
		this.windowObjects = [];
		this.isNewDay = true;

		this.eventHandlers = {
			visibilityChange: null,
			playPauseClick: null,
			resetClick: null,
			speedChange: null,
			clockToggle: null,
			resize: null,
		};

		this.loadingOverlay = null;
		this.loadingText = null;
		this.sceneContainer = null;
		this.cityscape = null;
		this.sky = null;
		this.sun = null;
		this.moon = null;
		this.starContainer = null;
		this.cloudContainer = null;
		this.ufoWrap = null;
		this.ufo = null;
		this.airplane = null;
		this.clockDisplay = null;
		this.digitalClock = null;
		this.analogClock = null;
		this.hourHand = null;
		this.minuteHand = null;
		this.clockToggleBtn = null;
		this.playPauseBtn = null;
		this.resetBtn = null;
		this.speedSlider = null;
		this.speedDisplay = null;
		this.lampLights = null;
		this.lampDowns = null;
		this.nightLayer = null;
		this.dayLayer = null;

		this.init();
	}

	init() {
		this.loadingOverlay = document.getElementById("loading-overlay");

		if (this.loadingOverlay) {
			this.loadingOverlay.style.display = "flex";
			setLoadingText("Initializing...");
		}

		this.loadingText = this.loadingOverlay
			? this.loadingOverlay.querySelector(".loading-text")
			: null;

		log("Starting initialization sequence");

		this.sceneContainer = document.getElementById("scene-container");
		this.cityscape = document.getElementById("cityscape");
		this.sky = document.getElementById("sky");
		this.sun = document.getElementById("sun");
		this.moon = document.getElementById("moon");
		this.starContainer = document.getElementById("stars");
		this.cloudContainer = document.getElementById("clouds");
		this.ufoWrap = document.querySelector(".ufo-wrap");
		this.ufo = document.querySelector(".ufo");
		this.airplane = document.querySelector(".airplane");

		this.clockDisplay = document.getElementById("clock");
		this.digitalClock = document.getElementById("digital-clock");
		this.analogClock = document.getElementById("analog-clock");
		this.hourHand = this.analogClock
			? this.analogClock.querySelector(".hour-hand")
			: null;
		this.minuteHand = this.analogClock
			? this.analogClock.querySelector(".minute-hand")
			: null;

		this.clockToggleBtn = document.getElementById("toggleClock");
		this.playPauseBtn = document.getElementById("playPause");
		this.resetBtn = document.getElementById("reset");
		this.speedSlider = document.getElementById("speedSlider");
		this.speedDisplay = document.getElementById("speedDisplay");

		this.lampLights = document.querySelectorAll(".lamp-light");

		this.setupEventListeners();

		this.isInitialized = false;

		setTimeout(() => {
			this.initializeSequentially();
		}, 300);
	}

	// OPTIMIZED: Chain initialization steps with promises
	initializeSequentially() {
		try {
			log("Sequential initialization started");

			const initTimeoutId = setTimeout(() => {
				log("Initialization timeout reached - forcing refresh option");
				const emergencyBtn =
					document.getElementById("emergency-refresh");
				if (emergencyBtn) {
					emergencyBtn.classList.add("visible");
					setLoadingText(
						"Loading taking too long. Consider refreshing."
					);
				}
			}, INIT_TIMEOUT);

			if (this.isInitialized) {
				clearTimeout(initTimeoutId);
				return;
			}

			this.chainedInitialization(initTimeoutId);
		} catch (error) {
			console.error("Error during initialization:", error);
			const emergencyBtn = document.getElementById("emergency-refresh");
			if (emergencyBtn) {
				emergencyBtn.classList.add("visible");
				setLoadingText("Error during initialization. Please refresh.");
			}
		}
	}

	// OPTIMIZED: Chain initialization steps with promises
	chainedInitialization(timeoutId) {
		setLoadingText("Setting up stars...");

		this.setupStarsOptimized()
			.then(() => {
				setLoadingText("Setting up sun and moon...");
				this.setupCelestialBodies();
				return this.delay(100);
			})
			.then(() => {
				setLoadingText("Building the buildings...");
				return this.createBuildingsOptimized();
			})
			.then(() => {
				setLoadingText("Building the houses...");
				return this.createHousesOptimized();
			})
			.then(() => {
				setLoadingText("Setting up clouds...");
				this.setupClouds();
				return this.delay(50);
			})
			.then(() => {
				setLoadingText("Building street lamps...");
				this.createStreetlamps();
				this.isPlaying = true;

				const startTimeOffset = 0.23 * this.options.cycleDuration;
				this.startTime = Date.now() - startTimeOffset;

				setLoadingText("Updating phases...");
				const timeOfDay =
					((Date.now() - this.startTime) %
						this.options.cycleDuration) /
					this.options.cycleDuration;

				this.updatePhases(timeOfDay);
				this.updateCelestialBodies(timeOfDay);
				this.updateClock(timeOfDay);
				this.updateWindowLights(timeOfDay);

				setLoadingText("Starting animation...");
				return this.delay(50);
			})
			.then(() => {
				this.isInitialized = true;
				this.loadingComplete = true;

				this.animate();
				this.airplaneMovement();
				this.ufoRandomMovement();

				this.ufoMovementInterval = setInterval(() => {
					if (this.isPlaying && this.ufo) {
						this.ufoRandomMovement();
					}
				}, 1000 + Math.random() * 2000);

				clearTimeout(timeoutId);

				if (this.loadingOverlay) {
					setTimeout(() => {
						this.loadingOverlay.style.display = "none";
					}, 500);
				}
			})
			.catch((error) => {
				console.error("Error in chained initialization:", error);
				const emergencyBtn =
					document.getElementById("emergency-refresh");
				if (emergencyBtn) {
					emergencyBtn.classList.add("visible");
					setLoadingText(
						"Error during initialization. Please refresh."
					);
				}
				clearTimeout(timeoutId);
			});
	}

	// OPTIMIZED: Helper method - Simple delay promise
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// OPTIMIZED: Star creation using requestAnimationFrame batching
	setupStarsOptimized() {
		return new Promise((resolve) => {
			if (!this.starContainer) {
				this.starContainer = document.getElementById("stars");
				if (!this.starContainer) {
					console.error("Star container not found");
					resolve();
					return;
				}
			}

			this.starContainer.innerHTML = "";

			const starCount = Math.floor(Math.random() * 50) + 100;
			const batchSize = 30;
			let currentBatch = 0;

			const createNextBatch = () => {
				const startIdx = currentBatch * batchSize;
				const endIdx = Math.min(startIdx + batchSize, starCount);
				const fragment = document.createDocumentFragment();

				for (let i = startIdx; i < endIdx; i++) {
					const star = document.createElement("div");
					star.className = "star";
					star.style.top = Math.random() * 100 + "%";
					star.style.left = Math.random() * 100 + "%";

					const size = Math.random() * 1.5 + 0.5;
					star.style.width = size + "px";
					star.style.height = size + "px";
					star.style.opacity = (Math.random() * 0.8 + 0.2).toString();

					fragment.appendChild(star);
				}

				this.starContainer.appendChild(fragment);

				currentBatch++;
				if (endIdx < starCount) {
					requestAnimationFrame(createNextBatch);
				} else {
					log("Stars setup complete");
					resolve();
				}
			};

			requestAnimationFrame(createNextBatch);
		});
	}

	// OPTIMIZED: Building creation
	createBuildingsOptimized() {
		return new Promise((resolve) => {
			const cityscape = document.getElementById("cityscape");
			if (!cityscape) {
				console.error("Cityscape element not found");
				resolve();
				return;
			}

			const existingBuildings = document.querySelectorAll(".building");
			existingBuildings.forEach((building) => building.remove());

			const buildingCount = this.options.buildingCount;
			const batchSize = 8;
			let currentBatch = 0;

			const createNextBatch = () => {
				const startIdx = currentBatch * batchSize;
				const endIdx = Math.min(startIdx + batchSize, buildingCount);
				const fragment = document.createDocumentFragment();

				for (let i = startIdx; i < endIdx; i++) {
					try {
						const building = document.createElement("div");
						building.className = "building";

						const width = Math.floor(Math.random() * 150) + 50;
						const height = Math.floor(Math.random() * 400) + 150;

						building.style.width = width + "px";
						building.style.height = height + "px";
						building.style.left =
							Math.floor(Math.random() * 90) + "%";

						const floorCount = Math.floor(height / 30);
						for (let j = 0; j < floorCount; j++) {
							const floor = document.createElement("div");
							floor.className = "floor";

							const windowCount = Math.floor(width / 20);
							for (let k = 0; k < windowCount; k++) {
								const window = document.createElement("div");
								window.className = "window";

								if (Math.random() < 0.7) {
									this.windowObjects.push({
										element: window,
										state: "off",
										hasBeenOn: false,
										building: true,
									});
								}

								floor.appendChild(window);
							}
							building.appendChild(floor);
						}

						fragment.appendChild(building);
					} catch (error) {
						console.error(`Error creating building ${i}:`, error);
					}
				}

				cityscape.appendChild(fragment);
				currentBatch++;

				if (endIdx < buildingCount) {
					requestAnimationFrame(createNextBatch);
				} else {
					log("Buildings created");
					resolve();
				}
			};

			requestAnimationFrame(createNextBatch);
		});
	}

	// OPTIMIZED: House creation
	createHousesOptimized() {
		return new Promise((resolve) => {
			const existingHouses = this.cityscape.querySelectorAll(".house");
			existingHouses.forEach((house) => house.remove());

			this.windowObjects = this.windowObjects.filter((w) => w.building);

			const houseColors = [
				"#FFB6C1",
				"#FFEB3B",
				"#64B5F6",
				"#FA8072",
				"#FFA726",
				"#81C784",
				"#BA68C8",
			];
			const roofColors = [
				"#212121",
				"#795548",
				"#BDBDBD",
				"#2E7D32",
				"#C62828",
				"#4527A0",
				"#1565C0",
			];
			const doorColors = [
				"#D32F2F",
				"#FBC02D",
				"#6A1B9A",
				"#1565C0",
				"#4E342E",
			];

			const houseCount = Math.floor(Math.random() * 6) + 6;
			const containerWidth = window.innerWidth;
			const minSpacing = 130;

			const positions = [];
			for (let i = 0; i <= houseCount; i++) {
				let x;
				do {
					x = Math.random() * (containerWidth - 120);
				} while (
					positions.some((pos) => Math.abs(pos - x) < minSpacing)
				);
				positions.push(x);
			}

			const fragment = document.createDocumentFragment();

			positions.forEach((x) => {
				const house = document.createElement("div");
				house.className = "house";

				const height = Math.random() * 30 + 80;
				house.style.height = `${height}px`;

				const houseColor =
					houseColors[Math.floor(Math.random() * houseColors.length)];
				const roofColor =
					roofColors[Math.floor(Math.random() * roofColors.length)];
				const doorColor =
					doorColors[Math.floor(Math.random() * doorColors.length)];

				const roof = document.createElement("div");
				roof.className = "roof";
				roof.style.backgroundColor = roofColor;
				house.appendChild(roof);

				const door = document.createElement("div");
				door.className = "door";
				door.style.backgroundColor = doorColor;
				house.appendChild(door);

				house.style.backgroundColor = houseColor;
				house.style.left = `${x}px`;
				house.style.zIndex = 20;

				const leftWindow = document.createElement("div");
				leftWindow.className = "house-window-left";
				this.windowObjects.push({
					element: leftWindow,
					state: "off",
					hasBeenOn: false,
					building: false,
					floor: 0,
					position: 0,
				});
				house.appendChild(leftWindow);

				const rightWindow = document.createElement("div");
				rightWindow.className = "house-window-right";
				this.windowObjects.push({
					element: rightWindow,
					state: "off",
					hasBeenOn: false,
					building: false,
					floor: 0,
					position: 1,
				});
				house.appendChild(rightWindow);

				fragment.appendChild(house);
			});

			this.cityscape.appendChild(fragment);
			log("Houses created");
			resolve();
		});
	}

	setupCelestialBodies() {
		log("Setting up celestial bodies");
		setLoadingText("setupCelestialBodies()...");

		if (!this.sun) {
			this.sun = document.getElementById("sun");
			if (!this.sun) {
				log("ERROR: Sun element not found");
				return;
			}
			setLoadingText("setupCelestialBodies() loaded Sun.");
		}

		if (!this.moon) {
			this.moon = document.getElementById("moon");
			if (!this.moon) {
				log("ERROR: Moon element not found");
				return;
			}
			setLoadingText("setupCelestialBodies() loaded Moon.");
		}

		this.sun.className = "sun";
		this.moon.className = "moon";

		if (this.moon.querySelectorAll(".moon-crater").length === 0) {
			for (let i = 0; i < 4; i++) {
				const crater = document.createElement("div");
				crater.className = "moon-crater";
				this.moon.appendChild(crater);
			}
			setLoadingText("setupCelestialBodies() Setup Moon Craters.");
		}

		log("Celestial bodies setup complete");
	}

	setupClouds() {
		const existingClouds = document.querySelectorAll(".cloud");
		existingClouds.forEach((cloud) => cloud.remove());
		this.clouds = [];

		this.minClouds = 3;
		this.maxClouds = 6;

		for (let i = 0; i < this.minClouds; i++) {
			this.createCloud(true);
		}
	}

	createCloud(randomizePosition = false) {
		const cloud = document.createElement("div");
		cloud.className = "cloud";

		const width = 100 + Math.random() * 100;
		const height = 40 + Math.random() * 30;
		const speed = 0.02 + Math.random() * 0.03;

		cloud.style.width = width + "px";
		cloud.style.height = height + "px";
		cloud.style.top = Math.random() * 40 + "%";

		if (randomizePosition) {
			cloud.style.left = Math.random() * 100 + "%";
		} else {
			cloud.style.left = "-20%";
		}

		cloud.dataset.speed = speed;

		document.getElementById("clouds").appendChild(cloud);
		this.clouds.push(cloud);

		if (this.clouds.length > this.maxClouds) {
			const oldCloud = this.clouds.shift();
			oldCloud.remove();
		}

		return cloud;
	}

	updateClouds() {
		const remainingClouds = [];

		for (const cloud of this.clouds) {
			const left = parseFloat(cloud.style.left);
			const speed = parseFloat(cloud.dataset.speed);

			if (left <= 120) {
				cloud.style.left = left + speed + "%";
				remainingClouds.push(cloud);
			} else {
				cloud.remove();
			}
		}

		this.clouds = remainingClouds;

		if (Math.random() < 0.01 && this.clouds.length < this.maxClouds) {
			this.createCloud(false);
		} else if (this.clouds.length < this.minClouds) {
			this.createCloud(false);
		}
	}

	updateCelestialBodies(timeOfDay) {
		const hourOfDay = timeOfDay * 24;

		if (hourOfDay >= 5.5 && hourOfDay <= 20) {
			const sunDayLength = 14.5;
			const sunProgress = (hourOfDay - 5.5) / sunDayLength;

			this.sun.style.opacity = "1";
			this.sun.classList.add("visible");

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			const totalWidth = viewportWidth + 1000;
			const xPos = -500 + totalWidth * sunProgress;

			const normalizedX = sunProgress - 0.5;
			const a = 4;
			const k = 0.05;
			const yPercent = a * Math.pow(normalizedX, 2) + k;

			const yPos = yPercent * viewportHeight;

			this.sun.style.left = `${xPos}px`;
			this.sun.style.top = `${yPos}px`;

			const brightness = Math.min(1, 1 - Math.abs(sunProgress - 0.5) * 2);

			const baseSunColor = [255, 221, 0];
			const sunsetColor = [255, 140, 0];
			const sunColor = this.interpolateColor(
				sunsetColor,
				baseSunColor,
				brightness
			);

			const rgbSunColor = `rgb(${sunColor[0]}, ${sunColor[1]}, ${sunColor[2]})`;
			this.sun.style.backgroundColor = rgbSunColor;
			this.sun.style.boxShadow = `0 0 ${
				30 * brightness
			}px ${rgbSunColor}, 0 0 ${60 * brightness}px rgb(255, 187, 0)`;
		} else {
			this.sun.style.opacity = "0";
			this.sun.classList.remove("visible");
		}

		if (hourOfDay >= 18 || hourOfDay <= 5.5) {
			let moonProgress;

			const moonNightLength = 11.5;

			if (hourOfDay >= 18) {
				moonProgress = (hourOfDay - 18) / moonNightLength;
			} else {
				moonProgress = (hourOfDay + 6) / moonNightLength;
			}

			this.moon.style.opacity = "1";
			this.moon.classList.add("visible");

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			const totalWidth = viewportWidth + 1000;
			const xPos = -500 + totalWidth * moonProgress;

			const normalizedX = moonProgress - 0.5;
			const a = 4;
			const k = 0.05;
			const yPercent = a * Math.pow(normalizedX, 2) + k;

			const yPos = yPercent * viewportHeight;

			this.moon.style.left = `${xPos}px`;
			this.moon.style.top = `${yPos}px`;
		} else {
			this.moon.style.opacity = "0";
			this.moon.classList.remove("visible");
		}

		let starOpacity = 0;
		if (hourOfDay >= 19 || hourOfDay < 5) {
			starOpacity = 1;
		} else if (hourOfDay >= 5 && hourOfDay < 7) {
			starOpacity = 1 - (hourOfDay - 5) / 2;
		} else if (hourOfDay >= 17 && hourOfDay < 19) {
			starOpacity = (hourOfDay - 17) / 2;
		}

		this.starContainer.style.opacity = starOpacity.toString();
	}

	updatePhases(timeOfDay) {
		try {
			const currentTime = timeOfDay * 24;
			let currentPhase;

			const skyLayers = {
				dawn: document.querySelector(".sky-layer.dawn"),
				day: document.querySelector(".sky-layer.day"),
				dusk: document.querySelector(".sky-layer.dusk"),
				night: document.querySelector(".sky-layer.night"),
			};

			Object.values(skyLayers).forEach((layer) => {
				if (layer) {
					layer.classList.add("hidden");
					layer.style.opacity = 0;
				}
			});

			if (currentTime >= 5 && currentTime < 7) {
				currentPhase = "dawn";
				if (skyLayers.dawn) {
					skyLayers.dawn.classList.remove("hidden");
					skyLayers.dawn.style.opacity = 1;

					const progress = (currentTime - 5) / 2;
					if (skyLayers.day) {
						skyLayers.day.classList.remove("hidden");
						skyLayers.day.style.opacity = progress;
					}
				}
			} else if (currentTime >= 7 && currentTime < 18) {
				currentPhase = "day";
				if (skyLayers.day) {
					skyLayers.day.classList.remove("hidden");
					skyLayers.day.style.opacity = 1;
				}
			} else if (currentTime >= 18 && currentTime < 20) {
				currentPhase = "dusk";
				if (skyLayers.dusk) {
					skyLayers.dusk.classList.remove("hidden");
					skyLayers.dusk.style.opacity = 1;

					const progress = (currentTime - 18) / 2;
					if (skyLayers.night) {
						skyLayers.night.classList.remove("hidden");
						skyLayers.night.style.opacity = progress;
					}
				}
			} else {
				currentPhase = "night";
				if (skyLayers.night) {
					skyLayers.night.classList.remove("hidden");
					skyLayers.night.style.opacity = 1;
				}
			}

			if (this.lampLights && this.lampLights.length > 0) {
				for (let i = 0; i < this.lampLights.length; i++) {
					const light = this.lampLights[i];
					const down = this.lampDowns[i];

					if (currentPhase === "night" || currentPhase === "dusk") {
						light.classList.remove("day");
						light.classList.add("night");

						if (down) {
							down.classList.add("night");
						}
					} else {
						light.classList.remove("night");
						light.classList.add("day");

						if (down) {
							down.classList.remove("night");
						}
					}
				}
			}

			this.updateWindowLights(timeOfDay);
			this.updateClock(timeOfDay);
		} catch (error) {
			console.error("Error in updatePhases:", error);
		}
	}

	updateClock(timeOfDay) {
		const totalMinutes = timeOfDay * 24 * 60;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = Math.floor(totalMinutes % 60);

		const hours12 = hours % 12 || 12;
		const ampm = hours >= 12 ? "PM" : "AM";

		this.digitalClock.textContent = `${hours12}:${String(minutes).padStart(
			2,
			"0"
		)} ${ampm}`;

		if (this.hourHand && this.minuteHand) {
			const hourAngle = (hours % 12) * 30 + minutes * 0.5;
			this.hourHand.style.transform = `rotate(${hourAngle}deg)`;

			const minuteAngle = minutes * 6;
			this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;

			if (Math.random() < 0.01) {
				log(
					`Updating clock - Time: ${hours12}:${String(
						minutes
					).padStart(2, "0")} ${ampm}`
				);
				log(
					`Hour hand angle: ${hourAngle}deg, Minute hand angle: ${minuteAngle}deg`
				);
			}
		} else if (Math.random() < 0.01) {
			log(
				"WARNING: Hour or minute hand references missing in updateClock"
			);
			log(
				`hourHand exists: ${!!this
					.hourHand}, minuteHand exists: ${!!this.minuteHand}`
			);
		}
	}

	updateWindowLights(timeOfDay) {
		const now = Date.now();
		if (now - this.lastWindowUpdate < 500) {
			return;
		}
		this.lastWindowUpdate = now;

		try {
			const hours = timeOfDay * 24;

			if (hours >= 7 && hours < 8 && !this.isNewDay) {
				this.windowObjects.forEach((window) => {
					window.hasBeenOn = false;
					window.state = "off";
					window.element.classList.remove("lit");
				});
				this.isNewDay = true;
				console.log("New day started - window states reset");
			} else if (hours < 7 || hours >= 8) {
				this.isNewDay = false;
			}

			let litPercentage = 0;

			if (hours >= 7 && hours < 17) {
				litPercentage = 0;
			} else if (hours >= 17 && hours < 19) {
				litPercentage = 0.1 + 0.25 * ((hours - 17) / 2);
			} else if (hours >= 19 && hours < 23) {
				litPercentage = 0.35 - 0.25 * ((hours - 19) / 4);
			} else {
				litPercentage = 0;
			}

			const buildingWindows = this.windowObjects.filter(
				(w) => w.building
			);

			const totalBuildingWindows = buildingWindows.length;
			const targetLitCount = Math.floor(
				totalBuildingWindows * litPercentage
			);

			const currentlyLitWindows = buildingWindows.filter(
				(w) => w.state === "on"
			).length;

			if (currentlyLitWindows < targetLitCount) {
				const eligibleWindows = buildingWindows.filter(
					(w) => w.state === "off" && !w.hasBeenOn
				);

				this.shuffleArray(eligibleWindows);

				const windowsToLight = eligibleWindows.slice(
					0,
					Math.min(
						targetLitCount - currentlyLitWindows,
						eligibleWindows.length
					)
				);

				windowsToLight.forEach((window) => {
					window.state = "on";
					window.hasBeenOn = true;
					window.element.classList.add("lit");
				});
			} else if (currentlyLitWindows > targetLitCount) {
				const litWindows = buildingWindows.filter(
					(w) => w.state === "on"
				);

				this.shuffleArray(litWindows);

				const windowsToTurnOff = litWindows.slice(
					0,
					currentlyLitWindows - targetLitCount
				);

				windowsToTurnOff.forEach((window) => {
					window.state = "off";
					window.element.classList.remove("lit");
				});
			}

			const houseWindows = this.windowObjects.filter((w) => !w.building);

			houseWindows.forEach((window) => {
				const shouldBeLit = hours >= 17 && hours < 23;

				if (
					shouldBeLit &&
					window.state === "off" &&
					!window.hasBeenOn
				) {
					window.state = "on";
					window.hasBeenOn = true;
					window.element.classList.add("lit");
				} else if (!shouldBeLit && window.state === "on") {
					window.state = "off";
					window.element.classList.remove("lit");
				}
			});
		} catch (error) {
			console.error("Error updating window lights:", error);
		}
	}

	calculateWindowTurnOffTime() {
		let x, y;
		do {
			x = Math.random() * 7 + 18;
			y = Math.random() * 0.2;
		} while (y > this.gaussianMixturePDF(x));

		return x;
	}

	gaussianMixturePDF(x) {
		const mu1 = 8 + 18;
		const sigma1 = Math.sqrt(5);
		const w1 = 0.7;

		const mu2 = 4 + 18;
		const sigma2 = Math.sqrt(10);
		const w2 = 0.3;

		function normalPDF(x, mu, sigma) {
			return (
				(1 / (Math.sqrt(2 * Math.PI) * sigma)) *
				Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma))
			);
		}

		return w1 * normalPDF(x, mu1, sigma1) + w2 * normalPDF(x, mu2, sigma2);
	}

	calculateCelestialPosition(progress, body) {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		const startX = -200;
		const endX = viewportWidth + 200;
		const x = startX + progress * (endX - startX);

		const h = viewportWidth / 2;
		const k = 10;

		const maxDistance = Math.max(h + 200, viewportWidth + 200 - h);
		const a =
			maxDistance > 0
				? (viewportHeight - k) / (maxDistance * maxDistance)
				: 0.001;

		let y;
		try {
			y = a * Math.pow(x - h, 2) + k;

			if (isNaN(y) || !isFinite(y)) {
				y = viewportHeight / 2;
			}
		} catch (e) {
			console.error("Error calculating celestial position:", e);
			y = viewportHeight / 2;
		}

		y = Math.max(10, Math.min(y, viewportHeight));

		return { x, y };
	}

	interpolateColor(color1, color2, factor) {
		const c1 = this.parseColor(color1);
		const c2 = this.parseColor(color2);

		const r = Math.round(c1.r + (c2.r - c1.r) * factor);
		const g = Math.round(c1.g + (c2.g - c1.g) * factor);
		const b = Math.round(c1.b + (c2.b - c1.b) * factor);

		return `rgb(${r}, ${g}, ${b})`;
	}

	parseColor(color) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = color;
		return {
			r: parseInt(ctx.fillStyle.slice(1, 3), 16),
			g: parseInt(ctx.fillStyle.slice(3, 5), 16),
			b: parseInt(ctx.fillStyle.slice(5, 7), 16),
		};
	}

	setupEventListeners() {
		this.eventHandlers.visibilityChange = () => {
			log(
				`Visibility changed: ${document.hidden ? "hidden" : "visible"}`
			);
			if (document.hidden) {
				if (this.isPlaying) {
					this.pause();
					this.wasPlayingBeforeHidden = true;
				}
			} else if (this.wasPlayingBeforeHidden) {
				this.play();
				this.wasPlayingBeforeHidden = false;
			}
		};
		document.addEventListener(
			"visibilitychange",
			this.eventHandlers.visibilityChange
		);

		if (this.playPauseBtn) {
			this.eventHandlers.playPauseClick = () => {
				if (this.isPlaying) {
					this.pause();
				} else {
					this.play();
				}
			};
			this.playPauseBtn.addEventListener(
				"click",
				this.eventHandlers.playPauseClick
			);
		}

		if (this.resetBtn) {
			this.eventHandlers.resetClick = () => {
				const startTimeOffset = 0.23 * this.options.cycleDuration;
				this.startTime = Date.now() - startTimeOffset;

				if (!this.isPlaying) {
					this.play();
				}
			};
			this.resetBtn.addEventListener(
				"click",
				this.eventHandlers.resetClick
			);
		}

		if (this.speedSlider) {
			this.speedDisplay = document.getElementById("speedDisplay");

			this.eventHandlers.speedChange = (e) => {
				const now = Date.now();
				const elapsed = now - this.startTime;
				const currentProgress =
					(elapsed % this.options.cycleDuration) /
					this.options.cycleDuration;

				const sliderValue = parseFloat(e.target.value);
				this.options.cycleDuration = sliderValue;

				if (this.speedDisplay) {
					const minutes = Math.floor(sliderValue / 60000);
					const seconds = Math.floor((sliderValue % 60000) / 1000);
					this.speedDisplay.textContent = `${minutes}:${seconds
						.toString()
						.padStart(2, "0")}`;
				}

				this.startTime =
					now - currentProgress * this.options.cycleDuration;

				const timeOfDay = currentProgress;
				this.updateCelestialBodies(timeOfDay);
			};
			this.speedSlider.addEventListener(
				"input",
				this.eventHandlers.speedChange
			);

			if (this.speedDisplay) {
				const initialValue = parseFloat(this.speedSlider.value);
				const minutes = Math.floor(initialValue / 60000);
				const seconds = Math.floor((initialValue % 60000) / 1000);
				this.speedDisplay.textContent = `${minutes}:${seconds
					.toString()
					.padStart(2, "0")}`;
			}
		}

		if (this.clockToggleBtn) {
			const digitalClock = document.getElementById("digital-clock");
			const analogClock = document.getElementById("analog-clock");

			this.eventHandlers.clockToggle = () => {
				if (digitalClock && analogClock) {
					if (digitalClock.classList.contains("active")) {
						digitalClock.classList.remove("active");
						analogClock.classList.add("active");
						this.clockToggleBtn.classList.add("active");
					} else {
						digitalClock.classList.add("active");
						analogClock.classList.remove("active");
						this.clockToggleBtn.classList.remove("active");
					}
				}
			};
			this.clockToggleBtn.addEventListener(
				"click",
				this.eventHandlers.clockToggle
			);
		}

		this.eventHandlers.resize = () => {
			if (this.startTime) {
				const now = Date.now();
				const elapsed = now - this.startTime;
				const timeOfDay =
					(elapsed % this.options.cycleDuration) /
					this.options.cycleDuration;
				this.updateCelestialBodies(timeOfDay);
			}
		};
		window.addEventListener("resize", this.eventHandlers.resize);

		const emergencyRefreshBtn =
			document.getElementById("emergency-refresh");
		if (emergencyRefreshBtn) {
			emergencyRefreshBtn.addEventListener("click", () => {
				log("Emergency refresh triggered");
				this.cleanup();
				initScene();
			});
		}
	}

	play() {
		log(`play called, isPlaying: ${this.isPlaying}`);

		if (this.isPlaying) {
			return;
		}

		this.isPlaying = true;
		this.isPaused = false;

		this.sun.style.animationPlayState = "running";
		this.moon.style.animationPlayState = "running";

		if (this.ufoWrap) {
			this.ufoWrap.classList.remove(
				"drifting",
				"up",
				"down",
				"diagonalUpRight",
				"diagonalDownRight",
				"diagonalUpLeft",
				"diagonalDownLeft",
				"zoomOffRight",
				"zoomOffLeft",
				"fadeIn"
			);

			const ufoRect = this.ufoWrap.getBoundingClientRect();
			this.ufoWrap.style.transition = "none";
			this.ufoWrap.style.animation = "none";
			if (this.ufoWrap.style.top <= 15) {
				this.ufoWrap.style.top = "15px";
			}
			this.ufoWrap.style.top = `${ufoRect.top}px`;

			this.ufoWrap.style.left = `${ufoRect.left}px`;
			this.ufoWrap.style.animationPlayState = "running";

			const ufoElements = this.ufoWrap.querySelectorAll("*");
			ufoElements.forEach((element) => {
				element.style.animationPlayState = "running";
				element.style.transition = "none";
			});

			if (!this.ufoMovementInterval) {
				this.ufoMovementInterval = setInterval(() => {
					if (this.isPlaying && this.ufo) {
						this.ufoRandomMovement();
					}
				}, 1000 + Math.random() * 3000);
			}
		}

		if (this.clouds && this.clouds.length) {
			this.clouds.forEach((cloud) => {
				if (cloud) {
					cloud.style.transition = "left 0.1s linear";

					const left = parseFloat(cloud.style.left);
					const speed = parseFloat(cloud.dataset.speed);

					setTimeout(() => {
						if (cloud && cloud.parentNode) {
							cloud.style.left = left + speed + "%";
						}
					}, 50);
				}
			});
		}

		if (this.airplane) {
			this.airplane.style.animationPlayState = "running";
		}

		if (this.playPauseBtn) {
			this.playPauseBtn.textContent = "Pause";
		}

		this.ufoRandomMovement();

		this.animate();

		setTimeout(() => {
			if (this.isPlaying && !this.animationRunning) {
				log("Animation not running after play, retrying...");
				this.animate();
			}
		}, 100);
	}

	pause() {
		if (this.isPaused) {
			return;
		}

		this.isPlaying = false;
		this.isPaused = true;

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		this.sun.style.animationPlayState = "paused";
		this.moon.style.animationPlayState = "paused";

		if (this.ufoWrap) {
			this.ufoWrap.classList.remove(
				"drifting",
				"up",
				"down",
				"diagonalUpRight",
				"diagonalDownRight",
				"diagonalUpLeft",
				"diagonalDownLeft",
				"zoomOffRight",
				"zoomOffLeft",
				"fadeIn"
			);

			const ufoRect = this.ufoWrap.getBoundingClientRect();
			this.ufoWrap.style.transition = "none";
			this.ufoWrap.style.animation = "none";
			if (this.ufoWrap.style.top <= 15) {
				this.ufoWrap.style.top = "15px";
			}
			this.ufoWrap.style.top = `${ufoRect.top}px`;

			this.ufoWrap.style.left = `${ufoRect.left}px`;
			this.ufoWrap.style.animationPlayState = "paused";

			const ufoElements = this.ufoWrap.querySelectorAll("*");
			ufoElements.forEach((element) => {
				element.style.animationPlayState = "paused";
				element.style.transition = "none";
			});

			if (this.ufoMovementInterval) {
				clearInterval(this.ufoMovementInterval);
				this.ufoMovementInterval = null;
			}
		}

		if (this.clouds && this.clouds.length) {
			this.clouds.forEach((cloud) => {
				if (cloud) {
					cloud.style.transition = "none";
					const computedStyle = window.getComputedStyle(cloud);
					cloud.style.left = computedStyle.left;
					cloud.style.animationPlayState = "paused";
				}
			});
		}

		if (this.airplane) {
			this.airplane.style.animationPlayState = "paused";
		}

		this.pausedAt = Date.now();

		if (this.playPauseBtn) {
			this.playPauseBtn.textContent = "Play";
		}
	}

	animate() {
		if (!this.isPlaying) {
			return;
		}

		try {
			const now = Date.now();
			const elapsed = now - this.startTime;
			const timeOfDay =
				(elapsed % this.options.cycleDuration) /
				this.options.cycleDuration;

			this.updatePhases(timeOfDay);
			this.updateCelestialBodies(timeOfDay);
			this.updateClock(timeOfDay);
			this.updateClouds();
			this.updateWindowLights(timeOfDay);

			if (this.ufoWrap) {
				const ufoTop = this.ufoWrap.getBoundingClientRect().top;
				if (ufoTop < 15) {
					this.ufoWrap.style.top = "15px";
				}
			}
		} catch (error) {
			console.error("Error in animation loop:", error);
		}

		this.animationFrameId = requestAnimationFrame(() => this.animate());

		this.animationRunning = true;

		if (this.ufoWrap && this.ufoWrap.getBoundingClientRect().top < 15) {
			this.ufoWrap.style.top = "15px";
		}
	}

	checkAnimationStatus() {
		log("Checking animation status...");

		if (this.isPlaying && !this.animationRunning) {
			log("Animation appears to be stalled, restarting...");

			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
			}

			this.animationFrameId = requestAnimationFrame(() => this.animate());
		}
	}

	ufoRandomMovement() {
		if (!this.ufoWrap || !this.ufo) return;

		const ufoRect = this.ufoWrap.getBoundingClientRect();
		const currentTop = ufoRect.top;
		const currentLeft = ufoRect.left;

		if (currentTop <= 15) {
			this.handleUfoAtTop();
			return;
		}

		this.ufoWrap.classList.remove(
			"up",
			"down",
			"diagonalUpRight",
			"diagonalDownRight",
			"diagonalUpLeft",
			"diagonalDownLeft",
			"zoomOffRight",
			"zoomOffLeft",
			"fadeIn"
		);

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		const keepInUpperHalf = Math.random() < 0.9;

		const maxVerticalPosition = keepInUpperHalf
			? viewportHeight * 0.5
			: viewportHeight - 100;

		this.ufoWrap.style.transition = "none";

		this.ufoWrap.style.top = `${currentTop}px`;
		this.ufoWrap.style.left = `${currentLeft}px`;

		void this.ufoWrap.offsetWidth;

		const movementType = Math.floor(Math.random() * 8);

		const transitionDuration = 2.5;

		this.ufoWrap.style.transition = `top ${transitionDuration}s ease-in-out, left ${transitionDuration}s ease-in-out, right ${transitionDuration}s ease-in-out`;

		setTimeout(() => {
			let newTop, newLeft;

			switch (movementType) {
				case 0:
					newTop = Math.max(15, currentTop - 200);
					newLeft = currentLeft;
					console.log("UFO moving up");
					break;
				case 1:
					newTop = Math.min(maxVerticalPosition, currentTop + 200);
					newLeft = currentLeft;
					console.log("UFO moving down");
					break;
				case 2:
					newTop = Math.max(15, currentTop - 150);
					newLeft = Math.min(viewportWidth - 150, currentLeft + 200);
					console.log("UFO moving diagonal up right");
					break;
				case 3:
					newTop = Math.min(maxVerticalPosition, currentTop + 150);
					newLeft = Math.min(viewportWidth - 150, currentLeft + 200);
					console.log("UFO moving diagonal down right");
					break;
				case 4:
					newTop = Math.max(15, currentTop - 150);
					newLeft = Math.max(50, currentLeft - 200);
					console.log("UFO moving diagonal up left");
					break;
				case 5:
					newTop = Math.min(maxVerticalPosition, currentTop + 150);
					newLeft = Math.max(50, currentLeft - 200);
					console.log("UFO moving diagonal down left");
					break;
				case 6:
					this.ufoWrap.style.right = "-110%";
					this.ufoWrap.style.left = "auto";
					console.log("UFO zooming right");
					this.scheduleUfoReturn();
					return;
				case 7:
					this.ufoWrap.style.left = "-110%";
					console.log("UFO zooming left");
					this.scheduleUfoReturn();
					return;
			}

			this.ufoWrap.style.top = `${newTop}px`;
			this.ufoWrap.style.left = `${newLeft}px`;
		}, 20);
	}

	handleUfoAtTop() {
		this.ufoWrap.classList.remove("drifting");
		this.ufoWrap.style.animationPlayState = "paused";

		setTimeout(() => {
			this.ufoWrap.style.opacity = "0";

			setTimeout(() => {
				this.ufoWrap.classList.remove("up");

				const randomLeft = Math.random() * 80 + 10;
				this.ufoWrap.style.left = `${randomLeft}%`;

				this.ufoWrap.style.top = "95vh";

				void this.ufoWrap.offsetWidth;

				this.ufoWrap.style.opacity = "1";

				setTimeout(() => {
					this.ufoWrap.style.transition = "";
					this.ufoWrap.classList.add("down");
					this.ufoWrap.style.animationPlayState = "running";

					setTimeout(() => {
						this.ufoWrap.style.transition = "none";
						this.ufoWrap.classList.remove("down");
						void this.ufoWrap.offsetWidth;
						this.ufoWrap.style.top = "";
						this.ufoWrap.style.transition = "";
						this.ufoWrap.classList.add("drifting");
						this.ufoRandomMovement();
					}, 3000);
				}, 100);
			}, 500);
		}, 5000 + Math.random() * 5000);
	}

	scheduleUfoReturn() {
		if (this.ufoReturnTimeout) {
			clearTimeout(this.ufoReturnTimeout);
		}

		const returnDelay = 3000 + Math.random() * 5000;

		this.ufoReturnTimeout = setTimeout(() => {
			if (!this.ufoWrap || !this.isPlaying) return;

			const viewportWidth = window.innerWidth;
			const randomHeight = 50 + Math.random() * 150;

			const isOffRight = this.ufoWrap.style.right === "-110%";

			this.ufoWrap.style.transition = "none";

			if (isOffRight) {
				this.ufoWrap.style.left = "-110%";
				this.ufoWrap.style.right = "auto";
			} else {
				this.ufoWrap.style.right = "-110%";
				this.ufoWrap.style.left = "auto";
			}

			this.ufoWrap.style.top = `${randomHeight}px`;

			void this.ufoWrap.offsetWidth;

			this.ufoWrap.style.transition =
				"left 3s ease-in-out, right 3s ease-in-out";

			setTimeout(() => {
				if (!this.ufoWrap || !this.isPlaying) return;

				if (isOffRight) {
					this.ufoWrap.style.left = "100px";
				} else {
					this.ufoWrap.style.right = "100px";
				}
			}, 50);
		}, returnDelay);
	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	updateSkyColors(phase, currentTime) {
		try {
			const sceneContainer = document.getElementById("scene-container");
			if (!sceneContainer) return;

			if (phase === "dawn") {
				const progress = (currentTime - 5) / 2;
				let dawnColor;

				if (progress < 0.5) {
					const adjustedProgress = progress * 2;
					dawnColor = this.interpolateColor(
						"#1a1a2e",
						"#d88ae3",
						adjustedProgress
					);
				} else {
					const adjustedProgress = (progress - 0.5) * 2;
					dawnColor = this.interpolateColor(
						"#d88ae3",
						"#87ceeb",
						adjustedProgress
					);
				}

				sceneContainer.style.background = dawnColor;
			} else if (phase === "day") {
				sceneContainer.style.background = "#87ceeb";
			} else if (phase === "dusk") {
				const progress = (currentTime - 18) / 2;
				let duskColor;

				if (progress < 0.5) {
					const adjustedProgress = progress * 2;
					duskColor = this.interpolateColor(
						"#87ceeb",
						"#d88ae3",
						adjustedProgress
					);
				} else {
					const adjustedProgress = (progress - 0.5) * 2;
					duskColor = this.interpolateColor(
						"#d88ae3",
						"#0f0c29",
						adjustedProgress
					);
				}

				sceneContainer.style.background = duskColor;
			} else {
				sceneContainer.style.background = "#0f0c29";
			}
		} catch (error) {
			console.error("Error in updateSkyColors:", error);
			if (phase === "dawn") sceneContainer.style.background = "#87ceeb";
			else if (phase === "day")
				sceneContainer.style.background = "#87ceeb";
			else if (phase === "dusk")
				sceneContainer.style.background = "#614385";
			else sceneContainer.style.background = "#0f0c29";
		}
	}

	airplaneMovement() {
		if (this.airplane) {
			this.airplane.classList.remove("goLeft", "goRight");
			this.airplane.style.top = `${100 + Math.random() * 300}px`;
		}

		if (this.airplane) {
			let spaceTime = Math.random();
			if (spaceTime < 0.2) {
				this.airplane.classList.add("goLeft");
			} else if (spaceTime > -0.2) {
				this.airplane.classList.add("goRight");
			} else {
				this.airplane.classList.remove("goLeft", "goRight");
				this.airplane.classList.add("stopFlying");
			}
		}

		setTimeout(() => {
			this.airplaneMovement();
		}, 5000 + Math.random() * 15000);
	}

	createStreetlamps() {
		const existingLamps = this.cityscape.querySelectorAll(".streetlamp");
		existingLamps.forEach((lamp) => lamp.remove());

		const spacing = 150;
		const lampCount = Math.ceil(window.innerWidth / spacing);

		this.lampLights = [];
		this.lampDowns = [];

		for (let i = 0; i <= lampCount; i++) {
			const lamp = document.createElement("div");
			lamp.className = "streetlamp";
			lamp.style.left = `${i * spacing}px`;

			const light = document.createElement("div");
			light.className = "lamp-light day";

			const down = document.createElement("div");
			down.className = "lamp-down";

			lamp.appendChild(light);
			lamp.appendChild(down);

			this.cityscape.appendChild(lamp);

			this.lampLights.push(light);
			this.lampDowns.push(down);
		}
	}

	cleanup() {
		log("Cleaning up CityScene resources");

		try {
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
				this.animationFrameId = null;
			}

			if (this.ufoMovementInterval) {
				clearInterval(this.ufoMovementInterval);
				this.ufoMovementInterval = null;
			}

			if (typeof heartbeatInterval !== "undefined") {
				clearInterval(heartbeatInterval);
			}

			if (this.eventHandlers.visibilityChange) {
				document.removeEventListener(
					"visibilitychange",
					this.eventHandlers.visibilityChange
				);
			}

			if (this.eventHandlers.playPauseClick && this.playPauseBtn) {
				this.playPauseBtn.removeEventListener(
					"click",
					this.eventHandlers.playPauseClick
				);
			}

			if (this.eventHandlers.resetClick && this.resetBtn) {
				this.resetBtn.removeEventListener(
					"click",
					this.eventHandlers.resetClick
				);
			}

			if (this.eventHandlers.speedChange && this.speedSlider) {
				this.speedSlider.removeEventListener(
					"input",
					this.eventHandlers.speedChange
				);
			}

			if (this.eventHandlers.clockToggle && this.clockToggleBtn) {
				this.clockToggleBtn.removeEventListener(
					"click",
					this.eventHandlers.clockToggle
				);
			}

			if (this.eventHandlers.resize) {
				window.removeEventListener("resize", this.eventHandlers.resize);
			}

			this.isPlaying = false;
			this.isInitialized = false;
			this.loadingComplete = false;

			if (this.loadingOverlay) {
				this.loadingOverlay.style.display = "none";
			}
		} catch (error) {
			console.error("Error during cleanup:", error);
		}

		log("CityScene cleanup complete");
	}
}
