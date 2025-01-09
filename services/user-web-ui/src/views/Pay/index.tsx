import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm";

const stripePromise = loadStripe(
	"pk_test_51Qecw3HCLCJGrqtYLCNqi4ZLICjXGEBvDOrr4FXZQUTAzm3JMkRN5bXI0sIIb7B7yjheuL9GorYdu95w65TpR5fq00C0ZmolBn"
);

interface PayProps {}

const Pay: React.FC<PayProps> = () => {
	useEffect(() => {
		document.title = "Pay - Avec";
	}, []);

	const [payment, setPayment] = useState({
		amount: "",
		show: true,
		clientSecret: "",
	});

	const handlePaymentIntent = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
      console.log(`payment.amount: ${payment.amount}`);
      console.log(`Number(payment.amount): ${Number(payment.amount)}`);
			const response = await fetch("http://localhost:1337/stripe/payment-intent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: Number(payment.amount),
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const { clientSecret } = await response.json();

			setPayment((pre) => ({ ...pre, clientSecret, show: false }));
		} catch (error) {
			console.log(error);
		}
	};
		return (
			<div>
				<h1>Payment</h1>
				{payment.show ? (
					<form>
						<input
							type="text"
							placeholder="Amount"
							value={payment.amount}
							onChange={(e) => setPayment((pre) => ({ ...pre, amount: e.target.value }))}
						/>
						<button className="btn green" onClick={handlePaymentIntent}>
							Continue to checkout form
						</button>
					</form>
				) : (
          <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret }}>
            <CheckoutForm />
          </Elements>
				)}
			</div>
		);
	};

export default Pay;