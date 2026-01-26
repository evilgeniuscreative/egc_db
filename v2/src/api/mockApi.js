// Mock API for local development
const MOCK_USER = { id: 1, username: "ian" };
const MOCK_TOKEN = "mock_jwt_token_12345";
const MOCK_PASSWORD = "aB26354!";

// Mock data stores
let mockProjects = [
	{
		id: 1,
		title: "Sample Project",
		type: "web",
		description: "Test project",
		active: 1,
	},
];
let mockArticles = [
	{
		id: 1,
		slug: "test-article",
		title: "Test Article",
		description: "Sample article",
		published: 1,
	},
];
let mockAnimations = [];
let mockNarration = [];
let mockSocials = [
	{
		id: 1,
		platform: "github",
		url: "https://github.com/evilgeniuscreative",
		icon: "faGithub",
		active: 1,
	},
];
let mockPages = [];
let mockSettings = [{ id: 1, k: "site_name", v: "Ian Kleinfeld" }];

const mockData = {
	projects: mockProjects,
	articles: mockArticles,
	animations: mockAnimations,
	narration: mockNarration,
	socials: mockSocials,
	pages: mockPages,
	settings: mockSettings,
};

export const mockApi = {
	auth: {
		login: async (username, password) => {
			await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
			if (username === "ian" && password === MOCK_PASSWORD) {
				return {
					ok: true,
					json: async () => ({ token: MOCK_TOKEN, user: MOCK_USER }),
				};
			}
			return {
				ok: false,
				json: async () => ({ error: "Invalid credentials" }),
			};
		},
		verify: async (token) => {
			await new Promise((r) => setTimeout(r, 200));
			if (token === MOCK_TOKEN) {
				return { ok: true, json: async () => ({ user: MOCK_USER }) };
			}
			return {
				ok: false,
				json: async () => ({ error: "Invalid token" }),
			};
		},
	},

	crud: {
		getAll: async (table) => {
			await new Promise((r) => setTimeout(r, 300));
			return { ok: true, json: async () => mockData[table] || [] };
		},

		getOne: async (table, id) => {
			await new Promise((r) => setTimeout(r, 200));
			const item = mockData[table]?.find((i) => i.id === parseInt(id));
			return item
				? { ok: true, json: async () => item }
				: { ok: false, json: async () => ({ error: "Not found" }) };
		},

		create: async (table, data) => {
			await new Promise((r) => setTimeout(r, 300));
			const newId = Math.max(0, ...mockData[table].map((i) => i.id)) + 1;
			const newItem = { id: newId, ...data };
			mockData[table].push(newItem);
			return { ok: true, json: async () => newItem };
		},

		update: async (table, id, data) => {
			await new Promise((r) => setTimeout(r, 300));
			const index = mockData[table].findIndex(
				(i) => i.id === parseInt(id),
			);
			if (index !== -1) {
				mockData[table][index] = { ...mockData[table][index], ...data };
				return { ok: true, json: async () => mockData[table][index] };
			}
			return { ok: false, json: async () => ({ error: "Not found" }) };
		},

		remove: async (table, id) => {
			await new Promise((r) => setTimeout(r, 300));
			const index = mockData[table].findIndex(
				(i) => i.id === parseInt(id),
			);
			if (index !== -1) {
				mockData[table].splice(index, 1);
				return { ok: true, json: async () => ({ success: true }) };
			}
			return { ok: false, json: async () => ({ error: "Not found" }) };
		},
	},
};
