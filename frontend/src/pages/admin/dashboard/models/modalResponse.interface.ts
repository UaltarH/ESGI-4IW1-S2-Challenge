export interface ModalResponse {
    type: "area" | "bar" | "line";
    title: string;
    description: string;
    width: number[];
    height: number[];
    dataSource: "orders" | "products";
    indexField: "name" | "date" | "categoryName";
    categoryField1: "totalAmount" | "orderCount" | "price" | "stock";
}