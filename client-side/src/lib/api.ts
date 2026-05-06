import type { MenuItem } from '@/data/menuData';

export const API_SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

export type OrderStatus = 'pending' | 'paid';
export type PaymentMethod = 'cash' | 'qris' | 'card';

export type ApiMenu = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiOrderMenu = ApiMenu & {
  quantity: number;
  notes?: string | null;
  tableOrderMenuId: number;
};

export type ApiPayment = {
  id: number;
  tableOrderId: number;
  amount: number;
  paidAmount: number;
  changeAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
};

export type ApiOrder = {
  id: number;
  tableNumber: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  menus: ApiOrderMenu[];
  payment: ApiPayment | null;
};

export type MenuPayload = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
};

export type CreateOrderPayload = {
  tableNumber: number;
  status?: 'pending';
  items: Array<{
    menuId: number;
    quantity: number;
    notes?: string;
  }>;
};

export type CreatePaymentPayload = {
  tableOrderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAmount: number;
  changeAmount: number;
  status: 'paid';
};

export type MidtransTokenPayload = {
  id: string | number;
  product: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  priceTotal: number;
};

export type MidtransTokenResponse = {
  token: string;
  redirect_url?: string;
  status_code?: string;
  status_message?: string;
};

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_SERVER_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage = typeof data === 'object' && data !== null && 'error' in data
      ? String(data.error)
      : 'Terjadi kesalahan pada server.';

    throw new Error(errorMessage);
  }

  return data as T;
};

export const mapMenuToClient = (menu: ApiMenu): MenuItem => ({
  id: menu.id,
  name: menu.name,
  description: menu.description,
  price: menu.price,
  image: menu.imageUrl,
  categoryId: menu.categoryId,
  isPopular: menu.isPopular,
  isAvailable: menu.isAvailable,
});

export const fetchMenus = () => fetchJson<ApiMenu[]>('/get-all-menus');

export const paymentOrder = (payload: MidtransTokenPayload) =>
  fetchJson<MidtransTokenResponse>('/api/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

export const createMenu = (payload: MenuPayload) =>
  fetchJson<ApiMenu>('/create-new-menus', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateMenu = (id: number, payload: MenuPayload) =>
  fetchJson<ApiMenu>(`/update-menu/${id}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deleteMenu = (id: number) =>
  fetchJson<ApiMenu>(`/delete-menu/${id}`, {
    method: 'DELETE',
  });

export const fetchOrders = (status?: OrderStatus) =>
  fetchJson<ApiOrder[]>(status ? `/get-all-orders?status=${status}` : '/get-all-orders');

export const createOrder = (payload: CreateOrderPayload) =>
  fetchJson<ApiOrder>('/create-new-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createPayment = (payload: CreatePaymentPayload) =>
  fetchJson<ApiPayment & { tableOrder: ApiOrder }>('/create-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
