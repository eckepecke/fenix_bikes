import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./index.css";

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
		<div className="checkout-form">
			<PaymentElement />
			<button className="green-btn" onClick={handlePaymentSubmit}>
				Finish payment
			</button>
		</div>
	);
};

export default CheckoutForm;
