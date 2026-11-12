
import React from 'react';
import { Link } from 'react-router-dom';
import { money } from './client.js';
import { useStore } from './store.jsx';

export default function ProductCard({ p }) {
  const {
    addToCart,
    toggleWish,
    toggleCompare,
    wishlist = [],
    compare = []
  } = useStore();

  // Never invent or assume a product price.
  const hasPrice =
    p.price !== null &&
    p.price !== undefined &&
    p.price !== '' &&
    Number.isFinite(Number(p.price)) &&
    Number(p.price) > 0;

  const hasDiscount =
    hasPrice &&
    p.discountPrice !== null &&
    p.discountPrice !== undefined &&
    Number(p.discountPrice) > 0 &&
    Number(p.discountPrice) < Number(p.price);

  const price = hasDiscount
    ? Number(p.discountPrice)
    : hasPrice
      ? Number(p.price)
      : null;

  const off = hasDiscount
    ? Math.round(
        ((Number(p.price) - price) / Number(p.price)) * 100
      )
    : 0;

  const stockKnown =
    p.stock !== null &&
    p.stock !== undefined &&
    p.stock !== '' &&
    Number.isFinite(Number(p.stock));

  const out = stockKnown && Number(p.stock) <= 0;

  const main =
    p.images?.find((image) => image.isMain && image.url) ||
    p.images?.find((image) => image.url);

  const wished = wishlist.some((x) => x._id === p._id);
  const compared = compare.some((x) => x._id === p._id);

  const instagramUrl =
    typeof p.instagramUrl === 'string' &&
    p.instagramUrl.startsWith('https://www.instagram.com/')
      ? p.instagramUrl
      : typeof p.sourcePostUrl === 'string' &&
        p.sourcePostUrl.startsWith('https://www.instagram.com/')
        ? p.sourcePostUrl
        : null;

  const unavailable = out;

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#eee5d9] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-xl">

      {/* AUTHENTIC PRODUCT IMAGE */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f3ece1]">
        <Link
          to={`/product/${p.slug}`}
          className="block h-full w-full"
          aria-label={`View ${p.name}`}
        >
          {main?.url ? (
            <img
              src={main.url}
              alt={p.name || 'Sowji saree'}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <span className="mb-3 text-4xl text-[#b89555]">✦</span>
              <span className="font-display text-xl text-[#681f32]">
                Sowji Collections
              </span>
              <span className="mt-2 text-xs text-[#92785c]">
                Authentic product photograph coming soon
              </span>
            </div>
          )}
        </Link>

        {/* PRODUCT LABELS */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {off > 0 && (
            <span className="bg-[#681f32] px-3 py-1 text-[10px] tracking-wider text-white">
              {off}% OFF
            </span>
          )}

          {p.isNewArrival && (
            <span className="bg-[#b89555] px-3 py-1 text-[10px] uppercase tracking-wider text-white">
              New Arrival
            </span>
          )}

          {out && (
            <span className="bg-[#292522] px-3 py-1 text-[10px] uppercase tracking-wider text-white">
              Unavailable
            </span>
          )}
        </div>

        {/* WISHLIST AND COMPARE */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wished}
            onClick={() => toggleWish(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
              wished
                ? 'bg-[#681f32] text-white'
                : 'bg-white/95 text-[#681f32] hover:bg-[#681f32] hover:text-white'
            }`}
          >
            <span className="text-xl">{wished ? '♥' : '♡'}</span>
          </button>

          <button
            type="button"
            aria-label={compared ? 'Remove from compare' : 'Compare product'}
            aria-pressed={compared}
            onClick={() => toggleCompare(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm shadow-sm transition ${
              compared
                ? 'bg-[#b89555] text-white'
                : 'bg-white/95 text-[#681f32] hover:bg-[#b89555] hover:text-white'
            }`}
          >
            ⇄
          </button>
        </div>

        {/* VIEW PRODUCT */}
        <Link
          to={`/product/${p.slug}`}
          className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#681f32]/95 py-3 text-center text-[10px] uppercase tracking-[3px] text-white transition-transform duration-300 group-hover:translate-y-0"
        >
          View Product
        </Link>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="flex flex-1 flex-col p-3 text-center sm:p-4">
        {p.category && (
          <p className="mb-1 text-[10px] uppercase tracking-[2px] text-[#b89555]">
            {p.category}
          </p>
        )}

        <Link
          to={`/product/${p.slug}`}
          className="line-clamp-2 min-h-[42px] font-display text-base text-[#681f32] transition hover:text-[#b89555] sm:text-lg"
        >
          {p.name}
        </Link>

        {p.sku && (
          <p className="mt-1 text-[10px] tracking-wider text-[#999087]">
            SKU: {p.sku}
          </p>
        )}

        {/* PRICE */}
        <div className="mt-3 flex min-h-[25px] flex-wrap items-center justify-center gap-2">
          {hasDiscount && (
            <del className="text-xs text-[#999087]">
              {money(p.price)}
            </del>
          )}

          {hasPrice ? (
            <strong className="text-base font-semibold text-[#292522]">
              {money(price)}
            </strong>
          ) : (
            <strong className="text-sm font-semibold text-[#681f32]">
              Contact for Price
            </strong>
          )}
        </div>

        {/* STOCK */}
        <p className={`mt-2 text-[10px] tracking-wide ${
          out
            ? 'text-red-700'
            : stockKnown && Number(p.stock) <= 3
              ? 'text-amber-700'
              : 'text-[#81776e]'
        }`}>
          {out
            ? 'Currently unavailable'
            : stockKnown && Number(p.stock) <= 3
              ? `Only ${Number(p.stock)} left`
              : stockKnown
                ? 'In stock'
                : 'Check availability'}
        </p>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-2 pt-4">
          <Link
            to={`/product/${p.slug}`}
            className="flex flex-1 items-center justify-center border border-[#b89555] px-2 py-2.5 text-[9px] uppercase tracking-wider text-[#681f32] transition hover:bg-[#f3ece1] sm:text-[10px]"
          >
            View Details
          </Link>

          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center bg-[#681f32] px-2 py-2.5 text-[9px] uppercase tracking-wider text-white transition hover:bg-[#431321] sm:text-[10px]"
            >
              Enquire
            </a>
          ) : (
            <button
              type="button"
              disabled={unavailable || !hasPrice}
              onClick={() => addToCart({ ...p, price })}
              className="flex flex-1 items-center justify-center bg-[#681f32] px-2 py-2.5 text-[9px] uppercase tracking-wider text-white transition hover:bg-[#431321] disabled:cursor-not-allowed disabled:opacity-40 sm:text-[10px]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  ); 
}
