const BASE = import.meta.env.VITE_API_URL || '';
export async function api(path, opts = {}) {
  const res = await fetch(BASE + '/api' + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Request failed');
  return res.json();
}
export const money = (n) => '₹' + Number(n).toLocaleString('en-IN');
export const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '';
export const INSTAGRAM = import.meta.env.VITE_INSTAGRAM_URL || '';
export const CATEGORIES = [
  'Kanchipuram Silk Sarees','Banarasi Sarees','Cotton Sarees','Organza Sarees','Linen Sarees','Mysore Silk Sarees',
  'Mangalagiri Sarees','Venkatagiri Sarees','Designer Sarees','Bridal Sarees','Party Wear Sarees','Daily Wear Sarees'
].map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }));
