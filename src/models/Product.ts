export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: string;
    isVeg: boolean;
    createdAt: string;
}
