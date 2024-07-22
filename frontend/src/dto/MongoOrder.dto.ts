export interface mongoOrder {
    _id: string,
    postgresId: string,
    orderNumber: string,
    date: Date,
    user: {
        userId: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
    },
    status: [
        {
            statusId: string,
            status: string,
            date: Date,
            _id: string
        }
    ],
    orderItems: [
        {
            orderItemId: string,
            productId: string,
            productName: string,
            quantity: number,
            price: number,
            _id: string
        }
    ],
    payment: {
        paymentId: string,
        stripePaymentId: string,
        amount: number,
        _id: string
    },
    shipping: {
        shippingId: string,
        shippingMethod: string,
        trackingNumber: number,
        address: string
        city: string,
        zipcode: number,
        country: string,
    },
    __v: number
}