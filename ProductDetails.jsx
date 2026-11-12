
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, money, INSTAGRAM } from './client.js';
import { useStore } from './store.jsx';

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart, toggleWish, wishlist = [] } = useStore();

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');
    setProduct(null);
    setQty(1);
    setSelectedColor('');
    setSelectedImage(0);

    api(`/products/${encodeURIComponent(slug)}`)
      .then(data => {
        if (!active) return;

        const found = data.item || data.product || data;

        if (!found || !found._id) {
          throw new Error('Product not found');
        }

        setProduct(found);
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Unable to load product.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const images = useMemo(
    () => (product?.images || []).filter(image => image?.url),
    [product]
  );

  const colors = useMemo(() => {
    if (!product) return [];

    const supplied = product.colors || product.colorVariants || [];

    const normalized = supplied
      .map(item => {
        if (typeof item === 'string') return item;
        return item?.name || item?.color || '';
      })
      .filter(Boolean);

    if (!normalized.length && product.color) {
      normalized.push(product.color);
    }

    return [...new Set(normalized)];
  }, [product]);

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

  const mainImage =
    images.find(image => image.isMain) || images[0];

  const activeImage = images[selectedImage] || mainImage;

  const hasPrice =
    product.price !== null &&
    product.price !== undefined &&
    product.price !== '' &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) > 0;

  const hasDiscount =
    hasPrice &&
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);

  const finalPrice = hasDiscount
    ? Number(product.discountPrice)
    : hasPrice
      ? Number(product.price)
      : null;

  const stockKnown =
    product.stock !== null &&
    product.stock !== undefined &&
    product.stock !== '' &&
    Number.isFinite(Number(product.stock));

  const out = stockKnown && Number(product.stock) <= 0;

  const wished = wishlist.some(
    item => item._id === product._id
  );

  const instagramUrl =
    product.instagramUrl?.startsWith('https://www.instagram.com/')
      ? product.instagramUrl
      : product.sourcePostUrl?.startsWith('https://www.instagram.com/')
        ? product.sourcePostUrl
        : INSTAGRAM;

  const maxQty = stockKnown
    ? Math.max(0, Number(product.stock))
    : 99;

  const increaseQty = () => {
    setQty(value => Math.min(maxQty, value + 1));
  };

  const handleAddToCart = () => {
    if (!hasPrice || out) return;

    addToCart(
      {
        ...product,
        price: finalPrice,
        selectedColor: selectedColor || product.color || ''
      },
      qty
    );
  };

  return (
    <section className="min-h-screen bg-[#fbf8f2] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/shop"
          className="text-xs uppercase tracking-widest text-[#92785c]"
        >
          ← Back to Shop
        </Link>

        <div className="mt-7 grid gap-10 md:grid-cols-2">

          {/* PRODUCT IMAGE GALLERY */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-[#f3ece1]">
              {activeImage?.url ? (
                <img
                  src={activeImage.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center font-display text-2xl text-[#681f32]">
                  Sowji Collections
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-[#681f32]'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">

            <p className="text-xs uppercase tracking-[3px] text-[#b89555]">
              {product.category || 'Sowji Collections'}
            </p>

            <h1 className="mt-3 font-display text-3xl text-[#681f32] sm:text-4xl">
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-3 text-xs text-[#92785c]">
                SKU: {product.sku}
              </p>
            )}

            {/* PRICE */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {hasDiscount && (
                <del className="text-lg text-gray-400">
                  {money(product.price)}
                </del>
              )}

              {hasPrice ? (
                <strong className="text-2xl text-[#681f32]">
                  {money(finalPrice)}
                </strong>
              ) : (
                <strong className="text-xl text-[#681f32]">
                  Contact for Price
                </strong>
              )}
            </div>

            <div className="my-6 h-px w-full bg-[#e5d8c7]" />

            <p className="leading-8 text-[#71675e]">
              {product.description ||
                'Discover this saree from Sowji Collections. Contact us for product details.'}
            </p>

            {/* PRODUCT DETAILS */}
            <div className="mt-7 grid grid-cols-2 gap-5 text-sm">
              {product.fabric && (
                <div>
                  <p className="text-xs text-[#92785c]">Fabric</p>
                  <p className="mt-1 text-[#681f32]">
                    {product.fabric}
                  </p>
                </div>
              )}

              {product.category && (
                <div>
                  <p className="text-xs text-[#92785c]">Collection</p>
                  <p className="mt-1 text-[#681f32]">
                    {product.category}
                  </p>
                </div>
              )}
            </div>

            {/* COLOUR OPTIONS */}
            {colors.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-[#681f32]">
                  Available Colours
                </p>

                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`border px-5 py-2 text-xs transition ${
                        selectedColor === color
                          ? 'border-[#681f32] bg-[#681f32] text-white'
                          : 'border-[#d9c8b1] bg-white text-[#681f32] hover:border-[#b89555]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STOCK STATUS */}
            <p className={`mt-7 text-sm ${
              out ? 'text-red-700' : 'text-green-800'
            }`}>
              {out
                ? 'Currently unavailable'
                : stockKnown
                  ? `${product.stock} available`
                  : 'Availability: Please enquire'}
            </p>

            {/* QUANTITY */}
            {hasPrice && !out && (
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm text-[#681f32]">
                  Quantity
                </span>

                <div className="flex items-center border border-[#dfcfb9] bg-white">
                  <button
                    type="button"
                    onClick={() => setQty(value => Math.max(1, value - 1))}
                    className="px-4 py-2"
                  >
                    −
                  </button>

                  <span className="min-w-8 text-center">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQty}
                    disabled={qty >= maxQty}
                    className="px-4 py-2 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-7 flex flex-wrap gap-3">
              {hasPrice ? (
                <button
                  type="button"
                  disabled={out}
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#681f32] px-5 py-4 text-xs uppercase tracking-widest text-white transition hover:bg-[#431321] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {out ? 'Unavailable' : 'Add to Cart'}
                </button>
              ) : (
                <a
                  href={instagramUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#681f32] px-5 py-4 text-center text-xs uppercase tracking-widest text-white transition hover:bg-[#431321]"
                >
                  Enquire for Price
                </a>
              )}

              <button
                type="button"
                onClick={() => toggleWish(product)}
                className="border border-[#b89555] px-5 py-4 text-xs uppercase tracking-widest text-[#681f32]"
              >
                {wished ? '♥ Wishlisted' : '♡ Wishlist'}
              </button>
            </div>

            <p className="mt-5 text-xs leading-6 text-[#92785c]">
              Sowji Collections — discover sarees for your special moments.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
