
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, money } from './client.js';
import { useStore } from './store.jsx';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  const { addToCart, toggleWish, wishlist = [] } = useStore();

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');
    setProduct(null);
    setQty(1);

    api(`/products/${encodeURIComponent(slug)}`)
      .then((data) => {
        if (!active) return;

        const found = data.item || data.product || data;
        if (!found || !found._id) {
          throw new Error('Product not found');
        }

        setProduct(found);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load product.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#fbf8f2] p-20 text-center text-[#681f32]">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] bg-[#fbf8f2] px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-[#681f32]">
          Product Not Found
        </h1>
        <p className="mt-3 text-sm text-[#81776e]">
          {error || 'This product is unavailable.'}
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage =
    images.find((image) => image.isMain) || images[0];

  const price =
    product.discountPrice &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const wished = wishlist.some((item) => item._id === product._id);
  const out = Number(product.stock) <= 0;

  return (
    <section className="min-h-screen bg-[#fbf8f2] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="text-xs uppercase tracking-widest text-[#92785c]">
          ← Back to Shop
        </Link>

        <div className="mt-7 grid gap-10 md:grid-cols-2">
          <div className="aspect-[3/4] overflow-hidden bg-[#f3ece1]">
            {mainImage?.url ? (
              <img
                src={mainImage.url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-2xl text-[#681f32]">
                Sowji Collections
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[3px] text-[#b89555]">
              {product.category}
            </p>

            <h1 className="mt-3 font-display text-3xl text-[#681f32] sm:text-4xl">
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-3 text-xs text-[#92785c]">
                SKU: {product.sku}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              {price < product.price && (
                <del className="text-lg text-gray-400">
                  {money(product.price)}
                </del>
              )}
              <strong className="text-2xl text-[#681f32]">
                {money(price)}
              </strong>
            </div>

            <p className="mt-6 leading-7 text-[#71675e]">
              {product.description || 'Discover this beautiful saree from Sowji Collections.'}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {product.fabric && (
                <div>
                  <p className="text-xs text-[#92785c]">Fabric</p>
                  <p className="mt-1 text-[#681f32]">{product.fabric}</p>
                </div>
              )}
              {product.color && (
                <div>
                  <p className="text-xs text-[#92785c]">Colour</p>
                  <p className="mt-1 text-[#681f32]">{product.color}</p>
                </div>
              )}
            </div>

            <p className={`mt-6 text-sm ${out ? 'text-red-700' : 'text-green-800'}`}>
              {out ? 'Currently unavailable' : `${product.stock} available`}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-[#681f32]">Quantity</span>
              <div className="flex items-center border border-[#dfcfb9] bg-white">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="px-4 py-2"
                >
                  −
                </button>
                <span className="min-w-8 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((value) =>
                      Math.min(Number(product.stock), value + 1)
                    )
                  }
                  disabled={qty >= Number(product.stock)}
                  className="px-4 py-2 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={out}
                onClick={() => addToCart({ ...product, price }, qty)}
                className="flex-1 bg-[#681f32] px-5 py-4 text-xs uppercase tracking-widest text-white disabled:opacity-40"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWish(product)}
                className="border border-[#b89555] px-5 py-4 text-xs uppercase tracking-widest text-[#681f32]"
              >
                {wished ? '♥ Wishlisted' : '♡ Wishlist'}
              </button>
            </div>

            <p className="mt-5 text-xs text-[#92785c]">
              A timeless addition to your wardrobe from Sowji Collections.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
