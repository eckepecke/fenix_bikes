import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

interface PaymentSuccessProps {
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ }) => {
	const { tripId } = useParams<{ tripId: string }>();
	useEffect(() => {
		document.title = "Payment successful - Avec";

		const updatePaymentStatus = async () => {
			try {
				const response = await fetch(`http://localhost:1337/stripe/payment-success/${tripId}`, {
					method: "GET",
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				console.log(result.msg);
			} catch (error) {
				console.log("Failed to update payment status:", error);
			}
		}

		if (tripId) {
			updatePaymentStatus();
		}
	}, [tripId]);

	return (
		<div>
			<h1>Payment successful!</h1>
			<p>Your payment for trip {tripId} was successful.</p>
		</div>
	);
};

export default PaymentSuccess;
