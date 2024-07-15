export interface mongoOrder {
    _id: string,
    postgresId: string,
    totalPrice: number,
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
        paymentMethod: string,
        amount: number,
        _id: string
    },
    shipping: {
        shippingId: string,
        shippingMethod: string,
        trackingNumber: string,
        address: string
        city: string,
        zipcode: number,
        country: string,
    },
    __v: number
}