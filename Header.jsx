
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { api } from './client.js';
import { useStore } from './store.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const { cart = [], wishlist = [] } = useStore();

  // Check whether the currently signed-in account is an administrator
  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      const token = localStorage.getItem('sowji_customer_token');

      if (!token) {
        if (active) setIsAdmin(false);
        return;
      }

      try {
        const data = await api('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (active) {
          setIsAdmin(data.user?.role === 'admin');
        }
      } catch {
        if (active) setIsAdmin(false);
      }
    };

    checkAdmin();

    const handleStorage = () => checkAdmin();
    window.addEventListener('storage', handleStorage);

    return () => {
      active = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, [location.pathname]);

  useEffect(() => {
    api('/announcements')
      .then((d) => setMsgs(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }, []);

  const links = [
    ['/', 'Home'],
    ['/shop', 'Shop'],
    ['/collections', 'Collections'],
    ['/about', 'About Us'],
    ['/contact', 'Contact Us']
  ];

  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0
  );

  const submit = (e) => {
    e.preventDefault();

    if (q.trim()) {
      nav('/shop?q=' + encodeURIComponent(q.trim()));
      setOpen(false);
    }
  };

  const navClass = ({ isActive }) =>
    `relative py-2 text-xs font-medium uppercase tracking-[2px] transition-colors ${
      isActive ? 'text-wine' : 'text-charcoal hover:text-wine'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-ivory">

      {msgs.length > 0 && (
        <div className="bg-wine px-3 py-2 text-center text-xs tracking-widest text-white">
          {msgs.join('  ✦  ')}
        </div>
      )}

      <div className="border-b border-[#e9dfd2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-2xl text-wine md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? '×' : '☰'}
          </button>

          <Link
            to="/"
            className="flex min-w-0 flex-col items-center text-center"
            onClick={() => setOpen(false)}
          >
            <span className="font-display text-xl font-bold tracking-[2px] text-wine sm:text-2xl md:text-3xl">
              SOWJI
            </span>
            <span className="text-[8px] tracking-[3px] text-gold sm:text-[9px]">
              COLLECTIONS
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={navClass}
              >
                {label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink to="/admin" className={navClass}>
                ADMIN
              </NavLink>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-3 text-wine sm:gap-5">

            {isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
                className="hidden text-xs font-bold tracking-widest text-gold transition hover:text-wine sm:inline"
              >
                ADMIN
              </Link>
            )}

            <Link
              to="/account"
              aria-label="My Account"
              className="transition hover:text-gold"
            >
              <span className="text-xl">♙</span>
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative transition hover:text-gold"
            >
              <span className="text-2xl">♡</span>
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[9px] text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative transition hover:text-gold"
            >
              <span className="text-xl">🛍</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-[#eee5d9] py-3 md:block">
        <form
          onSubmit={submit}
          className="mx-auto flex max-w-xl items-center border border-[#dfcfb9] bg-white px-4 transition focus-within:border-wine"
        >
          <span className="mr-3 text-lg text-gold">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sarees, fabrics and colours..."
            aria-label="Search products"
            className="w-full border-0 bg-transparent py-2 text-xs text-charcoal outline-none placeholder:text-gray-400 focus:ring-0"
          />
          <button
            type="submit"
            className="whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-wine hover:text-gold"
          >
            Search
          </button>
        </form>
      </div>

      {open && (
        <div className="border-b border-[#e9dfd2] bg-white px-5 py-5 shadow-lg md:hidden">

          <form onSubmit={submit} className="mb-5 flex border border-[#dfcfb9]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees..."
              aria-label="Search products"
              className="w-full min-w-0 px-3 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-wine px-4 text-xs uppercase tracking-wider text-white"
            >
              Search
            </button>
          </form>

          <nav className="flex flex-col">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-[#eee5d9] py-3 text-xs font-medium uppercase tracking-[2px] ${
                    isActive ? 'text-wine' : 'text-charcoal'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="border-b border-[#eee5d9] py-3 text-xs font-bold uppercase tracking-[2px] text-gold"
              >
                Admin Dashboard
              </NavLink>
            )}
          </nav>

          <div className="mt-4 flex justify-around text-xs text-wine">
            <Link to="/account" onClick={() => setOpen(false)}>
              My Account
            </Link>
            <Link to="/wishlist" onClick={() => setOpen(false)}>
              Wishlist ({wishlist.length})
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
