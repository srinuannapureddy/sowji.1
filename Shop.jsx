
import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProductGrid from './ProductGrid.jsx';
import { CATEGORIES } from './client.js';

export default function Shop() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const category = CATEGORIES.find(
    item => item.slug === slug
  );

  const searchQuery = searchParams.get('q') || '';

  const query = useMemo(() => {
    const params = new URLSearchParams(searchParams);

    if (category) {
      // Send the actual database category name, not its URL slug.
      params.set('category', category.name);
    } else if (slug) {
      params.set('category', slug.replace(/-/g, ' '));
    } else {
      params.delete('category');
    }

    return params.toString();
  }, [searchParams, category, slug]);

  const title = category
    ? category.name
    : searchQuery
      ? `Results for "${searchQuery}"`
      : 'Shop All Sarees';

  return (
    <main className="min-h-screen bg-[#fbf9f5]">

      <section className="border-b border-[#e9dfd1] bg-[#f5efe6] px-5 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[10px] uppercase tracking-[4px] text-[#a48655]">
            Sowji Collections
          </p>

          <h1 className="font-display text-3xl text-[#681f32] md:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#796d62]">
            Discover sarees that celebrate Indian craftsmanship,
            tradition and timeless elegance.
          </p>

          <div className="mt-5 text-xs text-[#796d62]">
            <Link to="/" className="hover:text-[#681f32]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-[#681f32]">
              Shop
            </Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#681f32]">{category.name}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <ProductGrid
        eyebrow={searchQuery ? 'Search Collection' : 'Our Collection'}
        title={title}
        query={query}
      />

    </main>
  );
}
