export interface RolePivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: RolePivot;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  email_verified_at: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: unknown[];
}

export interface UserProfileType {
  ok: boolean;
  message: string;
  data: User;
}

export interface BlogType {
  id: number;
  category_id: number;
  title: string;
  content: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    image: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  email_verified_at: string; // ISO Date String
  phone: string;
  address: string;
  status: "active" | "inactive";
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
}

export interface Food {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: string; // Stored as string to preserve decimal precision
  stock: number;
  image: string; // URL string
  status: "available" | "out_of_stock" | string;
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
}

export interface OrderItem {
  id: number;
  order_id: number;
  food_id: number;
  plan_type: "regular" | "custom" | string;
  total_days: number;
  quantity: number;
  unit_price: string; // Numeric string
  subtotal: string; // Numeric string
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  food: Food;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: string; // Numeric string
  status: "pending" | "processing" | "completed" | "cancelled" | string;
  payment_status: "pending" | "paid" | "refunded" | string;
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  total_deliveries: number;
  completed_deliveries: number;
  user: User;
  items: OrderItem[];
}

export interface Category {
  id: number;
  name: string;
  image: string | null;
  status: string;
  created_at: string; // ISO 8601 Timestamp format string
  updated_at: string;
}

export interface FoodItem {
  id: number;
  category_id: number;
  name: string;
  description: string; // Contains HTML string content
  price: string; // NOTE: Decimal balances from database payloads map as strings
  stock: number;
  image: string; // URL String resource path
  status: "available" | "unavailable" | string; // Strict literal status check
  created_at: string;
  updated_at: string;
  category: Category; // Eager-loaded relational category model data layout
}

export interface NotificationInnerData {
  order_id: number;
  order_number: string;
  amount?: string;
  message: string;
  type: "new_order" | "cancelled" | string;
}

export interface NotificationItem {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationInnerData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
