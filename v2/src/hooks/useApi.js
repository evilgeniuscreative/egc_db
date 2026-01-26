import { useAuth } from "../context/AuthContext";

const API = "http://localhost:8000";

export function useApi() {
	const { token } = useAuth();

	const headers = () => ({
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	});

	const request = async (endpoint, options = {}) => {
		const r = await fetch(`${API}${endpoint}`, {
			...options,
			headers: headers(),
		});
		const d = await r.json();
		if (!r.ok) throw new Error(d.error || "Request failed");
		return d;
	};

	return {
		getAll: (table) => request(`/crud.php?t=${table}`),
		getOne: (table, id) => request(`/crud.php?t=${table}&id=${id}`),
		create: (table, data) =>
			request(`/crud.php?t=${table}`, {
				method: "POST",
				body: JSON.stringify(data),
			}),
		update: (table, id, data) =>
			request(`/crud.php?t=${table}&id=${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),
		remove: (table, id) =>
			request(`/crud.php?t=${table}&id=${id}`, { method: "DELETE" }),
	};
}
