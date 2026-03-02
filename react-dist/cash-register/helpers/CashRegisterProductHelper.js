export class CashRegisterProductHelper {
  static calculateTotal(products) {
    return products.reduce((acc, product) => {
      const subtotal = product.price * product.quantity;
      return acc + subtotal - (product.discountCalculated ?? 0);
    }, 0);
  }
}