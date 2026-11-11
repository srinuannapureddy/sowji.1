
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import Home from './Home.jsx';
import Shop from './Shop.jsx';

const Soon = () => (
  <div className="mx-auto max-w-3xl px-4 py-24 text-center">
    <h1 className="text-3xl">Coming in the next build stage</h1>
    <div className="divider" />
    <Link to="/" className="btn-wine">Back to Home</Link>
  </div>
);

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="*" element={<Soon />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
