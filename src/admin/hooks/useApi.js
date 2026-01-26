import { useAuth } from "../context/AuthContext";

const API_BASE = "/ml/admin";

export const useApi = () => {
	const { token } = useAuth();

	const fetchApi = async (endpoint, options = {}) => {
		const headers = {
			"Content-Type": "application/json",
			...options.headers,
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(`${API_BASE}${endpoint}`, {
			...options,
			headers,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || "API request failed");
		}

		return data;
	};

	const getAll = (table) => fetchApi(`/api.php?table=${table}`);

	const getOne = (table, id) => fetchApi(`/api.php?table=${table}&id=${id}`);

	const create = (table, data) =>
		fetchApi(`/api.php?table=${table}`, {
			method: "POST",
			body: JSON.stringify(data),
		});

	const update = (table, id, data) =>
		fetchApi(`/api.php?table=${table}&id=${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});

	const remove = (table, id) =>
		fetchApi(`/api.php?table=${table}&id=${id}`, {
			method: "DELETE",
		});

	const reorder = (table, items) =>
		fetchApi(`/api.php?table=${table}&action=reorder`, {
			method: "POST",
			body: JSON.stringify({ items }),
		});

	return { getAll, getOne, create, update, remove, reorder };
};

export default useApi;
