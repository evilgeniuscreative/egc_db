import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

const Contact = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [btnText, setBtnText] = useState("Send");
	const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);

		fetch("/recaptcha_config.php")
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((data) => {
				setRecaptchaSiteKey(data.siteKey);
				if (data.siteKey && !window.grecaptcha) {
					const script = document.createElement("script");
					script.src = `https://www.google.com/recaptcha/api.js?render=${data.siteKey}`;
					script.async = true;
					script.defer = true;
					document.body.appendChild(script);
				}
			})
			.catch((err) => {
				console.error("Failed to load reCAPTCHA config:", err);
				const envSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
				if (envSiteKey) {
					setRecaptchaSiteKey(envSiteKey);
					if (!window.grecaptcha) {
						const script = document.createElement("script");
						script.src = `https://www.google.com/recaptcha/api.js?render=${envSiteKey}`;
						script.async = true;
						script.defer = true;
						document.body.appendChild(script);
					}
				}
			});
	}, []);

	const currentSEO = SEO.find((item) => item.page === "contact");

	const validate = () => {
		let errs = {};
		if (!form.name.trim()) errs.name = true;
		if (
			!form.email.trim() ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
		)
			errs.email = true;
		if (!form.message.trim() || form.message.trim().length < 50)
			errs.message = true;
		return errs;
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		if (errors[e.target.name]) {
			setErrors({ ...errors, [e.target.name]: false });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		const validationErrors = validate();
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			setIsSubmitting(true);
			setBtnText("Processing...");

			try {
				if (!window.grecaptcha || !recaptchaSiteKey) {
					setErrors({
						submit: "reCAPTCHA not loaded. Please refresh.",
					});
					setBtnText("Send");
					setIsSubmitting(false);
					return;
				}

				window.grecaptcha.ready(() => {
					window.grecaptcha
						.execute(recaptchaSiteKey, { action: "contact_form" })
						.then(async (token) => {
							await submitFormWithToken(token);
						});
				});
			} catch (error) {
				console.error("Error with reCAPTCHA:", error);
				setErrors({ submit: "reCAPTCHA error. Please try again." });
				setBtnText("Send");
				setIsSubmitting(false);
			}
		}
	};

	async function submitFormWithToken(recaptchaToken) {
		try {
			const formData = new FormData();
			formData.append("name", form.name);
			formData.append("email", form.email);
			formData.append("message", form.message);
			formData.append("g-recaptcha-response", recaptchaToken);

			const response = await fetch("/ml/submit.php", {
				method: "POST",
				body: formData,
			});

			const responseText = await response.text();

			if (
				response.ok &&
				(responseText.includes("Success") ||
					responseText.includes("sent successfully"))
			) {
				setSuccess(true);
				setForm({ name: "", email: "", message: "" });
			} else {
				console.error("Server response:", responseText);
				setErrors({
					submit: responseText || "Failed to send. Please try again.",
				});
			}
		} catch (error) {
			console.error("Error sending form:", error);
			setErrors({
				submit: "Network error. Please check your connection.",
			});
		} finally {
			setBtnText("Send");
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<Helmet>
				<title>{`Contact | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO?.description} />
				<meta
					name="keywords"
					content={currentSEO?.keywords?.join(", ") || ""}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="contact" />
				<main className="content-wrapper">
					<Logo width={99} />

					<section className="contact-section">
						<h1 className="title">
							Let's get started on your project! (Or get a quote).
						</h1>

						<div className="subtitle">
							<p>
								Thanks for your interest in working with me.
								Let's talk about your project. I'm here to help
								you build something amazing and unique,
								reliable, on time, and cost effective.
							</p>
							<p>
								I make an effort to respond to all messages
								within 24 hours during weekdays.
							</p>
						</div>

						{success && (
							<div className="form-success">
								Thank you for sending us a message, we'll get
								back to you within 2 working days. If you need
								to get in touch urgently, please call me at{" "}
								<a href="tel:+19193576004">(919) 357-6004</a> US
								EST 9:30am-6pm only please.
							</div>
						)}

						{!success && (
							<form
								className="contact-form"
								onSubmit={handleSubmit}
								noValidate
							>
								<div className="form-field">
									<label htmlFor="name">Full Name</label>
									<input
										type="text"
										id="name"
										name="name"
										value={form.name}
										onChange={handleChange}
										className={errors.name ? "error" : ""}
										required
									/>
									{errors.name && (
										<span className="error-msg">
											This field is required
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										className={errors.email ? "error" : ""}
										required
									/>
									{errors.email && (
										<span className="error-msg">
											Please enter a valid email
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="message">
										See General Description
									</label>
									<textarea
										id="message"
										name="message"
										rows={10}
										value={form.message}
										onChange={handleChange}
										className={
											errors.message ? "error" : ""
										}
										required
									/>
									<div
										className={
											form.message.length < 50
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.message.length} of 50 characters
										minimum
									</div>
									{errors.message && (
										<span className="error-msg">
											Message must be at least 50
											characters
										</span>
									)}
								</div>

								{errors.submit && (
									<div className="error-msg submit-error">
										{errors.submit}
									</div>
								)}

								<button
									type="submit"
									className="submit-btn"
									disabled={isSubmitting}
								>
									{btnText}
								</button>
							</form>
						)}
					</section>

					<Socials />
					<Footer />
				</main>
			</div>
		</>
	);
};

export default Contact;
