
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import Home from './Home.jsx';
import Shop from './Shop.jsx';

function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#fbf8f2] px-5 py-20">
      <div className="max-w-xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[5px] text-[#b89555]">
          Sowji Collections
        </p>

        <h1 className="font-display text-5xl text-[#681f32]">
          404
        </h1>

        <div className="mx-auto my-5 h-px w-16 bg-[#b89555]" />

        <h2 className="font-display text-2xl text-[#681f32]">
          This page is not available
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#81776e]">
          The page you are looking for may have moved or may not exist.
          Explore our collections to discover something beautiful.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex bg-[#681f32] px-8 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-[#431321]"
        >
          Return to Home
        </Link>
      </div>
    </section>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <div className="flex min-h-screen flex-col bg-[#fbf8f2]">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:slug" element={<Shop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>

      <WhatsAppButton />
    </>
  );
}
