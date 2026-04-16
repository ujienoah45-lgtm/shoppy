const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x750?text=No+Image';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

const normalizeImagePath = (imageValue) => {
  if (!imageValue) return PLACEHOLDER_IMAGE;

  if (Array.isArray(imageValue)) {
    if (imageValue.length === 0) return PLACEHOLDER_IMAGE;
    return normalizeImagePath(imageValue[0]);
  }

  if (typeof imageValue !== 'string') return PLACEHOLDER_IMAGE;

  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
    return imageValue;
  }

  if (imageValue.startsWith('/')) {
    return `${API_BASE_URL}${imageValue}`;
  }

  if (imageValue.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imageValue}`;
  }

  return `${API_BASE_URL}/uploads/${imageValue}`;
};

export const getProductPrimaryImage = (product) => {
  if (!product) return PLACEHOLDER_IMAGE;
  return normalizeImagePath(product.images || product.image);
};

export const getProductGallery = (product) => {
  if (!product) return [PLACEHOLDER_IMAGE];

  const rawImages = Array.isArray(product.images)
    ? product.images
    : (product.image ? [product.image] : []);

  if (rawImages.length === 0) return [PLACEHOLDER_IMAGE];

  return rawImages.map((img) => normalizeImagePath(img));
};
