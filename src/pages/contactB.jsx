import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

// Local email server API is used instead of EmailJS

import "./styles/contact.css";

let btnText = "Send";
const Contact = () => {
	const [form, setForm] = useState({
		name: "",
		title: "",
		email: "",
		phone: "",
		message: "",
	});
	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState(false);
	const [btnText, setBtnText] = useState("Send");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "contact");

	const validate = () => {
		let errs = {};
		if (!form.name.trim()) errs.name = true;
		if (!form.title.trim()) errs.title = true;
		if (!form.message.trim() || form.message.trim().length < 50)
			errs.message = true;
		if (!form.email.trim() && !form.phone.trim()) {
			errs.contact = true;
		}
		return errs;
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		if (errors[e.target.name] || errors.contact) {
			setErrors({ ...errors, [e.target.name]: false, contact: false });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validate();
		console.log("handle submit", validationErrors);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			// Change button text to indicate submission is in progress
			setBtnText("Sending...");

			console.log("no errors");
			// Send data to local email server API
			console.log("Sending form data:", {
				...form,
				time: new Date().toLocaleString(),
			});

			// Prepare data for submission
			const formData = {
				formType: "contact",
				name: form.name,
				title: form.title,
				email: form.email,
				phone: form.phone,
				message: form.message,
				time: new Date().toLocaleString(),
			};

			// Send data to local email server API
			fetch("/ml/submit.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(formData).toString(),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						console.log("Email sent successfully!");
						setSuccess(true);
						// Reset form
						setForm({
							name: "",
							title: "",
							email: "",
							phone: "",
							message: "",
						});
					} else {
						console.error("Failed to send email:", data.message);
						setErrors({
							submit:
								data.message ||
								"Failed to send. Please try again.",
						});
						// Reset button text
						setBtnText("Send");
					}
				})
				.catch((error) => {
					console.error("Error sending form:", error);
					setErrors({ submit: "Failed to send. Please try again." });
					// Reset button text
					setBtnText("Send");
				});
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Contact | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="contact" />
				<div className="content-wrapper">
					<div className="contact-logo-container">
						<div className="contact-logo">
							<Logo width={46} />
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

						<div
							className={`form-success ${
								success ? "form-success-visible" : ""
							}`}
						>
							<strong>
								Thank you for sending us a message, we&#8217;ll
								get back to you within 2 working days. If you
								need to get in touch urgently, please call me at{" "}
								<a href="tel:+19193576004">(919) 357-6004</a> US
								EST 9:30am-6pm only please.
							</strong>
						</div>
					</div>

					{/* Contact Form with Validation */}
					<form
						className="contact-container"
						id="contact-form"
						onSubmit={handleSubmit}
						noValidate
						style={{ display: success ? "none" : "block" }}
					>
						<input
							type="hidden"
							name="time"
							value={new Date().toLocaleString()}
						/>
						<label htmlFor="name">Name</label>
						<input
							type="text"
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							className={errors.name ? "field-error" : ""}
						/>
						{errors.name && (
							<div className="form-error">
								This field is required
							</div>
						)}

						<label htmlFor="title">Topic</label>
						<input
							type="text"
							id="title"
							name="title"
							value={form.title}
							onChange={handleChange}
							className={errors.title ? "field-error" : ""}
						/>
						{errors.title && (
							<div className="form-error">
								This field is required
							</div>
						)}

						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							className={errors.contact ? "field-error" : ""}
						/>

						<label htmlFor="phone">Phone</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							className={errors.contact ? "field-error" : ""}
						/>
						{errors.contact && (
							<div className="form-error">
								Either Email or Phone is required
							</div>
						)}

						<label htmlFor="message">Message</label>
						<textarea
							id="message"
							name="message"
							rows={10}
							value={form.message}
							onChange={handleChange}
							className={errors.message ? "field-error" : ""}
						/>
						<div
							className={
								form.message.length < 50 ? "not-met" : "met"
							}
						>
							{form.message.length} of 50 characters
						</div>
						{errors.message && (
							<div className="form-error">
								This field is required to be 50 characters or
								more
							</div>
						)}

						<div className="form-submit">
							<button
								type="submit"
								disabled={Object.keys(errors).length > 0}
							>
								{btnText}
							</button>
						</div>
					</form>

					<div className="socials-container">
						<div className="contact-socials">
							<Socials />
						</div>
					</div>

					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Contact;
