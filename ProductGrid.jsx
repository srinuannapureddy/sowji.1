
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './client.js';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({
  eyebrow,
  title,
  query,
  viewAllTo,
  viewAllLabel
}) {
  const [state, setState] = useState({
    loading: true,
    error: '',
    items: []
  });

  useEffect(() => {
    let active = true;

    setState({
      loading: true,
      error: '',
      items: []
    });

    api('/products?' + query)
      .then((data) => {
        if (!active) return;

        setState({
          loading: false,
          error: '',
          items: Array.isArray(data.items) ? data.items : []
        });
      })
      .catch((error) => {
        if (!active) return;

        setState({
          loading: false,
          error: error.message || 'Unable to load products.',
          items: []
        });
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-20">

      {/* SECTION HEADING */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[4px] text-[#b89555]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-display text-3xl text-[#681f32] md:text-4xl">
          {title}
        </h2>

        <div className="mx-auto my-4 h-px w-16 bg-[#b89555]" />
      </div>

      {/* LOADING */}
      {state.loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden border border-[#eee5d9] bg-white"
            >
              <div className="aspect-[3/4] animate-pulse bg-[#eee5d9]" />

              <div className="space-y-3 p-4">
                <div className="mx-auto h-3 w-1/2 animate-pulse bg-[#eee5d9]" />
                <div className="mx-auto h-4 w-3/4 animate-pulse bg-[#eee5d9]" />
                <div className="mx-auto h-4 w-1/3 animate-pulse bg-[#eee5d9]" />
                <div className="h-9 animate-pulse bg-[#eee5d9]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {!state.loading && state.error && (
        <div className="border border-[#ead7d7] bg-white px-5 py-10 text-center">
          <p className="font-display text-xl text-[#681f32]">
            Products are temporarily unavailable
          </p>

          <p className="mt-2 text-sm text-[#81776e]">
            Please refresh the page or try again shortly.
          </p>

          <button
            type="button"
            onClick={() =>
              setState((current) => ({ ...current, loading: true, error: '' }))
            }
            className="mt-5 border border-[#b89555] px-6 py-2 text-xs uppercase tracking-widest text-[#681f32] hover:bg-[#681f32] hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!state.loading && !state.error && state.items.length === 0 && (
        <div className="border border-dashed border-[#dfcfb9] bg-white px-5 py-12 text-center">
          <span className="text-4xl text-[#b89555]">✦</span>

          <h3 className="mt-4 font-display text-2xl text-[#681f32]">
            Beautiful sarees are coming soon
          </h3>

          <p className="mt-2 text-sm text-[#81776e]">
            We're preparing a special collection for you. Please visit again soon.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex border border-[#b89555] px-6 py-3 text-xs uppercase tracking-widest text-[#681f32] transition hover:bg-[#681f32] hover:text-white"
          >
            Explore the Shop
          </Link>
        </div>
      )}

      {/* PRODUCT CARDS */}
      {!state.loading && !state.error && state.items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {state.items.map((product) => (
              <ProductCard key={product._id} p={product} />
            ))}
          </div>

          {viewAllTo && (
            <div className="mt-10 text-center">
              <Link
                to={viewAllTo}
                className="inline-flex border border-[#b89555] px-8 py-3 text-xs uppercase tracking-[2px] text-[#681f32] transition hover:bg-[#681f32] hover:text-white"
              >
                {viewAllLabel || 'View All Products'}
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
