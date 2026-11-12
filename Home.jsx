
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid.jsx';
import { api, CATEGORIES, INSTAGRAM } from './client.js';

const promo = [
  {
    title: 'Wedding Collection',
    subtitle: 'For your most beautiful moments',
    link: '/category/bridal-sarees',
    number: '01'
  },
  {
    title: 'Festive Collection',
    subtitle: 'Celebrate in timeless elegance',
    link: '/shop?occasion=Festive',
    number: '02'
  },
  {
    title: 'New Arrivals',
    subtitle: 'Discover the latest designs',
    link: '/shop?sort=newest',
    number: '03'
  }
];

const seasons = [
  ['Wedding Season', '/shop?occasion=Wedding'],
  ['Festive Edit', '/shop?occasion=Festive'],
  ['Summer Collection', '/shop?occasion=Summer'],
  ['Traditional Heritage', '/shop?occasion=Traditional'],
  ['Party Wear', '/category/party-wear-sarees'],
  ['Everyday Elegance', '/category/daily-wear-sarees']
];

const prices = [
  ['Under ₹1,000', 0, 1000],
  ['₹1,000 – ₹2,000', 1000, 2000],
  ['₹2,000 – ₹4,000', 2000, 4000],
  ['₹4,000 – ₹6,000', 4000, 6000],
  ['₹6,000 – ₹10,000', 6000, 10000],
  ['₹10,000 and above', 10000, '']
];

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="mx-auto mb-9 max-w-2xl text-center">
    <p className="mb-2 text-xs font-medium uppercase tracking-[4px] text-[#b89555]">
      {eyebrow}
    </p>
    <h2 className="font-display text-3xl text-[#681f32] md:text-4xl">
      {title}
    </h2>
    <div className="mx-auto my-4 h-px w-16 bg-[#b89555]" />
    {description && (
      <p className="text-sm text-[#81776e]">{description}</p>
    )}
  </div>
);

export default function Home() {
  const [cats, setCats] = useState(CATEGORIES || []);
  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api('/categories')
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length) {
          setCats(data.items);
        }
      })
      .catch(() => {});

    api('/reviews?featured=true')
      .then((data) => {
        setReviews(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {});
  }, []);

  const subscribe = async (e) => {
    e.preventDefault();
    setMsg('');
    setSubmitting(true);

    try {
      await api('/newsletter', {
        method: 'POST',
        body: { email }
      });

      setMsg('Welcome to the Sowji Circle!');
      setEmail('');
    } catch (err) {
      setMsg(err.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[#fbf8f2]">

      {/* HERO */}
      <section className="relative bg-[#4a1727] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d283b] via-[#4a1727] to-[#29101a]" />

        <div className="relative mx-auto grid min-h-[480px] max-w-7xl items-center gap-8 px-5 py-20 md:grid-cols-2 md:px-10 md:py-24">

          <div className="text-center md:text-left">
            <p className="mb-5 text-xs tracking-[5px] text-[#d5b777]">
              SOWJI COLLECTIONS
            </p>

            <h1 className="font-display text-4xl leading-tight text-white md:text-6xl">
              The Art of
              <span className="block italic text-[#dfc38e]">
                Timeless Elegance
              </span>
            </h1>

            <div className="my-6 h-px w-20 bg-[#c6a15e] mx-auto md:mx-0" />

            <p className="mx-auto max-w-lg text-sm leading-8 text-[#eee1d9] md:mx-0">
              Discover exquisite sarees crafted to celebrate tradition,
              beauty and individuality. Every weave tells a story.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to="/collections"
                className="inline-flex items-center justify-center bg-[#c5a268] px-7 py-3 text-xs font-medium uppercase tracking-[2px] text-[#351321] transition hover:bg-white"
              >
                Explore Collections
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center border border-[#d8bc8d] px-7 py-3 text-xs font-medium uppercase tracking-[2px] text-white transition hover:bg-white hover:text-[#4a1727]"
              >
                Shop Now
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="relative border border-[#c5a268] p-3">
              <div className="flex min-h-[300px] flex-col items-center justify-center bg-gradient-to-br from-[#8b4c55] via-[#5c2739] to-[#2e1522] px-5 text-center md:min-h-[370px]">
                <span className="mb-5 text-5xl text-[#dfc38e]">✦</span>
                <p className="font-display text-3xl italic text-white md:text-4xl">
                  Woven with Love
                </p>
                <div className="my-5 h-px w-16 bg-[#c5a268]" />
                <p className="text-xs uppercase tracking-[4px] text-[#dfc38e]">
                  Tradition · Beauty · Grace
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOTIONAL COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="DISCOVER SOWJI"
          title="Collections to Cherish"
          description="Find the perfect drape for every occasion."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {promo.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden border border-[#dfcfb9] bg-[#f1e8dc] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[3px] text-[#b89555]">
                  COLLECTION {item.number}
                </span>
                <span className="text-2xl text-[#b89555]">✦</span>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[2px] text-[#92785c]">
                  {item.subtitle}
                </p>
                <h3 className="font-display text-2xl text-[#681f32]">
                  {item.title}
                </h3>
                <span className="mt-4 inline-block text-xs uppercase tracking-[2px] text-[#681f32] group-hover:text-[#b89555]">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="FABRIC CURATIONS"
            title="Shop by Material"
            description="Explore timeless fabrics and traditional craftsmanship."
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
            {cats.map((category, index) => (
              <Link
                key={category.slug || category.name || index}
                to={`/category/${category.slug}`}
                className="group text-center"
              >
                <div className="aspect-[4/5] overflow-hidden border border-[#e9dfd2] bg-[#f3ece1]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#f3e8dc] to-[#e8d6c2] p-3">
                      <span className="mb-3 text-3xl text-[#b89555]">✦</span>
                      <span className="font-display text-center text-lg text-[#681f32]">
                        {category.name}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="mt-3 font-display text-base text-[#681f32] transition group-hover:text-[#b89555]">
                  {category.name}
                </h3>
                <span className="mt-1 block text-[10px] uppercase tracking-[2px] text-[#92785c]">
                  Discover →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-16 md:py-20">
        <ProductGrid
          eyebrow="MOST COVETED"
          title="Best Sellers"
          query="bestSeller=true&limit=8"
          viewAllTo="/shop?bestSeller=true"
          viewAllLabel="View All Best Sellers"
        />
      </section>

      {/* BRIDAL BANNER */}
      <section className="bg-[#431321] px-5 py-16 text-center md:py-24">
        <p className="mb-4 text-xs tracking-[4px] text-[#d4b77e]">
          CURATED EXCELLENCE FOR YOUR SPECIAL DAY
        </p>

        <h2 className="font-display text-4xl text-white md:text-5xl">
          The Bridal Trousseau
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#e8d8d0]">
          Celebrate your special moments with exquisite sarees
          inspired by timeless Indian traditions.
        </p>

        <Link
          to="/category/bridal-sarees"
          className="mt-8 inline-flex border border-[#d4b77e] px-8 py-3 text-xs uppercase tracking-[2px] text-[#e2c996] transition hover:bg-[#d4b77e] hover:text-[#431321]"
        >
          Discover Bridal Collection
        </Link>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 md:py-20">
        <ProductGrid
          eyebrow="JUST IN"
          title="Recently Unveiled"
          query="sort=newest&limit=8"
          viewAllTo="/shop?sort=newest"
          viewAllLabel="View All New Arrivals"
        />
      </section>

      {/* SEASONAL COLLECTIONS */}
      <section className="bg-[#f1e9de] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="SEASONAL EDITS"
            title="Collections for Every Occasion"
            description="A beautiful drape for every celebration and everyday moment."
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {seasons.map(([name, link], index) => (
              <Link
                key={name}
                to={link}
                className="group flex min-h-[105px] items-center justify-between border border-[#dfcfb9] bg-[#fbf8f2] px-6 py-5 transition hover:border-[#681f32] hover:bg-[#681f32]"
              >
                <div>
                  <span className="mb-1 block text-[10px] tracking-[2px] text-[#b89555]">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-xl text-[#681f32] transition group-hover:text-white">
                    {name}
                  </h3>
                </div>
                <span className="text-xl text-[#b89555]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="BROWSE BY VALUE"
          title="Find Your Perfect Saree"
          description="Explore our collections by your preferred price range."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {prices.map(([label, min, max]) => (
            <Link
              key={label}
              to={`/shop?minPrice=${min}${max ? `&maxPrice=${max}` : ''}`}
              className="flex min-h-[90px] items-center justify-center border border-[#dfcfb9] bg-white px-3 text-center text-sm text-[#681f32] transition hover:border-[#681f32] hover:bg-[#681f32] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      {INSTAGRAM && (
        <section className="border-y border-[#e9dfd2] bg-white px-5 py-12 text-center">
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[#b89555]">
            STAY CONNECTED
          </p>
          <h2 className="font-display text-3xl text-[#681f32]">
            Follow Our Journey
          </h2>
          <p className="mt-3 text-sm text-[#81776e]">
            Discover our latest collections and inspirations.
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex bg-[#681f32] px-8 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-[#431321]"
          >
            Follow on Instagram
          </a>
        </section>
      )}

      {/* CUSTOMER REVIEWS */}
      {reviews.length > 0 && (
        <section className="bg-[#f1e9de] py-16">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              eyebrow="CUSTOMER STORIES"
              title="Words of Appreciation"
              description="Experiences shared by our customers."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="border border-[#e5d8c8] bg-[#fbf8f2] p-6"
                >
                  <p className="text-lg tracking-widest text-[#b89555]">
                    {'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                  </p>

                  <p className="my-4 text-sm leading-7 text-[#5d5149]">
                    “{review.comment}”
                  </p>

                  <div className="border-t border-[#e5d8c8] pt-4">
                    <p className="font-display text-base text-[#681f32]">
                      {review.displayName}
                    </p>
                    {review.verifiedPurchase && (
                      <span className="mt-1 inline-block text-xs text-green-800">
                        ✔ Verified Purchase
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="bg-[#fbf8f2] px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl border border-[#dfcfb9] bg-white px-5 py-10 text-center md:px-12 md:py-14">
          <p className="mb-3 text-xs uppercase tracking-[4px] text-[#b89555]">
            A LITTLE SOMETHING SPECIAL
          </p>

          <h2 className="font-display text-3xl text-[#681f32] md:text-4xl">
            Join the Sowji Circle
          </h2>

          <div className="mx-auto my-5 h-px w-16 bg-[#b89555]" />

          <p className="mx-auto mb-7 max-w-lg text-sm leading-7 text-[#81776e]">
            Be the first to discover new collections, exclusive offers,
            festive launches and special announcements.
          </p>

          <form
            onSubmit={subscribe}
            className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 border border-[#dfcfb9] px-4 py-3 text-sm outline-none focus:border-[#681f32]"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#681f32] px-7 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-[#431321] disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : 'Subscribe'}
            </button>
          </form>

          {msg && (
            <p className="mt-4 text-sm text-[#681f32]" role="status">
              {msg}
            </p>
          )}
        </div>
      </section>

    </main>
  );
}
