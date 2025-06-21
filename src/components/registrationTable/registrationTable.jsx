import React from "react";

const RegistrationTable = (props) => {
	const { data } = props;

	return (
		<div style={{ marginTop: "100px" }}>
			<div className="registration-table">
				<table>
					<thead>
						<tr>
							<th>Owner</th>
							<th>Locked</th>
							<th>Approved</th>
							<th>Created</th>
							<th>Expires</th>
							<th>+</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
							<td>5</td>
						</tr>

						{data.map((item, index) => {
							return (
								<tr key={index}>
									<td>{item.hasOwnerToApprove}</td>
									<td>{item.hasOwnershipToAccept}</td>
									<td>{item.type}</td>

									<td>{item.consumerKey}</td>
									<td>{item.consumerSecret}</td>
									<td>{item.description}</td>
									<td>{item.parentKey}</td>
								</tr>
							);
						})}
						<tr>
							<td>
								{/* {data.hasOwnerToApprove}
                                {data.hasOwnershipToAccept}
                                {data.type}
                                {data.consumer}
                                {data.consumerKey}
                                {data.consumerSecret}
                                {data.provider}
                                {data.description}
                                {data.parentKey} */}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default RegistrationTable;
