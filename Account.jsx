
import React, { useState } from 'react';

export default function Account() {
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    alert(
      'Account authentication is not connected yet. Please contact the store for assistance.'
    );
  }

  return (
    <section className="min-h-[75vh] bg-[#fbf8f2] px-5 py-16">
      <div className="mx-auto max-w-md">
        <div className="border border-[#e8dfd2] bg-white p-8 shadow-sm">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-[#a17b48]">
            Sowji Collections
          </p>

          <h1 className="mt-4 text-center font-display text-4xl text-[#681f32]">
            My Account
          </h1>

          <p className="mt-3 text-center text-sm text-[#81776e]">
            Welcome to the world of timeless elegance.
          </p>

          <div className="mt-8 grid grid-cols-2 border-b border-[#e8dfd2]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-3 text-xs uppercase tracking-widest ${
                mode === 'login'
                  ? 'border-b-2 border-[#681f32] text-[#681f32]'
                  : 'text-[#81776e]'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-3 text-xs uppercase tracking-widest ${
                mode === 'register'
                  ? 'border-b-2 border-[#681f32] text-[#681f32]'
                  : 'text-[#81776e]'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {mode === 'register' && (
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Full name"
                required
                className="w-full border border-[#e8dfd2] px-4 py-3 text-sm outline-none focus:border-[#681f32]"
              />
            )}

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="Email address"
              required
              className="w-full border border-[#e8dfd2] px-4 py-3 text-sm outline-none focus:border-[#681f32]"
            />

            {mode === 'register' && (
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                placeholder="Phone number"
                required
                className="w-full border border-[#e8dfd2] px-4 py-3 text-sm outline-none focus:border-[#681f32]"
              />
            )}

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="Password"
              required
              minLength={6}
              className="w-full border border-[#e8dfd2] px-4 py-3 text-sm outline-none focus:border-[#681f32]"
            />

            <button
              type="submit"
              className="w-full bg-[#681f32] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#4f1726]"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-6 text-[#81776e]">
            Your Sowji Collections shopping experience begins here.
          </p>
        </div>
      </div>
    </section>
  );
}
