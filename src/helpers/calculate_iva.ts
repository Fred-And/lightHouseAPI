export const calculateIva = (value: number): number => {
  const ivaRate = 0.23;
  return value * (1 + ivaRate);
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
