/**
 * Validation schema for product creation
 */
export const createProductSchema = {
  schema: {
    body: {
      type: "object",
      required: ["name", "sku", "categoryId", "providerId", "baseCost"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        sku: { type: "string" },
        categoryId: { type: "number" },
        providerId: { type: "number" },
        
        // Pricing components
        baseCost: { type: "number", minimum: 0 },
        printCost: { type: "number", minimum: 0 },
        packagingCost: { type: "number", minimum: 0 },
        shippingCost: { type: "number", minimum: 0 },
        laborCost: { type: "number", minimum: 0 },
        marginPercentage: { type: "number", minimum: 0 },
      },
    },
  },
};

/**
 * Validation schema for product update
 */
export const updateProductSchema = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number" },
      },
    },
    body: {
      type: "object",
      required: ["name", "sku", "categoryId", "providerId", "baseCost"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        sku: { type: "string" },
        categoryId: { type: "number" },
        providerId: { type: "number" },
        
        // Pricing components
        baseCost: { type: "number", minimum: 0 },
        printCost: { type: "number", minimum: 0 },
        packagingCost: { type: "number", minimum: 0 },
        shippingCost: { type: "number", minimum: 0 },
        laborCost: { type: "number", minimum: 0 },
        marginPercentage: { type: "number", minimum: 0 },
      },
    },
  },
};
