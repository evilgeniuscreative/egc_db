import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const result = await login(username, password);

		if (result.success) {
			navigate("/admin");
		} else {
			setError(result.error);
		}

		setLoading(false);
	};

	return (
		<div className="login-page">
			<div className="login-container">
				<div className="login-header">
					<h1>EGC Admin</h1>
					<p>Sign in to manage your portfolio</p>
				</div>

				<form onSubmit={handleSubmit} className="login-form">
					{error && <div className="login-error">{error}</div>}

					<div className="login-field">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoFocus
							autoComplete="username"
						/>
					</div>

					<div className="login-field">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="current-password"
						/>
					</div>

					<button
						type="submit"
						className="login-btn"
						disabled={loading}
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className="login-footer">
					<a href="/">← Back to site</a>
				</div>
			</div>
		</div>
	);
};

export default Login;
