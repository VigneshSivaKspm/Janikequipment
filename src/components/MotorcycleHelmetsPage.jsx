
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

const MotorcycleHelmetsPage = ({ variant = 'grid' }) => {
  const [helmets, setHelmets] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetch("/Product-details/Motorcycle_Helmet.json")
      .then((res) => res.json())
      .then((data) => setHelmets(data.helmets));
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive grid: 3 cards per row on desktop, 2 on tablet, 1 on mobile
  let columns = 3;
  if (windowWidth < 900) columns = 2;
  if (windowWidth < 600) columns = 1;

  const isCarousel = variant === 'carousel';
  const containerStyle = isCarousel
    ? {
        display: 'flex',
        overflowX: 'auto',
        gap: '32px',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 24px',
        scrollbarWidth: 'thin',
      }
    : {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 24px',
      };
  const cardStyle = isCarousel
    ? {
        minWidth: 320,
        maxWidth: 340,
        flex: '0 0 auto',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 16,
        background: '#fff',
        padding: 32,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s',
        minHeight: 420,
      }
    : {
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 16,
        background: '#fff',
        padding: 32,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s',
        minHeight: 420,
      };

  return (
    <div style={{ width: '100%', background: '#f7f8fa', padding: '48px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#222' }}>Motorcycle Helmets</h2>
      <div style={containerStyle}>
        {helmets.map((helmet, idx) => {
          const firstImage = helmet && helmet.images && helmet.images.length > 0 ? helmet.images[0] : null;
          const imgSrc = firstImage
            ? (firstImage.startsWith('/')
                ? firstImage
                : `/assets/Product-images/Motorcycle-Helmets/${firstImage}`)
            : null;
          return (
          <div key={idx} className="helmet-card" style={cardStyle}>
            {imgSrc && (
              <Link to="/product" state={{ product: helmet, source: 'Motorcycle-Helmets' }}>
                <img
                  src={imgSrc}
                  style={{ width: '100%', maxWidth: 200, height: 180, objectFit: 'contain', marginBottom: 18, borderRadius: 12, background: '#f3f3f3' }}
                />
              </Link>
            )}
            <h3 style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 22, color: '#222' }}>{helmet.name}</h3>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8, color: '#27ae60' }}>{helmet.features && helmet.features["Modèle casque"]}</div>
            {(() => {
              const p = helmet.price;
              let current = null;
              let original = null;
              if (p && typeof p === 'object') {
                current = p.web ?? p.recommended ?? null;
                original = p.recommended ?? null;
              } else if (p != null) {
                current = p;
              }
              return (
                <>
                  {original && (
                    <div style={{ color: '#888', fontSize: 14, marginBottom: 4, textDecoration: 'line-through' }}>Prix Conseillé : {original}</div>
                  )}
                  {current && (
                    <div style={{ color: '#e53935', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>{current}</div>
                  )}
                </>
              );
            })()}
            <Link
              to="/product"
              state={{ product: helmet, source: 'Motorcycle-Helmets' }}
              style={{
                display: 'inline-block',
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer',
                marginTop: 'auto',
                boxShadow: '0 2px 8px rgba(39,174,96,0.08)',
                textDecoration: 'none',
              }}
            >
              VOIR LE PRODUIT
            </Link>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default MotorcycleHelmetsPage;
