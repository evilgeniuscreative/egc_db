let INFO = {
	main: {
		title: "Ian Kleinfeld, Software Developer, Front End Engineer, with a deep UX, UI, and Design background",
		name: "Ian Kleinfeld",
		logo: "logo.jpg",
		hero1: "hero1.webp",
		hero2: "hero2.webp",
		herolink: "/getstarted",
	},

	socials: {
		github: "https://github.com/evilgeniuscreative/",
		linkedin: "https://linkedin.com/in/iankleinfeld",
		stackoverflow: "https://stackoverflow.com/users/1067156/maxrocket",
		twitter: "https://twitter.com/evilgeniuscrtv",
		instagram: "https://www.instagram.com/evilgeniuscrtv",
		bluesky: "https://bsky.app/profile/evilgeniuscreative.com",
	},

	homepage: {
		title: "Experienced, multifaceted, creative, committed Full Stack and Front-End Developer, Designer, and UX/UI Specialist.",
		description:
			'I\'m a Full Stack and front end developer, with a long UX/UI/Design history. I have 10+ years of experience who enjoys working with collaborative Agile teams, in an "we all win together" environment, with a deep passion for learning new tech and other modern magic. Serious value added.',
	},

	about: {
		title: "Ian Kleinfeld, Software Developer, Front End Engineer, with a deep UX, UI, and Design background.",
		description:
			"I can't even remember how many projects I've worked on over the years for private clients or companies or just for fun. But I always learn a lot of new skills and I love it. Each project is a chance to learn something new about technology, design, people, business, and more. Over the years, I've learned everything from the most basic HTML and CSS to arcane and nearly archaic languages like Freemarker, to battleship size CMSs like Khoros Community or Adobe AEM, to cutting edge web dev modern stacks like React, and Vue, with or without Typescript.",
	},

	designs: {
		title: "I'm passionate about learning, people, and software development / coding as a team sport.",
		description: "Coming soon .",
	},

	animations: {
		title: "Animations for Rally Software explaining Agile Metrics",
		description:
			"A series of animations explaining agile metrics for rally software, to give an idea of how each major agile metric is explaining measured and relates to team performance.",
	},
	articles: {
		title: "Articles",
		description:
			"Chronological collection of my long-form thoughts on programming, leadership, product design, and more.",
	},

	narration_videos: {
		title: "A series of video tutorials on how best to series of video tutorials on how best to use the community.",
		description:
			"All of the videos were written, produced, voiced, and created by me, single-handedly. In this case, I used Camtasia. I am also fluent in Adobe Premier, Audition, Adobe Animate, and iMovie.",
	},
	showImage: {
		title: "Project Image",
		description:
			"Image of a project I worked on that is either a poster or a website that offline",
	},
	projects: [
		{
			id: "City Lights",
			title: "Day to night to day to ...",
			type: ["animation", "frontend", "design"],
			thumb: "images/thumb-city-lights.jpg",
			description:
				"Exploring CSS and Javascript animation with an interactive day-to-night web app. Took a lot longer than it looks, getting everything to work together properly and on the timeline! Just HTML, JavaScript, and CSS. It's complicated, so every now and then it gets hung up loading. Just refresh. Still working that loading kink out.",
			logos: [
				{
					id: "56924",
					software: "HTML5",
					img: "images/icon-html5.png",
				},
				{
					id: "56925",
					software: "JavaScript",
					img: "images/javascript.png",
				},
				{
					id: "56926",
					software: "CSS3",
					img: "images/icon-css3.png",
				},
			],
			linkText: "View Project",
			link: "https://evilgeniuscreative.com/city_lights/",
		},
		{
			id: "AGILE",
			title: "Agile Metrics Explanation Animations",
			type: ["animation", "design"],
			thumb: "images/thumb-animation.jpg",
			description:
				"Animated introductions explaining the basics of multiple Agile Metrics data analysis and performance tracking types for Rally Software. These were placed in the information section of the Rally site to help customer understanding.",
			logos: [
				{
					id: "3211",
					software: "Edge Animate",
					img: "images/edgeanimate.png",
				},
			],
			linkText: "View Project",
			link: "/animation",
		},
		{
			id: "TURBOTAX",
			title: "Intuit Turbotax Out-of-Product-Help Community",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-intuit.jpg",
			description:
				"Enhancing the Intuit Khoros Community, integrating  with various other Intuit apps: React library, data pulled with GraphQL,  A/B/C/D live user testing, Splunk queries &amp; user dashboards, and more.",
			logos: [
				{
					id: "449",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "995",
					software: "React",
					img: "images/react.png",
				},
				{
					id: "7654",
					software: "Splunk",
					img: "images/splunk.png",
				},
				{
					id: "7653",
					software: "GraphQL",
					img: "images/icon-graphql.png",
				},
				{
					id: "891",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "882", software: "jQuery", img: "images/jquery.png" },
				{ id: "875", software: "JSON", img: "images/json.png" },
				{ id: "865", software: "SCSS", img: "images/sass.png" },
				{
					id: "864",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View Project",
			link: "https://ttlc.intuit.com/community/lower-your-debt/discussion/how-or-what-can-i-do-to-lower-my-debts/00/1882396",
		},
		{
			id: "NCDOT",
			title: "Vue vs Google Maps using NCDOT data",
			type: ["frontend", "design"],
			thumb: "images/thumb-ncdot.jpg",
			description:
				"Project just for fun pulling data from the North Carolina Department of transportation's open APIs. Users can discover the traffic and construction incidents around the state via Google Maps.",
			logos: [
				{ id: "0", software: "Vue", img: "images/vuejs.png" },
				{ id: "99", software: "HTML", img: "images/icon-html5.png" },
				{ id: "98", software: "SCSS", img: "images/sass.png" },
				{
					id: "8642",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View Project",
			link: "https://evilgeniuscreative.com/demo_ncdot/",
		},
		{
			id: "VOBI",
			title: "Voice Actor demo site for yours truly",
			type: ["frontend", "design"],
			thumb: "images/thumb-vobi.png",
			description:
				"Voice Acting site for my voice acting work, designed in-browser, built in React 19 + Typescript, responsive, with a Waveform audio player, and of course, my voice acting demos.",
			logos: [
				{ id: "9870", software: "React", img: "images/react.png" },
				{ id: "9871", software: "HTML5", img: "images/icon-html5.png" },
				{ id: "9872", software: "SCSS", img: "images/sass.png" },
				{
					id: "9873",
					software: "Javascript",
					img: "images/javascript.png",
				},
			],
			linkText: "View Project",
			link: "https://voiceoverbyian.com",
		},
		{
			id: "FIDELITY",
			title: "Fidelity Net Benefits Homepage",
			type: ["frontend", "design"],
			thumb: "images/thumb-fidelity.jpg",
			description:
				"Worked with a small team of developers and designers to create the Fidelity net, benefits, designs, and markups in a combination of JavaScript, jQuery, Backbone.js, and SCSS. Image only.",
			logos: [
				{ id: "1", software: "HTML5", img: "images/icon-html5.png" },
				{ id: "97", software: "SCSS", img: "images/sass.png" },
				{
					id: "96",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{
					id: "8641",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View Site demo design",
			link: "https://evilgeniuscreative.com/Fidelity/",
		},
		{
			id: "COAR",
			title: "Cisco OAuth Registry",
			type: ["frontend", "design"],
			what: "screenshot",
			thumb: "images/thumb-coar.jpg",
			description:
				"Working mockup for Cisco OAuth Registry built in Angular 1.x with Typescript in preparation for the completely redesigned, structured Angular 2. This allowed users to renew their OAuth credentials as needed. Many other customizations, designs, mockups, and wireframes for the in-house Enhancements and Bug tracker systerm, being upgraded from an older, Google website building language and framework.",
			logos: [
				{ id: "17", software: "AngularJS", img: "images/angular.png" },
				{
					id: "56",
					software: "Typescript",
					img: "images/typescript.png",
				},
				{ id: "55", software: "Less", img: "images/less.png" },
				{
					id: "8643",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View Example Project",
			link: "https://evilgeniuscreative.com/portfolio/COAR/index.php",
		},
		{
			id: "EA",
			title: "EA Answers Community Mega Menu",
			type: ["frontend", "backend"],
			thumb: "images/thumb-ea.jpg",
			description:
				'As complicated as this "All Boards" mega menu looks, creating it was even more complicated, with data, based on both the site structure, JSON objects, and the number of crazy API algorithms in Freemarker, built in Khoros Community. The site has been updated since this was created in 2021, so this is an image only of the site as it was then.',
			logos: [
				{
					id: "4",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "89",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "88", software: "jQuery", img: "images/jquery.png" },
				{ id: "87", software: "JSON", img: "images/json.png" },
				{ id: "86", software: "SCSS", img: "images/sass.png" },
				{
					id: "8644",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			image: "ea.jpg",
			linkText: "View EA archived screenshot",
			link: "showimage/EA",
		},
		{
			id: "BDIT",
			title: "Best Diners in Town: Atlanta",
			type: ["print", "design"],
			thumb: "images/thumb-bdit.jpg",
			description:
				"A graphic design magazine project introducing Atlanta Restaurants for those who paid to be included in the final printing, to be distributed around Atlanta for promotion. Designed entire magazine.	",
			logos: [
				{
					id: 96813,
					software: "Adobe InDesign",
					img: "images/icon-id.png",
				},
			],
			linkText: "View Magazine",
			link: "http://evilgeniuscreative.com/portfolio/pdf/bdit.php",
		},

		{
			id: "COFFEE",
			title: "Coffee Price Report",
			type: ["print", "design"],
			thumb: "images/thumb-coffee-report.jpg",
			file: "images/print/coffee-report.jpg",
			description:
				"A graphic design project for a Coffee Futures report as an add-on product for aWhere for investors, based on weather and farming data from coffee growing regions around the world. Designed entire report format.	",
			logos: [
				{
					id: 93813,
					software: "Adobe InDesign",
					img: "images/icon-id.png",
				},
			],
			linkText: "View Report",
			link: "http://evilgeniuscreative.com/portfolio/pdf/coffee.php",
		},
		{
			id: "JMP",
			title: "JMP User Community",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-jmpcom.jpg",
			description:
				"Among many dozens of custom components for the JMP Community, created a project and react to allow users to sort articles buy up to six different labels, when out of the box, the limitation was one built a react application on top of a free marker component to make this happen.",
			logos: [
				{
					id: "3",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{ id: "94", software: "React", img: "images/react.png" },
				{ id: "93", software: "Vue", img: "images/vuejs.png" },
				{ id: "997", software: "Angular", img: "images/angular.png" },
				{
					id: "998",
					software: "Typescript",
					img: "images/typescript.png",
				},
				{
					id: "92",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{
					id: "90",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{ id: "90", software: "jQuery", img: "images/jquery.png" },
				{
					id: "8645",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View JMP Community site",
			link: "https://community.jmp.com",
		},

		{
			id: "ROKU",
			title: "Roku Community Homepage Tiles",
			type: ["frontend", "design"],
			thumb: "images/thumb-roku.jpg",
			description:
				"New icon designs and functionality for Roku's community homepage navigation tiles, built in Khoros Community with small bits of UI to engage visitors. Big improvement on original.",
			logos: [
				{
					id: "5",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "85",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "84", software: "SCSS", img: "images/sass.png" },
			],
			linkText: "View Roku site and tiles",
			link: "https://community.roku.com",
		},
		{
			id: "FARMING",
			title: "The Future of Farming Poster",
			type: ["print", "design"],
			thumb: "images/thumb-farming.jpg",
			description:
				"This is a poster graphic design for defunct company aWhere, which was a weather reporting company for third-world farmers. This poster was for a conference in Nairobi on Farming Tech. (2015).",
			logos: [
				{
					id: 96813,
					software: "Adobe InDesign",
					img: "images/icon-id.png",
				},
			],
			image: "farming.jpg",
			linkText: "View Poster image",
			link: "showimage/FARMING",
		},
		{
			id: "BRUNSWICK",
			title: "Brunswick Boating Communities",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-brunswick.jpg",
			description:
				"Four Khoros Communities built within a single Community CMS using top-level categories for boating company and association Brunswick's Sea Ray Boats, Mercury Racing, Boston Whaler, and Ripl.",
			logos: [
				{
					id: "6",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "83",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "82", software: "SCSS", img: "images/sass.png" },
			],
			linkText: "View Community site",
			link: "https://community.brunswick.com/",
		},
		{
			id: "FARMPLAN",
			title: "Weather and crop cycle infographic",
			type: ["print", "design"],
			thumb: "images/thumb-awhere-cycle.jpg",
			description:
				"Infographic depicting the elements that go into farm planning and how that interacts with the weather products offered by aWhere. (2015).",
			logos: [
				{
					id: 27719,
					software: "Adobe Illustrator",
					img: "images/icon-illustrator.png",
				},
			],
			image: "awhere-weather-infographic.jpg",
			linkText: "View Poster image",
			link: "showimage/FARMPLAN",
		},
		{
			id: "GRANNYARC",
			title: "Donut Arc Chart",
			type: ["frontend", "design"],
			thumb: "images/thumb-grannyarc.png",
			description:
				"Simple donut chart showing the number of cats per grandmother",
			logos: [
				{
					id: 813,
					software: "D3.js",
					img: "images/icon-d3.png",
				},
				{
					id: 814,
					software: "HTML5",
					img: "images/icon-html5.png",
				},
			],
			image: "grannyarc.jpg",
			linkText: "View Chart",
			link: "https://evilgeniuscreative.com/portfolio/d3ex/grannies.html",
		},
		{
			id: "MACMILLAN",
			title: "Macmillan Communities redesign",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-mcmillan.jpg",
			description:
				"Integrated a custom menu slide-out that wraps the entire Khoros Community page content, and is populated both by site structure and via JSON for off-community pages. The custom sections are Browse, About, and Help, and the same for their sister sites.",
			logos: [
				{ id: "7", software: "somename", img: "images/khoros.png" },
				{
					id: "81",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "80", software: "SCSS", img: "images/sass.png" },
				{
					id: "79",
					software: "Javascript",
					img: "images/javascript.png",
				},
			],
			linkText: "View Community site",
			link: "https://community.macmillanlearning.com/t5/macmillan-community/ct-p/college",
		},
		{
			id: "SEPHORA",
			title: "Sephora Community custom emails",
			thumb: "images/thumb-sephora.jpg",
			type: ["frontend", "backend", "design"],
			description:
				"Worked closely with Sephora team to customize all Velocity-based Sephora Khoros Community emails to be consistent with the site design and easily understood by users to keep them informed and encourage them to visit the site more often.",
			logos: [
				{
					id: "78",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{ id: "77", software: "Velocity", img: "images/velocity.png" },
				{
					id: "76",
					software: "Fremarker",
					img: "images/freemarker.png",
				},
				{ id: "75", software: "SCSS", img: "images/sass.png" },
			],
			linkText: "View Community site",
			link: "https://community.sephora.com",
		},
		{
			id: "VERIZON",
			title: "Verizon Community custom menu",
			type: ["frontend"],
			thumb: "images/thumb-verizon.jpg",
			description:
				"Recreated a custom JavaScript and HTML menu in Verizon's Khoros Community to better meet their user's needs, as well as numerous other Community customizations as needed.",
			logos: [
				{
					id: "9",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{ id: "74", software: "HTML5", img: "images/icon-html5.png" },
				{
					id: "73",
					software: "Javascript",
					img: "images/javascript.png",
				},
			],
			linkText: "View Community site and menu",
			link: "https://community.verizon.com",
		},
		{
			id: "SPLUNK",
			title: "Splunk Community customization",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-splunk.jpg",
			description:
				"Modified personal information structure of user profile to create the option to give customized lists of content shown to the user that is specifically relevant to them based on their chosen preferences, or to turn that function off.",
			logos: [
				{
					id: "10",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "72",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{ id: "71", software: "HTML5", img: "images/icon-html5.png" },
				{
					id: "8646",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View Splunk Community site",
			link: "https://community.splunk.com",
		},
		{
			id: "INVOCA",
			title: "Invoca customized sign in process",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-invoca.jpg",
			description:
				"Customized sign in process to allow users to register and sign in all in one step, creating automatic usernames based on their email and random numbers or words that users could change if they wanted to.",
			logos: [
				{
					id: "11",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "70",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{
					id: "69",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
			],
			linkText: "View Community site",
			link: "https://community.invoca.com",
		},
		{
			id: "ZOOM",
			title: "Zoom homepage tiles display",
			type: ["frontend", "design"],
			thumb: "images/thumb-zoom.jpg",

			description:
				"Created a customized (and optional) JSON fed tile display for the home page when administrators choose to display them. The JSON can be created by the site administrators and turned on or off in the admin panel.",
			logos: [
				{
					id: "12",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "68",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{
					id: "67",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "65", software: "SCSS", img: "images/sass.png" },
			],
			linkText: "View Community site and tiles",
			link: "https://community.zoom.com",
		},
		{
			id: "SISENSE",
			title: "Salesforce integration",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-sisense.jpg",
			description:
				"Helped to integrate a Salesforce ticket tracking system into the out of the box ticket system, giving Sisense more flexibilty, control, and data sets that they could keep in their own Salesforce instance. This dashboard is only available to administrators.",
			logos: [
				{
					id: "13",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "64",
					software: "Salesforce",
					img: "images/salesforce.png",
				},
				{
					id: "63",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{ id: "62", software: "XML", img: "images/xml.png" },
			],
			linkText: "View Community site",
			link: "https://community.sisense.com",
		},
		{
			id: "JAMF",
			title: "JAMF Community constulting and tutorials",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-jamf.jpg",
			description:
				"Engaged in two months of tutorials with their Community administrative and design staff to customize their site &mdash; starting from scratch with basic HTML and CSS to the point where they can mostly take care of Community changes themselves.",
			logos: [
				{
					id: "14",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{ id: "61", software: "HTML5", img: "images/icon-html5.png" },
				{
					id: "60",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{ id: "59", software: "SCSS", img: "images/sass.png" },
			],
			linkText: "View Community site",
			link: "https://community.jamf.com",
		},
		{
			id: "ESP",
			title: "ESP Nutrition e-Commerce Site",
			type: ["frontend", "design"],
			thumb: "images/thumb-ESP.png",
			description:
				"Nutritional supplement and bodybuilding e-commerce site built in pre-Gutenberg WordPress and Shopped plug-in, with additional custom-made plugins and theme. Shop is offline. (2011).",
			logos: [
				{
					id: "15",
					software: "Wordpress",
					img: "images/wordpress.png",
				},
				{
					id: "999",
					software: "PHP",
					img: "images/php.png",
				},
			],
			image: "ESP.jpg",
			linkText: "View Site screenshot; site offline",
			link: "showimage/ESP",
		},
		{
			id: "XACTLY",
			title: "Xactly Community customizations",
			type: ["frontend", "backend"],
			thumb: "images/thumb-xactly.jpg",
			description:
				"Multiple Khoros Community customizations including an advanced, semi-automated sign in process, automated data filling, significantly improved customized event management to be used by administrators, and more.",
			logos: [
				{
					id: "16",
					software: "Khoros Community",
					img: "images/khoros.png",
				},
				{
					id: "58",
					software: "Freemarker",
					img: "images/freemarker.png",
				},
				{
					id: "57",
					software: "Javascript",
					img: "images/javascript.png",
				},
			],
			linkText: "View Community site",
			link: "https://community.xactlycorp.com",
		},

		{
			id: "WEATHERAPP",
			title: "aWhere: Weather app and Style Guide (2015)",
			type: ["frontend", "design"],
			thumb: "images/thumb-awhere-weather-app.jpg",
			description:
				"Created both a weather app from Angularjs and D3.js to provide farmers in developing countries with accurate weather reports. Also created a living style guide for the company from Angularjs. No longer in business. Weather app image only. (2015)",
			logos: [
				{ id: "18", software: "AngularJS", img: "images/angular.png" },
				{ id: "54", software: "D3js", img: "images/d3.png" },
				{ id: "53", software: "SCSS", img: "images/sass.png" },
				{ id: "52", software: "HTML5", img: "images/icon-html5.png" },
				{
					id: "8647",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "See app screenshot, site offline ",
			image: "weatherapp.jpg",
			link: "showimage/WEATHERAPP",
		},
		{
			id: "JMPCOM",
			title: "JMP.com AEM site work",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-jmp.jpg",
			description:
				"Worked in concert with the marketing and design team to create numerous pages, forms, and both AEM and JavaScript customizations in the JMP (a subsidiary of SAS) AEM company site.",
			logos: [
				{ id: "19", software: "AEM", img: "images/aem.jpg" },
				{ id: "51", software: "Less", img: "images/less.png" },
				{
					id: "50",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{
					id: "8648",
					software: "API",
					img: "images/icon-api.png",
				},
			],
			linkText: "View Community site",
			link: "https://jmp.com",
		},
		{
			id: "JDS",
			title: "AEM Discovery Summit site",
			type: ["frontend", "backend", "design"],
			thumb: "images/thumb-jds.jpg",
			description:
				"Created the original Discovery Summit site and managed various contents and acted as site administrator in AEM. Discovery Summit is an annual meeting of JMP users and developers that offers seminars, tutorials, meetups, and more.",
			logos: [
				{ id: "20", software: "AEM", img: "images/aem.jpg" },
				{ id: "49", software: "Less", img: "images/less.png" },
				{
					id: "48",
					software: "Javascript",
					img: "images/javascript.png",
				},
			],
			linkText: "View Community section",
			link: "https://discoverysummit.jmp",
		},
		{
			id: "CBC",
			title: "Capital Broadcasting Company",
			type: ["frontend", "design"],
			thumb: "images/thumb-cbc.jpg",
			description:
				"In 2014, Capitol Broadcasting Company in Raleigh, NC, needed to renew their ageing site &mdash; this was the chosen design to create the new site. Image only due to many changes on the site since this design.",
			logos: [
				{ id: "219", software: "HTML", img: "images/icon-html5.png" },
				{ id: "141", software: "SASS", img: "images/sass.png" },
				{
					id: "1481",
					software: "Javascript",
					img: "images/javascript.png",
				},
			],
			image: "cbc.jpg",
			linkText: "View Site screenshot, site changed",
			link: "showimage/CBC",
		},
		{
			id: "DANSER",
			title: "Danser Guitar Works",
			type: ["frontend", "design"],
			thumb: "images/thumb-danser.jpg",
			description:
				"Screenshot of a guitar-shaped customized theme and plugins in a Wordpress site for a high-end custom luthier who fixes and builds custom guitars. This design stood for many years until early 2020s, and now the site is no longer this design, now hosted on Wix. (2014).",
			logos: [
				{
					id: "210",
					software: "Wordpress",
					img: "images/wordpress.png",
				},
				{ id: "149", software: "SASS", img: "images/sass.png" },
				{
					id: "148",
					software: "Javascript",
					img: "images/javascript.png",
				},
				{ id: "295", software: "PHP", img: "images/php.png" },
			],
			image: "danser.jpg",
			linkText: "View Site screenshot, site changed",
			link: "showimage/DANSER",
		},
		{
			id: "LOSOLIVOS",
			title: "Los Olivos Online Store",
			type: ["frontend", "design"],
			thumb: "images/thumb-los-olivos.jpg",
			description:
				"Former raw foods online shopping site based on a WordPress Shopp plug-in and customized theme and other customized plugins. Store closed during the pandemic, so only an original mockup is available. (2013).",
			logos: [
				{ id: "2", software: "Wordpress", img: "images/wordpress.png" },
				{ id: "95", software: "PHP", img: "images/php.png" },
			],
			image: "los-olivos.jpg",
			linkText: "View Site screenshot, site offline",
			link: "showimage/LOSOLIVOS",
		},
		{
			id: "Challenger",
			show: false,
			title: "Challenger Disaster Chart",
			type: ["print", "design"],
			thumb: "images/thumb-challenger.jpg",
			description:
				"<p>The power to save lives through proper, simple data visualizations, as seen in these contrasting charts of the causes of the Challenger disaster. (Tufte, Edward, 1997). </p><p>The first chart, created by NASA engineers trying and failing to communicate the dangers of low-outside-temperature launches, and Tufte's redesign, which clearly shows the danger and could have prevented seven tragic deaths and many millions of dollars, as well as damage to public confidence in NASA.</p><p>In healthcare, the stakes are even higher, and can affect thousants or millions of lives. A common lesson in data visualization is that the simpler the chart, the more effective it is. This is a great example of that. A common theme in effective data visualization is to find the simplest way to show the data so it can be instantly understood. Fancier versions can be made later, but the first responsibility is to communicate the information.</p>",
			logos: [
				{
					id: 1997,
					software: "Photoshop",
					img: "images/photoshop.png",
				},
			],
			image: "challenger.jpg",
			linkText: "View Challenger Disaster Chart",
			link: "showimage/Challenger",
		},
	],
	animation: [
		{
			title: "Percentiles",
			thumb: "images/thumb-percentiles.png",
			description:
				"What Percintiles are and how they relate to Agile Metrics",
			link: "https://evilgeniuscreative.com/portfolio/PERCENTILES/percentiles.html",
		},
		{
			title: "Polar Charts",
			thumb: "images/thumb-polar.png",
			description:
				"What are polar charts and how can we use them in Agile Metrics?",
			link: "https://evilgeniuscreative.com/portfolio/POLAR/polar.html",
		},
		{
			title: "Predictability",
			thumb: "images/thumb-predictability.png",
			description: "What part does Predictability have in Agile Metrics",
			link: "https://evilgeniuscreative.com/portfolio/PREDICTABILITY/predictability.html",
		},
		{
			title: "Productivity",
			thumb: "images/thumb-productivity.png",
			description: "How do we best track Productivity in Agile Metrics?",
			link: "https://evilgeniuscreative.com/portfolio/PRODUCTIVITY/productivity.html",
		},
		{
			title: "Quality",
			thumb: "images/thumb-quality.png",
			description:
				"What does Quality mean and how do we understand it in the context of Agile Metrics",
			link: "https://evilgeniuscreative.com/portfolio/QUALITY/quality.html",
		},
		{
			title: "RESPONSIVENESS",
			thumb: "images/thumb-responsiveness.png",
			description:
				"What is Responsiveness in Agile Metrics, what does it mean, and why we should track it.",
			link: "https://evilgeniuscreative.com/portfolio/RESPONSIVENESS/responsiveness.html",
		},
		{
			title: "OVERALL",
			thumb: "images/thumb-overall.png",
			description:
				"Taking all the metrics above and displaying them as a group to get a bigger overview of how the team is doing.",
			link: "https://evilgeniuscreative.com/portfolio/OVERALL/overall.html",
		},
	],
	narration: [
		{
			id: 1,
			title: "JMP Wish List: An Overview",
			url: "https://community.jmp.com/t5/Getting-Started/JMP-Wish-List-An-Overview/ta-p/418995",
			text: "Tutorial on how to add items to it wish list in the JMP Community and follow up on them.",
			// Removed duplicate 'title' key
		},
		{
			id: 2,
			title: "Searching in the Community: An Overview",
			url: "https://community.jmp.com/t5/Getting-Started/Searching-in-the-Community-An-Overview/ta-p/419012",
			text: "First of two part video explaining basic and advanced search functions in the Community.",
		},
		{
			id: 3,
			title: "Searching in the Community: In Depth",
			url: "https://community.jmp.com/t5/Getting-Started/Searching-in-the-Community-In-Depth/ta-p/418996",
			text: "Second of two part video explaining basic and advanced search functions in the Community.",
		},
		{
			id: 4,
			title: "User Profile: Setting Up Your Profile",
			url: "https://community.jmp.com/t5/Getting-Started/User-Profile-Setting-Up-Your-Profile/ta-p/418994",
			text: "Tutorial on how to set up your user profile in the JMP Community.",
		},
		{
			id: 5,
			title: "Community Sections: An Overview",
			url: "https://community.jmp.com/t5/Getting-Started/Community-Sections-An-Overview/ta-p/418993",
			text: "Overview of the different sections of the JMP Community.",
		},
		{
			id: 6,
			title: "JMP Wish List: An Overview",
			url: "https://community.jmp.com/t5/Getting-Started/JMP-Wish-List-An-Overview/ta-p/418995",
			text: "The JMP Wish List, and intro to using it and following the process.",
		},
	],
};

export default INFO;
