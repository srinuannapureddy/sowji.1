import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { api, CATEGORIES, INSTAGRAM } from '../api/client.js';
const promo = [['Wedding Collection', 'Bridal grandeur', '/category/bridal-sarees'], ['Festive Collection', 'Luminous festive edit', '/shop?occasion=Festive'], ['New Arrivals', 'Just unveiled', '/shop?sort=newest']];
const seasons = [['Wedding Season', '/shop?occasion=Wedding'], ['Festive Edit', '/shop?occasion=Festive'], ['Summer Collection', '/shop?occasion=Summer'], ['Traditional Heritage', '/shop?occasion=Traditional'], ['Party Wear', '/category/party-wear-sarees'], ['Everyday Elegance', '/category/daily-wear-sarees']];
const prices = [['Under ₹1,000', 0, 1000], ['₹1,000 – ₹2,000', 1000, 2000], ['₹2,000 – ₹4,000', 2000, 4000], ['₹4,000 – ₹6,000', 4000, 6000], ['₹6,000 – ₹10,000', 6000, 10000], ['₹10,000 and above', 10000, '']];
const Head = ({ a, b }) => <div className="mb-8 text-center"><p className="font-promo text-lg tracking-widest text-gold">{a}</p><h2 className="text-3xl">{b}</h2><div className="divider" /></div>;
export default function Home() {
  const [cats, setCats] = useState(CATEGORIES);
  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api('/categories').then((d) => d.items?.length && setCats(d.items)).catch(() => {});
    api('/reviews?featured=true').then((d) => setReviews(d.items || [])).catch(() => {});
  }, []);
  const subscribe = async (e) => {
    e.preventDefault();
    try { await api('/newsletter', { method: 'POST', body: { email } }); setMsg('Welcome to the Sowji Circle!'); setEmail(''); }
    catch (err) { setMsg(err.message); }
  };
  return (
    <>
      <section className="bg-gradient-to-r from-wine to-[#3d1019] text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center md:py-28">
          <p className="font-promo text-xl tracking-[0.3em] text-gold">SOWJI COLLECTIONS</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl !text-ivory md:text-6xl">The Art of Timeless Elegance</h1><div className="divider" />
          <p className="mx-auto max-w-xl text-sm text-ivory/80">Discover exquisite sarees crafted to celebrate tradition, beauty and individuality.</p>
          <div className="mt-8 flex justify-center gap-4"><Link to="/collections" className="btn-gold !text-gold">Explore Collections</Link><Link to="/shop" className="btn bg-gold text-wine hover:bg-ivory">Shop Now</Link></div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {promo.map(([t, s, to]) => (
          <Link key={t} to={to} className="flex h-48 flex-col items-center justify-center border border-gold bg-beige text-center transition-colors hover:bg-wine hover:text-ivory">
            <span className="font-promo text-lg text-gold">{s}</span><span className="font-display text-2xl">{t}</span><span className="mt-2 text-xs uppercase tracking-widest">Explore Now →</span>
          </Link>))}
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <Head a="FABRIC CURATIONS" b="Shop by Material" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cats.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="group text-center">
              <div className="aspect-square overflow-hidden rounded-t-full border border-gold bg-beige">
                {c.image && <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
              </div>
              <p className="mt-2 font-display text-sm text-wine">{c.name}</p>
            </Link>))}
        </div>
      </section>
      <ProductGrid eyebrow="MOST COVETED" title="Best Sellers" query="bestSeller=true&limit=8" viewAllTo="/shop?bestSeller=true" viewAllLabel="View All Best Sellers" />
      <section className="bg-wine py-16 text-center"><p className="font-promo text-xl tracking-widest text-gold">CURATED EXCELLENCE FOR YOUR SPECIAL DAY</p>
        <h2 className="mt-2 text-4xl !text-ivory">The Bridal Trousseau</h2><Link to="/category/bridal-sarees" className="btn-gold mt-6 !text-gold">Shop Bridal</Link></section>
      <ProductGrid eyebrow="JUST IN" title="Recently Unveiled" query="sort=newest&limit=8" viewAllTo="/shop?sort=newest" viewAllLabel="View All New Arrivals" />
      <section className="bg-beige py-12"><div className="mx-auto max-w-7xl px-4"><Head a="SEASONAL EDITS" b="Seasonal Collections" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{seasons.map(([t, to]) => <Link key={t} to={to} className="flex h-36 items-center justify-center border border-gold bg-ivory font-display text-xl text-wine hover:bg-wine hover:text-ivory">{t}</Link>)}</div>
      </div></section>
      <section className="mx-auto max-w-7xl px-4 py-12"><Head a="BROWSE BY VALUE" b="Shop by Price" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {prices.map(([l, min, max]) => <Link key={l} to={`/shop?minPrice=${min}${max ? `&maxPrice=${max}` : ''}`} className="border border-gold py-6 text-center text-sm hover:bg-wine hover:text-ivory">{l}</Link>)}
        </div>
      </section>
      {INSTAGRAM && <section className="py-8 text-center"><h2 className="text-3xl">Follow Us on Instagram</h2><div className="divider" /><a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-wine">Follow</a></section>}
      {reviews.length > 0 && (
        <section className="bg-beige py-12"><div className="mx-auto max-w-5xl px-4"><h2 className="mb-8 text-center text-3xl">Words of Appreciation</h2>
          <div className="grid gap-4 md:grid-cols-3">{reviews.map((r) => (
            <blockquote key={r._id} className="bg-ivory p-5 text-sm"><p className="text-gold">{'★'.repeat(r.rating)}</p><p className="my-2">“{r.comment}”</p>
              <footer className="text-xs">{r.displayName}{r.verifiedPurchase && <span className="ml-2 text-green-800">✔ Verified Purchase</span>}</footer></blockquote>))}</div>
        </div></section>)}
      <section className="py-16 text-center"><h2 className="text-3xl">Join the Sowji Circle</h2><div className="divider" />
        <p className="mb-5 text-sm">New collections, exclusive offers, festive launches and special announcements.</p>
        <form onSubmit={subscribe} className="mx-auto flex max-w-md flex-col gap-2 px-4 sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 border border-gold px-4 py-3 text-sm" />
          <button className="btn-wine">Subscribe</button></form>
        {msg && <p className="mt-3 text-sm text-wine">{msg}</p>}
      </section>
    </>
  );
}
