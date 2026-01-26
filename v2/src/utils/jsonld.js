export const personSchema = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Ian Kleinfeld",
	jobTitle: "Full Stack Developer",
	url: "https://evilgeniuscreative.com",
	sameAs: [
		"https://github.com/evilgeniuscreative",
		"https://linkedin.com/in/iankleinfeld",
		"https://stackoverflow.com/users/1067156/maxrocket",
	],
	knowsAbout: [
		"React",
		"JavaScript",
		"Full Stack Development",
		"UX Design",
		"UI Design",
	],
};

export const articleSchema = (article) => ({
	"@context": "https://schema.org",
	"@type": "Article",
	headline: article.title,
	description: article.description,
	author: { "@type": "Person", name: "Ian Kleinfeld" },
	datePublished: article.published_at,
	image: `https://evilgeniuscreative.com/images/${article.image}`,
});

export const portfolioSchema = {
	"@context": "https://schema.org",
	"@type": "CreativeWork",
	name: "Ian Kleinfeld Portfolio",
	creator: { "@type": "Person", name: "Ian Kleinfeld" },
	url: "https://evilgeniuscreative.com",
};
