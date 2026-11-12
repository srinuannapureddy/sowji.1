
import React from 'react';
import { Link } from 'react-router-dom';
import { money } from './client.js';
import { useStore } from './store.jsx';

export default function Cart() {
  const { cart = [], updateQty, removeFromCart } = useStore();

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  if (!cart.length) {
    return (
      <section className="min-h-[60vh] bg-[#fbf8f2] px-5 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mb-5 text-6xl text-[#b89555]">🛍</div>
          <h1 className="font-display text-3xl text-[#681f32]">
            Your Cart is Empty
          </h1>
          <p className="mt-3 text-sm text-[#81776e]">
            Discover beautiful sarees and add your favourites to your cart.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white"
          >
            Explore Sarees
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fbf8f2] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl text-[#681f32] sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-[#81776e]">
          Review your selected sarees.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {cart.map((item) => {
              const image =
                item.images?.find((img) => img.isMain) ||
                item.images?.[0];

              return (
                <article
                  key={item._id}
                  className="flex gap-4 border border-[#eee5d9] bg-white p-3 sm:p-5"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    className="h-32 w-24 shrink-0 bg-[#f3ece1] sm:h-40 sm:w-32"
                  >
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-display text-lg text-[#681f32]"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 text-xs text-[#92785c]">
                      {item.category}
                    </p>

                    <p className="mt-2 font-semibold text-[#292522]">
                      {money(item.price)}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center border border-[#dfcfb9]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item._id, Number(item.qty || 1) - 1)
                          }
                          className="px-3 py-2"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.qty || 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item._id, Number(item.qty || 1) + 1)
                          }
                          className="px-3 py-2"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit border border-[#eee5d9] bg-white p-6">
            <h2 className="font-display text-xl text-[#681f32]">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-sm">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>

            <div className="mt-4 flex justify-between border-t border-[#eee5d9] pt-4 text-base">
              <strong>Total</strong>
              <strong className="text-[#681f32]">
                {money(subtotal)}
              </strong>
            </div>

            <p className="mt-3 text-xs text-[#81776e]">
              Shipping and any applicable charges are calculated at checkout.
            </p>

            <Link
              to="/shop"
              className="mt-6 block border border-[#b89555] py-3 text-center text-xs uppercase tracking-widest text-[#681f32]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
