const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createStripeSession = async (orderItems) => {
    const successUrl = process.env.NODE_ENV === 'production' ? 'https://boxtobe.mapa-server.org/order/success' : 'http://localhost:5173/order/success';
    const cancelUrl = process.env.NODE_ENV === 'production' ? 'https://boxtobe.mapa-server.org/order/cancel' : 'http://localhost:5173/order/cancel';

    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            ...orderItems.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.productName,
                        metadata: {
                            productId: item.productId
                        }
                    },
                    unit_amount: Math.round(item.price * 100), // Convertir en centimes
                },
                quantity: item.quantity,
            })),
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Frais de livraison',
                    },
                    unit_amount: 499, // 4.99 EUR en centimes
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${cancelUrl}?session_id={CHECKOUT_SESSION_ID}`,
    });
};

module.exports = {
    createStripeSession,
};