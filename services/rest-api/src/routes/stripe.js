import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { setTripPaid } from '../../../db/trips.js';

dotenv.config();
const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripe = Stripe(stripeApiKey);

const router = express.Router();

router.get("/", async (req, res) => {
  return res.status(200).json({
    message: "These are all the stripe routes",
    routes: {
      paymentIntent: {
        method: "POST",
        path: "stripe/payment-intent",
        description: ""
      },
      createCheckoutSession: {
        method: "POST",
        path: "stripe/create-checkout-session",
        description: ""
      },

    }
  });
});

router.post('/payment-intent', async (req, res) => {
  const { amount } = req.body;

  console.log(`amount: ${amount}`);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'sek',
  });

  res.json({
    msg: 'Payment Intent Created',
    client_secret: paymentIntent.client_secret

  });
});

router.post('/create-checkout-session', async (req, res) => {
  const { tripId, amount } = req.body;

  console.log(`tripId: ${tripId}, amount: ${amount}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'sek',
          product_data: {
            name: `Trip ${tripId}`,
          },
          unit_amount: amount * 100, // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.headers.origin}/payment-success/${tripId}`,
    cancel_url: `${req.headers.origin}/cancel`,
  });

  res.json({ id: session.id });
});


router.get('/payment-success/:tripId', async (req, res) => {
  const { tripId } = req.params;
  console.log(`Payment success for trip ID: ${tripId}`);

  try {
    await setTripPaid(tripId);
    res.json({ msg: 'Trip payment status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to update trip payment status' });
  }
});


export default router;