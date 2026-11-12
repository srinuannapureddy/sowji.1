
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from './client.js';

export default function Collections() {
  return (
    <div className="min-h-screen bg-[#fbf8f2]">
      <section className="bg-[#681f32] px-5 py-16 text-center md:py-24">
        <p className="text-xs uppercase tracking-[5px] text-[#c7a66b]">
          Discover Sowji
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-6xl">
          Our Collections
        </h1>
        <div className="mx-auto my-5 h-px w-20 bg-[#c7a66b]" />
        <p className="mx-auto max-w-xl text-sm leading-7 text-[#f3e8e4]">
          Explore sarees for every celebration, every occasion and every
          beautiful moment.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#b89555]">
            Find Your Style
          </p>
          <h2 className="mt-3 font-display text-3xl text-[#681f32] md:text-4xl">
            Explore by Collection
          </h2>
          <div className="divider" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative flex min-h-52 items-end overflow-hidden border border-[#e5d8c7] bg-gradient-to-br from-[#eee5d9] via-[#f8f0e5] to-[#d9c5a8] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="absolute right-5 top-3 font-display text-7xl text-[#681f32]/10">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative">
                <p className="mb-2 text-xs uppercase tracking-[3px] text-[#9b7845]">
                  Sowji Collection
                </p>
                <h3 className="font-display text-2xl text-[#681f32]">
                  {category.name}
                </h3>
                <span className="mt-4 inline-block border-b border-[#b89555] pb-1 text-xs uppercase tracking-widest text-[#681f32] group-hover:text-[#9b7845]">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/shop" className="inline-block bg-[#681f32] px-9 py-4 text-xs uppercase tracking-[2px] text-white hover:bg-[#431321]">
            Shop All Sarees
          </Link>
        </div>
      </section>
    </div>
  );
}
