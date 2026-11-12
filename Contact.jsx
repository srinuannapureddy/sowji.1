
import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP, INSTAGRAM } from './client.js';

export default function Contact() {
  const whatsapp = String(WHATSAPP).replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-[#fbf8f2]">
      <section className="bg-[#681f32] px-5 py-16 text-center md:py-24">
        <p className="text-xs uppercase tracking-[5px] text-[#c7a66b]">
          We Are Here to Help
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-6xl">
          Contact Us
        </h1>
        <div className="mx-auto my-5 h-px w-20 bg-[#c7a66b]" />
        <p className="mx-auto max-w-xl text-sm leading-7 text-[#f3e8e4]">
          Have a question about a saree or your order? We'd love to hear
          from you.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-[#e5d8c7] bg-white p-8">
            <span className="text-3xl text-[#b89555]">✉</span>
            <h2 className="mt-4 font-display text-2xl text-[#681f32]">
              Customer Enquiries
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#81776e]">
              Contact us about product details, availability, orders and
              general questions.
            </p>

            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello Sowji Collections, I have an enquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-[#681f32] px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-[#431321]"
              >
                Chat on WhatsApp
              </a>
            ) : (
              <p className="mt-5 text-sm text-[#9b7845]">
                WhatsApp contact details will be added soon.
              </p>
            )}
          </div>

          <div className="border border-[#e5d8c7] bg-white p-8">
            <span className="text-3xl text-[#b89555]">♡</span>
            <h2 className="mt-4 font-display text-2xl text-[#681f32]">
              Follow Our Collections
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#81776e]">
              Follow us for new arrivals, collection updates and saree
              inspiration.
            </p>

            {INSTAGRAM ? (
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block border border-[#b89555] px-6 py-3 text-xs uppercase tracking-widest text-[#681f32] hover:bg-[#681f32] hover:text-white"
              >
                Visit Instagram
              </a>
            ) : (
              <p className="mt-5 text-sm text-[#9b7845]">
                Instagram details will be added soon.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 bg-[#f1e8dc] p-8 text-center">
          <h2 className="font-display text-2xl text-[#681f32]">
            Looking for something beautiful?
          </h2>
          <p className="mt-3 text-sm text-[#81776e]">
            Explore our saree collections and find your favourite style.
          </p>
          <Link to="/collections" className="mt-6 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-[#431321]">
            Browse Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
