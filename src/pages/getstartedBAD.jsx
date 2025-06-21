import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";
import phoneCodes from "../data/phonecodes.json";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

function GetStarted() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const currentSEO = SEO.find((item) => item.page === "getstarted");

  // Prepare country and phone code options
  const countryOptions = [
    ...phoneCodes.filter((c) => c.name === "United States"),
    ...phoneCodes.filter((c) => c.name !== "United States").sort((a, b) => a.name.localeCompare(b.name)),
  ];
  const phoneCodeOptions = phoneCodes;

  const [form, setForm] = React.useState({
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
    budget: "",
    deadlineMonth: "",
    deadlineDay: "",
    deadlineYear: "2025",
    notes: "",
  });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState(false);

  // Validation helpers
  const validateEmail = (email) => /.+@.+\..+/.test(email);
  const validatePhone = (phone) => /^[0-9\-\s()]{7,}$/.test(phone);
  const validateUrl = (url) => /^(https?:\/\/)?(www\.)?[^\s]+\.[^\s]+/.test(url);
  const validateNumber = (val) => !isNaN(Number(val)) && val.trim() !== "";
  const validateMonth = (m) => /^([1-9]|1[0-2])$/.test(m);
  const validateDay = (d) => /^([1-9]|[12][0-9]|3[01])$/.test(d);
  const validateYear = (y) => /^\d{4}$/.test(y) && Number(y) >= 2025;

  const validate = () => {
    let errs = {};
    if (!form.fullname.trim()) errs.fullname = true;
    if (!validatePhone(form.telephone)) errs.telephone = true;
    if (!validateEmail(form.email)) errs.email = true;
    if (!validateUrl(form.siteurl)) errs.siteurl = true;
    if (!form.location) errs.location = true;
    if (!form.description.trim() || form.description.trim().length < 50) errs.description = true;
    if (!form.goals.trim() || form.goals.trim().length < 30) errs.goals = true;
    if (!form.business.trim() || form.business.trim().length < 30) errs.business = true;
    if (!validateNumber(form.budget)) errs.budget = true;
    if (!validateMonth(form.deadlineMonth)) errs.deadlineMonth = true;
    if (!validateDay(form.deadlineDay)) errs.deadlineDay = true;
    if (!validateYear(form.deadlineYear)) errs.deadlineYear = true;
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "location") {
      const selectedCountry = countryOptions.find((c) => c.name === value);
      let newPhoneCode = form.phoneCode;
      if (selectedCountry) newPhoneCode = selectedCountry.dial_code;
      setForm((prev) => ({ ...prev, location: value, phoneCode: newPhoneCode }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleDeadlineKeyDown = (e, field) => {
    if (e.key === "Tab") {
      if (field === "deadlineMonth" && !e.shiftKey) {
        e.preventDefault();
        document.getElementById("deadlineDay").focus();
      } else if (field === "deadlineDay" && !e.shiftKey) {
        e.preventDefault();
        document.getElementById("deadlineYear").focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        hosting: false,
        location: "United States",
        description: "",
        goals: "",
        business: "",
        budget: "",
        deadlineMonth: "",
        deadlineDay: "",
        deadlineYear: "2025",
        notes: "",
      });
    }
  };

  return (
    <div className="page-content">
      <Helmet>
        <title>{`Get Started | ${INFO.main.title}`}</title>
        <meta name="description" content={currentSEO.description} />
        <meta name="keywords" content={currentSEO.keywords.join(", ")} />
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
            Let&#8217;s get started on your project! (Or get a quote).
          </div>
          <div className="subtitle contact-subtitle">
            Thanks for your interest in working with me. Let&#8217;s talk about your project. I&#8217;m here to help you build something amazing and unique, reliable, on time, and cost effective.<br /><br />I make an effort to respond to all messages
          </div>
          <div className="getstarted-hosting-info-row">
            <a name="hosting" className="getstarted-hosting-link">What is hosting?</a>
          </div>
          {success ? (
            <div className="form-success">Thank you for sending us a message, we&#8217;ll get back to you ASAP.</div>
          ) : (
            <form id="getstarted-form" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" value={form.fullname} onChange={handleChange} className={errors.fullname ? "field-error" : ""} />
                {errors.fullname && <div className="form-error">This field is required</div>}
              </div>
              <div>
                <label htmlFor="telephone">Telephone</label>
                <div className="getstarted-phone-row">
                  <select name="phoneCode" value={form.phoneCode} onChange={handleChange} className="getstarted-phone-select">
                    {phoneCodeOptions.map((p) => (
                      <option key={p.dial_code + p.name} value={p.dial_code}>{p.dial_code} ({p.name})</option>
                    ))}
                  </select>
                  <input type="text" id="telephone" name="telephone" value={form.telephone} onChange={handleChange} className={errors.telephone ? "field-error" : ""} />
                </div>
                {errors.telephone && <div className="form-error">Please enter a valid phone number</div>}
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className={errors.email ? "field-error" : ""} />
                {errors.email && <div className="form-error">Please enter a valid email address</div>}
              </div>
              <div>
                <label htmlFor="siteurl">Site URL</label>
                <input type="text" id="siteurl" name="siteurl" value={form.siteurl} onChange={handleChange} className={errors.siteurl ? "field-error" : ""} placeholder="https://yourdomain.com" />
                {errors.siteurl && <div className="form-error">Please enter a valid URL starting with http://, https://, or www.</div>}
                <div className="checkbox-container">
                  <label className="checkbox-label-row">
                    <input type="checkbox" name="ownurl" checked={form.ownurl} onChange={handleChange} />
                    <div className="checkbox-label">I already own this url</div>
                  </label>
                  <label className="checkbox-label-row">
                    <input type="checkbox" name="hosting" checked={form.hosting} onChange={handleChange} />
                    <div className="checkbox-label">I will need hosting</div>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <select id="location" name="location" value={form.location} onChange={handleChange} className={errors.location ? "field-error" : ""}>
                  {countryOptions.map((c) => (
                    <option key={c.code + c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {errors.location && <div className="form-error">This field is required</div>}
              </div>
              <div>
                <label htmlFor="description">Site General Description</label>
                <textarea id="description" name="description" rows={6} value={form.description} onChange={handleChange} className={errors.description ? "field-error" : ""} />
                {errors.description && <div className="form-error">Must be at least 50 characters</div>}
              </div>
              <div>
                <label htmlFor="goals">Site Goals</label>
                <textarea id="goals" name="goals" rows={6} value={form.goals} onChange={handleChange} className={errors.goals ? "field-error" : ""} />
                {errors.goals && <div className="form-error">Must be at least 30 characters</div>}
              </div>
              <div>
                <label htmlFor="business">Short Business Explanation</label>
                <textarea id="business" name="business" rows={6} value={form.business} onChange={handleChange} className={errors.business ? "field-error" : ""} />
                {errors.business && <div className="form-error">Must be at least 30 characters</div>}
              </div>
              <div>
                <label htmlFor="budget">Approximate Budget (USD)</label>
                <input type="text" id="budget" name="budget" value={form.budget} onChange={handleChange} className={errors.budget ? "field-error" : ""} placeholder="e.g. 5000" />
                {errors.budget && <div className="form-error">Please enter a valid budget amount</div>}
              </div>
              <div>
                <label>Approximate Deadline</label>
                <div className="getstarted-deadline-row">
                  <input type="text" name="deadlineMonth" id="deadlineMonth" value={form.deadlineMonth} onChange={handleChange} className={errors.deadlineMonth ? "field-error" : ""} placeholder="MM" maxLength={2} onKeyDown={(e) => handleDeadlineKeyDown(e, "deadlineMonth")} />
                  <span>/</span>
                  <input type="text" name="deadlineDay" id="deadlineDay" value={form.deadlineDay} onChange={handleChange} className={errors.deadlineDay ? "field-error" : ""} placeholder="DD" maxLength={2} onKeyDown={(e) => handleDeadlineKeyDown(e, "deadlineDay")} />
                  <span>/</span>
                  <input type="text" name="deadlineYear" id="deadlineYear" value={form.deadlineYear} onChange={handleChange} className={errors.deadlineYear ? "field-error" : ""} placeholder="YYYY" maxLength={4} />
                </div>
                {(errors.deadlineMonth || errors.deadlineDay || errors.deadlineYear) && (
                  <div className="form-error">Please enter a valid date (MM/DD/YYYY, year ≥ 2025)</div>
                )}
              </div>
              <div>
                <label htmlFor="notes">Additional Notes</label>
                <textarea id="notes" name="notes" rows={4} value={form.notes} onChange={handleChange} />
              </div>
              <div>
                <input type="submit" value="Send" />
                {errors.submit && <div className="form-error">{errors.submit}</div>}
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
  </div>
);

export default GetStarted;
	const validateEmail = (email) => /.+@.+\..+/.test(email);
	const validatePhone = (phone) => /^[0-9\-\s()]{7,}$/.test(phone);
	const validateUrl = (url) =>
		/^(https?:\/\/)?(www\.)?[^\s]+\.[^\s]+/.test(url);
	const validateNumber = (val) => !isNaN(Number(val)) && val.trim() !== "";
	const validateMonth = (m) => /^([1-9]|1[0-2])$/.test(m);
	const validateDay = (d) => /^([1-9]|[12][0-9]|3[01])$/.test(d);
	const validateYear = (y) => /^\d{4}$/.test(y) && Number(y) >= 2025;

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
		if (!validateNumber(form.budget)) errs.budget = true;
		if (!validateMonth(form.deadlineMonth)) errs.deadlineMonth = true;
		if (!validateDay(form.deadlineDay)) errs.deadlineDay = true;
		if (!validateYear(form.deadlineYear)) errs.deadlineYear = true;
		return errs;
	};

	const handleChange = async (e) => {
		const { name, value, type, checked } = e.target;
		if (name === "location") {
			const selectedCountry = countryOptions.find(
				(c) => c.name === value
			);
			let newPhoneCode = form.phoneCode;
			if (selectedCountry) {
				newPhoneCode = selectedCountry.dial_code;
			}
			setForm((prev) => ({
				...prev,
				location: value,
				phoneCode: newPhoneCode,
			}));
			if (errors["location"]) setErrors({ ...errors, location: false });
			if (errors["phoneCode"]) setErrors({ ...errors, phoneCode: false });
			// Reset USD equivalent if location changes
			setForm((prev) => ({ ...prev, usdEquivalent: "" }));
		} else if (name === "budgetCurrency") {
			setForm((prev) => ({
				...prev,
				budgetCurrency: value,
				budgetOtherCurrency: "",
			}));
			// Reset USD equivalent on currency change
			setForm((prev) => ({ ...prev, usdEquivalent: "" }));
		} else if (name === "budgetOtherCurrency") {
			setForm((prev) => ({ ...prev, budgetOtherCurrency: value }));
			// Reset USD equivalent on currency change
			setForm((prev) => ({ ...prev, usdEquivalent: "" }));
		} else if (name === "budgetAmount") {
			// Only allow numbers, commas, decimals
			const sanitized = value.replace(/[^\d.,]/g, "");
			setForm((prev) => ({ ...prev, budgetAmount: sanitized }));
			// Reset USD equivalent on amount change
			setForm((prev) => ({ ...prev, usdEquivalent: "" }));
		} else {
			setForm((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
			if (errors[name]) setErrors({ ...errors, [name]: false });
		}
	};

	const handleDeadlineKeyDown = (e, field) => {
		if (e.key === "Tab") {
			if (field === "deadlineMonth" && !e.shiftKey) {
				e.preventDefault();
				document.getElementById("deadlineDay").focus();
			} else if (field === "deadlineDay" && !e.shiftKey) {
				e.preventDefault();
				document.getElementById("deadlineYear").focus();
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validate();
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length === 0) {
			// send with emailjs
			window.emailjs
				.send(
					"service_ie06l0b",
					"template_64p8506",
					{
						...form,
						deadline: `${form.deadlineMonth}/${form.deadlineDay}/${form.deadlineYear}`,
						time: new Date().toLocaleString(),
					},
					"41CWR9J7p79kVgXoW"
				)
				.then(() => {
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
						budget: "",
						deadlineMonth: "",
						deadlineDay: "",
						deadlineYear: "2025",
						notes: "",
					});
				})
				.catch(() => {
					setErrors({ submit: "Failed to send. Please try again." });
				});
		}
	};

	return (
		<div className="page-content">
			<Helmet>
				<title>{`Get Started | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
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
						Let&#8217;s get started on your project! (Or get a quote).
					</div>
					<div className="subtitle contact-subtitle">
						Thanks for your interest in working with me.
						Let&#8217;s talk about your project. I&#8217;m here to help you build something amazing and unique, reliable, on time, and cost effective.
						<br />
						<br />I make an effort to respond to all messages
					</div>
					<div className="getstarted-hosting-info-row">
						<a name="hosting" className="getstarted-hosting-link">
							What is hosting?
						</a>
					</div>
					{success ? (
									alignItems: "center",
								}}
							>
								<input
									type="text"
									name="deadlineMonth"
									id="deadlineMonth"
									value={form.deadlineMonth}
									onChange={handleChange}
									className={
										errors.deadlineMonth
											? "field-error"
											: ""
									}
									placeholder="MM"
									maxLength={2}
									style={{ width: 40 }}
									onKeyDown={(e) =>
										handleDeadlineKeyDown(
											e,
											"deadlineMonth"
										)
									}
								/>
								<span>/</span>
								<input
									type="text"
									name="deadlineDay"
									id="deadlineDay"
									value={form.deadlineDay}
									onChange={handleChange}
									className={
										errors.deadlineDay ? "field-error" : ""
									}
									placeholder="DD"
									maxLength={2}
									style={{ width: 40 }}
									onKeyDown={(e) =>
										handleDeadlineKeyDown(e, "deadlineDay")
									}
								/>
								<span>/</span>
								<input
									type="text"
									name="deadlineYear"
									id="deadlineYear"
									value={form.deadlineYear}
									onChange={handleChange}
									className={
										errors.deadlineYear ? "field-error" : ""
									}
									placeholder="YYYY"
									maxLength={4}
									style={{ width: 60 }}
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
											<option key={p.dial_code + p.name} value={p.dial_code}>
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
										className={errors.telephone ? "field-error" : ""}
									/>
								</div>
								{errors.telephone && <div className="form-error">Please enter a valid phone number</div>}
							</div>
							<div>
								<label htmlFor="email">Email</label>
								<input
									type="email"
									id="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									className={errors.email ? "field-error" : ""}
								/>
								{errors.email && <div className="form-error">Please enter a valid email address</div>}
							</div>
							<div>
								<label htmlFor="siteurl">Site URL</label>
								<input
									type="text"
									id="siteurl"
									name="siteurl"
									value={form.siteurl}
									onChange={handleChange}
									className={errors.siteurl ? "field-error" : ""}
									placeholder="https://yourdomain.com"
								/>
								{errors.siteurl && <div className="form-error">Please enter a valid URL starting with http://, https://, or www.</div>}
								<div className="checkbox-container">
									<label className="checkbox-label-row">
										<input
											type="checkbox"
											name="ownurl"
											checked={form.ownurl}
											onChange={handleChange}
										/>
										<div className="checkbox-label">I already own this url</div>
									</label>
									<label className="checkbox-label-row">
										<input
											type="checkbox"
											name="hosting"
											checked={form.hosting}
											onChange={handleChange}
										/>
										<div className="checkbox-label">I will need hosting</div>
									</label>
							</label>
							<textarea
								id="notes"
								name="notes"
								rows={5}
								value={form.notes}
								onChange={handleChange}
							/>

							<input type="submit" value="Send" />
							{errors.submit && (
								<div className="form-error">
									{errors.submit}
								</div>
							)}
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

// --- Currency conversion helper component ---
function USDXConverter({ amount, currency, setUsdEquivalent, usdEquivalent }) {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");

// ... (rest of the code remains the same)
		if (!amount || !currency) return;
		setLoading(true);
		setError("");
		const sanitizedAmount = parseFloat((amount + "").replace(/,/g, ""));
		if (isNaN(sanitizedAmount)) {
			setError("Invalid amount");
			setLoading(false);
			return;
		}
		const url = `http://api.exchangeratesapi.io/v1/latest/?access_key=fe5a838f6e6ac90efbc3b555b33e5a2e&from=${currency}&to=USD&amount=${sanitizedAmount}`;
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				if (data.success && data.result) {
					setUsdEquivalent(
						Number(data.result).toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						})
					);
					setError("");
				} else {
					setUsdEquivalent("");
					setError("Could not fetch conversion");
				}
			})
			.catch(() => {
				setUsdEquivalent("");
				setError("Could not fetch conversion");
			})
			.finally(() => setLoading(false));
		// Only run when amount/currency changes
		// eslint-disable-next-line
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
	if (usdEquivalent)
		return (
			<div className="usdx" style={{ textAlign: "center" }}>
				USD Equivalent: <strong>{usdEquivalent}</strong>
			</div>
		);
	return null;
}

export default GetStarted;
