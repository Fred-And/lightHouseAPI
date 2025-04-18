/**
 * Interface for product creation data with detailed pricing components
 */
export interface ProductCreateData {
  name: string;
  description?: string;
  sku: string;
  categoryId: number;
  providerId: number;

  // Pricing components
  baseCost: number; // Base cost from supplier (stored as rawPrice)
  printCost?: number; // Optional print cost
  packagingCost?: number; // Optional packaging cost
  shippingCost?: number; // Optional shipping cost
  laborCost?: number; // Optional labor cost
  marginPercentage?: number; // Optional margin percentage (default 30%)
}

/**
 * Interface for product update data
 */
export interface ProductUpdateData extends ProductCreateData {
  id: number;
}

/**
 * Interface for product response data
 */
export interface ProductResponseData {
  id: number;
  name: string;
  description?: string;
  sku: string;
  rawPrice: number;
  totalPrice: number;
  categoryId: number;
  providerId: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: number;
    name: string;
  };
  provider?: {
    id: number;
    name: string;
  };
  inventory?: {
    id: number;
    quantity: number;
    minimumQuantity: number;
    location?: string;
  };
}
