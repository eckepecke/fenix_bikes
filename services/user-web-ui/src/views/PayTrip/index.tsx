import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import { FetchTrip } from "../../components/FetchTrip";

const stripePromise = loadStripe(
    "pk_test_51Qecw3HCLCJGrqtYLCNqi4ZLICjXGEBvDOrr4FXZQUTAzm3JMkRN5bXI0sIIb7B7yjheuL9GorYdu95w65TpR5fq00C0ZmolBn"
);

interface PayTripProps { }

const PayTrip: React.FC<PayTripProps> = () => {
    useEffect(() => {
        document.title = "Pay - Avec";
    }, []);

    const [payment, setPayment] = useState({
        amount: "",
        clientSecret: "",
    });

    const { tripId = "" } = useParams<{ tripId: string }>();

    const fetchTripDetails = async () => {
        if (tripId) {
            const trip = await FetchTrip(tripId);
            if (trip && trip.cost) {
                setPayment((pre) => ({ ...pre, amount: trip.cost.toString() }));
            }
        }
    };

    const fetchPaymentIntent = async () => {
        try {
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

            const clientSecretResponse = await response.json();
            const clientSecret = clientSecretResponse.client_secret;

            setPayment((pre) => ({ ...pre, clientSecret }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);

    useEffect(() => {
        if (payment.amount) {
            fetchPaymentIntent();
        }
    }, [payment.amount]);

    return (
        <div>
            <h1>Payment</h1>
            {payment.clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret }}>
                    <CheckoutForm tripId={tripId} />
                </Elements>
            )}
        </div>
    );
};

export default PayTrip;