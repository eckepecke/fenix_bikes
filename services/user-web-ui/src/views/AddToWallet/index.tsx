import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCookies } from "react-cookie";
import CheckoutForm from "../../components/CheckoutForm";
import { FetchUser, User } from "../../components/FetchUser";
import "./index.css";

const stripePromise = loadStripe(
	"pk_test_51Qecw3HCLCJGrqtYLCNqi4ZLICjXGEBvDOrr4FXZQUTAzm3JMkRN5bXI0sIIb7B7yjheuL9GorYdu95w65TpR5fq00C0ZmolBn"
);

interface AddToWalletProps {}

const AddToWallet: React.FC<AddToWalletProps> = () => {
	useEffect(() => {
		document.title = "Wallet - Avec";
	}, []);

	const [payment, setPayment] = useState({
		amount: "",
		show: true,
		clientSecret: "",
	});

	const [cookies] = useCookies(["user"]);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		document.title = "Ride History - Avec";

		const getUser = async () => {
			if (cookies.user?.email) {
				const fetchedUser = await FetchUser(cookies.user.email);
				setUser(fetchedUser);
			}
		};

		getUser();
	}, [cookies]);

	const handlePaymentIntent = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			console.log(`payment.amount: ${payment.amount}`);
			console.log(`Number(payment.amount): ${Number(payment.amount)}`);
			const response = await fetch("http://localhost:1337/api/v1/stripe/payment-intent", {
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

			const clientSecretResponse = await response.json();
			const clientSecret = clientSecretResponse.client_secret;

			setPayment((pre) => ({ ...pre, clientSecret, show: false }));
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<h1>Wallet</h1>
			<p>Current balance: {user ? user.balance : "Loading..."}</p>
			{payment.show ? (
				<form className="payment-form">
					<input
						type="text"
						placeholder="Amount"
						value={payment.amount}
						onChange={(e) => setPayment((pre) => ({ ...pre, amount: e.target.value }))}
					/>
					<button className="green-btn" onClick={handlePaymentIntent}>
						Continue to checkout form
					</button>
				</form>
			) : (
				payment.clientSecret && (
					<Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret }}>
						<CheckoutForm type="wallet" />
					</Elements>
				)
			)}
		</div>
	);
};

export default AddToWallet;
