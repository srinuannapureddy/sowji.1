
import React from 'react';
import { Link } from 'react-router-dom';
import { money } from './client.js';
import { useStore } from './store.jsx';

export default function ProductCard({ p }) {
  const {
    addToCart,
    toggleWish,
    toggleCompare,
    wishlist,
    compare
  } = useStore();

  const price =
    p.discountPrice && p.discountPrice < p.price
      ? p.discountPrice
      : p.price;

  const off =
    price < p.price
      ? Math.round(((p.price - price) / p.price) * 100)
      : 0;

  const out = p.stock <= 0;
  const main = p.images?.find((i) => i.isMain) || p.images?.[0];

  return (
    <div className="group bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-beige">
        <Link to={`/product/${p.slug}`}>
          {main && (
            <img
              src={main.url}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1 text-[10px] uppercase tracking-widest">
          {off > 0 && (
            <span className="bg-wine px-2 py-1 text-ivory">
              -{off}%
            </span>
          )}

          {p.isNewArrival && (
            <span className="bg-gold px-2 py-1 text-white">
              New
            </span>
          )}

          {out && (
            <span className="bg-charcoal px-2 py-1 text-ivory">
              Out of stock
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-2 text-lg">
          <button
            aria-label="Wishlist"
            onClick={() => toggleWish(p)}
            className="bg-ivory/90 px-2"
          >
            {wishlist.some((x) => x._id === p._id) ? '♥' : '♡'}
          </button>

          <button
            aria-label="Compare"
            onClick={() => toggleCompare(p)}
            className={`px-2 text-sm ${
              compare.some((x) => x._id === p._id)
                ? 'bg-gold text-white'
                : 'bg-ivory/90'
            }`}
          >
            ⇄
          </button>
        </div>
      </div>

      <div className="p-3 text-center">
        <Link
          to={`/product/${p.slug}`}
          className="block font-display text-base text-wine"
        >
          {p.name}
        </Link>

        <p className="text-[11px] text-charcoal/60">
          SKU: {p.sku}
        </p>

        <p className="mt-1 text-sm">
          {off > 0 && (
            <del className="mr-2 text-charcoal/50">
              {money(p.price)}
            </del>
          )}
          <strong>{money(price)}</strong>
        </p>

        <p
          className={`text-[11px] ${
            out
              ? 'text-red-700'
              : p.stock <= 3
                ? 'text-amber-700'
                : 'text-green-800'
          }`}
        >
          {out
            ? 'Out of stock'
            : p.stock <= 3
              ? `Only ${p.stock} left`
              : 'In stock'}
        </p>

        <div className="mt-2 flex gap-2">
          <Link
            to={`/product/${p.slug}`}
            className="btn-gold flex-1 !px-2 !py-2 text-[11px]"
          >
            Quick View
          </Link>

          <button
            disabled={out}
            onClick={() => addToCart({ ...p, price })}
            className="btn-wine flex-1 !px-2 !py-2 text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
