const API = import.meta.env.VITE_API_URL;

export const getImageSrc = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith('/') ? `${API}${imageUrl}` : imageUrl;
};
