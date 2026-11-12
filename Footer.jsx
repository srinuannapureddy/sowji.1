
import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP, INSTAGRAM } from './client.js';

const columns = [
  {
    title: 'Company',
    links: [
      ['/about', 'About Us'],
      ['/contact', 'Contact Us'],
      ['/support', 'Customer Support'],
      ['/faq', 'Frequently Asked Questions']
    ]
  },
  {
    title: 'Policies',
    links: [
      ['/shipping-policy', 'Shipping Policy'],
      ['/return-policy', 'Returns & Refunds'],
      ['/privacy-policy', 'Privacy Policy'],
      ['/terms', 'Terms & Conditions']
    ]
  }
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[#431321] text-[#fbf8f2]">

      {/* MAIN FOOTER */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

        {/* BRAND */}
        <div>
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-semibold tracking-[3px] text-[#fbf8f2]">
              SOWJI
            </span>
            <span className="mt-1 block text-xs tracking-[5px] text-[#c7a66b]">
              COLLECTIONS
            </span>
          </Link>

          <div className="my-5 h-px w-16 bg-[#b89555]" />

          <p className="font-display text-xl italic text-[#c7a66b]">
            Elegance Woven in Every Thread.
          </p>

          <p className="mt-4 max-w-xs text-sm leading-7 text-[#e8dcd5]">
            Discover timeless Indian sarees, thoughtfully selected to
            celebrate tradition, beauty and individuality.
          </p>
        </div>

        {/* COMPANY AND POLICY LINKS */}
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[2px] text-[#c7a66b]">
              {column.title}
            </h3>

            <ul className="space-y-3">
              {column.links.map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-[#e8dcd5] transition-colors hover:text-[#c7a66b]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* CONNECT */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[2px] text-[#c7a66b]">
            Connect With Us
          </h3>

          <div className="space-y-3">
            {INSTAGRAM && (
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#e8dcd5] transition-colors hover:text-[#c7a66b]"
              >
                Instagram ↗
              </a>
            )}

            {WHATSAPP && (
              <a
                href={`https://wa.me/${String(WHATSAPP).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#e8dcd5] transition-colors hover:text-[#c7a66b]"
              >
                WhatsApp ↗
              </a>
            )}
          </div>

          <div className="mt-6 border-t border-[#b89555]/30 pt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-[#c7a66b]">
              Secure Shopping
            </p>

            <p className="mt-2 text-xs leading-6 text-[#e8dcd5]">
              Secure payments through Razorpay, subject to your checkout
              configuration.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#b89555]/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#e8dcd5]/80">
            © {year} Sowji Collections. All rights reserved.
          </p>

          <p className="font-display text-sm italic text-[#c7a66b]">
            Tradition • Grace • Elegance
          </p>
        </div>
      </div>
    </footer>
  );
}
