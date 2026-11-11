
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
    setState((s) => ({ ...s, loading: true }));

    api('/products?' + query)
      .then((d) =>
        setState({
          loading: false,
          error: '',
          items: d.items || []
        })
      )
      .catch((e) =>
        setState({
          loading: false,
          error: e.message,
          items: []
        })
      );
  }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="font-promo text-lg tracking-widest text-gold">
          {eyebrow}
        </p>
        <h2 className="text-3xl">{title}</h2>
        <div className="divider" />
      </div>

      {state.loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse bg-beige"
            />
          ))}
        </div>
      )}

      {state.error && (
        <p className="text-center text-sm text-red-800">
          Could not load products. Please try again shortly.
        </p>
      )}

      {!state.loading && !state.error && state.items.length === 0 && (
        <p className="text-center text-sm">
          New sarees will appear here soon.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {state.items.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>

      {viewAllTo && (
        <div className="mt-8 text-center">
          <Link to={viewAllTo} className="btn-gold">
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
