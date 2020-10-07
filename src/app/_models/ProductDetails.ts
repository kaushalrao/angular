import { ItemDetails } from "./ItemDetails";

export class ProductDetails {
    id: number;
    customer_id: string;
    order_id: string;
    quantity: number;
    product_code: ItemDetails[];
}