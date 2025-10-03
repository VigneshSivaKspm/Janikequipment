import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>{title}</h3>
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>{children}</div>
  </div>
);

const KeyValue = ({ k, v }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
    <div style={{ color: '#6b7280', fontWeight: 600 }}>{k}</div>
    <div style={{ color: '#111827', whiteSpace: 'pre-wrap' }}>{String(v)}</div>
  </div>
);

const renderObject = (obj) => {
  if (!obj) return null;
  return (
    <div>
      {Object.entries(obj).map(([k, v]) => (
        typeof v === 'object' && v !== null ? (
          <div key={k} style={{ marginBottom: 12 }}>
            <div style={{ color: '#374151', fontWeight: 700, marginBottom: 8 }}>{k}</div>
            <div style={{ paddingLeft: 12, borderLeft: '2px solid #e5e7eb' }}>
              {renderObject(v)}
            </div>
          </div>
        ) : (
          <KeyValue key={k} k={k} v={v} />
        )
      ))}
    </div>
  );
};

const priceBlock = (product) => {
  // Handle different price shapes across JSONs
  const p = product.price;
  const web = p && typeof p === 'object' ? p.web : undefined;
  const rec = p && typeof p === 'object' ? p.recommended : undefined;
  const sale = product.salePrice;
  const price = web || sale || p || product.price || product.salePrice;
  const original = rec || product.originalPrice;
  return (
    <div>
      {original && <div style={{ color: '#6b7280', textDecoration: 'line-through', marginBottom: 6 }}>{original}</div>}
      {price && <div style={{ color: '#e11d48', fontWeight: 800, fontSize: 28 }}>{price}</div>}
    </div>
  );
};

const ProductDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  const source = state?.source; // e.g., 'helmets', 'sportswear', etc.

  if (!product) {
    return (
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Produit introuvable</h1>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>Aucune donnée de produit n'a été fournie.</p>
        <button onClick={() => navigate(-1)} style={{ background: '#111827', color: '#fff', padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Retour</button>
      </section>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const name = product.name || product.title || 'Produit';
  const brand = product.brand || product.manufacturer || '';
  const [activeIdx, setActiveIdx] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const resolvedImages = useMemo(() => {
    return images.map((img) => (img && img.startsWith('/') ? img : `/assets/Product-images/${(source || 'Products')}/${img}`)).filter(Boolean);
  }, [images, source]);

  const hasImages = resolvedImages.length > 0;
  const prevImage = () => setActiveIdx((i) => (i - 1 + resolvedImages.length) % resolvedImages.length);
  const nextImage = () => setActiveIdx((i) => (i + 1) % resolvedImages.length);

  return (
    <section style={{ maxWidth: 1200, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: isDesktop ? '48px 24px' : '24px 16px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16, background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>← Retour</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isDesktop ? 24 : 16, overflow: 'hidden' }}>
        {/* Hero card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 24,
          }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: isDesktop ? 28 : 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '5fr 7fr' : '1fr', gap: isDesktop ? 24 : 16, alignItems: 'start' }}>
                {/* Gallery */}
                <div style={isDesktop ? { position: 'sticky', top: 88 } : { maxWidth: '100%' }}>
                  {/* Main image with arrows */}
                  <div style={{ position: 'relative', background: '#f9fafb', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    {hasImages ? (
                      <img
                        src={resolvedImages[activeIdx]}
                        alt={`${name}-${activeIdx}`}
                        style={{ width: '100%', height: isDesktop ? 520 : (isTablet ? 420 : 300), objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
                      <div style={{ padding: 24, color: '#6b7280', textAlign: 'center' }}>Aucune image disponible</div>
                    )}
                    {hasImages && resolvedImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          aria-label="Précédent"
                          style={{
                            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(17,24,39,0.6)', color: '#fff', border: 'none', borderRadius: '9999px',
                            width: 36, height: 36, cursor: 'pointer'
                          }}
                        >
                          ‹
                        </button>
                        <button
                          onClick={nextImage}
                          aria-label="Suivant"
                          style={{
                            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(17,24,39,0.6)', color: '#fff', border: 'none', borderRadius: '9999px',
                            width: 36, height: 36, cursor: 'pointer'
                          }}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {hasImages && (
                    <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(80px, 1fr))' : 'repeat(auto-fill, minmax(56px, 1fr))', gap: 8, marginTop: 12 }}>
                      {resolvedImages.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIdx(idx)}
                          aria-label={`Voir l'image ${idx + 1}`}
                          style={{
                            padding: 0,
                            background: '#fff',
                            border: idx === activeIdx ? '2px solid #2563eb' : '1px solid #e5e7eb',
                            borderRadius: 8,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            height: isDesktop ? 80 : 56,
                          }}
                        >
                          <img src={src} alt={`${name}-thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h1 style={{ fontSize: isDesktop ? 34 : 24, fontWeight: 900, marginBottom: 8, letterSpacing: -0.2, wordBreak: 'break-word' }}>{name}</h1>
                  {brand && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: '#eef2ff',
                        color: '#3730a3',
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase'
                      }}>{brand}</span>
                    </div>
                  )}
                  <div style={{ marginBottom: 18 }}>{priceBlock(product)}</div>

                  {/* quick meta */}
                  {product.sizes && Array.isArray(product.sizes) && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>Tailles</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {product.sizes.map((s, i) => (
                          <span key={i} style={{
                            padding: '6px 10px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            background: '#fff',
                            fontWeight: 600,
                            fontSize: 12,
                            color: '#374151'
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.color && (
                    <div style={{ marginBottom: 12 }}>
                      <strong>Couleur:</strong> <span style={{ color: '#374151' }}>{product.color}</span>
                    </div>
                  )}
                  {product.reviews && (
                    <div style={{ marginBottom: 12, color: '#374151' }}>Avis: {product.reviews}</div>
                  )}

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                    <button style={{
                      background: '#111827', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 18px', fontWeight: 700, cursor: 'pointer', width: isDesktop ? 'auto' : '100%',
                      boxShadow: '0 8px 18px rgba(17,24,39,0.15)'
                    }}>Ajouter au panier</button>
                    <button style={{
                      background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 18px', fontWeight: 600, cursor: 'pointer', width: isDesktop ? 'auto' : '100%'
                    }}>Ajouter à la liste de souhaits</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        {product.features && (
          <Section title="Caractéristiques">
            {renderObject(product.features)}
          </Section>
        )}
        {product.characteristics && (
          <Section title="Caractéristiques (techniques)">
            {renderObject(product.characteristics)}
          </Section>
        )}
        {/* Render remaining fields except known ones */}
        <Section title="Informations supplémentaires">
          {renderObject(Object.fromEntries(Object.entries(product).filter(([k]) => !['images','name','title','brand','manufacturer','features','characteristics','sizes','color','price','salePrice','originalPrice','reviews'].includes(k))))}
        </Section>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
