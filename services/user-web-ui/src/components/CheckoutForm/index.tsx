import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface CheckoutFormProps {
	tripId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ tripId }) => {
	const stripe = useStripe();
	const elements = useElements();

	const handlePaymentSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!stripe || !elements) {
			return;
		}

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/payment-success/${tripId}`,
			},
		});

		if (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<PaymentElement />
			<button className="btn green" onClick={handlePaymentSubmit}>
				Finish payment
			</button>
		</div>
	);
};

export default CheckoutForm;
