export const getCart = async () => {
  const res = await fetch('/api/v1/cart', {
    credentials: "include"
  });
  const data = await res.json();
  return data.data?.cart?.items;
};

export const addProd = async (product) => {
  const res = await fetch('/api/v1/cart/add', {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: product._id,
      quantity: 1
    })
  });

  const data = await res.json();
  return data.data?.cart?.items;
};

export const remProd = async (productId) => {
  const res = await fetch(`/api/v1/cart/remove/${productId}`, {
    method: "DELETE",
    credentials: "include"
  })

  const data = await res.json();
  return data.data?.cart?.items;
};

export const increaseQty = async (productId, quantity) => {
  const res = await fetch(`/api/v1/cart/${productId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity
    })
  });

  const data = await res.json();
  return data.data?.cart?.items;
};

export const reduceQty = async (productId, quantity) => {
  const res = await fetch(`/api/v1/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity
    })
  });

  const data = await res.json();
  return data.data?.cart?.items;
};

export const restoreCart = async () => {
  const res = await fetch('/api/v1/cart', {
    method: "DELETE",
    credentials: "include"
  });

  const data = await res.json();
  return data.data?.cart?.items;
};



