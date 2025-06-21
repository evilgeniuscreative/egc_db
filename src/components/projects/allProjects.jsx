import React, { useState } from "react";
import Select from "react-select";
import Project from "./project";
import INFO from "../../data/user";

import "./styles/allProjects.css";

const AllProjects = () => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [projectType, setProjectType] = useState("");
	const [filterKey, setFilterKey] = useState(0);

	const handleProjecTypeDisplay = (option) => {
		setSelectedOption(option);
		setProjectType(option ? option.value : "");
		setFilterKey((prevKey) => prevKey + 1);
	};

	const options = [
		{ value: "all", label: "All" },
		{ value: "animation", label: "Animation" },
		{ value: "design", label: "Design" },
		{ value: "frontend", label: "Front End" },
		{ value: "backend", label: "Mid Layer / Back End" },
		{ value: "print", label: "Print" },
	];

	return (
		<>
			<p className="all-projects-type-label">
				Select Projects by Type (Most have multiple types.)
			</p>
			<div className="all-projects-type">
				<Select
					options={options}
					onChange={handleProjecTypeDisplay}
					value={selectedOption}
					placeholder="All"
				/>
			</div>
			<div className="all-projects-container">
				{INFO.projects.map(
					(project, index) =>
						project.show !== false &&
						(projectType === "" ||
							(Array.isArray(project.type)
								? project.type.includes(projectType)
								: project.type === projectType) ||
							projectType === "all") && (
							<div
								className={`all-projects-project project-${index}`}
								key={`${filterKey}-${index}`}
							>
								<Project
									softwareLogos={project.logos}
									title={project.title}
									description={project.description}
									thumb={project.thumb}
									link={project.link}
									linkText={project.linkText}
									type={project.type}
								/>
							</div>
						)
				)}
			</div>
		</>
	);
};

export default AllProjects;
