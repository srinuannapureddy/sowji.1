import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP, INSTAGRAM } from './client.js';
const col = (t, items) => (
  <div><h3 className="mb-3 text-lg !text-gold">{t}</h3>
    {items.map(([to, l]) => <Link key={l} to={to} className="block py-1 text-sm text-ivory/80 hover:text-gold">{l}</Link>)}</div>
);
export default function Footer() {
  return (
    <footer className="mt-12 bg-wine text-ivory">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div><img src="/logo.svg" alt="Sowji Collections" className="h-16 rounded bg-ivory p-1" /><p className="mt-3 font-promo text-xl text-gold">Elegance Woven in Every Thread.</p></div>
        {col('Company', [['/about', 'About Us'], ['/contact', 'Contact Us'], ['/support', 'Customer Support'], ['/faq', 'FAQ']])}
        {col('Policies', [['/shipping-policy', 'Shipping Policy'], ['/return-policy', 'Return and Refund Policy'], ['/privacy-policy', 'Privacy Policy'], ['/terms', 'Terms and Conditions']])}
        <div><h3 className="mb-3 text-lg !text-gold">Connect</h3>
          {INSTAGRAM && <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="block py-1 text-sm">Instagram</a>}
          {WHATSAPP && <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="block py-1 text-sm">WhatsApp</a>}
          <p className="mt-3 text-xs text-ivory/70">Secure payments by Razorpay: UPI, cards, net banking, wallets.</p></div>
      </div>
      <p className="border-t border-gold/30 py-4 text-center text-xs">© {new Date().getFullYear()} Sowji Collections. All rights reserved.</p>
    </footer>
  );
}
