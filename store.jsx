
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

// Each product and selected colour gets its own cart identity.
const getCartKey = (item) => {
  if (item.cartKey) return item.cartKey;

  const color = String(item.selectedColor || item.color || '')
    .trim()
    .toLowerCase();

  return `${item._id}::${color}`;
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() =>
    load('sowji_cart').map(item => ({
      ...item,
      cartKey: getCartKey(item)
    }))
  );

  const [wishlist, setWishlist] = useState(() =>
    load('sowji_wish')
  );

  const [compare, setCompare] = useState(() =>
    load('sowji_compare')
  );

  useEffect(() => save('sowji_cart', cart), [cart]);
  useEffect(() => save('sowji_wish', wishlist), [wishlist]);
  useEffect(() => save('sowji_compare', compare), [compare]);

  // ADD PRODUCT WITH SELECTED COLOUR
  const addToCart = (product, quantity = 1) => {
    if (!product?._id) return;

    const selectedColor = String(
      product.selectedColor || product.color || ''
    ).trim();

    const cartKey = getCartKey({
      ...product,
      selectedColor
    });

    const requestedQty = Math.max(
      1,
      Number(quantity) || 1
    );

    const stockKnown =
      product.stock !== null &&
      product.stock !== undefined &&
      product.stock !== '';

    const stock = Number(product.stock);

    const maxStock =
      stockKnown && Number.isFinite(stock)
        ? Math.max(0, stock)
        : 99;

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
            selectedColor,
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
          selectedColor,
          cartKey,
          qty: Math.min(maxStock, requestedQty)
        }
      ];
    });
  };

  // UPDATE ONLY THE SELECTED CART ITEM
  const updateQty = (cartKeyOrId, quantity) => {
    const newQty = Number(quantity);

    if (!Number.isFinite(newQty) || newQty < 1) return;

    setCart(currentCart =>
      currentCart.map(item => {
        const matches =
          getCartKey(item) === cartKeyOrId ||
          (!item.cartKey && item._id === cartKeyOrId);

        if (!matches) return item;

        const stockKnown =
          item.stock !== null &&
          item.stock !== undefined &&
          item.stock !== '';

        const stock = Number(item.stock);

        const maxStock =
          stockKnown && Number.isFinite(stock)
            ? Math.max(0, stock)
            : 99;

        return {
          ...item,
          qty: Math.min(maxStock, newQty)
        };
      }).filter(item => Number(item.qty) > 0)
    );
  };

  // REMOVE ONLY THE SELECTED CART ITEM
  const removeFromCart = (cartKeyOrId) => {
    setCart(currentCart =>
      currentCart.filter(item => {
        if (getCartKey(item) === cartKeyOrId) return false;

        return item._id !== cartKeyOrId;
      })
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
        ? currentWishlist.filter(
            item => item._id !== product._id
          )
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
    throw new Error(
      'useStore must be used inside StoreProvider'
    );
  }

  return context;
}
