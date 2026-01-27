import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";
import phoneCodes from "../data/phonecodes.json";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/getstarted.css";

function USDXConverter({ amount, currency, setUsdEquivalent }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!amount || !currency || currency === "USD" || currency === "")
			return;

		const sanitizedAmount = parseFloat((amount + "").replace(/,/g, ""));
		if (isNaN(sanitizedAmount)) {
			setError("Invalid amount");
			return;
		}

		setLoading(true);
		setError("");

		fetch(
			`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_W9VpzqNqveR6psCl6ooVwJAS3V0Rm48cvUIXTFKF&currencies=${currency}`,
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.data && data.data[currency]) {
					const rate = data.data[currency];
					const usdValue = sanitizedAmount / rate;
					setUsdEquivalent(
						usdValue.toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						}),
					);
					setError("");
				} else {
					setUsdEquivalent("");
					setError("Could not fetch conversion");
				}
			})
			.catch((err) => {
				console.error("Currency conversion error:", err);
				setUsdEquivalent("");
				setError("Could not fetch conversion");
			})
			.finally(() => setLoading(false));
	}, [amount, currency, setUsdEquivalent]);

	if (loading) return <div className="usd-converter">Converting...</div>;
	if (error) return <div className="usd-converter error">{error}</div>;
	return null;
}

function GetStarted() {
	const thisYear = useMemo(() => new Date().getFullYear(), []);
	const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);

		fetch("/recaptcha_config.php")
			.then((res) => res.json())
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
			.catch((err) =>
				console.error("Failed to load reCAPTCHA config:", err),
			);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "getstarted");

	const countryOptions = [
		...phoneCodes.filter((c) => c.name === "United States"),
		...phoneCodes
			.filter((c) => c.name !== "United States")
			.sort((a, b) => a.name.localeCompare(b.name)),
	];

	const today = new Date();
	const getDefaultDeadline = () => {
		const d = new Date(
			today.getFullYear(),
			today.getMonth() + 3,
			today.getDate(),
		);
		return {
			month: (d.getMonth() + 1).toString(),
			day: d.getDate().toString(),
			year: d.getFullYear().toString(),
		};
	};
	const defaultDeadlineObj = getDefaultDeadline();

	const [form, setForm] = useState({
		fullname: "",
		phoneCode: "+1",
		telephone: "",
		email: "",
		siteurl: "",
		ownurl: false,
		hosting: false,
		location: "United States",
		description: "",
		goals: "",
		business: "",
		budgetAmount: "",
		budgetCurrency: "USD",
		budgetOtherCurrency: "",
		usdEquivalent: "",
		deadlineMonth: defaultDeadlineObj.month,
		deadlineDay: defaultDeadlineObj.day,
		deadlineYear: defaultDeadlineObj.year,
		notes: "",
	});

	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [btnText, setBtnText] = useState("Send");

	const validateEmail = (email) =>
		/.+@.+\..+/.test(email) && email.trim().length > 5;
	const validatePhone = (phone) => /^[0-9\-\s()]{7,}$/.test(phone);
	const validateUrl = (url) =>
		/^(https?:\/\/)?(www\.)?[^\s]+\.[^\s]+/.test(url) ||
		url.trim().length > 5;
	const validateNumber = (val) => !isNaN(Number(val)) && val.trim() !== "";
	const validateMonth = (m) => /^[1-9]$|^1[0-2]$/.test(m);
	const validateDay = (d, m, y) => {
		const day = Number(d);
		const month = Number(m);
		const year = Number(y);
		if (!day || !month || !year) return false;
		const daysInMonth = new Date(year, month, 0).getDate();
		return day > 0 && day <= daysInMonth;
	};
	const validateYear = (y) =>
		/^\d{4}$/.test(y) && Number(y) >= today.getFullYear();

	const validate = () => {
		let errs = {};
		if (!form.fullname.trim() || form.fullname.trim().length < 5)
			errs.fullname = true;
		if (!validatePhone(form.telephone)) errs.telephone = true;
		if (!validateEmail(form.email)) errs.email = true;
		if (!validateUrl(form.siteurl)) errs.siteurl = true;
		if (!form.location) errs.location = true;
		if (!form.description.trim() || form.description.trim().length < 50)
			errs.description = true;
		if (!form.goals.trim() || form.goals.trim().length < 50)
			errs.goals = true;
		if (!form.business.trim() || form.business.trim().length < 50)
			errs.business = true;
		if (!validateNumber(form.budgetAmount)) errs.budgetAmount = true;
		if (!validateMonth(form.deadlineMonth)) errs.deadlineMonth = true;
		if (
			!validateDay(
				form.deadlineDay,
				form.deadlineMonth,
				form.deadlineYear,
			)
		)
			errs.deadlineDay = true;
		if (!validateYear(form.deadlineYear)) errs.deadlineYear = true;
		return errs;
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === "location") {
			const selectedCountry = countryOptions.find(
				(c) => c.name === value,
			);
			let newPhoneCode = form.phoneCode;
			if (selectedCountry) newPhoneCode = selectedCountry.dial_code;
			setForm((prev) => ({
				...prev,
				location: value,
				phoneCode: newPhoneCode,
			}));
		} else if (name === "phoneCode") {
			const selectedCountry = phoneCodes.find(
				(c) => c.dial_code === value,
			);
			let newLocation = form.location;
			if (selectedCountry) newLocation = selectedCountry.name;
			setForm((prev) => ({
				...prev,
				phoneCode: value,
				location: newLocation,
			}));
		} else if (name === "budgetCurrency") {
			setForm((prev) => ({
				...prev,
				budgetCurrency: value,
				budgetOtherCurrency: "",
				usdEquivalent: "",
			}));
		} else if (name === "budgetOtherCurrency") {
			setForm((prev) => ({
				...prev,
				budgetOtherCurrency: value,
				usdEquivalent: "",
			}));
		} else if (name === "budgetAmount") {
			const sanitized = value.replace(/[^\d.,]/g, "");
			setForm((prev) => ({
				...prev,
				budgetAmount: sanitized,
				usdEquivalent: "",
			}));
		} else {
			setForm((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}

		if (errors[name]) {
			setErrors({ ...errors, [name]: false });
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
						.execute(recaptchaSiteKey, {
							action: "getstarted_form",
						})
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
			const fullMessage = `
PROJECT INQUIRY - Get Started Form

Contact Information:
Name: ${form.fullname}
Phone: ${form.phoneCode} ${form.telephone}
Email: ${form.email}
Location: ${form.location}

Project Details:
Site URL: ${form.siteurl}
${form.ownurl ? "✓ Already owns URL" : "✗ Does not own URL"}
${form.hosting ? "✓ Needs hosting" : "✗ Does not need hosting"}

Description: ${form.description}

Goals: ${form.goals}

Business Info: ${form.business}

Budget: ${form.budgetAmount} ${form.budgetCurrency}${form.usdEquivalent ? ` (${form.usdEquivalent})` : ""}

Deadline: ${form.deadlineMonth}/${form.deadlineDay}/${form.deadlineYear}

Additional Notes: ${form.notes || "None"}

Submitted: ${new Date().toLocaleString()}
			`.trim();

			const formData = new FormData();
			formData.append("name", form.fullname);
			formData.append("email", form.email);
			formData.append("message", fullMessage);
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
				setForm({
					fullname: "",
					phoneCode: "+1",
					telephone: "",
					email: "",
					siteurl: "",
					ownurl: false,
					hosting: false,
					location: "United States",
					description: "",
					goals: "",
					business: "",
					budgetAmount: "",
					budgetCurrency: "USD",
					budgetOtherCurrency: "",
					usdEquivalent: "",
					deadlineMonth: defaultDeadlineObj.month,
					deadlineDay: defaultDeadlineObj.day,
					deadlineYear: defaultDeadlineObj.year,
					notes: "",
				});
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
				<title>{`Get Started | ${INFO.main.title}`}</title>
				<meta
					name="description"
					content={currentSEO?.description || ""}
				/>
				<meta
					name="keywords"
					content={currentSEO?.keywords?.join(", ") || ""}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="getstarted" />
				<main className="content-wrapper">
					<Logo width={99} />

					<section className="getstarted-section">
						<h1 className="title">
							Let's get started on your project! (Or get a quote).
						</h1>

						<div className="subtitle">
							Thanks for your interest in working with me. Let's
							talk about your project. I'm here to help you build
							something amazing and unique, reliable, on time, and
							cost effective.
							<br />
							<br />I make an effort to respond to all messages
							within 24 hours during weekdays.
						</div>

						{success ? (
							<div className="form-success">
								Thank you for sending us a message, we'll get
								back to you ASAP.
							</div>
						) : (
							<form
								className="getstarted-form"
								onSubmit={handleSubmit}
								noValidate
							>
								<div className="form-field">
									<label htmlFor="fullname">Full Name</label>
									<input
										type="text"
										id="fullname"
										name="fullname"
										value={form.fullname}
										onChange={handleChange}
										className={
											errors.fullname ? "error" : ""
										}
										required
									/>
									<span
										className={
											form.fullname.length < 8
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.fullname.length} of 8 characters
										minimum
									</span>
									{errors.fullname && (
										<span className="error-msg">
											This field is required
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="telephone">Telephone</label>
									<div className="phone-input">
										<select
											name="phoneCode"
											value={form.phoneCode}
											onChange={handleChange}
										>
											{phoneCodes.map((p) => (
												<option
													key={p.dial_code + p.name}
													value={p.dial_code}
												>
													{p.dial_code} ({p.name})
												</option>
											))}
										</select>
										<input
											type="text"
											id="telephone"
											name="telephone"
											value={form.telephone}
											onChange={handleChange}
											className={
												errors.telephone ? "error" : ""
											}
											required
										/>
									</div>
									{errors.telephone && (
										<span className="error-msg">
											Please enter a valid phone number
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
									<span
										className={
											form.email.length < 6
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.email.length} of 6 characters
										minimum
									</span>
									{errors.email && (
										<span className="error-msg">
											Please enter a valid email
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="siteurl">Site URL</label>
									<input
										type="text"
										id="siteurl"
										name="siteurl"
										value={form.siteurl}
										onChange={handleChange}
										className={
											errors.siteurl ? "error" : ""
										}
										placeholder="https://yourdomain.com"
										required
									/>
									<span
										className={
											form.siteurl.length < 15
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.siteurl.length} of 15 characters
										minimum
									</span>
									{errors.siteurl && (
										<span className="error-msg">
											Please enter a valid URL
										</span>
									)}

									<div className="checkbox-group">
										<label>
											<input
												type="checkbox"
												name="ownurl"
												checked={form.ownurl}
												onChange={handleChange}
											/>
											I already own this url
										</label>
										<label>
											<input
												type="checkbox"
												name="hosting"
												checked={form.hosting}
												onChange={handleChange}
											/>
											I will need hosting
										</label>
									</div>
								</div>

								<div className="form-field">
									<label htmlFor="location">Location</label>
									<select
										id="location"
										name="location"
										value={form.location}
										onChange={handleChange}
										className={
											errors.location ? "error" : ""
										}
										required
									>
										{countryOptions.map((c) => (
											<option
												key={c.code + c.name}
												value={c.name}
											>
												{c.name}
											</option>
										))}
									</select>
									{errors.location && (
										<span className="error-msg">
											This field is required
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="description">
										See General Description
									</label>
									<textarea
										id="description"
										name="description"
										rows={6}
										value={form.description}
										onChange={handleChange}
										className={
											errors.description ? "error" : ""
										}
										required
									/>
									<span
										className={
											form.description.length < 50
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.description.length} of 50
										characters minimum
									</span>
									{errors.description && (
										<span className="error-msg">
											Must be at least 50 characters
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="goals">Site Goals</label>
									<textarea
										id="goals"
										name="goals"
										rows={6}
										value={form.goals}
										onChange={handleChange}
										className={errors.goals ? "error" : ""}
										required
									/>
									<span
										className={
											form.goals.length < 50
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.goals.length} of 50 characters
										minimum
									</span>
									{errors.goals && (
										<span className="error-msg">
											Must be at least 50 characters
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="business">
										Short Business Explanation
									</label>
									<textarea
										id="business"
										name="business"
										rows={6}
										value={form.business}
										onChange={handleChange}
										className={
											errors.business ? "error" : ""
										}
										required
									/>
									<span
										className={
											form.business.length < 50
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.business.length} of 50 characters
										minimum
									</span>
									{errors.business && (
										<span className="error-msg">
											Must be at least 50 characters
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="budgetAmount">
										Approximate Budget
									</label>
									<div className="budget-input">
										<input
											type="text"
											id="budgetAmount"
											name="budgetAmount"
											value={form.budgetAmount}
											onChange={handleChange}
											className={
												errors.budgetAmount
													? "error"
													: ""
											}
											placeholder="e.g. 5000"
											required
										/>
										<select
											name="budgetCurrency"
											value={form.budgetCurrency}
											onChange={handleChange}
										>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
											<option value="GBP">GBP</option>
											<option value="CAD">CAD</option>
											<option value="AUD">AUD</option>
											<option value="JPY">JPY</option>
											<option value="CHF">CHF</option>
											<option value="ILS">ILS</option>
											<option value="Other">Other</option>
										</select>
									</div>
									{form.budgetCurrency === "Other" && (
										<input
											type="text"
											name="budgetOtherCurrency"
											value={form.budgetOtherCurrency}
											onChange={handleChange}
											placeholder="Enter currency code"
										/>
									)}
									<span
										className={
											form.budgetAmount.length < 3
												? "char-count not-met"
												: "char-count met"
										}
									>
										{form.budgetAmount.length} of 3
										characters minimum
									</span>
									{errors.budgetAmount && (
										<span className="error-msg">
											Please enter a valid budget
										</span>
									)}
									{form.budgetCurrency !== "USD" &&
										form.budgetAmount && (
											<USDXConverter
												amount={form.budgetAmount}
												currency={
													form.budgetCurrency ===
													"Other"
														? form.budgetOtherCurrency
														: form.budgetCurrency
												}
												setUsdEquivalent={(usd) =>
													setForm((prev) => ({
														...prev,
														usdEquivalent: usd,
													}))
												}
											/>
										)}
									{form.usdEquivalent && (
										<div className="usd-equivalent">
											USD Equivalent:{" "}
											<strong>
												{form.usdEquivalent}
											</strong>
										</div>
									)}
								</div>

								<div className="form-field">
									<label>
										Approximate Deadline [MM/DD/YYYY]
									</label>
									<div className="deadline-input">
										<select
											name="deadlineMonth"
											value={form.deadlineMonth}
											onChange={handleChange}
											className={
												errors.deadlineMonth
													? "error"
													: ""
											}
										>
											<option value="">Month</option>
											{[
												"January",
												"February",
												"March",
												"April",
												"May",
												"June",
												"July",
												"August",
												"September",
												"October",
												"November",
												"December",
											].map((m, i) => (
												<option
													key={i + 1}
													value={i + 1}
												>
													{m} ({i + 1})
												</option>
											))}
										</select>
										<span>/</span>
										<select
											name="deadlineDay"
											value={form.deadlineDay}
											onChange={handleChange}
											className={
												errors.deadlineDay
													? "error"
													: ""
											}
										>
											<option value="">Day</option>
											{Array.from(
												{ length: 31 },
												(_, i) => i + 1,
											).map((d) => (
												<option key={d} value={d}>
													{d}
												</option>
											))}
										</select>
										<span>/</span>
										<select
											name="deadlineYear"
											value={form.deadlineYear}
											onChange={handleChange}
											className={
												errors.deadlineYear
													? "error"
													: ""
											}
										>
											<option value="">Year</option>
											{Array.from(
												{ length: 5 },
												(_, i) => thisYear + i,
											).map((y) => (
												<option key={y} value={y}>
													{y}
												</option>
											))}
										</select>
									</div>
									{(errors.deadlineMonth ||
										errors.deadlineDay ||
										errors.deadlineYear) && (
										<span className="error-msg">
											Please enter a valid future date
										</span>
									)}
								</div>

								<div className="form-field">
									<label htmlFor="notes">
										Additional Notes
									</label>
									<textarea
										id="notes"
										name="notes"
										rows={4}
										value={form.notes}
										onChange={handleChange}
									/>
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
}

export default GetStarted;
