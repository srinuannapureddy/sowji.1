
import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProductGrid from './ProductGrid.jsx';
import { CATEGORIES } from './client.js';

export default function Shop() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const category = CATEGORIES.find(
    (item) => item.slug === slug
  );

  const searchQuery = searchParams.get('q') || '';

  const query = useMemo(() => {
    const params = new URLSearchParams(searchParams);

    if (slug) {
      params.set('category', slug);
    }

    return params.toString();
  }, [searchParams, slug]);

  const title = category
    ? category.name
    : searchQuery
      ? `Results for "${searchQuery}"`
      : 'Shop All Sarees';

  return (
    <div className="min-h-screen bg-[#fbf8f2]">

      {/* SHOP BANNER */}
      <section className="bg-[#681f32] px-5 py-14 text-center md:py-20">
        <p className="mb-3 text-xs uppercase tracking-[5px] text-[#c7a66b]">
          Sowji Collections
        </p>

        <h1 className="font-display text-3xl text-white md:text-5xl">
          {title}
        </h1>

        <div className="mx-auto my-5 h-px w-20 bg-[#c7a66b]" />

        <p className="mx-auto max-w-xl text-sm leading-7 text-[#f3e8e4]">
          Explore beautiful sarees that celebrate Indian craftsmanship,
          tradition and timeless elegance.
        </p>

        <div className="mt-5 text-xs text-[#e8dcd5]">
          <Link to="/" className="hover:text-[#c7a66b]">Home</Link>
          <span className="mx-2">/</span>
          <span>Shop</span>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span>{category.name}</span>
            </>
          )}
        </div>
      </section>

      {/* CATEGORY LINKS */}
      <section className="mx-auto max-w-7xl px-5 pt-8">
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className={`border px-5 py-2 text-xs uppercase tracking-wider transition ${
              !slug
                ? 'border-[#681f32] bg-[#681f32] text-white'
                : 'border-[#d9c9b5] text-[#681f32] hover:bg-[#681f32] hover:text-white'
            }`}
          >
            All Sarees
          </Link>

          {CATEGORIES.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              className={`border px-5 py-2 text-xs uppercase tracking-wider transition ${
                slug === item.slug
                  ? 'border-[#681f32] bg-[#681f32] text-white'
                  : 'border-[#d9c9b5] text-[#681f32] hover:bg-[#681f32] hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <ProductGrid
        eyebrow={searchQuery ? 'Search Collection' : 'Our Collection'}
        title={searchQuery ? 'Discover Your Saree' : title}
        query={query}
      />

    </div>
  );
}
