export const calculateIva = (value: number): number => {
  const ivaRate = 0.23;
  return value * (1 + ivaRate);
};

/**
 * Calculate the final price of a product based on its component costs and margin
 * @param baseCost - The base cost of the product (e.g. from supplier)
 * @param printCost - Optional cost for printing
 * @param packagingCost - Optional cost for packaging
 * @param shippingCost - Optional cost for shipping
 * @param laborCost - Optional cost for labor
 * @param marginPercentage - Optional margin percentage (default: 30%)
 * @returns The final price of the product
 */
export const calculateProductFinalPrice = ({
  baseCost,
  printCost = 0,
  packagingCost = 0,
  shippingCost = 0,
  laborCost = 0,
  marginPercentage = 30,
}: {
  baseCost: number;
  printCost?: number;
  packagingCost?: number;
  shippingCost?: number;
  laborCost?: number;
  marginPercentage?: number;
}): number => {
  // Calculate the total cost
  const totalCost =
    baseCost + printCost + packagingCost + shippingCost + laborCost;

  // Apply the margin
  const finalPrice = totalCost * (1 + marginPercentage / 100);

  // Return the final price rounded to 2 decimal places
  return Number(finalPrice.toFixed(2));
};

export const calculateProductRawTotal = (
  productPrice: number,
  printPrice: number,
  quantity: number
): number => {
  return (productPrice + printPrice) * quantity;
};

export const calculateProductUnitRawTotal = (
  productPrice: number,
  printPrice: number
): number => {
  return productPrice + printPrice;
};

export const calculateProductTotal = (
  productPrice: number,
  printPrice: number,
  quantity: number,
  serviceFee: number
): number => {
  return (
    calculateProductUnitRawTotal(productPrice, printPrice) *
    quantity *
    serviceFee
  );
};

export const calculateProductRawTotalArray = (
  items: {
    productPrice: number;
    printPrice: number;
    quantity: number;
  }[]
): number => {
  return items.reduce((acc, item) => {
    return (
      acc +
      calculateProductRawTotal(
        item.productPrice,
        item.printPrice,
        item.quantity
      )
    );
  }, 0);
};

export const calculateProductTotalArray = (
  items: {
    productPrice: number;
    printPrice: number;
    quantity: number;
    serviceFee: number;
  }[]
): number => {
  return items.reduce((acc, item) => {
    return (
      acc +
      calculateProductRawTotal(
        item.productPrice,
        item.printPrice,
        item.quantity
      ) *
        item.serviceFee
    );
  }, 0);
};

export const calculateProductTotalWithIva = (
  productPrice: number,
  printPrice: number,
  quantity: number,
  serviceFee: number
): number => {
  return calculateIva(
    calculateProductTotal(productPrice, printPrice, quantity, serviceFee)
  );
};
