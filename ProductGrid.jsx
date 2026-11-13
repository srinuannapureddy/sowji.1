
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './client.js';
import ProductCard from './ProductCard.jsx';

const PAGE_SIZE = 12;

const MAIN_COLOURS = [
  ['Red', '#C62828'],
  ['Maroon', '#681F32'],
  ['Pink', '#E88AAE'],
  ['Blue', '#2455A4'],
  ['Green', '#287447'],
  ['Yellow', '#E8C52E'],
  ['Black', '#222222'],
  ['White', '#F5F2EA'],
  ['Purple', '#75418B'],
  ['Orange', '#E87824'],
  ['Gold', '#C6A04A'],
  ['Beige', '#D8C3A2']
];

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

  const categories = useMemo(
    () => [...new Set(items.map(p => p.category).filter(Boolean))].sort(),
    [items]
  );

  const fabrics = useMemo(
    () => [...new Set(items.map(p => p.fabric).filter(Boolean))].sort(),
    [items]
  );

  const occasions = useMemo(
    () => [...new Set(items.map(p => p.occasion).filter(Boolean))].sort(),
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
          ...(Array.isArray(p.colors) ? p.colors.map(v =>
            typeof v === 'string' ? v : v?.name || v?.color || ''
          ) : []),
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
        const variants = [
          ...(Array.isArray(p.colors) ? p.colors : []),
          ...(Array.isArray(p.colorVariants) ? p.colorVariants : [])
        ];

        const values = variants.map(v =>
          typeof v === 'string'
            ? v
            : v?.name || v?.color || ''
        );

        if (p.color) values.push(p.color);

        return values.some(value =>
          String(value).toLowerCase().includes(colour.toLowerCase())
        );
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
    'w-full border-0 border-b border-[#ded3c5] bg-transparent px-0 py-2.5 text-sm text-[#541b30] outline-none focus:border-[#a48655]';

  const labelClass =
    'mb-2 block text-[10px] font-semibold uppercase tracking-[1.6px] text-[#80684f]';

  const selectClass =
    'w-full border-0 border-b border-[#ded3c5] bg-transparent py-2.5 text-sm text-[#541b30] outline-none focus:border-[#a48655]';

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-10 md:px-8 md:py-14">

      <div className="mb-8">
        {eyebrow && (
          <p className="mb-2 text-[10px] uppercase tracking-[4px] text-[#a48655]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-display text-2xl text-[#681f32] md:text-3xl">
          {title}
        </h2>
      </div>

      {loading && (
        <div className="py-20 text-center text-sm text-[#81776e]">
          Preparing the saree collection…
        </div>
      )}

      {!loading && error && (
        <div className="py-16 text-center">
          <h3 className="font-display text-xl text-[#681f32]">
            Collection temporarily unavailable
          </h3>
          <p className="mt-2 text-sm text-[#81776e]">{error}</p>
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
        <div className="py-16 text-center">
          <h3 className="font-display text-2xl text-[#681f32]">
            Our Saree Collection
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#81776e]">
            Our verified Sowji sarees and original product photographs
            will appear here once they are added to the collection.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-12">

          {/* LEFT FILTER SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="flex items-center justify-between border-b border-[#ded3c5] pb-4">
              <h3 className="font-display text-xl text-[#681f32]">
                Filter By
              </h3>

              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-wider text-[#94764d] underline underline-offset-4"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-6 py-5">

              {/* SEARCH */}
              <div>
                <label className={labelClass} htmlFor="sowji-search">
                  Search Sarees
                </label>
                <input
                  id="sowji-search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Saree, fabric or colour..."
                  className={inputClass}
                />
              </div>

              {/* COLLECTION */}
              <div>
                <label className={labelClass} htmlFor="sowji-category">
                  Collection
                </label>
                <select
                  id="sowji-category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All Collections</option>
                  {categories.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* FABRIC */}
              <div>
                <label className={labelClass} htmlFor="sowji-fabric">
                  Fabric
                </label>
                <select
                  id="sowji-fabric"
                  value={fabric}
                  onChange={e => setFabric(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All Fabrics</option>
                  {fabrics.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* MAIN COLOUR FILTER */}
              <div>
                <p className={labelClass}>Colour</p>

                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  {MAIN_COLOURS.map(([name, hex]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        setColour(current =>
                          current === name ? 'all' : name
                        )
                      }
                      className={`flex items-center gap-2 text-left text-xs transition-colors ${
                        colour === name
                          ? 'font-semibold text-[#681f32]'
                          : 'text-[#62564d] hover:text-[#681f32]'
                      }`}
                      aria-pressed={colour === name}
                    >
                      <span
                        className={`h-5 w-5 shrink-0 rounded-full border ${
                          colour === name
                            ? 'border-[#681f32] ring-2 ring-[#c6a04a] ring-offset-2'
                            : 'border-[#d8cec1]'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                      {name}
                    </button>
                  ))}
                </div>

                {colour !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setColour('all')}
                    className="mt-3 text-[10px] uppercase tracking-wider text-[#94764d] underline underline-offset-4"
                  >
                    Clear colour
                  </button>
                )}
              </div>

              {/* OCCASION */}
              <div>
                <label className={labelClass} htmlFor="sowji-occasion">
                  Occasion
                </label>
                <select
                  id="sowji-occasion"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">All Occasions</option>
                  {occasions.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE RANGE */}
              <div>
                <p className={labelClass}>Price Range (₹)</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="Min"
                    aria-label="Minimum price"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    aria-label="Maximum price"
                    className={inputClass}
                  />
                </div>
              </div>

            </div>
          </aside>

          {/* RIGHT PRODUCT AREA */}
          <div className="min-w-0">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#ded3c5] pb-4">
              <div>
                <p className="text-sm text-[#681f32]">
                  <strong>{filtered.length}</strong> Sarees Found
                </p>
                <p className="mt-1 text-xs text-[#81776e]">
                  Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}
                  {' '}–{Math.min(page * PAGE_SIZE, filtered.length)}
                  {' '}of {filtered.length}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="sowji-sort"
                  className="whitespace-nowrap text-[10px] uppercase tracking-wider text-[#80684f]"
                >
                  Sort By
                </label>

                <select
                  id="sowji-sort"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="max-w-[170px] border-b border-[#ded3c5] bg-transparent py-2 text-xs text-[#541b30] outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {visible.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map(product => (
                  <ProductCard key={product._id} p={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <h3 className="font-display text-xl text-[#681f32]">
                  No Sarees Found
                </h3>
                <p className="mt-2 text-sm text-[#81776e]">
                  Try changing your search or filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-xs uppercase tracking-widest text-[#681f32] underline underline-offset-4"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* PAGINATION */}
            {pageCount > 1 && (
              <nav
                aria-label="Saree collection pages"
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
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
                  className="text-xs uppercase tracking-widest text-[#681f32] underline underline-offset-4"
                >
                  {viewAllLabel || 'View All Sarees'}
                </Link>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
