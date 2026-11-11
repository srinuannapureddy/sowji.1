import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductGrid from './ProductGrid.jsx';
import { CATEGORIES } from '../api/client.js';
export default function Shop() {
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const params = new URLSearchParams(sp);
  if (slug) params.set('category', slug);
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const title = cat ? cat.name : sp.get('q') ? `Results for “${sp.get('q')}”` : 'Shop All Sarees';
  return <ProductGrid eyebrow="Sowji Collections" title={title} query={params.toString()} />;
}
