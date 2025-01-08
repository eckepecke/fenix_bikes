import React, { useEffect } from "react";

interface PayProps {
}

const Pay: React.FC<PayProps> = ({  }) => {
	useEffect(() => {
		document.title = "Pay - Avec";
	}, []);

	return (
		<div>
			<h1>Payment</h1>
		</div>
	);
};

export default Pay;
