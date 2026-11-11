
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { api } from './client.js';
import { useStore } from './store.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState([]);

  const nav = useNavigate();
  const { cart, wishlist } = useStore();

  useEffect(() => {
    api('/announcements')
      .then((d) => setMsgs(d.items || []))
      .catch(() => {});
  }, []);

  const links = [
    ['/', 'Home'],
    ['/shop', 'Shop'],
    ['/collections', 'Collections'],
    ['/about', 'About Us'],
    ['/contact', 'Contact Us']
  ];

  const submit = (e) => {
    e.preventDefault();

    if (q.trim()) {
      nav('/shop?q=' + encodeURIComponent(q.trim()));
    }

    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory shadow-sm">
      {msgs.length > 0 && (
        <div className="bg-wine py-2 text-center text-xs tracking-widest text-gold">
          {msgs.join('  ✦  ')}
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <button
          className="text-2xl text-wine md:hidden"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <Link to="/">
          <img src="/logo.svg" alt="Sowji Collections" className="h-14" />
        </Link>

        <nav className="hidden gap-8 text-sm uppercase tracking-widest md:flex">
          {links.map(([to, l]) => (
            <NavLink key={to} to={to} className="hover:text-wine">
              {l}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/account" aria-label="My Account">👤</Link>

          <Link to="/wishlist" aria-label="Wishlist">
            ♡<sup>{wishlist.length}</sup>
          </Link>

          <Link to="/cart" aria-label="Cart">
            🛍<sup>{cart.reduce((n, i) => n + i.qty, 0)}</sup>
          </Link>
        </div>
      </div>

      <form onSubmit={submit} className="mx-auto hidden max-w-xl px-4 pb-2 md:block">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sarees, fabrics, colours…"
          className="w-full border border-gold bg-white px-4 py-2 text-sm outline-none focus:border-wine"
        />
      </form>

      {open && (
        <div className="border-t border-gold bg-ivory px-4 py-3 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees"
              className="w-full border border-gold px-3 py-2 text-sm"
            />
          </form>

          {links.map(([to, l]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm uppercase tracking-widest"
            >
              {l}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
