/**
 * Filename: contact.jsx
 * Location: /src/pages/
 *
 * Simple contact form for Evil Genius Creative website
 *
 * Variables:
 * - form: Object with name, email, message fields
 * - recaptchaSiteKey: Dynamic reCAPTCHA site key from backend
 * - errors: Form validation error states
 * - success: Form submission success state
 * - isSubmitting: Form submission loading state
 *
 * Features:
 * - Basic contact form validation
 * - reCAPTCHA v3 integration (invisible)
 * - Real-time character counting for message field
 * - Integration with PHP backend mail system
 *
 * Instructions:
 * 1. Requires recaptcha_config.php endpoint for dynamic site key
 * 2. Submits to /submit.php with basic contact data
 * 3. Uses reCAPTCHA v3 action: 'contact_form'
 * 4. Minimum 50 characters required for message field
 */

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
	// FORM STATE: Main form data object
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	// UI STATE: Form validation and submission states
	const [errors, setErrors] = useState({}); // Field-specific error messages
	const [success, setSuccess] = useState(false); // Success message display flag
	const [isSubmitting, setIsSubmitting] = useState(false); // Loading state during submission
	const [btnText, setBtnText] = useState("Send"); // Dynamic button text
	const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(""); // reCAPTCHA key from backend

	// COMPONENT INITIALIZATION: Set up page and load reCAPTCHA
	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to top when component loads

		// SECURITY: Fetch dynamic reCAPTCHA site key from backend
		fetch("/recaptcha_config.php")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}: ${res.statusText}`);
				}
				return res.json();
			})
			.then((data) => {
				console.log("reCAPTCHA config loaded:", data);
				setRecaptchaSiteKey(data.siteKey);

				// RECAPTCHA: Load Google reCAPTCHA v3 script dynamically
				if (data.siteKey && !window.grecaptcha) {
					const script = document.createElement("script");
					script.src = `https://www.google.com/recaptcha/api.js?render=${data.siteKey}`;
					script.async = true;
					script.defer = true;
					script.onload = () =>
						console.log("reCAPTCHA script loaded");
					script.onerror = () =>
						console.error("reCAPTCHA script failed to load");
					document.body.appendChild(script);
				}
			})
			.catch((err) => {
				console.error("Failed to load reCAPTCHA config:", err);
				// FALLBACK: Use environment variable if backend fails
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
				} else {
					console.error(
						"No reCAPTCHA site key available in environment variables"
					);
				}
			});
	}, []);

	// SEO: Get page-specific SEO metadata
	const currentSEO = SEO.find((item) => item.page === "contact");

	// VALIDATION: Check form fields for errors
	const validate = () => {
		let errs = {};
		if (!form.name.trim()) errs.name = true; // Name is required
		if (
			!form.email.trim() ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) // Email format validation
		)
			errs.email = true;
		if (!form.message.trim() || form.message.trim().length < 50)
			// Minimum 50 characters
			errs.message = true;
		return errs;
	};

	// FORM HANDLING: Update form state and clear errors on input
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value }); // Update form field
		if (errors[e.target.name]) {
			setErrors({ ...errors, [e.target.name]: false }); // Clear error when user types
		}
	};

	// FORM SUBMISSION: Main form submission handler
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form submission

		if (isSubmitting) return; // Prevent double submission

		// VALIDATION: Check all form fields
		const validationErrors = validate();
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			setIsSubmitting(true);
			setBtnText("Processing...");

			try {
				// SECURITY: Check if reCAPTCHA is ready
				if (!window.grecaptcha || !recaptchaSiteKey) {
					setErrors({
						submit: "reCAPTCHA not loaded. Please refresh the page.",
					});
					setBtnText("Send");
					setIsSubmitting(false);
					return;
				}

				// RECAPTCHA: Execute invisible reCAPTCHA v3 verification
				window.grecaptcha.ready(() => {
					window.grecaptcha
						.execute(recaptchaSiteKey, { action: "contact_form" }) // Generate token
						.then(async (token) => {
							await submitFormWithToken(token); // Submit with token
						});
				});
			} catch (error) {
				console.error("Error with reCAPTCHA:", error);
				setErrors({
					submit: "reCAPTCHA error. Please try again.",
				});
				setBtnText("Send");
				setIsSubmitting(false);
			}
		}
	};

	// BACKEND SUBMISSION: Send form data with reCAPTCHA token to PHP backend
	async function submitFormWithToken(recaptchaToken) {
		try {
			// FORM DATA: Prepare data for PHP backend
			const formData = new FormData();
			formData.append("name", form.name); // User's name
			formData.append("email", form.email); // User's email
			formData.append("message", form.message); // Message content
			formData.append("g-recaptcha-response", recaptchaToken); // reCAPTCHA token

			// HTTP REQUEST: Send POST request to PHP mail handler
			const response = await fetch("/ml/submit.php", {
				method: "POST",
				body: formData,
			});

			const responseText = await response.text();

			// SUCCESS HANDLING: Check if submission was successful
			if (
				response.ok &&
				(responseText.includes("Success") ||
					responseText.includes("sent successfully"))
			) {
				setSuccess(true); // Show success message
				setForm({
					// Reset form fields
					name: "",
					email: "",
					message: "",
				});
			} else {
				// ERROR HANDLING: Display server error message
				console.error("Server response:", responseText);
				setErrors({
					submit: responseText || "Failed to send. Please try again.",
				});
			}
		} catch (error) {
			console.error("Error sending form:", error);
			setErrors({
				submit: "Network error. Please check your connection and try again.",
			});
		} finally {
			setBtnText("Send");
			setIsSubmitting(false);
		}
	}

	return (
		<React.Fragment>
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
				<div className="content-wrapper">
					<div className="contact-logo-container">
						<div className="contact-logo">
							<Logo width={99} />
						</div>
					</div>

					<div className="contact-container">
						<div className="title contact-title">
							Connect with Me
						</div>

						<div className="subtitle contact-subtitle">
							<p>
								Thank you for your interest in getting in touch
								with me. I welcome your feedback, questions, and
								suggestions. If you have a specific question or
								comment, please feel free to email me directly
								using the form below, or call{" "}
								<a href="tel:+19193576004">(919) 357-6004</a> US
								EST 9:30am-6pm only please.
							</p>
							<p>
								<a href="https://www.timeanddate.com/time/map/#!cities=207">
									Time zone reference map.
								</a>
							</p>
							<p>
								I make an effort to respond to all messages
								within 24 hours, although it may take me longer
								during busy periods.
							</p>
						</div>

						{/* Success Message */}
						{success && (
							<div className="form-success">
								Thank you for sending us a message, we'll get
								back to you within 2 working days. If you need
								to get in touch urgently, please call me at{" "}
								<a href="tel:+19193576004">(919) 357-6004</a> US
								EST 9:30am-6pm only please.
							</div>
						)}

						{/* Contact Form */}
						{!success && (
							<form
								id="contact-form"
								onSubmit={handleSubmit}
								noValidate
							>
								<div className="field-row">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										id="name"
										name="name"
										value={form.name}
										onChange={handleChange}
										className={
											errors.name ? "field-error" : ""
										}
										required
									/>
								</div>
								{errors.name && (
									<div className="form-error">
										This field is required
									</div>
								)}

								<div className="field-row">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										className={
											errors.email ? "field-error" : ""
										}
										required
									/>
								</div>
								{errors.email && (
									<div className="form-error">
										Please enter a valid email address
									</div>
								)}

								<div className="field-row">
									<label htmlFor="message">Message</label>
									<textarea
										id="message"
										name="message"
										rows={10}
										value={form.message}
										onChange={handleChange}
										className={
											errors.message ? "field-error" : ""
										}
										required
									/>
								</div>
								<div
									className={
										form.message.length < 50
											? "not-met"
											: "met"
									}
								>
									{form.message.length} of 50 characters
									minimum
								</div>
								{errors.message && (
									<div className="form-error">
										Message must be at least 50 characters
									</div>
								)}

								{/* No visible reCAPTCHA widget for v3 - runs invisibly */}

								{errors.submit && (
									<div
										className="form-error"
										style={{ marginBottom: "10px" }}
									>
										{errors.submit}
									</div>
								)}

								<div className="form-submit">
									<button
										type="submit"
										disabled={isSubmitting}
									>
										{btnText}
									</button>
								</div>
							</form>
						)}
					</div>

					<div className="socials-container">
						<Socials />
					</div>
				</div>
				<div className="page-footer">
					<Footer />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Contact;
