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
import PropTypes from "prop-types";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

// --- Currency conversion helper ---
function USDXConverter({ amount, currency, setUsdEquivalent }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Add proper validation to prevent unnecessary API calls
		if (!amount || !currency || currency === "USD" || currency === "") {
			return;
		}
		
		// Use a ref to track if this effect has already run with these values
		const sanitizedAmount = parseFloat((amount + "").replace(/,/g, ""));
		if (isNaN(sanitizedAmount)) {
			setError("Invalid amount");
			return;
		}

		setLoading(true);
		setError("");
		
		fetch(
			`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_W9VpzqNqveR6psCl6ooVwJAS3V0Rm48cvUIXTFKF&currencies=${currency}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.data && data.data[currency]) {
					// Calculate USD equivalent (inverse of the rate)
					const rate = data.data[currency];
					const usdValue = sanitizedAmount / rate;
					setUsdEquivalent(
						usdValue.toLocaleString(
							"en-US",
							{
								style: "currency",
								currency: "USD",
							}
						)
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
	}, [amount, currency]);

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
	// Get current year for the deadline dropdown
	const thisYear = useMemo(() => new Date().getFullYear(), []);
	
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const currentSEO = SEO.find((item) => item.page === "getstarted");

	// Prepare country and phone code options
	const countryOptions = [
		...phoneCodes.filter((c) => c.name === "United States"),
		...phoneCodes
			.filter((c) => c.name !== "United States")
			.sort((a, b) => a.name.localeCompare(b.name)),
	];
	const phoneCodeOptions = phoneCodes;

	const [modalIsOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	// --- Deadline Defaults ---
	const today = new Date();
	const getDefaultDeadline = () => {
		const d = new Date(
			today.getFullYear(),
			today.getMonth() + 3,
			today.getDate()
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
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [success, setSuccess] = useState(false);
	// thisYear is already declared at the top of the component
	// Validation helpers
	const validateEmail = (email) => /.+@.+\..+/.test(email);
	const validatePhone = (phone) => /^[0-9\-\s()]{7,}$/.test(phone);
	const validateUrl = (url) =>
		/^(https?:\/\/)?(www\.)?[^\s]+\.[^\s]+/.test(url);
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
		if (!form.fullname.trim()) errs.fullname = true;
		if (!validatePhone(form.telephone)) errs.telephone = true;
		if (!validateEmail(form.email)) errs.email = true;
		if (!validateUrl(form.siteurl)) errs.siteurl = true;
		if (!form.location) errs.location = true;
		if (!form.description.trim() || form.description.trim().length < 50)
			errs.description = true;
		if (!form.goals.trim() || form.goals.trim().length < 30)
			errs.goals = true;
		if (!form.business.trim() || form.business.trim().length < 30)
			errs.business = true;
		if (!validateNumber(form.budgetAmount)) errs.budgetAmount = true;
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

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
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
		} else if (name === "phoneCode") {
			// Find the country that matches this phone code
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
		if (touched[name]) {
			const fieldError = validateField(
				name,
				type === "checkbox" ? checked : value
			);
			setErrors((prev) => ({ ...prev, [name]: fieldError }));
		}
	};

	// Validate a single field
	const validateField = (name, value) => {
		switch (name) {
			case "fullname":
				return !value.trim();
			case "telephone":
				return !validatePhone(value);
			case "email":
				return !validateEmail(value);
			case "siteurl":
				return !validateUrl(value);
			case "location":
				return !value;
			case "description":
				return !value.trim() || value.trim().length < 50;
			case "goals":
				return !value.trim() || value.trim().length < 30;
			case "business":
				return !value.trim() || value.trim().length < 30;
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
	const handleSubmit = (e) => {
		e.preventDefault();
		// Mark all fields as touched
		const allTouched = Object.keys(form).reduce((acc, field) => {
			acc[field] = true;
			return acc;
		}, {});
		setTouched(allTouched);
		const validationErrors = validate();
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length === 0) {
			setSuccess(true);
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
				deadlineMonth: "",
				deadlineDay: "",
				deadlineYear: "2025",
				notes: "",
			});
		}
	};
	// Removed problematic useEffect that was causing infinite loop

	// Render
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
						<Logo width={46} />
					</div>
				</div>
				<div className="contact-container">
					<div className="title contact-title">
						Let&#8217;s get started on your project! (Or get a
						quote).
					</div>
					<div className="subtitle contact-subtitle">
						Thanks for your interest in working with me. Let&#8217;s
						talk about your project. I&#8217;m here to help you
						build something amazing and unique, reliable, on time,
						and cost effective.
						<br />
						<br />I make an effort to respond to all messages
					</div>
					<div className="getstarted-hosting-info-row">
						<a name="hosting" className="getstarted-hosting-link">
							What is hosting?
						</a>
					</div>
					{success ? (
						<div className="form-success">
							Thank you for sending us a message, we&#8217;ll get
							back to you ASAP.
						</div>
					) : (
						<form
							id="getstarted-form"
							onSubmit={handleSubmit}
							noValidate
						>
							<div>
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
								/>
								{errors.fullname && (
									<div className="form-error">
										This field is required
									</div>
								)}
							</div>
							<div>
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
									/>
								</div>
								{errors.telephone && (
									<div className="form-error">
										Please enter a valid phone number
									</div>
								)}
							</div>
							<div>
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
								/>
								{errors.email && (
									<div className="form-error">
										Please enter a valid email address
									</div>
								)}
							</div>
							<div>
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
								/>
								{errors.siteurl && (
									<div className="form-error">
										Please enter a valid URL starting with
										http://, https://, or www.
									</div>
								)}
								<div className="checkbox-container">
									<label className="checkbox-label-row">
										<input
											type="checkbox"
											name="ownurl"
											checked={form.ownurl}
											onChange={handleChange}
										/>
										<div className="checkbox-label">
											I already own this url
										</div>
									</label>
									<label className="checkbox-label-row">
										<input
											type="checkbox"
											name="hosting"
											checked={form.hosting}
											onChange={handleChange}
										/>
										<div className="checkbox-label">
											I will need hosting
										</div>
									</label>
								</div>
							</div>
							<div>
								<label htmlFor="location">Location</label>
								<select
									id="location"
									name="location"
									value={form.location}
									onChange={handleChange}
									className={
										errors.location ? "field-error" : ""
									}
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
							<div>
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
								/>
								{errors.description && (
									<div className="form-error">
										Must be at least 50 characters
									</div>
								)}
							</div>
							<div>
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
								/>
								{errors.goals && (
									<div className="form-error">
										Must be at least 30 characters
									</div>
								)}
							</div>
							<div>
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
								/>
								{errors.business && (
									<div className="form-error">
										Must be at least 30 characters
									</div>
								)}
							</div>
							<div>
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
										USD Equivalent: <strong>{form.usdEquivalent}</strong>
									</div>
								)}
							</div>
							<div>
								<label>Approximate Deadline</label>
								<div className="getstarted-deadline-row">
									{/* Month dropdown */}
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
										<option value="11">November (11)</option>
										<option value="12">December (12)</option>
									</select>
									
									<span>/</span>
								
									{/* Day dropdown */}
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
										{/* Generate days based on selected month */}
										{(() => {
											const month = parseInt(form.deadlineMonth, 10);
											const year = parseInt(form.deadlineYear, 10);
											
											// Default to 31 days
											let daysInMonth = 31;
											
											// Adjust days based on month
											if (month && !isNaN(month)) {
												if (month === 2) {
													// February - check for leap year
													if (year && !isNaN(year) && 
														((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
														daysInMonth = 29;
													} else {
														daysInMonth = 28;
													}
												} else if ([4, 6, 9, 11].includes(month)) {
													// April, June, September, November have 30 days
													daysInMonth = 30;
												}
											}
											
											// Generate options for days
											const dayOptions = [];
											for (let i = 1; i <= daysInMonth; i++) {
												dayOptions.push(
													<option key={`day-${i}`} value={i.toString()}>
														{i}
													</option>
												);
											}
											return dayOptions;
										})()}
									</select>
									<span>/</span>
								
									{/* Year dropdown */}
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
										<option value={thisYear.toString()}>{thisYear}</option>
										<option value={(thisYear + 1).toString()}>{thisYear + 1}</option>
										<option value={(thisYear + 2).toString()}>{thisYear + 2}</option>
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
							<div>
								<label htmlFor="notes">Additional Notes</label>
								<textarea
									id="notes"
									name="notes"
									rows={4}
									value={form.notes}
									onChange={handleChange}
								/>
							</div>
							<div>
								<input type="submit" value="Send" />
								{errors.submit && (
									<div className="form-error">
										{errors.submit}
									</div>
								)}
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
