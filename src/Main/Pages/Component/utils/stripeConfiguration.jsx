// In your stripe configuration file (e.g., src/stripe.js)
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.PUBLISHABLE_KEY, {
      locale: 'en',
    });
  }
  return stripePromise;
};

export default getStripe;
