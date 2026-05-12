export interface Stats {
  revenue: number;
  sales: number;
  customers: number;
  avgOrderValue: number;
  revenueChange: number;
  salesChange: number;
  customersChange: number;
  aovChange: number;
}

export type OrderStatus = 'New' | 'In Kitchen' | 'Packaging' | 'Shipped' | 'Cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  image: string;
  isSeasonal?: boolean;
  isBundle?: boolean;
}
