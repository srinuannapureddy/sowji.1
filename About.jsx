
import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#fbf8f2]">
      <section className="bg-[#681f32] px-5 py-20 text-center md:py-28">
        <p className="text-xs uppercase tracking-[5px] text-[#c7a66b]">
          The Story of Sowji
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-6xl">
          About Us
        </h1>
        <div className="mx-auto my-5 h-px w-20 bg-[#c7a66b]" />
        <p className="mx-auto max-w-2xl text-sm leading-7 text-[#f3e8e4]">
          Celebrating the beauty of Indian sarees and the elegance of
          timeless tradition.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="flex min-h-80 items-center justify-center bg-gradient-to-br from-[#eee5d9] to-[#d8c3a5] p-10 text-center">
          <div>
            <p className="font-display text-5xl text-[#681f32]">SOWJI</p>
            <p className="mt-3 text-xs tracking-[5px] text-[#9b7845]">
              COLLECTIONS
            </p>
            <div className="mx-auto my-5 h-px w-16 bg-[#b89555]" />
            <p className="font-display text-xl italic text-[#681f32]">
              Elegance in Every Thread
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[4px] text-[#b89555]">
            Our Story
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-[#681f32] md:text-4xl">
            Tradition Meets Timeless Elegance
          </h2>

          <p className="mt-6 text-sm leading-8 text-[#6f655d]">
            Welcome to Sowji Collections, a destination for discovering
            the beauty and grace of Indian sarees.
          </p>

          <p className="mt-4 text-sm leading-8 text-[#6f655d]">
            From traditional silk sarees to elegant everyday styles, our
            collection is designed to help you find something special for
            celebrations, meaningful occasions and everyday moments.
          </p>

          <p className="mt-4 text-sm leading-8 text-[#6f655d]">
            We believe every saree tells a story. Our aim is to make
            discovering that perfect saree a delightful experience.
          </p>

          <Link to="/collections" className="mt-8 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-[#431321]">
            Explore Our Collections
          </Link>
        </div>
      </section>

      <section className="bg-[#f1e8dc] px-6 py-16 text-center">
        <h2 className="font-display text-3xl text-[#681f32]">
          Tradition. Beauty. Individuality.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6f655d]">
          Discover a collection that celebrates the elegance of every
          occasion.
        </p>
      </section>
    </div>
  ); 
}
