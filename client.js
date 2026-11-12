
const BASE = (
  import.meta.env.VITE_API_URL ||
  'https://sowji-backend.onrender.com'
).replace(/\/+$/, '');

export async function api(path, opts = {}) {
  const url = `${BASE}/api${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    ...(opts.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...opts.headers
  };

  const options = {
    method: opts.method || 'GET',
    credentials: 'include',
    ...opts,
    headers
  };

  if (opts.body !== undefined) {
    options.body =
      opts.body instanceof FormData
        ? opts.body
        : JSON.stringify(opts.body);
  } else {
    delete options.body;
  }

  const response = await fetch(url, options);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const money = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const WHATSAPP =
  import.meta.env.VITE_WHATSAPP_NUMBER || '';

export const INSTAGRAM =
  import.meta.env.VITE_INSTAGRAM_URL || '';

export const CATEGORIES = [
  'Kanchipuram Silk Sarees',
  'Banarasi Sarees',
  'Cotton Sarees',
  'Organza Sarees',
  'Linen Sarees',
  'Mysore Silk Sarees',
  'Mangalagiri Sarees',
  'Venkatagiri Sarees',
  'Designer Sarees',
  'Bridal Sarees',
  'Party Wear Sarees',
  'Daily Wear Sarees'
].map((name) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-')
}));
