export type TCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};



export interface TProduct {
  status?: "active" | "inactive" | string;
  stockStatus?: boolean;
  discount?: (discount: number) => number;
  orderQuantity?: string | number | readonly string[] | undefined;
  _id: string;
  name: string; // Product name
  photo?: string | string[]; // Product image URL (single or array for backward compatibility)
  photos?: string[]; // Product images array
  description: string; // Product description
  price: number; // Unit price
  stock: number; // Available stock
  category?: TCategory | TCategory[] | string | string[]; // Linked category
  brand?: string; // Brand name (optional)
  createdAt: string;
  //   updatedAt: string;
  // User/Admin who created
}

export type TProductResponse = {
  data: TProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

interface OrderItem {
  id: TProduct;
  orderQuantity: number;
  _id: string;
}
export interface TOrder {
  _id: string;
  orderId: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
  };
  product: OrderItem[];
  address: {
    address: string;
    district: string;
    _id: string;
  };
  totalAmount: number;
  deliveryStatus: boolean;
  paymentStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TOrderResponse = {
  data: TOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};
