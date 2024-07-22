export interface shipping {
    shippingMethod: string;
    trackingNumber?: number | undefined;
    address: string;
    city: string;
    zipcode: number;
    country: string;
}