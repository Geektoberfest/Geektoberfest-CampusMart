import api from "./api";
export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (id) => api.post(`/wishlist/${id}`);
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);
