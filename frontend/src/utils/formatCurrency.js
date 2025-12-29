// Format currency to USD without rounding
export const formatCurrency = (price) => {
  if (price === null || price === undefined) return '$0.00';
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  // Format with 2 decimal places, no rounding
  return `$${numPrice.toFixed(2)}`;
};

