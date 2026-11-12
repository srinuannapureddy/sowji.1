
import React from 'react';
import { Link } from 'react-router-dom';

export default function Account() {
  return (
    <main style={{
      minHeight: '70vh',
      background: '#faf7f1',
      padding: '75px 20px',
      color: '#38251f'
    }}>
      <div style={{
        maxWidth: '650px',
        margin: 'auto',
        textAlign: 'center',
        padding: '45px 25px',
        background: '#fffdf9',
        border: '1px solid #e8dcc9',
        borderRadius: '12px'
      }}>
        <p style={{
          color: '#a17b45',
          letterSpacing: '4px',
          fontSize: '12px'
        }}>
          SOWJI COLLECTIONS
        </p>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '38px',
          fontWeight: 'normal',
          margin: '20px 0'
        }}>
          My Account
        </h1>

        <p style={{ lineHeight: 1.8, color: '#786b60' }}>
          Welcome to Sowji Collections.
          Your personal shopping space for timeless
          traditional sarees.
        </p>

        <div style={{
          display: 'grid',
          gap: '14px',
          marginTop: '35px'
        }}>
          <Link className="btn-primary" to="/shop">
            Explore Sarees
          </Link>

          <Link className="btn-secondary" to="/wishlist">
            My Wishlist
          </Link>

          <Link className="btn-secondary" to="/cart">
            My Shopping Bag
          </Link>
        </div>
      </div>
    </main>
  );
}
