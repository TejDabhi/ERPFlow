export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  shipping_method_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}
