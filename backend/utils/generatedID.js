export const generateCustomerId = (latestNumber) => {
  return `CUST-${String(latestNumber).padStart(4, "0")}`;
};

export const generateOrderId = (latestNumber) => {
  return `ORD-${String(latestNumber).padStart(4, "0")}`;
};
