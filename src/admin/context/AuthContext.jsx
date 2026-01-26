import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = "/ml/admin";

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("egc_admin_token"));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			verifyToken();
		} else {
			setLoading(false);
		}
	}, []);

	const verifyToken = async () => {
		try {
			const response = await fetch(`${API_BASE}/auth.php`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUser(data.user);
			} else {
				logout();
			}
		} catch (error) {
			console.error("Token verification failed:", error);
			logout();
		} finally {
			setLoading(false);
		}
	};

	const login = async (username, password) => {
		try {
			const response = await fetch(`${API_BASE}/auth.php`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (response.ok && data.token) {
				localStorage.setItem("egc_admin_token", data.token);
				setToken(data.token);
				setUser(data.user);
				return { success: true };
			} else {
				return { success: false, error: data.error || "Login failed" };
			}
		} catch (error) {
			return { success: false, error: "Network error" };
		}
	};

	const logout = () => {
		localStorage.removeItem("egc_admin_token");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				login,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
