import React, { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext(null);
const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('sowji_cart'));
  const [wishlist, setWishlist] = useState(() => load('sowji_wish'));
  const [compare, setCompare] = useState(() => load('sowji_compare'));
  useEffect(() => save('sowji_cart', cart), [cart]);
  useEffect(() => save('sowji_wish', wishlist), [wishlist]);
  useEffect(() => save('sowji_compare', compare), [compare]);
  const flip = (set, max = 99) => (p) => set((l) => (l.some((x) => x._id === p._id) ? l.filter((x) => x._id !== p._id) : l.length < max ? [...l, p] : l));
  const addToCart = (p, qty = 1) => setCart((c) => {
    const f = c.find((i) => i._id === p._id);
    return f ? c.map((i) => (i._id === p._id ? { ...i, qty: i.qty + qty } : i)) : [...c, { ...p, qty }];
  });
  return <Ctx.Provider value={{ cart, wishlist, compare, addToCart, toggleWish: flip(setWishlist), toggleCompare: flip(setCompare, 4) }}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
