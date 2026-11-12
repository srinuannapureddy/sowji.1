
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES, INSTAGRAM } from './client.js';
import ProductGrid from './ProductGrid.jsx';

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <p className="mb-3 text-[10px] uppercase tracking-[5px] text-[#ad8954]">
      {eyebrow}
    </p>
    <h2 className="font-display text-3xl text-[#541b30] md:text-5xl">
      {title}
    </h2>
    <div className="mx-auto my-5 h-px w-16 bg-[#b89555]" />
    {description && (
      <p className="text-sm leading-7 text-[#81746c]">{description}</p>
    )}
  </div>
);

export default function Home() {
  const [categories, setCategories] = useState(
    (CATEGORIES || []).filter(category =>
      /saree/i.test(category.name || category.title || '')
    )
  );

  useEffect(() => {
    let active = true;

    api('/categories')
      .then(data => {
        if (!active || !Array.isArray(data.items)) return;

        setCategories(
          data.items.filter(category =>
            /saree/i.test(category.name || category.title || '')
          )
        );
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="overflow-hidden bg-[#faf7f1] text-[#4d2635]">

      <style>{`
        @keyframes sowjiFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes sowjiReveal {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sowji-reveal {
          animation: sowjiReveal 1s ease both;
        }

        .sowji-float {
          animation: sowjiFloat 7s ease-in-out infinite;
        }

        .sowji-card {
          transition: transform .4s ease, box-shadow .4s ease;
        }

        .sowji-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 18px 40px rgba(75, 28, 46, .10);
        }

        .sowji-gold-line {
          background: linear-gradient(
            90deg,
            transparent,
            #c5a36e,
            transparent
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .sowji-reveal,
          .sowji-float {
            animation: none;
          }
        }
      `}</style>

      {/* PREMIUM HERO */}
      <section className="relative isolate overflow-hidden bg-[#351322] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#71364a] via-[#401728] to-[#210d18]" />

        <div className="absolute -right-36 -top-32 h-[600px] w-[600px] rounded-full border border-[#d5b77c]/15" />
        <div className="absolute -right-20 top-10 h-[430px] w-[430px] rounded-full border border-[#d5b77c]/15" />
        <div className="absolute bottom-0 left-0 h-px w-full sowji-gold-line" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-12">

          <div className="sowji-reveal relative z-10 text-center md:text-left">
            <p className="mb-6 text-[10px] uppercase tracking-[6px] text-[#dfc18b]">
              WELCOME TO SOWJI COLLECTIONS
            </p>

            <h1 className="font-display text-5xl leading-[1.15] md:text-7xl">
              Elegance
              <span className="block italic text-[#e5c994]">
                in Every
              </span>
              <span className="block">Drape.</span>
            </h1>

            <div className="my-8 mx-auto h-px w-20 bg-[#d0ad72] md:mx-0" />

            <p className="mx-auto max-w-md text-sm leading-8 text-[#eadbd9] md:mx-0">
              Discover authentic saree collections for celebrations,
              special occasions and unforgettable moments.
              Find the drape that tells your story.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                to="/shop"
                className="bg-[#d1ae75] px-8 py-4 text-[10px] uppercase tracking-[2.5px] text-[#351321] transition hover:bg-[#f2dfb8]"
              >
                Shop Sarees ↗
              </Link>

              <Link
                to="/collections"
                className="border border-[#d8bd94]/70 px-8 py-4 text-[10px] uppercase tracking-[2.5px] text-white transition hover:bg-white hover:text-[#401728]"
              >
                Our Collections
              </Link>
            </div>

            <p className="mt-12 text-[9px] uppercase tracking-[4px] text-[#d9bd91]/75">
              The beauty of the Indian saree
            </p>
          </div>

          {/* EDITORIAL BRAND PANEL */}
          <div className="sowji-float relative mx-auto flex h-[390px] w-full max-w-[480px] items-center justify-center md:h-[530px]">
            <div className="absolute inset-5 rounded-t-full border border-[#d6b77e]/40" />
            <div className="absolute inset-12 rounded-t-full border border-[#d6b77e]/25" />

            <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-full border border-[#d6b77e]/50 bg-[#4a2033]/70 text-center backdrop-blur-sm md:h-80 md:w-80">
              <span className="text-5xl text-[#e2c18b]">✧</span>
              <p className="mt-4 font-display text-5xl italic text-[#f0dfbf]">
                Sowji
              </p>
              <div className="my-4 h-px w-16 bg-[#d0ad72]" />
              <p className="text-[9px] uppercase tracking-[4px] text-[#e2c18b]">
                Saree Collections
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND INTRODUCTION */}
      <section className="px-6 py-20 text-center md:py-28">
        <p className="mb-4 text-[10px] uppercase tracking-[5px] text-[#ad8954]">
          THE SOWJI EXPERIENCE
        </p>

        <h2 className="font-display text-3xl leading-snug text-[#541b30] md:text-5xl">
          A graceful tradition.
          <span className="block italic">
            An everlasting expression.
          </span>
        </h2>

        <div className="mx-auto my-6 h-px w-16 bg-[#b89555]" />

        <p className="mx-auto max-w-2xl text-sm leading-8 text-[#81746c]">
          Explore our saree collections and discover beautiful drapes
          for your celebrations, festivities and everyday elegance.
        </p>
      </section>

      {/* REAL VERIFIED PRODUCTS */}
      <section className="bg-[#f0e8dc] px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <ProductGrid
            eyebrow="THE SOWJI EDIT"
            title="Discover Our Sarees"
            query="limit=8"
            viewAllTo="/shop"
            viewAllLabel="View All Sarees"
          />
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="bg-[#faf7f1] px-5 py-20 md:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="EXPLORE BY STYLE"
              title="Our Saree Collections"
              description="Discover the categories available in our collection."
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Link
                  key={category.slug || category.name || index}
                  to={`/category/${category.slug}`}
                  className="sowji-card group border border-[#d9c8b1] bg-white p-7 text-center md:p-10"
                >
                  <span className="mb-5 block text-3xl text-[#b89555]">
                    ✧
                  </span>

                  <h3 className="font-display text-xl text-[#541b30] md:text-2xl">
                    {category.name || category.title}
                  </h3>

                  <div className="mx-auto my-5 h-px w-10 bg-[#b89555] transition-all duration-500 group-hover:w-20" />

                  <span className="text-[9px] uppercase tracking-[2px] text-[#92785c]">
                    Explore Collection ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDITORIAL BANNER */}
      <section className="relative overflow-hidden bg-[#4a192e] px-6 py-24 text-center text-white md:py-28">
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full border border-[#d9bd91]/15" />
        <div className="absolute -right-10 top-10 h-60 w-60 rounded-full border border-[#d9bd91]/15" />

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-5 text-[10px] uppercase tracking-[5px] text-[#d9bd91]">
            THE ART OF THE SAREE
          </p>

          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Every drape has
            <span className="block italic text-[#e4c895]">
              its own story.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#eadbd9]">
            Discover authentic Sowji collections and find a saree
            that makes every occasion special.
          </p>

          <Link
            to="/shop"
            className="mt-9 inline-flex border border-[#d8bd94] px-9 py-4 text-[10px] uppercase tracking-[2px] text-[#f1dfbd] transition hover:bg-[#d8bd94] hover:text-[#401728]"
          >
            Explore Sarees ↗
          </Link>
        </div>
      </section>

      {/* OFFICIAL INSTAGRAM */}
      {INSTAGRAM && (
        <section className="bg-[#faf7f1] px-6 py-20 text-center md:py-24">
          <p className="mb-3 text-[10px] uppercase tracking-[5px] text-[#ad8954]">
            THE SOWJI LOOKBOOK
          </p>

          <h2 className="font-display text-3xl text-[#541b30] md:text-5xl">
            Sarees, stories & style.
          </h2>

          <div className="mx-auto my-5 h-px w-16 bg-[#b89555]" />

          <p className="mx-auto max-w-lg text-sm leading-8 text-[#81746c]">
            Discover original Sowji saree photographs, new designs
            and collection updates from our official shop.
          </p>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex bg-[#541b30] px-9 py-4 text-[10px] uppercase tracking-[2px] text-white transition hover:bg-[#8b4357]"
          >
            Visit Official Instagram ↗
          </a>
        </section>
      )}

      {/* FOOTER DETAIL */}
      <section className="border-t border-[#e6dacb] bg-[#f0e8dc] px-6 py-12 text-center">
        <span className="text-2xl text-[#b89555]">✧</span>
        <p className="mt-3 font-display text-2xl italic text-[#541b30]">
          Sowji Collections
        </p>
        <p className="mt-2 text-[9px] uppercase tracking-[4px] text-[#92785c]">
          The art of the saree
        </p>
      </section>
    </main>
  );
}
