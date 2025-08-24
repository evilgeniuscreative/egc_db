import React from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar.jsx";
import Footer from "../components/common/footer.jsx";
import Logo from "../components/common/logo.jsx";

import INFO from "../data/user.js";
import SEO from "../data/seo.js";
import REG_DATA from "../data/registration_data.js"; // Correct import statement
import RegistrationTable from "../components/registrationTable/registrationTable.jsx";

const AllRegistrations = () => {
	const currentSEO = SEO.find((item) => item.page === "coaroauth") || {};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Projects | ${INFO.main.title}`}</title>
				<meta
					name="description"
					content={currentSEO.description || "Missing Description"}
				/>
				<meta
					name="keywords"
					content={(currentSEO.keywords || []).join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="COAR Project" />
				<div className="content-wrapper">
					<div className="projects-logo-container">
						<div className="projects-logo">
							<Logo width={99} />
						</div>
					</div>
					<div className="coar-container">
						<RegistrationTable data={REG_DATA} />
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default AllRegistrations;
