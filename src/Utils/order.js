export const createOrder = async (customerName, customerPhone, customerAddress, paymentMethod) => {
  const res = await fetch('/api/v1/orders', {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod
    })
  });

  const data = await res.json();
  return data.data.order;
};

export const getOrders = async () => {
  const res = await fetch('/api/v1/orders', { credentials: "include" });
  
  const data = await res.json();
  return data.data.orders;
};
