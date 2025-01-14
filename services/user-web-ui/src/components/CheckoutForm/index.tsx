import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface CheckoutFormProps {
	type: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ type }) => {
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
				return_url: `${window.location.origin}/payment-success/${type}`,
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
