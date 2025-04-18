/**
 * Interface for order creation data
 */
export interface OrderCreateData {
  customerId: number;
  orderNumber: string;
  productionStatus: string;
  orderDate: string;
  description?: string;
  items: OrderItemCreateData[];
}

/**
 * Interface for order item creation data
 */
export interface OrderItemCreateData {
  productId: number;
  printId?: number;
  quantity: number;
  productUnitPrice: number;
  printUnitPrice?: number;
}

/**
 * Interface for order update data
 */
export interface OrderUpdateData {
  customerId?: number;
  orderNumber?: string;
  productionStatus?: string;
  orderDate?: string;
  description?: string;
  totalCost?: number;
  finalCustomerPrice?: number;
}
