import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './AdminProducts.css';

const emptyForm = {
  _id: null,
  name: '',
  description: '',
  category: '',
  sizes: '',
  colors: '',
  price: '',
  brand: '',
  stock: '',
  images: [],
};

const asCsv = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  return value || '';
};

const splitCsv = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/products?limit=100', { credentials: 'include' });
      const data = await res.json();
      if (data.status === 'success') {
        setProducts(data.data?.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        toast.error('Delete failed');
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      _id: product._id,
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      sizes: asCsv(product.sizes),
      colors: asCsv(product.colors),
      price: product.price ?? '',
      brand: product.brand || '',
      stock: product.stock ?? '',
      images: Array.isArray(product.images) ? product.images : [],
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentProduct(emptyForm);
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditing(true);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const sizes = splitCsv(currentProduct.sizes);
    const colors = splitCsv(currentProduct.colors);

    if (!currentProduct.name || !currentProduct.category || !currentProduct.price || !currentProduct.stock || !currentProduct.brand) {
      toast.error('Please fill required fields: name, category, brand, price, stock.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', currentProduct.name);
      formData.append('description', currentProduct.description);
      formData.append('category', currentProduct.category);
      formData.append('price', String(Number(currentProduct.price)));
      formData.append('brand', currentProduct.brand);
      formData.append('stock', String(Number(currentProduct.stock)));

      sizes.forEach((size) => formData.append('sizes', size));
      colors.forEach((color) => formData.append('colors', color));
      imageFiles.forEach((file) => formData.append('images', file));

      if (currentProduct._id) {
        const res = await fetch(`/api/v1/products/${currentProduct._id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: formData,
        });

        const data = await res.json();
        if (data.status !== 'success') {
          toast.error(data.message || 'Update failed');
          return;
        }

        toast.success('Product updated successfully');
      } else {
        const res = await fetch('/api/v1/products', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const data = await res.json();
        if (data.status !== 'success') {
          toast.error(data.message || 'Create failed');
          return;
        }

        toast.success('Product created successfully');
      }

      setIsEditing(false);
      setCurrentProduct(emptyForm);
      setImageFiles([]);
      setImagePreviews([]);
      fetchProducts();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Unable to save product');
    }
  };

  return (
    <div className="admin-products">
      <div className="header-flex">
        <h2>Product Management</h2>
        <button className="add-btn" onClick={handleAdd}>+ Add New Product</button>
      </div>

      <div className="products-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id?.slice(0, 8)}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>NGN {Number(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button className="edit-action" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete-action" onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentProduct._id ? 'Edit Product' : 'Add New Product'}</h3>
            <form className="admin-product-form" onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" value={currentProduct.name} onChange={handleFieldChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input id="brand" name="brand" type="text" value={currentProduct.brand} onChange={handleFieldChange} required />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows={3} value={currentProduct.description} onChange={handleFieldChange} />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input id="category" name="category" type="text" value={currentProduct.category} onChange={handleFieldChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input id="stock" name="stock" type="number" min="0" value={currentProduct.stock} onChange={handleFieldChange} required />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="price">Price (NGN)</label>
                  <input id="price" name="price" type="number" step="0.01" min="0" value={currentProduct.price} onChange={handleFieldChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="sizes">Sizes (comma-separated)</label>
                  <input id="sizes" name="sizes" type="text" placeholder="S, M, L" value={currentProduct.sizes} onChange={handleFieldChange} />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="colors">Colors (comma-separated)</label>
                <input id="colors" name="colors" type="text" placeholder="black, white" value={currentProduct.colors} onChange={handleFieldChange} />
              </div>

              <div className="form-group full-width">
                <label htmlFor="images">Images (upload, field name: images)</label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <small className="form-help">Multer field: <code>images</code>. Max recommended: 3 files.</small>
              </div>

              {imagePreviews.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreviews.map((src) => (
                    <img key={src} src={src} alt="Preview" />
                  ))}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
