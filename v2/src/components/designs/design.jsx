import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./styles/design.css";

const Design = (props) => {
    const { title, description, linkText, link } = props;


    return (
        <React.Fragment>
            <div className="design">
                <Link to={link} target="_blank">
                    <div className="design-container">
                        <div className="design-title">{title}</div>
                        <div className="design-description">{description}</div>
                        <div className="design-link">
                            <div className="design-link-icon">
                                <FontAwesomeIcon icon={faLink} />
                            </div>

                            <div className="design-link-text">{linkText}</div>
                        </div>
                    </div>
                </Link>
            </div>
        </React.Fragment>
    );
};

export default Design;
