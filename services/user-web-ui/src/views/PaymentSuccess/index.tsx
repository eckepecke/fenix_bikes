import React, { useEffect } from "react";

interface PaymentSuccessProps {
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({  }) => {
	useEffect(() => {
		document.title = "Payment successful - Avec";
	}, []);

	return (
		<div>
			<h1>Payment successful!</h1>
		</div>
	);
};

export default PaymentSuccess;
