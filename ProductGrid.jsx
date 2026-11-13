
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './client.js';
import ProductCard from './ProductCard.jsx';

const PAGE_SIZE = 12;

export default function ProductGrid({
  eyebrow,
  title,
  query,
  viewAllTo,
  viewAllLabel
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [fabric, setFabric] = useState('all');
  const [colour, setColour] = useState('all');
  const [occasion, setOccasion] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError('');

      try {
        const data = await api('/products?' + (query || ''));

        if (!active) return;

        const products = Array.isArray(data.items)
          ? data.items
          : [];

        // Preserve the existing verified-product requirement.
        const verified = products.filter(product =>
          product.isVerified === true &&
          Array.isArray(product.images) &&
          product.images.some(image =>
            image &&
            typeof image.url === 'string' &&
            image.url.trim()
          )
        );

        setItems(verified);
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load sarees.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [query, retry]);

  const categories = useMemo(() =>
    [...new Set(items.map(p => p.category).filter(Boolean))].sort(),
    [items]
  );

  const fabrics = useMemo(() =>
    [...new Set(items.map(p => p.fabric).filter(Boolean))].sort(),
    [items]
  );

  const colours = useMemo(() => {
    const result = new Set();

    items.forEach(product => {
      if (product.color) result.add(product.color);

      const variants = product.colors || product.colorVariants || [];

      if (Array.isArray(variants)) {
        variants.forEach(item => {
          const value = typeof item === 'string'
            ? item
            : item?.name || item?.color;

          if (value) result.add(value);
        });
      }
    });

    return [...result].sort();
  }, [items]);

  const occasions = useMemo(() =>
    [...new Set(items.map(p => p.occasion).filter(Boolean))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    let result = [...items];

    const term = search.trim().toLowerCase();

    if (term) {
      result = result.filter(p =>
        [
          p.name,
          p.category,
          p.fabric,
          p.color,
          p.occasion,
          p.description
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      );
    }

    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (fabric !== 'all') {
      result = result.filter(p => p.fabric === fabric);
    }

    if (colour !== 'all') {
      result = result.filter(p => {
        const variants = p.colors || p.colorVariants || [];

        const values = Array.isArray(variants)
          ? variants.map(v =>
              typeof v === 'string' ? v : v?.name || v?.color
            )
          : [];

        if (p.color) values.push(p.color);

        return values.includes(colour);
      });
    }

    if (occasion !== 'all') {
      result = result.filter(p => p.occasion === occasion);
    }

    result = result.filter(p => {
      const price = Number(p.discountPrice || p.price);

      if (!Number.isFinite(price) || price <= 0) return true;

      if (minPrice !== '' && price < Number(minPrice)) return false;
      if (maxPrice !== '' && price > Number(maxPrice)) return false;

      return true;
    });

    result.sort((a, b) => {
      const priceA = Number(a.discountPrice || a.price) || 0;
      const priceB = Number(b.discountPrice || b.price) || 0;

      if (sort === 'price-low') return priceA - priceB;
      if (sort === 'price-high') return priceB - priceA;

      if (sort === 'name') {
        return String(a.name || '').localeCompare(String(b.name || ''));
      }

      if (sort === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [
    items, search, category, fabric, colour,
    occasion, minPrice, maxPrice, sort
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    search, category, fabric, colour,
    occasion, minPrice, maxPrice, sort, query
  ]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const visible = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function clearFilters() {
    setSearch('');
    setCategory('all');
    setFabric('all');
    setColour('all');
    setOccasion('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  }

  const inputClass =
    'w-full border border-[#dfcfb9] bg-white px-3 py-3 text-xs text-[#541b30] outline-none focus:border-[#b89555]';

  const labelClass =
    'mb-2 block text-[10px] font-semibold uppercase tracking-[1.5px] text-[#80684f]';

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">

      {/* COLLECTION HEADING */}
      <div className="mx-auto mb-9 max-w-2xl text-center">
        {eyebrow && (
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[#b89555]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-display text-3xl text-[#681f32] md:text-4xl">
          {title}
        </h2>

        <div className="mx-auto my-4 h-px w-16 bg-[#b89555]" />
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-[#81776e]">
          Preparing the saree collection…
        </div>
      )}

      {!loading && error && (
        <div className="border border-[#ead7d7] bg-white px-5 py-10 text-center">
          <h3 className="font-display text-xl text-[#681f32]">
            Collection temporarily unavailable
          </h3>

          <p className="mt-2 text-sm text-[#81776e]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRetry(value => value + 1)}
            className="mt-5 border border-[#b89555] px-6 py-3 text-xs uppercase tracking-widest text-[#681f32]"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="border border-dashed border-[#dfcfb9] bg-white px-5 py-14 text-center">
          <span className="text-4xl text-[#b89555]">✦</span>

          <h3 className="mt-4 font-display text-2xl text-[#681f32]">
            Our Saree Collection
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#81776e]">
            Our verified Sowji sarees and original product photographs
            will appear here once they are added to the collection.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          {/* FILTER PANEL */}
          <div className="mb-7 border border-[#e8dccd] bg-[#fffdf9] p-4 md:p-6">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[3px] text-[#b89555]">
                  Find Your Perfect Drape
                </p>
                <h3 className="mt-1 font-display text-xl text-[#681f32]">
                  Explore Sarees
                </h3>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs uppercase tracking-wider text-[#681f32] underline underline-offset-4"
              >
                Clear All Filters
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className={labelClass} htmlFor="sowji-search">
                  Search Sarees
                </label>

                <input
                  id="sowji-search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search saree, fabric or colour..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-category">
                  Collection
                </label>

                <select
                  id="sowji-category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="all">All Collections</option>
                  {categories.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-fabric">
                  Fabric
                </label>

                <select
                  id="sowji-fabric"
                  value={fabric}
                  onChange={e => setFabric(e.target.value)}
                  className={inputClass}
                >
                  <option value="all">All Fabrics</option>
                  {fabrics.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-colour">
                  Colour
                </label>

                <select
                  id="sowji-colour"
                  value={colour}
                  onChange={e => setColour(e.target.value)}
                  className={inputClass}
                >
                  <option value="all">All Colours</option>
                  {colours.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-occasion">
                  Occasion
                </label>

                <select
                  id="sowji-occasion"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  className={inputClass}
                >
                  <option value="all">All Occasions</option>
                  {occasions.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-sort">
                  Sort By
                </label>

                <select
                  id="sowji-sort"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className={inputClass}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-min">
                  Minimum Price (₹)
                </label>

                <input
                  id="sowji-min"
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="Minimum price"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="sowji-max">
                  Maximum Price (₹)
                </label>

                <input
                  id="sowji-max"
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="Maximum price"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* PRODUCT COUNT */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#81776e]">
              <strong className="text-[#681f32]">
                {filtered.length}
              </strong>{' '}
              Sarees Found
            </p>

            <p className="text-xs text-[#81776e]">
              Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}
              {' '}–{Math.min(page * PAGE_SIZE, filtered.length)}
              {' '}of {filtered.length}
            </p>
          </div>

          {/* PRODUCTS */}
          {visible.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {visible.map(product => (
                <ProductCard key={product._id} p={product} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#dfcfb9] bg-white px-5 py-12 text-center">
              <h3 className="font-display text-xl text-[#681f32]">
                No Sarees Found
              </h3>

              <p className="mt-2 text-sm text-[#81776e]">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 bg-[#681f32] px-6 py-3 text-xs uppercase tracking-widest text-white"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {pageCount > 1 && (
            <nav
              aria-label="Saree collection pages"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(value => Math.max(1, value - 1))}
                className="border border-[#d9c8b1] px-4 py-2 text-xs text-[#681f32] disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: pageCount }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  type="button"
                  aria-current={page === number ? 'page' : undefined}
                  onClick={() => setPage(number)}
                  className={
                    page === number
                      ? 'bg-[#681f32] px-4 py-2 text-xs text-white'
                      : 'border border-[#d9c8b1] px-4 py-2 text-xs text-[#681f32]'
                  }
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage(value => Math.min(pageCount, value + 1))}
                className="border border-[#d9c8b1] px-4 py-2 text-xs text-[#681f32] disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}

          {viewAllTo && (
            <div className="mt-10 text-center">
              <Link
                to={viewAllTo}
                className="inline-flex border border-[#b89555] px-8 py-3 text-xs uppercase tracking-[2px] text-[#681f32] transition hover:bg-[#681f32] hover:text-white"
              >
                {viewAllLabel || 'View All Sarees'}
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
