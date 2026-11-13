
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

  async function loadDashboard() {
    setError('');

    try {
      const [productData, orderData] = await Promise.all([
        api('/products/admin/all', { headers: authHeaders() }),
        api('/orders', { headers: authHeaders() })
      ]);

      setProducts(productData.items || []);
      setOrders(orderData.orders || []);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard information.');
    }
  }

  useEffect(() => {
    let active = true;

    async function checkAccount() {
      const savedToken = token();

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const result = await api('/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });

        if (active) setUser(result.user);
      } catch {
        localStorage.removeItem(TOKEN);
      } finally {
        if (active) setLoading(false);
      }
    }

    checkAccount();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') loadDashboard();
  }, [user]);

  async function activateAdmin(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const result = await api('/auth/promote-admin', {
        method: 'POST',
        headers: {
          ...authHeaders(),
          'x-admin-bootstrap-key': bootstrapKey
        }
      });

      if (!result.token || !result.user) {
        throw new Error('Unexpected administrator response.');
      }

      localStorage.setItem(TOKEN, result.token);
      setUser(result.user);
      setBootstrapKey('');
      setMessage('Administrator account activated.');
    } catch (err) {
      setError(err.message || 'Administrator activation failed.');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN);
    setUser(null);
    setProducts([]);
    setOrders([]);
    window.location.hash = '#/account';
  }

  function updateProductField(e) {
    const { name, value, type, checked } = e.target;

    setProductForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function updateImage(index, value) {
    setProductForm(current => ({
      ...current,
      imageUrls: current.imageUrls.map((url, i) =>
        i === index ? value : url
      )
    }));
  }

  function addImageField() {
    setProductForm(current => ({
      ...current,
      imageUrls: [...current.imageUrls, '']
    }));
  }

  function removeImageField(index) {
    setProductForm(current => {
      const next = current.imageUrls.filter((_, i) => i !== index);

      return {
        ...current,
        imageUrls: next.length ? next : [''],
        mainImage: Math.min(current.mainImage, Math.max(0, next.length - 1))
      };
    });
  }

  function startAddProduct() {
    setEditingId(null);
    setProductForm({
      ...emptyProduct,
      imageUrls: ['']
    });
    setShowForm(true);
    setError('');
    setMessage('');
  }

  function startEditProduct(product) {
    const images = (product.images || []).map(image => image.url).filter(Boolean);

    const mainIndex = Math.max(
      0,
      (product.images || []).findIndex(image => image.isMain)
    );

    setEditingId(product._id);

    setProductForm({
      name: product.name || '',
      category: product.category || CATEGORIES[0],
      sku: product.sku || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      stock: product.stock ?? '',
      fabric: product.fabric || '',
      weaveType: product.weaveType || '',
      blousePiece: product.blousePiece || '',
      blouseIncluded: Boolean(product.blouseIncluded),
      color: product.color || '',
      occasion: product.occasion || '',
      careInstructions: product.careInstructions || '',
      description: product.description || '',
      imageUrls: images.length ? images : [''],
      mainImage: Math.min(mainIndex, Math.max(0, images.length - 1)),
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival)
    });

    setShowForm(true);
    setError('');
    setMessage('');
  }

  function validateProduct() {
    const name = productForm.name.trim();
    const sku = productForm.sku.trim();

    if (!name || !sku || !productForm.category.trim()) {
      throw new Error('Please enter the product name, category and unique SKU.');
    }

    if (productForm.price === '' || !Number.isFinite(Number(productForm.price)) || Number(productForm.price) <= 0) {
      throw new Error('Please enter a valid product price greater than zero.');
    }

    if (
      productForm.discountPrice !== '' &&
      (
        !Number.isFinite(Number(productForm.discountPrice)) ||
        Number(productForm.discountPrice) < 0 ||
        Number(productForm.discountPrice) >= Number(productForm.price)
      )
    ) {
      throw new Error('Discount price must be less than the regular price.');
    }

    if (
      productForm.stock === '' ||
      !Number.isInteger(Number(productForm.stock)) ||
      Number(productForm.stock) < 0
    ) {
      throw new Error('Enter a valid stock quantity (zero or more).');
    }

    const images = productForm.imageUrls
      .map(url => url.trim())
      .filter(Boolean);

    for (const url of images) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') {
          throw new Error();
        }
      } catch {
        throw new Error('Every photograph must use a valid HTTPS image URL.');
      }
    }

    if (images.length && productForm.mainImage >= images.length) {
      throw new Error('Please select a main product photograph.');
    }

    return images;
  }

  async function saveProduct(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const images = validateProduct();

      const slug = productForm.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const payload = {
        name: productForm.name.trim(),
        slug,
        category: productForm.category.trim(),
        sku: productForm.sku.trim(),
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice === ''
          ? null
          : Number(productForm.discountPrice),
        stock: Number(productForm.stock),
        fabric: productForm.fabric.trim(),
        weaveType: productForm.weaveType.trim(),
        blousePiece: productForm.blousePiece.trim(),
        blouseIncluded: Boolean(productForm.blouseIncluded),
        color: productForm.color.trim(),
        occasion: productForm.occasion.trim(),
        careInstructions: productForm.careInstructions.trim(),
        description: productForm.description.trim(),
        images: images.map((url, index) => ({
          url,
          isMain: index === productForm.mainImage
        })),
        isBestSeller: Boolean(productForm.isBestSeller),
        isNewArrival: Boolean(productForm.isNewArrival)
      };

      if (editingId) {
        await api(`/products/${editingId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: payload
        });

        setMessage('Product details updated.');
      } else {
        await api('/products', {
          method: 'POST',
          headers: authHeaders(),
          body: payload
        });

        setMessage('Product saved as an unpublished draft.');
      }

      setShowForm(false);
      setProductForm(emptyProduct);
      setEditingId(null);
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Could not save product.');
    } finally {
      setBusy(false);
    }
  }

  async function publishProduct(product) {
    if (!product.images?.some(image => image.url?.trim())) {
      setError('Add an authentic product photograph before publishing.');
      return;
    }

    if (!window.confirm(`Verify and publish "${product.name}"? Only do this after checking its authenticity and details.`)) {
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    try {
      await api(`/products/${product._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: {
          isVerified: true,
          isPublished: true
        }
      });

      setMessage('Product verified and published.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Could not publish product.');
    } finally {
      setBusy(false);
    }
  }

  async function unpublishProduct(product) {
    setBusy(true);
    setError('');

    try {
      await api(`/products/${product._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: { isPublished: false }
      });

      setMessage('Product unpublished.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Could not unpublish product.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Permanently delete "${product.name}"?`)) return;

    setBusy(true);
    setError('');

    try {
      await api(`/products/${product._id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });

      setMessage('Product deleted.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Could not delete product.');
    } finally {
      setBusy(false);
    }
  }

  async function updateOrder(orderId, status) {
    setBusy(true);
    setError('');

    try {
      await api(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: { status }
      });

      setMessage('Order status updated.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Could not update order.');
    } finally {
      setBusy(false);
    }
  }

  const publishedCount = products.filter(
    product => product.isPublished && product.isVerified
  ).length;

  const pendingCount = orders.filter(
    order => order.status === 'Placed'
  ).length;

  const totalSales = orders
    .filter(order => !['Cancelled', 'Returned'].includes(order.status))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const filteredProducts = products.filter(product => {
    const query = search.toLowerCase();

    return (
      (product.name || '').toLowerCase().includes(query) ||
      (product.sku || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f1] p-12 text-center">
        Loading administrator access...
      </div>
    );
  }

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#faf7f1] px-5 py-16">
        <div className="w-full max-w-md border border-[#e8dfd2] bg-white p-8 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[4px] text-[#b89555]">
            Sowji Collections
          </p>
          <h1 className="mt-5 font-display text-4xl text-[#541b30]">
            Admin Access
          </h1>
          <p className="mt-4 text-sm text-[#81746c]">
            Please sign in to your authorised account before opening the dashboard.
          </p>
          <Link
            to="/account"
            className="mt-7 block bg-[#541b30] p-4 text-xs uppercase tracking-widest text-white"
          >
            Sign in to your account
          </Link>
        </div>
      </section>
    );
  }

  if (user.role !== 'admin') {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#faf7f1] px-5 py-16">
        <div className="w-full max-w-md border border-[#e8dfd2] bg-white p-8 shadow-sm">
          <p className="text-center text-xs uppercase tracking-[4px] text-[#b89555]">
            Private administrator setup
          </p>
          <h1 className="mt-5 text-center font-display text-3xl text-[#541b30]">
            Activate Admin Account
          </h1>

          <p className="mt-4 text-center text-sm text-[#81746c]">
            Signed in as {user.email}
          </p>

          {user.email?.toLowerCase() !== ADMIN_EMAIL && (
            <p className="mt-5 bg-red-50 p-3 text-sm text-red-700">
              This account is not the authorised administrator email.
            </p>
          )}

          {error && (
            <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={activateAdmin} className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-wider text-[#541b30]">
              One-time setup key
              <input
                type="password"
                value={bootstrapKey}
                onChange={e => setBootstrapKey(e.target.value)}
                required
                autoComplete="off"
                placeholder="Enter your private setup key"
                className="mt-2 w-full border border-[#e8dfd2] p-3"
              />
            </label>

            <button
              disabled={busy || user.email?.toLowerCase() !== ADMIN_EMAIL}
              className="w-full bg-[#541b30] p-4 text-xs uppercase tracking-widest text-white disabled:opacity-50"
            >
              {busy ? 'Activating...' : 'Activate administrator'}
            </button>
          </form>

          <p className="mt-4 text-xs text-[#81746c]">
            Never share your setup key or save it in website code.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e9] text-[#292522]">
      <header className="border-b border-[#e8dfd2] bg-[#351321] px-5 py-5 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[4px] text-[#e5c994]">
              Sowji Collections
            </p>
            <h1 className="mt-1 font-display text-2xl text-white md:text-3xl">
              Administration
            </h1>
          </div>
          <div className="text-right">
            <p className="hidden text-xs text-[#e5d8d2] sm:block">{user.email}</p>
            <button onClick={logout} className="mt-1 text-xs text-[#e5c994] underline">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 md:px-8">
        <div className="mb-7 flex flex-wrap gap-2">
          {[
            ['overview', 'Overview'],
            ['orders', 'Orders'],
            ['products', 'Saree Collection']
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setShowForm(false);
                setError('');
                setMessage('');
              }}
              className={`px-5 py-3 text-xs uppercase tracking-wider ${
                tab === key
                  ? 'bg-[#541b30] text-white'
                  : 'border border-[#dfd2c2] bg-white text-[#541b30]'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={loadDashboard}
            disabled={busy}
            className="ml-auto border border-[#b89555] px-4 py-3 text-xs text-[#541b30]"
          >
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="mb-5 border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {message}
          </div>
        )}

        {tab === 'overview' && (
          <>
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[3px] text-[#b89555]">
                Store overview
              </p>
              <h2 className="mt-2 font-display text-3xl text-[#541b30]">
                Welcome back, {user.name}
              </h2>
              <p className="mt-2 text-sm text-[#81746c]">
                Here's what's happening with your store.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Total Orders', orders.length],
                ['New Orders', pendingCount],
                ['Total Sarees', products.length],
                ['Published Sarees', publishedCount]
              ].map(([label, value]) => (
                <div key={label} className="border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-[#81746c]">{label}</p>
                  <p className="mt-3 font-display text-4xl text-[#541b30]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Panel title="Order value">
                <p className="font-display text-4xl text-[#541b30]">
                  {money(totalSales)}
                </p>
                <p className="mt-2 text-xs text-[#81746c]">
                  Value of non-cancelled and non-returned orders. This is not a profit calculation.
                </p>
              </Panel>

              <Panel title="Quick actions">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setTab('orders')}
                    className="bg-[#541b30] p-4 text-xs uppercase tracking-wider text-white"
                  >
                    View customer orders
                  </button>
                  <button
                    onClick={() => {
                      setTab('products');
                      startAddProduct();
                    }}
                    className="border border-[#b89555] p-4 text-xs uppercase tracking-wider text-[#541b30]"
                  >
                    Add a saree
                  </button>
                </div>
              </Panel>
            </div>

            <div className="mt-5">
              <Panel title="Recent orders">
                {orders.length === 0 ? (
                  <p className="text-sm">No customer orders have been received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead className="border-b text-xs uppercase tracking-wider text-[#81746c]">
                        <tr>
                          <th className="p-3">Order</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order._id} className="border-b border-[#eee5d9]">
                            <td className="p-3">{order.orderNumber}</td>
                            <td className="p-3">{order.customer?.name}</td>
                            <td className="p-3">{money(order.total)}</td>
                            <td className="p-3">{order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <Panel title="Customer orders">
            {orders.length === 0 ? (
              <p className="text-sm">No orders yet. New customer orders will appear here.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <article key={order._id} className="border border-[#eee5d9] p-4 md:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#541b30]">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-[#81746c]">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="font-display text-xl text-[#541b30]">
                        {money(order.total)}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <p><b>Customer:</b> {order.customer?.name}</p>
                        <p><b>Email:</b> {order.customer?.email}</p>
                        <p><b>Phone:</b> {order.customer?.phone}</p>
                      </div>
                      <div>
                        <p><b>Payment:</b> {order.paymentMethod} / {order.paymentStatus}</p>
                        <p><b>Delivery:</b> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        <p><b>Postal code:</b> {order.shippingAddress?.postalCode}</p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#eee5d9] pt-3">
                      <p className="mb-2 text-xs uppercase tracking-wider text-[#81746c]">
                        Items ordered
                      </p>
                      {(order.items || []).map((item, index) => (
                        <div key={index} className="flex justify-between gap-3 py-1 text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{money(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="text-xs uppercase tracking-wider text-[#81746c]">
                        Update status
                      </label>
                      <select
                        value={order.status}
                        disabled={busy}
                        onChange={e => updateOrder(order._id, e.target.value)}
                        className="border border-[#dfd2c2] bg-white px-3 py-2 text-sm"
                      >
                        {STATUSES.map(status => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Panel>
        )}

        {tab === 'products' && (
          <Panel
            title="Saree collection"
            action={
              <button
                onClick={startAddProduct}
                className="bg-[#541b30] px-4 py-3 text-xs uppercase tracking-wider text-white"
              >
                + Add saree
              </button>
            }
          >
            {showForm && (
              <form onSubmit={saveProduct} className="mb-7 border border-[#dfd2c2] bg-[#faf7f1] p-5">
                <h3 className="mb-5 font-display text-2xl text-[#541b30]">
                  {editingId ? 'Edit saree details' : 'Add a new saree'}
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Product name *" name="name" value={productForm.name} onChange={updateProductField} required />
                  <Field label="Unique SKU *" name="sku" value={productForm.sku} onChange={updateProductField} required />

                  <label className="block text-xs text-[#541b30]">
                    Category *
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={updateProductField}
                      required
                      className="mt-1 w-full border border-[#dfd2c2] bg-white p-3 text-sm"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>

                  <Field label="Fabric" name="fabric" value={productForm.fabric} onChange={updateProductField} />
                  <Field label="Weave type" name="weaveType" value={productForm.weaveType} onChange={updateProductField} />
                  <Field label="Colour" name="color" value={productForm.color} onChange={updateProductField} />
                  <Field label="Blouse piece details" name="blousePiece" value={productForm.blousePiece} onChange={updateProductField} />
                  <Field label="Occasion" name="occasion" value={productForm.occasion} onChange={updateProductField} />

                  <Field label="Price (₹) *" name="price" value={productForm.price} onChange={updateProductField} type="number" min="0.01" step="0.01" required />
                  <Field label="Discount price (₹)" name="discountPrice" value={productForm.discountPrice} onChange={updateProductField} type="number" min="0" step="0.01" />
                  <Field label="Stock quantity *" name="stock" value={productForm.stock} onChange={updateProductField} type="number" min="0" step="1" required />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 text-sm text-[#541b30]">
                    <input
                      type="checkbox"
                      name="blouseIncluded"
                      checked={productForm.blouseIncluded}
                      onChange={updateProductField}
                    />
                    Blouse piece included
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#541b30]">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={productForm.isBestSeller}
                      onChange={updateProductField}
                    />
                    Mark as bestseller
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#541b30]">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={productForm.isNewArrival}
                      onChange={updateProductField}
                    />
                    Mark as new arrival
                  </label>
                </div>

                <label className="mt-5 block text-xs text-[#541b30]">
                  Care instructions
                  <textarea
                    name="careInstructions"
                    value={productForm.careInstructions}
                    onChange={updateProductField}
                    rows="2"
                    placeholder="Example: Dry clean only"
                    className="mt-1 w-full border border-[#dfd2c2] bg-white p-3 text-sm"
                  />
                </label>

                <label className="mt-4 block text-xs text-[#541b30]">
                  Product description
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={updateProductField}
                    rows="4"
                    className="mt-1 w-full border border-[#dfd2c2] bg-white p-3 text-sm"
                  />
                </label>

                <div className="mt-6 border-t border-[#dfd2c2] pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-display text-xl text-[#541b30]">Product photographs</h4>
                      <p className="mt-1 text-xs text-[#81746c]">
                        Add HTTPS image links to genuine, authorised Sowji saree photographs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="border border-[#b89555] px-4 py-2 text-xs text-[#541b30]"
                    >
                      + Add image
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {productForm.imageUrls.map((url, index) => (
                      <div key={index} className="border border-[#e8dfd2] bg-white p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs text-[#541b30]">
                            Photograph {index + 1}
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 text-xs text-[#541b30]">
                              <input
                                type="radio"
                                name="mainImage"
                                checked={productForm.mainImage === index}
                                onChange={() => setProductForm(current => ({
                                  ...current,
                                  mainImage: index
                                }))}
                              />
                              Main image
                            </label>
                            {productForm.imageUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="text-xs text-red-700 underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        <input
                          type="url"
                          value={url}
                          onChange={e => updateImage(index, e.target.value)}
                          placeholder="https://..."
                          className="mt-2 w-full border border-[#dfd2c2] p-3 text-sm"
                        />

                        {url.trim().startsWith('https://') && (
                          <div className="mt-3">
                            <img
                              src={url.trim()}
                              alt={`Saree photograph ${index + 1} preview`}
                              className="h-36 w-28 border border-[#e8dfd2] object-cover"
                              onError={e => {
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={e => {
                                e.currentTarget.style.display = 'block';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-xs text-[#81746c]">
                  New products are saved as unpublished drafts. Check every image and product detail for authenticity before verifying and publishing. This form stores image URLs; it does not upload image files.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    disabled={busy}
                    className="bg-[#541b30] px-6 py-3 text-xs uppercase tracking-wider text-white disabled:opacity-50"
                  >
                    {busy ? 'Saving...' : 'Save product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setProductForm(emptyProduct);
                    }}
                    className="border border-[#dfd2c2] px-6 py-3 text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mb-5">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sarees by name, SKU or category..."
                className="w-full border border-[#dfd2c2] bg-white p-3 text-sm"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-sm">
                {products.length === 0
                  ? 'No products are in the database yet. You can add your first saree above.'
                  : 'No matching sarees found.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-wider text-[#81746c]">
                    <tr>
                      <th className="p-3">Saree</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product._id} className="border-b border-[#eee5d9]">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {product.images?.[0]?.url && (
                              <img
                                src={product.images.find(image => image.isMain)?.url || product.images[0].url}
                                alt={product.name}
                                className="h-14 w-12 object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-[#541b30]">{product.name}</p>
                              <p className="text-xs text-[#81746c]">{product.category}</p>
                              <p className="text-xs text-[#81746c]">
                                {(product.images || []).length} image(s)
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{product.sku}</td>
                        <td className="p-3">
                          {product.price == null ? 'Not set' : money(product.price)}
                        </td>
                        <td className="p-3">{product.stock ?? 'Not set'}</td>
                        <td className="p-3">
                          {product.isPublished && product.isVerified ? 'Published' : 'Draft'}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => startEditProduct(product)}
                              className="text-xs text-[#8b6534] underline"
                            >
                              Edit
                            </button>
                            {product.isPublished && product.isVerified ? (
                              <button
                                disabled={busy}
                                onClick={() => unpublishProduct(product)}
                                className="text-xs text-[#541b30] underline"
                              >
                                Unpublish
                              </button>
                            ) : (
                              <button
                                disabled={busy}
                                onClick={() => publishProduct(product)}
                                className="text-xs text-green-800 underline"
                              >
                                Verify & publish
                              </button>
                            )}
                            <button
                              disabled={busy}
                              onClick={() => deleteProduct(product)}
                              className="text-xs text-red-700 underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        )}

        <p className="mt-8 text-center text-xs text-[#81746c]">
          Sowji Collections · Private Store Administration
        </p>
      </div>
    </div>
  );
}
