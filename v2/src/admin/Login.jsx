import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await login(username, password);
		if (result.ok) {
			navigate("/admin");
		} else {
			setError(result.error);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#1a1a2e",
			}}
		>
			<div
				style={{
					background: "white",
					padding: "40px",
					borderRadius: "8px",
					width: "100%",
					maxWidth: "400px",
				}}
			>
				<h1 style={{ margin: "0 0 20px", color: "#00d4ff" }}>
					EGC Admin
				</h1>
				{error && (
					<div
						style={{
							background: "#ffebee",
							color: "#c62828",
							padding: "10px",
							borderRadius: "4px",
							marginBottom: "15px",
						}}
					>
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: "15px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "500",
							}}
						>
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							style={{
								width: "100%",
								padding: "10px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
						/>
					</div>
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "500",
							}}
						>
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							style={{
								width: "100%",
								padding: "10px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
						/>
					</div>
					<button
						type="submit"
						style={{
							width: "100%",
							padding: "12px",
							background: "#00d4ff",
							color: "#1a1a2e",
							border: "none",
							borderRadius: "4px",
							fontWeight: "600",
							cursor: "pointer",
						}}
					>
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
}
