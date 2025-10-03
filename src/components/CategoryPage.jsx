import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Helper to format various price shapes into a display string
const formatPrice = (price) => {
  if (!price) return '';
  if (typeof price === 'string') return price;
  if (typeof price === 'number') return `${price} €`;
  if (typeof price === 'object') {
    if (price.web != null) return `${price.web} €`;
    if (price.recommended != null) return `${price.recommended} €`;
    return '';
  }
  return '';
};

// Ensure images paths is usable by the app (prefix leading slash if missing)
const normalizeImagePath = (imgPath) => {
  if (!imgPath) return undefined;
  return imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
};

// Build a public path under assets/Product-images with URL-encoded folder
const buildAssetsPath = (folderName, fileName) => {
  if (!fileName) return undefined;
  const encodedFolder = encodeURIComponent(folderName);
  return `/assets/Product-images/${encodedFolder}/${fileName}`;
};

// Build list items from fetched data per slug
const buildProducts = (slug, data) => {
  switch (slug) {
    case 'motorcycle-helmet': {
      const items = data?.helmets || [];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        image: Array.isArray(p.images)
          ? (p.images[0]?.startsWith('/') ? p.images[0] : `/assets/Product-images/Motorcycle-Helmets/${p.images[0]}`)
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        raw: p,
        source: 'Motorcycle-Helmets',
      }));
    }
    case 'biker-equipment': {
      const items = data?.biker_equipment || [];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        image: Array.isArray(p.images)
          ? (p.images[0]?.startsWith('/') ? p.images[0] : `/assets/Product-images/Biker-equipments/${p.images[0]}`)
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        raw: p,
        source: 'Biker-equipments',
      }));
    }
    case 'airbag-protection': {
      const vests = data?.airbag_vests || [];
      const backs = data?.back_protectors || [];
      const others = data?.other_products || [];
      const items = [...vests, ...backs, ...others];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        image: Array.isArray(p.images)
          ? (p.images[0]?.startsWith('/') ? p.images[0] : `/assets/Product-images/Airbag%20%26%20Protection/${p.images[0]}`)
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        raw: p,
        source: 'Airbag-Protection',
      }));
    }
    case 'spare-parts-accessories': {
      const items = data?.products || [];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        image: Array.isArray(p.images)
          ? (p.images[0]?.includes('/')
              ? normalizeImagePath(p.images[0])
              : buildAssetsPath('Spare Parts & Accessories', p.images[0]))
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        raw: p,
        source: 'Spare Parts & Accessories',
      }));
    }
    case 'sportswear': {
      const items = data?.products || [];
      return items.map((p) => ({
        name: p.name,
        price: p.salePrice != null ? `${p.salePrice} €` : (p.originalPrice != null ? `${p.originalPrice} €` : ''),
        image: Array.isArray(p.images)
          ? (p.images[0]?.startsWith('/') ? p.images[0] : `/assets/Product-images/Sportswere/${p.images[0]}`)
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        raw: p,
        source: 'Sportswere',
      }));
    }
    default:
      return [];
  }
};

const prettyTitle = (slug) => slug
  .replace(/-/g, ' ')
  .replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const urlBySlug = {
      'motorcycle-helmet': '/Product-details/Motorcycle_Helmet.json',
      'biker-equipment': '/Product-details/Biker_Equipments.json',
      'airbag-protection': '/Product-details/Airbag_Protection.json',
      'spare-parts-accessories': '/Product-details/Spare_Parts_Accessories.json',
      'sportswear': '/Product-details/Sportswere.json',
    };
    const url = urlBySlug[slug];
    if (!url) { setData(null); return; }
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, [slug]);

  const products = buildProducts(slug, data);

  return (
    <section style={{maxWidth: 1200, margin: '0 auto', padding: '24px'}}>
      <h2 style={{marginBottom: 16}}>{prettyTitle(slug)}</h2>
      {products.length === 0 ? (
        <p>Aucun produit trouvé pour cette catégorie.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          {products.map((p, idx) => (
            <Link
              key={idx}
              to="/product"
              state={{ product: p.raw, source: p.source }}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#fff',
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              {p.image && (
                <div style={{width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f3f4f6'}}>
                  <img src={p.image} alt={p.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              )}
              <div style={{padding: 12}}>
                <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 8}}>{p.name}</h3>
                {p.price && <div style={{color: '#2563eb', fontWeight: 700, marginBottom: 8}}>{p.price}</div>}
                {p.description && <p style={{fontSize: 14, color: '#374151'}}>{p.description.slice(0, 120)}{p.description.length > 120 ? '…' : ''}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryPage;
