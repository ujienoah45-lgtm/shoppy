const getProducts = async (sortBy = "name") => {
  const res = await fetch(`/api/v1/products?sort=${sortBy}&limit=50`);
  const data = await res.json();
  return data.data.products;
};

export default getProducts;