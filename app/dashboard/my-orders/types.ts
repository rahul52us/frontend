export interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string | Date;
  remarks?: string;
}

export interface OrderData {
  _id: string;
  orderId: string;
  company?: {
    _id: string;
    name: string;
    companyCode?: string;
    logo?: { url?: string };
  };
  items: OrderItem[];
  orderStatus: string;
  paymentMethod: string;
  paymentStatus?: string;
  subtotal?: number;
  total: number;
  quote?: {
    price?: { value: string; currency: string };
    breakup?: Array<{
      title: string;
      title_type: "item" | "delivery" | "tax" | "discount" | "packing";
      price: { value: string; currency: string };
    }>;
  };
  deliveryCharges?: number;
  discount?: number;
  tax?: number;
  shippingAddress?: {
    name?: string;
    phone?: string;
    address?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  statusHistory?: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

