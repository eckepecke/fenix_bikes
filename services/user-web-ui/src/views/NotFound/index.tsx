import React, { useEffect } from "react";

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = ({}) => {
	useEffect(() => {
		document.title = "Payment successful - Fenix";
	}, []);

	return (
		<div>
			<h1>Not found</h1>
			<h2>The page you are looking for doesn't exist (404)</h2>
		</div>
	);
};

export default NotFound;
