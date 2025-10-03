import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

// Helpers to localize display without touching JSON
const translateName = (name) => {
  if (!name) return name;
  return name
    .replace(/Women's/gi, 'Femme')
    .replace(/Men's/gi, 'Homme')
    .replace(/Lady/gi, 'Femme')
    .replace(/Jacket/gi, 'Blouson')
    .replace(/Gloves?/gi, 'Gants')
    .replace(/Black/gi, 'Noir')
    .replace(/White/gi, 'Blanc')
    .replace(/Red/gi, 'Rouge')
    .replace(/Blue/gi, 'Bleu')
    .replace(/Navy/gi, 'Navy')
    .replace(/Brown/gi, 'Marron');
};

const translateValue = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/Summer\s*\/\s*Mid-season/gi, 'Été / Mi-saison')
    .replace(/All seasons/gi, 'Toutes saisons')
    .replace(/Summer/gi, 'Été')
    .replace(/Leather/gi, 'Cuir')
    .replace(/Textile/gi, 'Textile')
    .replace(/Man/gi, 'Homme')
    .replace(/Women/gi, 'Femme')
    .replace(/Male/gi, 'Homme')
    .replace(/Female/gi, 'Femme')
    .replace(/Black/gi, 'Noir')
    .replace(/White/gi, 'Blanc')
    .replace(/Red/gi, 'Rouge')
    .replace(/Blue/gi, 'Bleu')
    .replace(/Fuchsia/gi, 'Fuchsia')
    .replace(/Urban/gi, 'Urbain')
    .replace(/Racing/gi, 'Racing')
    .replace(/Roadster\/?Sport/gi, 'Roadster/Sport')
    .replace(/Predisposed back/gi, 'Prédisposé(e) dorsale')
    .replace(/Trouser\/jacket connection/gi, 'Raccord pantalon/veste')
    .replace(/Fixed lining/gi, 'Doublure fixe')
    .replace(/Waterproof/gi, 'Imperméable')
    .replace(/Removable Lining/gi, 'Doublure Amovible')
    .replace(/CE Elbow Protections/gi, 'Protections CE Coudes')
    .replace(/CE Shoulder Protections/gi, 'Protections CE Epaules')
    .replace(/Guarantee/gi, 'Garantie')
    .replace(/Jacket approval/gi, 'Homologation blouson \/ veste')
    .replace(/Gloves approval/gi, 'Homologation gants')
    .replace(/Motorcycle gloves/gi, 'Gants moto');
};

const getFeature = (features, frKey, enKey) => {
  if (!features) return undefined;
  const v = features[frKey] ?? features[enKey];
  return translateValue(v);
};
const BikerEquipmentsPage = ({ variant = 'grid' }) => {
  const [equipments, setEquipments] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetch("/Product-details/Biker_Equipments.json")
      .then((res) => res.json())
      .then((data) => setEquipments(data.biker_equipment));
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
      <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#222' }}>Équipements motard</h2>
      <div style={containerStyle}>
        {equipments.map((equipment, idx) => {
          const firstImage = equipment && equipment.images && equipment.images.length > 0 ? equipment.images[0] : null;
          const imgSrc = firstImage
            ? (firstImage.startsWith('/')
                ? firstImage
                : `/assets/Product-images/Biker-equipments/${firstImage}`)
            : null;
          return (
          <div key={idx} className="equipment-card" style={cardStyle}>
            {imgSrc && (
              <Link to="/product" state={{ product: equipment, source: 'Biker-equipments' }}>
                <img
                  src={imgSrc}
                  alt={equipment.name}
                  style={{ width: '100%', maxWidth: 200, height: 180, objectFit: 'contain', marginBottom: 18, borderRadius: 12, background: '#f3f3f3' }}
                />
              </Link>
            )}
            <h3 style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 22, color: '#222' }}>{translateName(equipment.name)}</h3>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8, color: '#27ae60' }}>{getFeature(equipment.features, "Type de produit", "Product type")}</div>
            <div style={{ marginBottom: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: '#ffd700', fontSize: 18 }}>★</span>
              ))}
              <span style={{ marginLeft: 6, color: '#444', fontSize: 14 }}>(8 avis)</span>
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>Prix Conseillé : {equipment.price}</div>
            <div style={{ color: '#e53935', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>{equipment.price}</div>
            <Link
              to="/product"
              state={{ product: equipment, source: 'Biker-equipments' }}
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

export default BikerEquipmentsPage;
