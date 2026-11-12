
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

// Unique cart identity: same product + same colour = same item.
const getCartKey = (item) => {
  if (item.cartKey) return item.cartKey;

  const color = String(item.selectedColor || '').trim().toLowerCase();
  return `${item._id}::${color}`;
};

const getMaxStock = (stock) => {
  if (stock === null || stock === undefined || stock === '') {
    return 99;
  }

  const value = Number(stock);
  return Number.isFinite(value) && value >= 0 ? value : 99;
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() =>
    load('sowji_cart').map(item => ({
      ...item,
      cartKey: getCartKey(item)
    }))
  );

  const [wishlist, setWishlist] = useState(() => load('sowji_wish'));
  const [compare, setCompare] = useState(() => load('sowji_compare'));

  useEffect(() => save('sowji_cart', cart), [cart]);
  useEffect(() => save('sowji_wish', wishlist), [wishlist]);
  useEffect(() => save('sowji_compare', compare), [compare]);

  // ADD PRODUCT OR COLOUR VARIANT TO CART
  const addToCart = (product, quantity = 1) => {
    if (!product?._id) return;

    const requestedQty = Math.max(1, Number(quantity) || 1);
    const cartKey = getCartKey(product);
    const maxStock = getMaxStock(product.stock);

    if (maxStock <= 0) return;

    setCart(currentCart => {
      const existing = currentCart.find(
        item => getCartKey(item) === cartKey
      );

      if (existing) {
        return currentCart.map(item => {
          if (getCartKey(item) !== cartKey) return item;

          return {
            ...item,
            ...product,
            cartKey,
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
          cartKey,
          qty: Math.min(maxStock, requestedQty)
        }
      ];
    });
  };

  // UPDATE ONLY THE SELECTED CART LINE
  const updateQty = (cartKey, quantity) => {
    const newQty = Number(quantity);

    if (!Number.isFinite(newQty) || newQty < 1) return;

    setCart(currentCart =>
      currentCart.map(item => {
        if (getCartKey(item) !== cartKey) return item;

        return {
          ...item,
          qty: Math.min(getMaxStock(item.stock), newQty)
        };
      }).filter(item => Number(item.qty) > 0)
    );
  };

  // REMOVE ONLY THE SELECTED CART LINE
  const removeFromCart = (cartKey) => {
    setCart(currentCart =>
      currentCart.filter(
        item => getCartKey(item) !== cartKey
      )
    );
  };

  const clearCart = () => setCart([]);

  // WISHLIST
  const toggleWish = (product) => {
    if (!product?._id) return;

    setWishlist(currentWishlist => {
      const exists = currentWishlist.some(
        item => item._id === product._id
      );

      return exists
        ? currentWishlist.filter(item => item._id !== product._id)
        : [...currentWishlist, product];
    });
  };

  // COMPARE
  const toggleCompare = (product) => {
    if (!product?._id) return;

    setCompare(currentCompare => {
      const exists = currentCompare.some(
        item => item._id === product._id
      );

      if (exists) {
        return currentCompare.filter(
          item => item._id !== product._id
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
    throw new Error('useStore must be used inside StoreProvider');
  }

  return context;
}
