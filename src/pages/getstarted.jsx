/**
 * Filename: getstarted.jsx
 * Location: /src/pages/
 *
 * Project questionnaire form for Evil Genius Creative
 * Comprehensive form for gathering project requirements, budget, timeline
 *
 * Variables:
 * - form: Object containing all project questionnaire fields
 * - recaptchaSiteKey: Dynamic reCAPTCHA site key from backend
 * - errors: Form validation error states
 * - success: Form submission success state
 * - isSubmitting: Form submission loading state
 * - modalIsOpen: Hosting info modal state
 *
 * Features:
 * - International phone code integration
 * - Currency conversion with USD equivalent
 * - Dynamic date validation for project deadlines
 * - reCAPTCHA v3 integration (invisible)
 * - Comprehensive project data collection
 *
 * Instructions:
 * 1. Requires recaptcha_config.php endpoint for dynamic site key
 * 2. Submits to /submit.php with consolidated project message
 * 3. Uses reCAPTCHA v3 action: 'getstarted_form'
 * 4. All project data is formatted into readable message for admin
 */

import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import EgcModal from "../components/egcmodal/EgcModal";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";
import phoneCodes from "../data/phonecodes.json";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

// CURRENCY CONVERSION: Helper component to convert project budget to USD
function USDXConverter({ amount, currency, setUsdEquivalent }) {
	const [loading, setLoading] = useState(false);  // API call loading state
	const [error, setError] = useState("");         // Conversion error messages

	// CURRENCY API: Convert non-USD amounts to USD equivalent
	useEffect(() => {
		// Skip conversion if no amount, no currency, or already USD
		if (!amount || !currency || currency === "USD" || currency === "") {
			return;
		}

		// VALIDATION: Clean and validate the amount input
		const sanitizedAmount = parseFloat((amount + "").replace(/,/g, ""));
		if (isNaN(sanitizedAmount)) {
			setError("Invalid amount");
			return;
		}

		setLoading(true);
		setError("");

		// API CALL: Fetch current exchange rates from FreeCurrencyAPI
		fetch(
			`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_W9VpzqNqveR6psCl6ooVwJAS3V0Rm48cvUIXTFKF&currencies=${currency}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.data && data.data[currency]) {
					// CALCULATION: Convert foreign currency to USD
					const rate = data.data[currency];        // Exchange rate
					const usdValue = sanitizedAmount / rate; // Convert to USD
					setUsdEquivalent(
						usdValue.toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						})
					);
					setError("");
				} else {
					// ERROR: API didn't return expected data
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
	}, [amount, currency]); // Re-run when amount or currency changes

	if (loading)
		return (
			<div className="usdx" style={{ textAlign: "center" }}>
				Converting...
			</div>
		);
	if (error)
		return (
			<div className="usdx" style={{ textAlign: "center", color: "red" }}>
				{error}
			</div>
		);
	return null;
}

function GetStarted() {
	// DATE UTILITIES: Get current year for date validation
	const thisYear = useMemo(() => new Date().getFullYear(), []);
	const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("");

	// COMPONENT INITIALIZATION: Set up page and load reCAPTCHA
	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to top when component loads

		// SECURITY: Fetch dynamic reCAPTCHA site key from backend
		fetch("/recaptcha_config.php")
			.then((res) => res.json())
			.then((data) => {
				setRecaptchaSiteKey(data.siteKey);

				// RECAPTCHA: Load Google reCAPTCHA v3 script dynamically
				if (data.siteKey && !window.grecaptcha) {
					const script = document.createElement("script");
					script.src = `https://www.google.com/recaptcha/api.js?render=${data.siteKey}`;
					script.async = true;
					script.defer = true;
					document.body.appendChild(script);
				}
			})
			.catch((err) =>
				console.error("Failed to load reCAPTCHA config:", err)
			);
	}, []);

	// SEO: Get page-specific SEO metadata
	const currentSEO = SEO.find((item) => item.page === "getstarted");

	// PHONE/COUNTRY DATA: Prepare sorted country and phone code options
	const countryOptions = [
		...phoneCodes.filter((c) => c.name === "United States"), // US first
		...phoneCodes
			.filter((c) => c.name !== "United States")
			.sort((a, b) => a.name.localeCompare(b.name)),        // Rest alphabetical
	];
	const phoneCodeOptions = phoneCodes;

	// MODAL STATE: Hosting information modal control
	const [modalIsOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);   // Show hosting info modal
	const closeModal = () => setIsOpen(false); // Hide hosting info modal

	// DATE CALCULATION: Set default project deadline to 3 months from today
	const today = new Date();
	const getDefaultDeadline = () => {
		const d = new Date(
			today.getFullYear(),
			today.getMonth() + 3,  // Add 3 months
			today.getDate()
		);
		return {
			month: (d.getMonth() + 1).toString(),  // Convert to 1-12 format
			day: d.getDate().toString(),
			year: d.getFullYear().toString(),
		};
	};
	const defaultDeadlineObj = getDefaultDeadline();

	// FORM STATE: Comprehensive project questionnaire data
	const [form, setForm] = useState({
		// CONTACT INFO
		fullname: "",                              // Client's full name
		phoneCode: "+1",                           // International phone code
		telephone: "",                             // Phone number
		email: "",                                 // Email address
		
		// WEBSITE/HOSTING INFO
		siteurl: "",                               // Desired website URL
		ownurl: false,                             // Already owns domain
		buyurl: false,                             // Needs to buy domain
		hosting: false,                            // Needs hosting setup
		hostself: false,                           // Will self-host
		location: "United States",                 // Client location
		
		// PROJECT DETAILS
		description: "",                           // Project description
		goals: "",                                 // Project goals
		business: "",                              // Business description
		
		// BUDGET INFO
		budgetAmount: "",                          // Budget amount
		budgetCurrency: "USD",                     // Budget currency
		budgetOtherCurrency: "",                   // Custom currency
		usdEquivalent: "",                         // USD conversion result
		
		// TIMELINE
		deadlineMonth: defaultDeadlineObj.month,   // Project deadline month
		deadlineDay: defaultDeadlineObj.day,       // Project deadline day
		deadlineYear: defaultDeadlineObj.year,     // Project deadline year
		
		// ADDITIONAL INFO
		notes: "",                                 // Additional notes
	});

	// UI STATE: Form validation and submission states
	const [errors, setErrors] = useState({});           // Field-specific error messages
	const [touched, setTouched] = useState({});         // Fields that user has interacted with
	const [success, setSuccess] = useState(false);      // Success message display flag
	const [isSubmitting, setIsSubmitting] = useState(false); // Loading state during submission
	const [btnText, setBtnText] = useState("Send");     // Dynamic button text

	// VALIDATION: Helper functions for form field validation
	const validateEmail = (email) =>
		/.+@.+\..+/.test(email) && email.trim().length > 5;  // Basic email format check
	const validatePhone = (phone) => /^[0-9\-\s()]{7,}$/.test(phone); // Phone number format
	const validateUrl = (url) =>
		/^(https?:\/\/)?(www\.)?[^\s]+\.[^\s]+/.test(url) ||
		url.trim().length > 5;                              // URL format or minimum length
	const validateNumber = (val) => !isNaN(Number(val)) && val.trim() !== ""; // Valid number check
	const validateMonth = (m) => /^[1-9]$|^1[0-2]$/.test(m);                 // Month 1-12
	const validateDay = (d, m, y) => {
		const day = Number(d);
		const month = Number(m);
		const year = Number(y);
		if (!day || !month || !year) return false;
		const daysInMonth = new Date(year, month, 0).getDate(); // Get max days in month
		return day > 0 && day <= daysInMonth;                  // Valid day for the month
	};
	const validateYear = (y) =>
		/^\d{4}$/.test(y) && Number(y) >= today.getFullYear(); // 4-digit year, not in past

	// VALIDATION: Main form validation function
	const validate = () => {
		let errs = {};
		// CONTACT VALIDATION
		if (!form.fullname.trim() || form.fullname.trim().length < 5)
			errs.fullname = true;                           // Name minimum 5 chars
		if (!validatePhone(form.telephone)) errs.telephone = true;  // Phone format check
		if (!validateEmail(form.email)) errs.email = true;          // Email format check
		
		// WEBSITE VALIDATION
		if (!validateUrl(form.siteurl)) errs.siteurl = true;        // URL format check
		if (!form.location) errs.location = true;                   // Location required
		
		// PROJECT DETAILS VALIDATION (minimum 50 characters each)
		if (!form.description.trim() || form.description.trim().length < 50)
			errs.description = true;
		if (!form.goals.trim() || form.goals.trim().length < 50)
			errs.goals = true;
		if (!form.business.trim() || form.business.trim().length < 50)
			errs.business = true;
		
		// BUDGET VALIDATION
		if (!validateNumber(form.budgetAmount)) errs.budgetAmount = true;
		
		// DATE VALIDATION
		if (!validateMonth(form.deadlineMonth)) errs.deadlineMonth = true;
		if (
			!validateDay(
				form.deadlineDay,
				form.deadlineMonth,
				form.deadlineYear
			)
		)
			errs.deadlineDay = true;
		if (!validateYear(form.deadlineYear)) errs.deadlineYear = true;
		return errs;
	};

	// UI HELPER: Character count display for text fields
	const countCharacters = (name, length) => {
		return {
			className: form[name].length < length ? "not-met" : "met", // CSS class for styling
			countText: `${form[name].length > length ? "OK: " : ""}${
				form[name].length
			} of ${length} characters minimum`,                        // Display text
		};
	};

	// FORM HANDLING: Update form state with special logic for related fields
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		
		// LOCATION CHANGE: Auto-update phone code when country changes
		if (name === "location") {
			const selectedCountry = countryOptions.find(
				(c) => c.name === value
			);
			let newPhoneCode = form.phoneCode;
			if (selectedCountry) newPhoneCode = selectedCountry.dial_code;
			setForm((prev) => ({
				...prev,
				location: value,
				phoneCode: newPhoneCode,
			}));
		// PHONE CODE CHANGE: Auto-update country when phone code changes
		} else if (name === "phoneCode") {
			const selectedCountry = phoneCodeOptions.find(
				(c) => c.dial_code === value
			);
			let newLocation = form.location;
			if (selectedCountry) newLocation = selectedCountry.name;
			setForm((prev) => ({
				...prev,
				phoneCode: value,
				location: newLocation,
			}));
		// BUDGET CURRENCY CHANGE: Reset conversion when currency changes
		} else if (name === "budgetCurrency") {
			setForm((prev) => ({
				...prev,
				budgetCurrency: value,
				budgetOtherCurrency: "",  // Clear custom currency
				usdEquivalent: "",        // Clear USD conversion
			}));
		// CUSTOM CURRENCY CHANGE: Reset conversion
		} else if (name === "budgetOtherCurrency") {
			setForm((prev) => ({
				...prev,
				budgetOtherCurrency: value,
				usdEquivalent: "",        // Clear USD conversion
			}));
		// BUDGET AMOUNT CHANGE: Sanitize input and reset conversion
		} else if (name === "budgetAmount") {
			const sanitized = value.replace(/[^\d.,]/g, ""); // Only allow numbers, commas, periods
			setForm((prev) => ({
				...prev,
				budgetAmount: sanitized,
				usdEquivalent: "",        // Clear USD conversion
			}));
		// GENERAL FIELD CHANGE: Handle checkboxes and text inputs
		} else {
			setForm((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
		if (touched[name]) {
			const fieldError = validateField(
				name,
				type === "checkbox" ? checked : value
			);
			setErrors((prev) => ({ ...prev, [name]: fieldError }));
		}
	};

	const validateField = (name, value) => {
		switch (name) {
			case "fullname":
				return !value.trim() || value.trim().length < 8;
			case "telephone":
				return !validatePhone(value);
			case "email":
				return !validateEmail(value) || value.trim().length < 5;
			case "siteurl":
				return !validateUrl(value) || value.trim().length < 15;
			case "location":
				return !value;
			case "description":
				return !value.trim() || value.trim().length < 50;
			case "goals":
				return !value.trim() || value.trim().length < 50;
			case "business":
				return !value.trim() || value.trim().length < 50;
			case "budgetAmount":
				return !validateNumber(value);
			case "budgetCurrency":
				return !value;
			case "deadlineMonth":
				return !validateMonth(value);
			case "deadlineDay":
				return !validateDay(
					form.deadlineDay,
					form.deadlineMonth,
					form.deadlineYear
				);
			case "deadlineYear":
				return !validateYear(value);
			default:
				return false;
		}
	};

	// Form submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isSubmitting) return;

		const allTouched = Object.keys(form).reduce((acc, field) => {
			acc[field] = true;
			return acc;
		}, {});
		setTouched(allTouched);

		const validationErrors = validate();
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			setIsSubmitting(true);
			setBtnText("Processing...");

			try {
				// Execute reCAPTCHA v3
				if (!window.grecaptcha || !recaptchaSiteKey) {
					setErrors({
						submit: "reCAPTCHA not loaded. Please refresh the page.",
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
				setErrors({
					submit: "reCAPTCHA error. Please try again.",
				});
				setBtnText("Send");
				setIsSubmitting(false);
			}
		}
	};

	async function submitFormWithToken(recaptchaToken) {
		try {
			// Create comprehensive message for PHP backend
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

Budget: ${form.budgetAmount} ${form.budgetCurrency}${
				form.usdEquivalent ? ` (${form.usdEquivalent})` : ""
			}

Deadline: ${form.deadlineMonth}/${form.deadlineDay}/${form.deadlineYear}

Additional Notes: ${form.notes || "None"}

Submitted: ${new Date().toLocaleString()}
			`.trim();

			// Prepare form data for PHP backend
			const formData = new FormData();
			formData.append("name", form.fullname);
			formData.append("email", form.email);
			formData.append("message", fullMessage);
			formData.append("g-recaptcha-response", recaptchaToken);

			// Send to PHP backend
			const response = await fetch("/submit.php", {
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
				// Reset form to defaults
				setForm({
					fullname: "",
					phoneCode: "+1",
					telephone: "",
					email: "",
					siteurl: "",
					ownurl: false,
					buyurl: false,
					hosting: false,
					hostself: false,
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
				submit: "Network error. Please check your connection and try again.",
			});
		} finally {
			setBtnText("Send");
			setIsSubmitting(false);
		}
	}

	return (
		<div className="page-content">
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
			<NavBar active="getstarted" />
			<div className="content-wrapper">
				<div className="contact-logo-container">
					<div className="contact-logo">
						<Logo width={99} />
					</div>
				</div>
				<div className="contact-container">
					<div className="title contact-title">
						Let's get started on your project! (Or get a quote).
					</div>
					<div className="subtitle contact-subtitle">
						Thanks for your interest in working with me. Let's talk
						about your project. I'm here to help you build something
						amazing and unique, reliable, on time, and cost
						effective.
						<br />
						<br />I make an effort to respond to all messages within
						24 hours during weekdays.
					</div>
					<div className="getstarted-hosting-info-row">
						<a name="hosting" className="getstarted-hosting-link">
							What is hosting?
						</a>
					</div>
					{success ? (
						<div className="form-success">
							Thank you for sending us a message, we'll get back
							to you ASAP.
						</div>
					) : (
						<form
							id="getstarted-form"
							onSubmit={handleSubmit}
							noValidate
						>
							<div className="getstarted-fullname-row field-row">
								<label htmlFor="fullname">Full Name</label>
								<input
									type="text"
									id="fullname"
									name="fullname"
									value={form.fullname}
									onChange={handleChange}
									className={
										errors.fullname ? "field-error" : ""
									}
									required
								/>
								<div
									id="get-started-fullname-count"
									className={
										countCharacters("fullname", 8).className
									}
								>
									{countCharacters("fullname", 8).countText}
								</div>
								{errors.fullname && (
									<div className="form-error">
										This field is required
									</div>
								)}
							</div>
							<div className="field-row">
								<label htmlFor="telephone">Telephone</label>
								<div className="getstarted-phone-row">
									<select
										name="phoneCode"
										value={form.phoneCode}
										onChange={handleChange}
										className="getstarted-phone-select"
									>
										{phoneCodeOptions.map((p) => (
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
											errors.telephone
												? "field-error"
												: ""
										}
										required
									/>
								</div>
								{errors.telephone && (
									<div className="form-error">
										Please enter a valid phone number
									</div>
								)}
							</div>
							<div className="field-row" id="get-started-email">
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
								<div
									id="get-started-email-count"
									className={
										countCharacters("email", 6).className
									}
								>
									{countCharacters("email", 6).countText}
								</div>
								{errors.email && (
									<div className="form-error">
										Please enter a valid email address
									</div>
								)}
							</div>
							<div className="field-row">
								<label htmlFor="siteurl">Site URL</label>
								<input
									type="text"
									id="siteurl"
									name="siteurl"
									value={form.siteurl}
									onChange={handleChange}
									className={
										errors.siteurl ? "field-error" : ""
									}
									placeholder="https://yourdomain.com"
									required
								/>
								<div
									id="get-started-siteurl-count"
									className={
										countCharacters("siteurl", 15).className
									}
								>
									{countCharacters("siteurl", 15).countText}
								</div>
								{errors.siteurl && (
									<div className="form-error">
										Please enter a valid URL starting with
										http://, https://, or www.
									</div>
								)}
								<div className="checkbox-container field-row">
									<label className="checkbox-label-row">
										<div className="checkbox-label">
											I already own this url
										</div>
										<input
											type="checkbox"
											name="ownurl"
											checked={form.ownurl}
											onChange={handleChange}
										/>
									</label>
									<label className="checkbox-label-row">
										<div className="checkbox-label">
											I will need hosting
										</div>
										<input
											type="checkbox"
											name="hosting"
											checked={form.hosting}
											onChange={handleChange}
										/>
									</label>
								</div>
							</div>
							<div className="field-row">
								<label htmlFor="location">Location</label>
								<select
									id="location"
									name="location"
									value={form.location}
									onChange={handleChange}
									className={
										errors.location ? "field-error" : ""
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
									<div className="form-error">
										This field is required
									</div>
								)}
							</div>
							<div id="description-row" className="field-row">
								<label htmlFor="description">
									Site General Description
								</label>
								<textarea
									id="description"
									name="description"
									rows={6}
									value={form.description}
									onChange={handleChange}
									className={
										errors.description ? "field-error" : ""
									}
									required
								/>
								<div
									id="get-started-description-count"
									className={
										countCharacters("description", 50)
											.className
									}
								>
									{
										countCharacters("description", 50)
											.countText
									}
								</div>
								{errors.description && (
									<div className="form-error">
										Must be at least 50 characters
									</div>
								)}
							</div>
							<div id="goals-row" className="field-row">
								<label htmlFor="goals">Site Goals</label>
								<textarea
									id="goals"
									name="goals"
									rows={6}
									value={form.goals}
									onChange={handleChange}
									className={
										errors.goals ? "field-error" : ""
									}
									required
								/>
								<div
									id="get-started-goals-count"
									className={
										countCharacters("goals", 50).className
									}
								>
									{countCharacters("goals", 50).countText}
								</div>
								{errors.goals && (
									<div className="form-error">
										Must be at least 50 characters
									</div>
								)}
							</div>
							<div id="business-row" className="field-row">
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
										errors.business ? "field-error" : ""
									}
									required
								/>
								<div
									id="get-started-business-count"
									className={
										countCharacters("business", 50)
											.className
									}
								>
									{countCharacters("business", 50).countText}
								</div>
								{errors.business && (
									<div className="form-error">
										Must be at least 50 characters
									</div>
								)}
							</div>
							<div id="budget-row" className="field-row">
								<label htmlFor="budgetAmount">
									Approximate Budget
								</label>
								<input
									type="text"
									id="budgetAmount"
									name="budgetAmount"
									value={form.budgetAmount}
									onChange={handleChange}
									className={
										errors.budgetAmount ? "field-error" : ""
									}
									placeholder="e.g. 5000"
									required
								/>

								<select
									name="budgetCurrency"
									value={form.budgetCurrency}
									onChange={handleChange}
									className="getstarted-currency-select"
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
								{form.budgetCurrency === "Other" && (
									<input
										type="text"
										name="budgetOtherCurrency"
										value={form.budgetOtherCurrency}
										onChange={handleChange}
										placeholder="Enter currency USD exchange rate"
										className="getstarted-currency-other"
									/>
								)}
								<div
									id="get-started-budget-count"
									className={
										countCharacters("budgetAmount", 3)
											.className
									}
								>
									{
										countCharacters("budgetAmount", 3)
											.countText
									}
								</div>
								{errors.budgetAmount && (
									<div className="form-error">
										Please enter a valid budget amount
									</div>
								)}
								{form.budgetCurrency !== "USD" &&
									form.budgetAmount && (
										<USDXConverter
											amount={form.budgetAmount}
											currency={
												form.budgetCurrency === "Other"
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
									<div
										className="usdx"
										style={{ textAlign: "center" }}
									>
										USD Equivalent:{" "}
										<strong>{form.usdEquivalent}</strong>
									</div>
								)}
							</div>
							<div className="field-row">
								<label>
									Approximate Deadline [ USA Style date:
									MM/DD/YYYY ]
								</label>
								<div className="getstarted-deadline-row">
									<select
										name="deadlineMonth"
										id="deadlineMonth"
										value={form.deadlineMonth}
										onChange={handleChange}
										className={
											errors.deadlineMonth
												? "field-error"
												: ""
										}
									>
										<option value="">Month</option>
										<option value="1">January (1)</option>
										<option value="2">February (2)</option>
										<option value="3">March (3)</option>
										<option value="4">April (4)</option>
										<option value="5">May (5)</option>
										<option value="6">June (6)</option>
										<option value="7">July (7)</option>
										<option value="8">August (8)</option>
										<option value="9">September (9)</option>
										<option value="10">October (10)</option>
										<option value="11">
											November (11)
										</option>
										<option value="12">
											December (12)
										</option>
									</select>

									<span>/</span>

									<select
										name="deadlineDay"
										id="deadlineDay"
										value={form.deadlineDay}
										onChange={handleChange}
										className={
											errors.deadlineDay
												? "field-error"
												: ""
										}
									>
										<option value="">Day</option>
										{(() => {
											const month = parseInt(
												form.deadlineMonth,
												10
											);
											const year = parseInt(
												form.deadlineYear,
												10
											);

											let daysInMonth = 31;

											if (month && !isNaN(month)) {
												if (month === 2) {
													if (
														year &&
														!isNaN(year) &&
														((year % 4 === 0 &&
															year % 100 !== 0) ||
															year % 400 === 0)
													) {
														daysInMonth = 29;
													} else {
														daysInMonth = 28;
													}
												} else if (
													[4, 6, 9, 11].includes(
														month
													)
												) {
													daysInMonth = 30;
												}
											}

											const dayOptions = [];
											for (
												let i = 1;
												i <= daysInMonth;
												i++
											) {
												dayOptions.push(
													<option
														key={`day-${i}`}
														value={i.toString()}
													>
														{i}
													</option>
												);
											}
											return dayOptions;
										})()}
									</select>
									<span>/</span>

									<select
										name="deadlineYear"
										id="deadlineYear"
										value={form.deadlineYear}
										onChange={handleChange}
										className={
											errors.deadlineYear
												? "field-error"
												: ""
										}
									>
										<option value="">Year</option>
										<option value={thisYear.toString()}>
											{thisYear}
										</option>
										<option
											value={(thisYear + 1).toString()}
										>
											{thisYear + 1}
										</option>
										<option
											value={(thisYear + 2).toString()}
										>
											{thisYear + 2}
										</option>
									</select>
								</div>
								{(errors.deadlineMonth ||
									errors.deadlineDay ||
									errors.deadlineYear) && (
									<div className="form-error">
										Please enter a valid date (MM/DD/YYYY,
										year ≥ 2025)
									</div>
								)}
							</div>
							<div className="field-row">
								<label htmlFor="notes">Additional Notes</label>
								<textarea
									id="notes"
									name="notes"
									rows={4}
									value={form.notes}
									onChange={handleChange}
								/>
							</div>

							{/* No visible reCAPTCHA widget for v3 - runs invisibly */}

							{errors.submit && (
								<div
									className="form-error"
									style={{ marginBottom: "10px" }}
								>
									{errors.submit}
								</div>
							)}

							<div>
								<input
									type="submit"
									value={btnText}
									disabled={isSubmitting}
								/>
							</div>
						</form>
					)}
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
		</div>
	);
}

export default GetStarted;
