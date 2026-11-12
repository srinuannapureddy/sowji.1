
import React from 'react';
import { Link } from 'react-router-dom';
import { money } from './client.js';
import { useStore } from './store.jsx';

export default function Wishlist() {
  const {
    wishlist = [],
    toggleWish,
    addToCart
  } = useStore();

  return (
    <section className="min-h-screen bg-[#fbf8f2] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl text-[#681f32] sm:text-4xl">
          My Wishlist
        </h1>

        <p className="mt-2 text-sm text-[#81776e]">
          Your favourite sarees, saved in one place.
        </p>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-5 text-6xl text-[#b89555]">♡</div>

            <h2 className="font-display text-2xl text-[#681f32]">
              Your Wishlist is Empty
            </h2>

            <p className="mt-3 text-sm text-[#81776e]">
              Save the sarees you love and find them here.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white"
            >
              Explore Sarees
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((item) => {
              const image =
                item.images?.find((img) => img.isMain) ||
                item.images?.[0];

              const price =
                item.discountPrice &&
                item.discountPrice < item.price
                  ? item.discountPrice
                  : item.price;

              return (
                <article
                  key={item._id}
                  className="overflow-hidden border border-[#eee5d9] bg-white"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    className="block aspect-[3/4] bg-[#f3ece1]"
                  >
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="p-3 text-center">
                    <Link
                      to={`/product/${item.slug}`}
                      className="line-clamp-2 font-display text-sm text-[#681f32] sm:text-base"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 font-semibold text-[#292522]">
                      {money(price)}
                    </p>

                    <button
                      type="button"
                      disabled={Number(item.stock) <= 0}
                      onClick={() => addToCart({ ...item, price })}
                      className="mt-3 w-full bg-[#681f32] px-2 py-3 text-[10px] uppercase tracking-wider text-white disabled:opacity-40"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWish(item)}
                      className="mt-3 text-xs text-red-700 underline"
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
