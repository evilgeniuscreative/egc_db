import React from "react";

import Design from "./design";

import INFO from "../../data/user";

import "./styles/allDesigns.css";

const AllDesigns = () => {
    return (
        <div className="all-designs-container">
            {INFO.designs.map((design, index) => (
                <div className="all-designs-design" key={index}>
                    <Design
                        title={design.title}
                        description={design.description}
                        linkText={design.linkText}
                        link={design.link}
                    />
                </div>
            ))}
        </div>
    );
};

export default AllDesigns;
