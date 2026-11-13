
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES, INSTAGRAM } from './client.js';
import ProductGrid from './ProductGrid.jsx';

const verifiedImage = (product) => {
  if (product?.isVerified !== true || !Array.isArray(product.images)) {
    return '';
  }

  const image = product.images.find(
    item => typeof item?.url === 'string' && item.url.trim()
  );

  return image?.url || '';
};

function Heading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-4 text-[10px] uppercase tracking-[5px] text-[#a98550]">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-tight text-[#4a192d] md:text-5xl">
        {title}
      </h2>
      <div className="mx-auto my-6 h-px w-16 bg-[#b89555]" />
      {description && (
        <p className="text-sm leading-8 text-[#82766e]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState(
    (CATEGORIES || []).filter(item =>
      /saree/i.test(item.name || '')
    )
  );

  const [editorialProducts, setEditorialProducts] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        const [categoryData, productData] = await Promise.all([
          api('/categories'),
          api('/products?limit=8')
        ]);

        if (!active) return;

        if (Array.isArray(categoryData.items)) {
          setCategories(
            categoryData.items.filter(item =>
              /saree/i.test(item.name || item.title || '')
            )
          );
        }

        if (Array.isArray(productData.items)) {
          setEditorialProducts(
            productData.items
              .filter(product => verifiedImage(product))
              .slice(0, 4)
          );
        }
      } catch {
        // Keep the homepage usable if an optional request fails.
      }
    }

    loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  const heroImage = verifiedImage(editorialProducts[0]);

  return (
    <main className="overflow-hidden bg-[#faf7f1] text-[#4b2935]">

      <style>{`
        @keyframes sowjiFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes sowjiAppear {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sowji-appear {
          animation: sowjiAppear .9s ease both;
        }

        .sowji-float {
          animation: sowjiFloat 7s ease-in-out infinite;
        }

        .sowji-image {
          transition: transform .8s cubic-bezier(.2,.7,.2,1);
        }

        .sowji-image:hover {
          transform: scale(1.045);
        }

        .sowji-luxury-card {
          transition: transform .4s ease, box-shadow .4s ease;
        }

        .sowji-luxury-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(65, 25, 43, .12);
        }

        .sowji-gold-rule {
          background: linear-gradient(
            90deg,
            transparent,
            #c6a36b,
            transparent
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .sowji-appear,
          .sowji-float {
            animation: none;
          }

          .sowji-image,
          .sowji-luxury-card {
            transition: none;
          }
        }
      `}</style>

      {/* LUXURY HERO */}
      <section className="relative isolate overflow-hidden bg-[#321421] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#71364c] via-[#421a2c] to-[#1e0c16]" />

        <div className="absolute -right-32 -top-32 h-[580px] w-[580px] rounded-full border border-[#d7b982]/20" />
        <div className="absolute -right-12 top-12 h-[420px] w-[420px] rounded-full border border-[#d7b982]/15" />
        <div className="absolute bottom-0 left-0 h-px w-full sowji-gold-rule" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-12">

          <div className="sowji-appear relative z-10 text-center md:text-left">
            <p className="mb-7 text-[10px] uppercase tracking-[5px] text-[#e2c895]">
              THE HOUSE OF SOWJI
            </p>

            <h1 className="font-display text-5xl leading-[1.12] md:text-7xl">
              The Art of
              <span className="block italic text-[#e7cfa3]">
                Indian
              </span>
              <span className="block">Elegance.</span>
            </h1>

            <div className="my-8 mx-auto h-px w-20 bg-[#d2b078] md:mx-0" />

            <p className="mx-auto max-w-md text-sm leading-8 text-[#eadbdc] md:mx-0">
              Discover the timeless beauty of the saree.
              Explore graceful drapes, rich traditions and
              elegant styles for moments worth remembering.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                to="/shop"
                className="bg-[#d5b47d] px-9 py-4 text-[10px] uppercase tracking-[2px] text-[#321421] transition hover:bg-[#f1dfbd]"
              >
                Discover Sarees ↗
              </Link>

              <Link
                to="/collections"
                className="border border-[#d8bd94]/70 px-9 py-4 text-[10px] uppercase tracking-[2px] text-white transition hover:bg-white hover:text-[#321421]"
              >
                Explore Collections
              </Link>
            </div>

            <p className="mt-12 text-[9px] uppercase tracking-[4px] text-[#d9bd91]/75">
              Tradition · Craftsmanship · Grace
            </p>
          </div>

          {/* VERIFIED SAREE IMAGE */}
          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="absolute -inset-5 rounded-t-full border border-[#d8bd94]/30" />
            <div className="absolute -inset-2 rounded-t-full border border-[#d8bd94]/20" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-[#d8bd94]/50 bg-gradient-to-br from-[#89516a] via-[#54273e] to-[#29101e]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Verified Sowji saree collection"
                  className="sowji-image h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <span className="text-6xl text-[#e2c18b]">✧</span>
                  <p className="mt-5 font-display text-6xl italic text-[#f0dfbf]">
                    Sowji
                  </p>
                  <div className="my-5 h-px w-16 bg-[#d0ad72]" />
                  <p className="text-[9px] uppercase tracking-[4px] text-[#e2c18b]">
                    Saree Collections
                  </p>
                  <p className="mt-8 max-w-[220px] text-xs leading-6 text-[#eadbdc]">
                    Your verified saree photographs will appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="sowji-float absolute -bottom-5 -left-5 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#d8bd94]/50 bg-[#d5b47d] text-center text-[#321421] shadow-xl">
              <span className="text-2xl">✧</span>
              <span className="text-[8px] uppercase tracking-[2px]">
                Sowji
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="px-6 py-24 text-center md:py-32">
        <p className="mb-5 text-[10px] uppercase tracking-[5px] text-[#a98550]">
          A WORLD OF TIMELESS DRAPES
        </p>

        <h2 className="font-display text-3xl leading-snug text-[#4a192d] md:text-5xl">
          Not just a saree.
          <span className="block italic">
            A feeling that stays.
          </span>
        </h2>

        <div className="mx-auto my-7 h-px w-16 bg-[#b89555]" />

        <p className="mx-auto max-w-2xl text-sm leading-8 text-[#82766e]">
          Every saree carries a story of elegance and tradition.
          Find a beautiful drape for your celebrations,
          cherished occasions and everyday moments.
        </p>
      </section>

      {/* COLLECTION CATEGORIES */}
      <section className="bg-[#f0e8dc] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Heading
            eyebrow="CURATED FOR YOU"
            title="Explore Our Collections"
            description="Discover saree styles and traditional weaves in the Sowji collection."
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => {
              const name = category.name || category.title;
              const slug = category.slug ||
                name?.toLowerCase().replace(/\s+/g, '-');

              return (
                <Link
                  key={slug || index}
                  to={`/category/${slug}`}
                  className="sowji-luxury-card group border border-[#ddcdb8] bg-[#fffdf9] px-4 py-9 text-center md:px-7 md:py-12"
                >
                  <span className="text-3xl text-[#b89555]">✧</span>

                  <h3 className="mt-5 font-display text-lg text-[#541b30] md:text-2xl">
                    {name}
                  </h3>

                  <div className="mx-auto my-5 h-px w-9 bg-[#b89555] transition-all duration-500 group-hover:w-16" />

                  <span className="text-[9px] uppercase tracking-[2px] text-[#92785c]">
                    Discover ↗
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED VERIFIED PRODUCTS */}
      <section className="bg-[#faf7f1] px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ProductGrid
            eyebrow="THE SOWJI SELECTION"
            title="Discover Beautiful Drapes"
            query="limit=8"
            viewAllTo="/shop"
            viewAllLabel="View All Sarees"
          />
        </div>
      </section>

      {/* EDITORIAL PRODUCT STRIP */}
      {editorialProducts.length > 1 && (
        <section className="bg-[#eee4d7] px-5 py-20 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Heading
              eyebrow="THE SOWJI LOOKBOOK"
              title="Elegance in Every Detail"
              description="Explore photographs from our verified saree collection."
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {editorialProducts.map((product, index) => {
                const image = verifiedImage(product);

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug || product._id}`}
                    className={`group relative overflow-hidden bg-[#e2d4c2] ${
                      index % 2 === 1 ? 'md:mt-10' : ''
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={image}
                        alt={product.name || 'Sowji saree'}
                        loading="lazy"
                        className="sowji-image h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
                      <p className="font-display text-lg">
                        {product.name || 'Sowji Saree'}
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-[2px] text-[#ead4a8]">
                        Explore Saree ↗
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LUXURY BRAND BANNER */}
      <section className="relative overflow-hidden bg-[#421729] px-6 py-24 text-center text-white md:py-32">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-[#d9bd91]/20" />
        <div className="absolute -right-5 top-8 h-64 w-64 rounded-full border border-[#d9bd91]/15" />
        <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full border border-[#d9bd91]/15" />

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-6 text-[10px] uppercase tracking-[5px] text-[#d9bd91]">
            THE SOWJI SIGNATURE
          </p>

          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Grace never
            <span className="block italic text-[#e4c895]">
              goes out of style.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#eadbd9]">
            Celebrate the beauty of Indian tradition with
            sarees that make every moment feel special.
          </p>

          <Link
            to="/shop"
            className="mt-10 inline-flex bg-[#d5b47d] px-10 py-4 text-[10px] uppercase tracking-[2px] text-[#321421] transition hover:bg-[#f1dfbd]"
          >
            Shop The Collection ↗
          </Link>
        </div>
      </section>

      {/* INSTAGRAM */}
      {INSTAGRAM && (
        <section className="bg-[#faf7f1] px-6 py-20 text-center md:py-24">
          <p className="mb-4 text-[10px] uppercase tracking-[5px] text-[#a98550]">
            FOLLOW OUR JOURNEY
          </p>

          <h2 className="font-display text-3xl text-[#541b30] md:text-5xl">
            The Sowji Lookbook
          </h2>

          <div className="mx-auto my-6 h-px w-16 bg-[#b89555]" />

          <p className="mx-auto max-w-lg text-sm leading-8 text-[#81746c]">
            Follow our official page for original saree photographs,
            collection updates and new arrivals.
          </p>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex border border-[#541b30] px-9 py-4 text-[10px] uppercase tracking-[2px] text-[#541b30] transition hover:bg-[#541b30] hover:text-white"
          >
            Visit Instagram ↗
          </a>
        </section>
      )}

      {/* HOMEPAGE BRAND SIGNATURE */}
      <section className="border-t border-[#e5d9c9] bg-[#f0e8dc] px-6 py-14 text-center">
        <span className="text-3xl text-[#b89555]">✧</span>
        <p className="mt-4 font-display text-3xl italic text-[#541b30]">
          Sowji Collections
        </p>
        <p className="mt-3 text-[9px] uppercase tracking-[4px] text-[#92785c]">
          The Art of Indian Elegance
        </p>
      </section>

    </main>
  );
}
