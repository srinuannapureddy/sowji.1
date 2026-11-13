
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES } from './client.js';
import ProductGrid from './ProductGrid.jsx';

const fallbackCategories = CATEGORIES.filter(item =>
  /saree/i.test(item.name || '')
);

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-[10px] uppercase tracking-[4px] text-[#a98550]">
        {eyebrow}
      </p>

      <h2 className="font-display text-3xl text-[#541b30] md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#81746c]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [lookbookImages, setLookbookImages] = useState([]);
  const [lookbookLoading, setLookbookLoading] = useState(true);

  // Load saree categories.
  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await api('/categories');

        if (!active || !Array.isArray(data.items)) return;

        const sareeCategories = data.items.filter(item =>
          /saree/i.test(item.name || item.title || '')
        );

        if (sareeCategories.length) {
          setCategories(sareeCategories);
        }
      } catch {
        // Keep existing fallback categories.
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  // Load genuine photographs from published Sowji products.
  useEffect(() => {
    let active = true;

    async function loadLookbook() {
      try {
        const data = await api('/products?limit=40');

        if (!active) return;

        const products = Array.isArray(data.items)
          ? data.items
          : [];

        const photographs = products
          .filter(product =>
            product.isVerified === true &&
            Array.isArray(product.images)
          )
          .flatMap(product =>
            product.images
              .filter(image =>
                image &&
                typeof image.url === 'string' &&
                image.url.trim()
              )
              .map(image => ({
                url: image.url,
                name: product.name || 'Sowji Saree',
                alt: image.alt || product.name || 'Sowji saree photograph'
              }))
          );

        const uniquePhotographs = photographs.filter(
          (photo, index, array) =>
            array.findIndex(item => item.url === photo.url) === index
        );

        setLookbookImages(uniquePhotographs.slice(0, 4));
      } catch {
        if (active) {
          setLookbookImages([]);
        }
      } finally {
        if (active) {
          setLookbookLoading(false);
        }
      }
    }

    loadLookbook();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="bg-[#fbf8f2] text-[#4b2935]">

      <style>{`
        .sowji-home-image {
          transition: transform .7s ease;
        }

        .sowji-home-card:hover .sowji-home-image {
          transform: scale(1.04);
        }

        .sowji-home-card {
          transition: box-shadow .3s ease, transform .3s ease;
        }

        .sowji-home-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(70, 30, 45, .09);
        }

        .sowji-home-link {
          position: relative;
        }

        .sowji-home-link:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0;
          height: 1px;
          background: #a98550;
          transition: width .3s ease;
        }

        .sowji-home-link:hover:after {
          width: 100%;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="bg-[#f0e8dc]">
        <div className="mx-auto grid max-w-[1500px] md:min-h-[570px] md:grid-cols-2">

          {/* LEFT HERO TEXT */}
          <div className="flex flex-col justify-center px-7 py-16 md:px-16 lg:px-24">

            <p className="mb-5 text-[10px] uppercase tracking-[4px] text-[#a98550]">
              THE HOUSE OF SOWJI
            </p>

            <h1 className="font-display text-5xl leading-[1.15] text-[#541b30] md:text-6xl lg:text-7xl">
              Discover the
              <span className="block italic">Beauty of</span>
              Indian Sarees
            </h1>

            <p className="mt-6 max-w-md text-sm leading-8 text-[#796d64]">
              Explore timeless Indian drapes, traditional craftsmanship
              and beautiful saree collections for every occasion.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="bg-[#681f32] px-8 py-4 text-[10px] uppercase tracking-[2px] text-white transition hover:bg-[#421525]"
              >
                Shop All Sarees →
              </Link>

              <Link
                to="/collections"
                className="border border-[#681f32] px-8 py-4 text-[10px] uppercase tracking-[2px] text-[#681f32] transition hover:bg-[#681f32] hover:text-white"
              >
                Explore Collections
              </Link>

            </div>
          </div>

          {/* RIGHT HERO - ACTUAL SOWJI SAREE PHOTOGRAPH */}
          <div className="relative min-h-[360px] overflow-hidden bg-[#e5d9ca] md:min-h-full">

            {lookbookImages.length > 0 ? (
              <>
                <img
                  src={lookbookImages[0].url}
                  alt={lookbookImages[0].alt || 'Sowji saree'}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  fetchPriority="high"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[10px] uppercase tracking-[4px] text-white">
                    THE HOUSE OF SOWJI
                  </p>

                  <h2 className="mt-2 font-display text-3xl italic text-white md:text-4xl">
                    The Sowji Edit
                  </h2>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-display text-2xl italic text-[#541b30]">
                  {lookbookLoading
                    ? 'Loading saree photograph...'
                    : 'Saree photography coming soon'}
                </p>
              </div>
            )}

            {/* Decorative gold borders */}
            <div className="pointer-events-none absolute inset-5 border border-[#d8bd8b]/70" />
            <div className="pointer-events-none absolute inset-9 border border-white/30" />

          </div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}
      <section className="border-b border-[#e8dfd3] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8">

          <p className="mb-6 text-center text-[10px] uppercase tracking-[3px] text-[#a98550]">
            Explore by Collection
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-5">

            {categories.map((category, index) => {
              const name = category.name || category.title;

              const slug = category.slug ||
                name?.toLowerCase().replace(/\s+/g, '-');

              return (
                <Link
                  key={category._id || slug || index}
                  to={`/category/${slug}`}
                  className="sowji-home-link text-xs text-[#541b30] hover:text-[#a98550]"
                >
                  {name}
                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* COLLECTION INTRODUCTION */}
      <section className="px-5 py-16 md:py-24">

        <SectionHeading
          eyebrow="THE SOWJI COLLECTION"
          title="A Saree for Every Story"
          description="From timeless traditional weaves to elegant contemporary drapes, discover the collections that celebrate Indian artistry."
        />

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">

          {categories.slice(0, 6).map((category, index) => {
            const name = category.name || category.title;

            const slug = category.slug ||
              name?.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link
                key={category._id || slug || index}
                to={`/category/${slug}`}
                className="sowji-home-card flex min-h-[150px] flex-col items-center justify-center border border-[#e7daca] bg-white px-4 py-8 text-center md:min-h-[190px]"
              >
                <span className="text-2xl text-[#b89555]">✧</span>

                <h3 className="mt-4 font-display text-lg text-[#541b30] md:text-xl">
                  {name}
                </h3>

                <span className="mt-3 text-[9px] uppercase tracking-[2px] text-[#a98550]">
                  Explore Collection →
                </span>
              </Link>
            );
          })}

        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#f0e8dc] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">

          <ProductGrid
            eyebrow="FRESH FROM SOWJI"
            title="New Arrivals"
            query="limit=8"
            viewAllTo="/shop"
            viewAllLabel="Explore All Sarees"
          />

        </div>
      </section>

      {/* REAL SAREE PHOTOGRAPH GRID */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE SOWJI LOOKBOOK"
            title="Discover the Art of Draping"
            description="Explore the beauty of our saree collection through original Sowji product photographs."
          />

          {lookbookLoading ? (

            <div className="py-16 text-center text-sm text-[#81746c]">
              Loading our saree lookbook…
            </div>

          ) : lookbookImages.length > 0 ? (

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">

              {lookbookImages.map((photo, index) => (
                <Link
                  key={photo.url}
                  to="/shop"
                  className="sowji-home-card group relative block aspect-[3/4] overflow-hidden bg-[#eee4d8]"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading="lazy"
                    className="sowji-home-image h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-12">

                    <p className="font-display text-base text-white md:text-lg">
                      {photo.name}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[2px] text-white/80">
                      Explore Sarees →
                    </p>

                  </div>
                </Link>
              ))}

            </div>

          ) : (

            <div className="border border-dashed border-[#d9c8b1] bg-[#f4eee5] px-5 py-16 text-center">

              <span className="text-4xl text-[#b89555]">✧</span>

              <p className="mt-4 font-display text-xl text-[#541b30]">
                Your Sowji Lookbook
              </p>

              <p className="mt-2 text-sm text-[#81746c]">
                Verified saree photographs uploaded through Admin will
                appear here automatically.
              </p>

            </div>

          )}

        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="bg-[#421729] px-6 py-20 text-center text-white md:py-28">

        <p className="mb-5 text-[10px] uppercase tracking-[4px] text-[#d9bd91]">
          THE SOWJI EXPERIENCE
        </p>

        <h2 className="font-display text-4xl leading-tight md:text-6xl">
          Tradition meets
          <span className="block italic text-[#e4c895]">
            timeless elegance.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#eadbd9]">
          Find your next favourite drape and celebrate the beauty
          of Indian sarees with Sowji Collections.
        </p>

        <Link
          to="/shop"
          className="mt-9 inline-flex bg-[#d5b47d] px-9 py-4 text-[10px] uppercase tracking-[2px] text-[#321421] transition hover:bg-[#f1dfbd]"
        >
          Shop the Collection →
        </Link>

      </section>

    </main>
  );
}
