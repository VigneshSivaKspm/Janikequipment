import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

const SparePartsAccessoriesPage = ({ variant = 'grid' }) => {
  const [products, setProducts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Keep path convention consistent with existing pages
    fetch("/Product-details/Spare_parts-Accessories.json")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));

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
      <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#222' }}>Pièces détachées & accessoires</h2>
      <div style={containerStyle}>
        {products.map((product, idx) => {
          const firstImage = product && product.images && product.images.length > 0 ? product.images[0] : null;
          // If the JSON has just filenames, prefix with the public assets path.
          // If it already starts with '/', treat it as a web-root path.
          const imgSrc = firstImage
            ? (firstImage.startsWith('/')
                ? firstImage
                : `/assets/Product-images/Spare Parts & Accessories/${firstImage}`)
            : null;
          return (
          <div key={idx} className="spareparts-card" style={cardStyle}>
            {imgSrc && (
              <Link to="/product" state={{ product, source: 'Spare Parts & Accessories' }}>
                <img
                  src={imgSrc}
                  alt={product.name}
                  style={{ width: '100%', maxWidth: 200, height: 180, objectFit: 'contain', marginBottom: 18, borderRadius: 12, background: '#f3f3f3' }}
                />
              </Link>
            )}
            <h3 style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 22, color: '#222' }}>{product.name}</h3>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8, color: '#27ae60' }}>{product.characteristics && (product.characteristics.type || product.characteristics.material)}</div>
            <div style={{ marginBottom: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: '#ffd700', fontSize: 18 }}>★</span>
              ))}
              <span style={{ marginLeft: 6, color: '#444', fontSize: 14 }}>({product.reviews || 0} avis)</span>
            </div>
            {product.original_price && (
              <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>Prix Conseillé : {product.original_price}</div>
            )}
            <div style={{ color: '#e53935', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>{product.price}</div>
            <Link
              to="/product"
              state={{ product, source: 'Spare Parts & Accessories' }}
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

export default SparePartsAccessoriesPage;
