
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

    setState({ loading: true, error: '', items: [] });

    api('/products?' + (query || ''))
      .then((data) => {
        if (!active) return;

        const products = Array.isArray(data.items) ? data.items : [];

        // Only show products explicitly verified by the shop.
        const verifiedProducts = products.filter((product) =>
          product.isVerified === true &&
          Array.isArray(product.images) &&
          product.images.some((image) =>
            image &&
            typeof image.url === 'string' &&
            image.url.trim() !== ''
          )
        );

        setState({
          loading: false,
          error: '',
          items: verifiedProducts
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

      {state.loading && (
        <div className="py-16 text-center text-sm text-[#81776e]">
          Preparing the collection…
        </div>
      )}

      {!state.loading && state.error && (
        <div className="border border-[#ead7d7] bg-white px-5 py-10 text-center">
          <p className="font-display text-xl text-[#681f32]">
            Collection temporarily unavailable
          </p>
          <p className="mt-2 text-sm text-[#81776e]">
            Please try again shortly.
          </p>
          <button
            type="button"
            onClick={() =>
              setState((current) => ({
                ...current,
                loading: true,
                error: ''
              }))
            }
            className="mt-5 border border-[#b89555] px-6 py-2 text-xs uppercase tracking-widest text-[#681f32]"
          >
            Retry
          </button>
        </div>
      )}

      {!state.loading && !state.error && state.items.length === 0 && (
        <div className="border border-dashed border-[#dfcfb9] bg-white px-5 py-14 text-center">
          <span className="text-4xl text-[#b89555]">✦</span>

          <h3 className="mt-4 font-display text-2xl text-[#681f32]">
            Our authentic saree collection is being prepared
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#81776e]">
            We are adding verified Sowji New Vastra products and original
            photographs. Please contact us for the latest collection.
          </p>

          <a
            href="https://www.instagram.com/sowji_newvastra/"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex border border-[#681f32] bg-[#681f32] px-7 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-[#431321]"
          >
            Visit Official Instagram
          </a>
        </div>
      )}

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
