import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API = "http://localhost:8000";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("egc_token"));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			fetch(`${API}/auth.php`, {
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((r) => (r.ok ? r.json() : Promise.reject()))
				.then((d) => setUser(d.user))
				.catch(() => logout())
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, [token]);

	const login = async (username, password) => {
		const r = await fetch(`${API}/auth.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const d = await r.json();
		if (r.ok && d.token) {
			localStorage.setItem("egc_token", d.token);
			setToken(d.token);
			setUser(d.user);
			return { ok: true };
		}
		return { ok: false, error: d.error || "Login failed" };
	};

	const logout = () => {
		localStorage.removeItem("egc_token");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, token, loading, login, logout, isAuth: !!user }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
