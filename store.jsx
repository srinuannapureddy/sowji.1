
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from 'react';
import { api } from './client.js';

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

const getCartKey = (item) => {
  if (item.cartKey) return item.cartKey;

  const color = String(item.selectedColor || item.color || '')
    .trim()
    .toLowerCase();

  return `${item._id}::${color}`;
};

const getToken = () => {
  return localStorage.getItem('sowji_customer_token');
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

  const [cloudReady, setCloudReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');

  const tokenRef = useRef(getToken());
  const readyRef = useRef(false);
  const timerRef = useRef(null);
  const loadingRef = useRef(false);

  // Keep a local backup for guest shopping.
  useEffect(() => save('sowji_cart', cart), [cart]);
  useEffect(() => save('sowji_wish', wishlist), [wishlist]);
  useEffect(() => save('sowji_compare', compare), [compare]);

  // Load account shopping data after login.
  useEffect(() => {
    let cancelled = false;

    const loadAccountData = async () => {
      const token = getToken();

      tokenRef.current = token;
      readyRef.current = false;
      setCloudReady(false);

      if (!token) {
        setSyncStatus('idle');
        return;
      }

      loadingRef.current = true;
      setSyncStatus('loading');

      try {
        const response = await api('/customer-data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (cancelled) return;

        const data = response.data || {};

        if (response.initialized) {
          setCart(
            (data.cart || []).map(item => ({
              ...item,
              cartKey: getCartKey(item)
            }))
          );

          setWishlist(data.wishlist || []);
          setCompare(data.compare || []);
        } else {
          // First account login: move guest data into the account.
          setCart(current =>
            current.map(item => ({
              ...item,
              cartKey: getCartKey(item)
            }))
          );
        }

        readyRef.current = true;
        setCloudReady(true);
        setSyncStatus('synced');
      } catch (error) {
        console.error('Account shopping data load failed:', error);
        if (!cancelled) {
          setSyncStatus('error');
          setCloudReady(false);
        }
      } finally {
        loadingRef.current = false;
      }
    };

    loadAccountData();

    return () => {
      cancelled = true;
    };
  }, [getToken()]);

  // Save changes to the signed-in account.
  useEffect(() => {
    const token = getToken();

    if (
      !token ||
      !cloudReady ||
      !readyRef.current ||
      loadingRef.current
    ) {
      return;
    }

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        setSyncStatus('saving');

        await api('/customer-data', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            cart,
            wishlist,
            compare
          }
        });

        setSyncStatus('synced');
      } catch (error) {
        console.error('Account shopping data save failed:', error);
        setSyncStatus('error');
      }
    }, 700);

    return () => clearTimeout(timerRef.current);
  }, [cart, wishlist, compare, cloudReady]);

  // Detect login/logout in another browser tab.
  useEffect(() => {
    const checkLogin = () => {
      const token = getToken();

      if (token !== tokenRef.current) {
        tokenRef.current = token;
        readyRef.current = false;
        setCloudReady(false);
        setSyncStatus('idle');
        window.dispatchEvent(new Event('sowji-auth-changed'));
      }
    };

    const handleAuth = () => {
      const token = getToken();

      if (token !== tokenRef.current) {
        tokenRef.current = token;
        readyRef.current = false;
        setCloudReady(false);
        setSyncStatus('idle');
        window.location.reload();
      }
    };

    window.addEventListener('storage', checkLogin);
    window.addEventListener('sowji-auth-changed', handleAuth);

    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('sowji-auth-changed', handleAuth);
    };
  }, []);

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

  // UPDATE CART QUANTITY
  const updateQty = (cartKeyOrId, quantity) => {
    const newQty = Number(quantity);

    if (!Number.isFinite(newQty) || newQty < 1) return;

    setCart(currentCart =>
      currentCart.map(item => {
        const matches =
          getCartKey(item) === cartKeyOrId ||
          item._id === cartKeyOrId;

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

  // REMOVE CART ITEM
  const removeFromCart = (cartKeyOrId) => {
    setCart(currentCart =>
      currentCart.filter(item =>
        getCartKey(item) !== cartKeyOrId &&
        item._id !== cartKeyOrId
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
        toggleCompare,
        cloudReady,
        syncStatus
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
