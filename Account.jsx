
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './client.js';

const TOKEN = 'sowji_customer_token';

function notifyAuthChanged() {
  window.dispatchEvent(new Event('sowji-auth-changed'));
}

export default function Account() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const token = localStorage.getItem(TOKEN);

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const result = await api('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (active) {
          setUser(result.user);
        }
      } catch {
        localStorage.removeItem(TOKEN);
        notifyAuthChanged();
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (busy) return;

    setBusy(true);

    try {
      const register = mode === 'register';

      const result = await api(
        register ? '/auth/register' : '/auth/login',
        {
          method: 'POST',
          body: register
            ? form
            : {
                email: form.email,
                password: form.password
              }
        }
      );

      if (!result.token || !result.user) {
        throw new Error('Unexpected server response.');
      }

      localStorage.setItem(TOKEN, result.token);
      notifyAuthChanged();

      setUser(result.user);
      setForm({
        name: '',
        email: '',
        phone: '',
        password: ''
      });
      setMessage(result.message || 'Successfully signed in.');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN);
    notifyAuthChanged();

    setUser(null);
    setMode('login');
    setMessage('You have signed out.');
    setError('');
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] p-16 text-center">
        Loading account...
      </div>
    );
  }

  return (
    <section className="min-h-[75vh] bg-[#fbf8f2] px-5 py-16">
      <div className="mx-auto max-w-md border border-[#e8dfd2] bg-white p-8 shadow-sm">

        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#a17b48]">
          Sowji Collections
        </p>

        <h1 className="mt-4 text-center font-display text-4xl text-[#681f32]">
          {user ? 'My Account' : 'Welcome'}
        </h1>

        {message && (
          <p role="status" className="mt-5 bg-green-50 p-3 text-sm text-green-800">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {user ? (
          <div className="mt-8 space-y-5">

            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone}</p>

            <Link
              to="/shop"
              className="block bg-[#681f32] p-4 text-center text-white"
            >
              Explore Sarees
            </Link>

            <Link
              to="/cart"
              className="block border p-4 text-center"
            >
              My Shopping Bag
            </Link>

            <Link
              to="/wishlist"
              className="block border p-4 text-center"
            >
              My Wishlist
            </Link>

            <button
              onClick={logout}
              className="w-full p-3 text-sm underline"
            >
              Sign Out
            </button>

          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 border-b">

              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                  setMessage('');
                }}
                className={`p-3 ${
                  mode === 'login'
                    ? 'border-b-2 border-[#681f32] text-[#681f32]'
                    : ''
                }`}
              >
                Login
              </button>

              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                  setMessage('');
                }}
                className={`p-3 ${
                  mode === 'register'
                    ? 'border-b-2 border-[#681f32] text-[#681f32]'
                    : ''
                }`}
              >
                Register
              </button>

            </div>

            <form onSubmit={submit} className="mt-7 space-y-4">

              {mode === 'register' && (
                <>
                  <input
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Full name"
                    required
                    maxLength={80}
                    className="w-full border p-3"
                  />

                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update}
                    placeholder="Phone number"
                    required
                    maxLength={16}
                    className="w-full border p-3"
                  />
                </>
              )}

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="Email address"
                required
                className="w-full border p-3"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                placeholder={
                  mode === 'register'
                    ? 'Create password (8+ characters)'
                    : 'Password'
                }
                minLength={mode === 'register' ? 8 : 1}
                maxLength={72}
                required
                className="w-full border p-3"
              />

              <button
                disabled={busy}
                type="submit"
                className="w-full bg-[#681f32] p-4 text-xs uppercase tracking-widest text-white disabled:opacity-60"
              >
                {busy
                  ? 'Please wait...'
                  : mode === 'register'
                    ? 'Create Account'
                    : 'Sign In'}
              </button>

            </form>
          </>
        )}

      </div>
    </section>
  );
}
