
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES, INSTAGRAM } from './client.js';

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

function FlowingFabric() {
  return (
    <svg
      viewBox="0 0 600 650"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fabricOne" x1="80" y1="20" x2="510" y2="600">
          <stop stopColor="#D6B77E" />
          <stop offset=".48" stopColor="#8D4559" />
          <stop offset="1" stopColor="#3B1428" />
        </linearGradient>
        <linearGradient id="fabricTwo" x1="500" y1="0" x2="50" y2="650">
          <stop stopColor="#F1D9AA" />
          <stop offset=".5" stopColor="#A96A70" />
          <stop offset="1" stopColor="#5A2038" />
        </linearGradient>
      </defs>

      <path
        d="M430 -40 C170 80 560 170 320 300 C100 420 390 500 120 700"
        stroke="url(#fabricOne)"
        strokeWidth="100"
        strokeLinecap="round"
        opacity=".72"
      />
      <path
        d="M520 -30 C260 110 620 210 380 340 C180 450 470 560 210 700"
        stroke="url(#fabricTwo)"
        strokeWidth="35"
        strokeLinecap="round"
        opacity=".85"
      />
      <path
        d="M350 -30 C120 130 480 210 250 360 C50 500 300 580 70 700"
        stroke="#E7CDA0"
        strokeWidth="2"
        opacity=".7"
      />
      <path
        d="M490 -30 C250 120 580 230 350 370 C150 510 400 590 170 700"
        stroke="#E7CDA0"
        strokeWidth="1.5"
        opacity=".55"
      />
      <circle cx="300" cy="300" r="175" stroke="#D9B979" opacity=".12" />
      <circle cx="300" cy="300" r="140" stroke="#D9B979" opacity=".12" />
    </svg>
  );
}

export default function Home() {
  const [categories, setCategories] = useState(
    (CATEGORIES || []).filter((category) =>
      /saree/i.test(category.name || category.title || '')
    )
  );

  useEffect(() => {
    let active = true;

    api('/categories')
      .then((data) => {
        if (!active || !Array.isArray(data.items)) return;

        setCategories(
          data.items.filter((category) =>
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
        @keyframes fabricFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }

        @keyframes fabricDrift {
          0% { transform: translateX(-3%) scale(1); }
          50% { transform: translateX(2%) scale(1.03); }
          100% { transform: translateX(-3%) scale(1); }
        }

        @keyframes softReveal {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fabric-float {
          animation: fabricFloat 8s ease-in-out infinite;
        }

        .fabric-drift {
          animation: fabricDrift 12s ease-in-out infinite;
        }

        .soft-reveal {
          animation: softReveal 1s ease both;
        }

        .sowji-outline {
          background: linear-gradient(120deg, #b18b54, #ead5a9, #8b5c49);
          padding: 1px;
        }

        .sowji-card {
          transition: transform .5s ease, box-shadow .5s ease;
        }

        .sowji-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 45px rgba(75, 28, 46, .10);
        }

        @media (prefers-reduced-motion: reduce) {
          .fabric-float, .fabric-drift, .soft-reveal {
            animation: none;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="relative isolate min-h-[650px] overflow-hidden bg-[#401728] text-white md:min-h-[730px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#71364a] via-[#401728] to-[#240e1b]" />

        <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full border border-[#d5b77c]/10" />
        <div className="absolute -right-24 top-16 h-[450px] w-[450px] rounded-full border border-[#d5b77c]/10" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-5 px-6 py-16 md:min-h-[730px] md:grid-cols-2 md:px-12">
          <div className="soft-reveal relative z-10 py-10 text-center md:text-left">
            <p className="mb-6 text-[10px] uppercase tracking-[6px] text-[#dfc18b]">
              SOWJI COLLECTIONS
            </p>

            <h1 className="font-display text-5xl leading-[1.12] md:text-7xl">
              Elegance
              <span className="block italic text-[#e5c994]">
                in Every
              </span>
              <span className="block">Drape.</span>
            </h1>

            <div className="my-7 mx-auto h-px w-20 bg-[#d0ad72] md:mx-0" />

            <p className="mx-auto max-w-md text-sm leading-8 text-[#eadbd9] md:mx-0">
              Discover the beauty of sarees through timeless style,
              graceful details and the art of the perfect drape.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                to="/shop"
                className="bg-[#d1ae75] px-8 py-4 text-[10px] uppercase tracking-[2.5px] text-[#351321] transition duration-300 hover:bg-[#f2dfb8]"
              >
                Explore Sarees <span className="ml-3">↗</span>
              </Link>

              <Link
                to="/collections"
                className="border border-[#d8bd94]/70 px-8 py-4 text-[10px] uppercase tracking-[2.5px] text-white transition duration-300 hover:bg-white hover:text-[#401728]"
              >
                View Collections
              </Link>
            </div>

            <p className="mt-12 text-[9px] uppercase tracking-[4px] text-[#d9bd91]/75">
              The beauty of the Indian saree
            </p>
          </div>

          <div className="relative mx-auto h-[390px] w-full max-w-[500px] md:h-[590px]">
            <div className="fabric-float absolute inset-0">
              <FlowingFabric />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border border-[#d6b77e]/40 bg-[#401728]/35 text-center backdrop-blur-sm md:h-60 md:w-60">
                <span className="text-3xl text-[#e2c18b]">✧</span>
                <p className="mt-3 font-display text-3xl italic text-[#f0dfbf]">
                  Sowji
                </p>
                <p className="mt-2 text-[8px] uppercase tracking-[4px] text-[#e2c18b]">
                  Saree Collections
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d7b77d]/70 to-transparent" />
      </section>

      {/* INTRODUCTION */}
      <section className="relative px-6 py-20 text-center md:py-28">
        <div className="fabric-drift pointer-events-none absolute left-0 top-0 h-32 w-full opacity-20">
          <svg viewBox="0 0 1200 120" className="h-full w-full" preserveAspectRatio="none">
            <path d="M0 65 C250 0 400 130 650 55 S1000 0 1200 60" stroke="#b89555" strokeWidth="1.5" fill="none" />
            <path d="M0 85 C250 20 400 150 650 75 S1000 20 1200 80" stroke="#b89555" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <p className="mb-4 text-[10px] uppercase tracking-[5px] text-[#ad8954]">
          A WORLD OF SAREES
        </p>

        <h2 className="font-display text-3xl leading-snug text-[#541b30] md:text-5xl">
          A graceful tradition.
          <span className="block italic">An everlasting expression.</span>
        </h2>

        <div className="mx-auto my-6 h-px w-16 bg-[#b89555]" />

        <p className="mx-auto max-w-2xl text-sm leading-8 text-[#81746c]">
          Explore saree styles for celebrations, special occasions and
          everyday elegance. Find a drape that reflects your own style.
        </p>
      </section>

      {/* VERIFIED SAREE CATEGORIES */}
      {categories.length > 0 && (
        <section className="bg-[#f0e8dc] px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="THE SAREE EDIT"
              title="Explore Saree Collections"
              description="Browse the saree categories available in our collection."
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Link
                  key={category.slug || category.name || index}
                  to={`/category/${category.slug}`}
                  className="sowji-card group relative overflow-hidden border border-[#d9c8b1] bg-[#faf7f1] p-7 text-center md:p-10"
                >
                  <span className="mb-5 block text-2xl text-[#b89555]">
                    ✧
                  </span>

                  <h3 className="font-display text-xl text-[#541b30] md:text-2xl">
                    {category.name || category.title}
                  </h3>

                  <div className="mx-auto my-5 h-px w-10 bg-[#b89555] transition-all duration-500 group-hover:w-20" />

                  <span className="text-[9px] uppercase tracking-[2px] text-[#92785c]">
                    Explore Sarees ↗
                  </span>

                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#9c7548] transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDITORIAL BANNER */}
      <section className="relative overflow-hidden bg-[#4a192e] px-6 py-20 text-center text-white md:py-28">
        <div className="fabric-float pointer-events-none absolute -right-24 top-0 h-full w-1/2 opacity-30">
          <FlowingFabric />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-5 text-[10px] uppercase tracking-[5px] text-[#d9bd91]">
            THE SAREE EXPERIENCE
          </p>

          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Every drape has
            <span className="block italic text-[#e4c895]">
              its own story.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#eadbd9]">
            Discover saree styles that bring together personal expression
            and the enduring beauty of Indian attire.
          </p>

          <Link
            to="/shop"
            className="mt-9 inline-flex border border-[#d8bd94] px-9 py-4 text-[10px] uppercase tracking-[2px] text-[#f1dfbd] transition hover:bg-[#d8bd94] hover:text-[#401728]"
          >
            Explore the Saree Edit ↗
          </Link>
        </div>
      </section>

      {/* INSTAGRAM LOOKBOOK */}
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
            Visit our official Instagram to discover original Sowji
            saree photographs, new designs and collection updates.
          </p>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex bg-[#541b30] px-9 py-4 text-[10px] uppercase tracking-[2px] text-white transition hover:bg-[#8b4357]"
          >
            Discover Official Saree Lookbook ↗
          </a>
        </section>
      )}

      {/* CLOSING DETAIL */}
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
