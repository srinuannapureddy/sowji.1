
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from './client.js';

const TOKEN = 'sowji_customer_token';
const ADMIN_EMAIL = 'akshathacgowda.75@gmail.com';

const STATUSES = [
  'Placed', 'Confirmed', 'Processing',
  'Shipped', 'Delivered', 'Cancelled', 'Returned'
];

const CATEGORIES = [
  'Kanchipuram Silk Sarees',
  'Banarasi Sarees',
  'Cotton Sarees',
  'Organza Sarees',
  'Designer Sarees',
  'Party Wear Sarees'
];

const emptyProduct = {
  name: '',
  category: 'Kanchipuram Silk Sarees',
  sku: '',
  price: '',
  discountPrice: '',
  stock: '',
  fabric: '',
  weaveType: '',
  blousePiece: '',
  blouseIncluded: false,
  color: '',
  occasion: '',
  careInstructions: '',
  description: '',
  imageUrls: [''],
  mainImage: 0,
  isBestSeller: false,
  isNewArrival: false
};

function Panel({ title, children, action }) {
  return (
    <section className="border border-[#e8dfd2] bg-white p-5 shadow-sm md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-[#541b30]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, min, step, placeholder }) {
  return (
    <label className="block text-xs text-[#541b30]">
      {label}
      <input
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        placeholder={placeholder || ''}
        className="mt-1 w-full border border-[#dfd2c2] bg-white p-3 text-sm"
      />
    </label>
  );
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [bootstrapKey, setBootstrapKey] = useState('');

  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const token = () => localStorage.getItem(TOKEN);

  const authHeaders = () => ({
    Authorization: `Bearer ${token()}`
  });
