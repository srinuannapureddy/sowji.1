
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const Ctx = createContext(null);

const load = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('sowji_cart'));
  const [wishlist, setWishlist] = useState(() => load('sowji_wish'));
  const [compare, setCompare] = useState(() => load('sowji_compare'));

  useEffect(() => save('sowji_cart', cart), [cart]);
  useEffect(() => save('sowji_wish', wishlist), [wishlist]);
  useEffect(() => save('sowji_compare', compare), [compare]);

  // ADD PRODUCT TO CART
  const addToCart = (product, quantity = 1) => {
    if (!product?._id) return;

    const requestedQty = Math.max(1, Number(quantity) || 1);
    const stock = Number(product.stock);
    const maxStock = Number.isFinite(stock) && stock >= 0 ? stock : 99;

    if (maxStock <= 0) return;

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return currentCart.map((item) => {
          if (item._id !== product._id) return item;

          return {
            ...item,
            ...product,
            qty: Math.min(
              maxStock,
              (Number(item.qty) || 1) + requestedQty
            )
          };
        });
      }

      return [
        ...currentCart,
        {
          ...product,
          qty: Math.min(maxStock, requestedQty)
        }
      ];
    });
  };

  // UPDATE CART QUANTITY
  const updateQty = (id, quantity) => {
    const newQty = Number(quantity);

    if (!Number.isFinite(newQty) || newQty < 1) return;

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item._id !== id) return item;

        const stock = Number(item.stock);
        const maxStock =
          Number.isFinite(stock) && stock >= 0 ? stock : 99;

        return {
          ...item,
          qty: Math.min(maxStock, newQty)
        };
      }).filter((item) => Number(item.qty) > 0)
    );
  };

  // REMOVE PRODUCT FROM CART
  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  // CLEAR CART
  const clearCart = () => setCart([]);

  // ADD OR REMOVE FROM WISHLIST
  const toggleWish = (product) => {
    if (!product?._id) return;

    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => item._id === product._id
      );

      if (exists) {
        return currentWishlist.filter(
          (item) => item._id !== product._id
        );
      }

      return [...currentWishlist, product];
    });
  };

  // ADD OR REMOVE FROM COMPARE
  const toggleCompare = (product) => {
    if (!product?._id) return;

    setCompare((currentCompare) => {
      const exists = currentCompare.some(
        (item) => item._id === product._id
      );

      if (exists) {
        return currentCompare.filter(
          (item) => item._id !== product._id
        );
      }

      if (currentCompare.length >= 4) return currentCompare;

      return [...currentCompare, product];
    });
  };

  return (
    <Ctx.Provider
      value={{
        cart,
        wishlist,
        compare,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        toggleWish,
        toggleCompare
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error(
      'useStore must be used inside StoreProvider'
    );
  }

  return context;
}
