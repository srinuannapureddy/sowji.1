
import React from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';

import Home from './Home.jsx';
import Shop from './Shop.jsx';
import Collections from './Collections.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';

import Cart from './Cart.jsx';
import Wishlist from './Wishlist.jsx';
import ProductDetails from './ProductDetails.jsx';
import Account from './Account.jsx';
import Admin from './Admin.jsx';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#fbf8f2] px-5 py-20 text-center">
      <div>
        <h1 className="font-display text-5xl text-[#681f32]">
          404
        </h1>

        <p className="mt-4 text-[#81776e]">
          This page could not be found.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />

      {isAdminPage ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen flex-col bg-[#fbf8f2]">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <WhatsAppButton />
        </div>
      )}
    </>
  );
}
