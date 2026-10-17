import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
const WishlistContext = createContext(null);
export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(new Set());
  useEffect(() => {
    if (!user) {
      setIds(new Set());
      return;
    }
    getWishlist()
      .then((r) => setIds(new Set(r.data.data.items.map((i) => i._id))))
      .catch(() => setIds(new Set()));
  }, [user]);
  const isWishlisted = (itemId) => ids.has(itemId);
  const toggle = async (itemId) => {
    if (ids.has(itemId)) {
      await removeFromWishlist(itemId);
      setIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    } else {
      await addToWishlist(itemId);
      setIds((prev) => new Set(prev).add(itemId));
    }
  };
  return (
    <WishlistContext.Provider value={{ ids, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}
export const useWishlist = () => useContext(WishlistContext);
