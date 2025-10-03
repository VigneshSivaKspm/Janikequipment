import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 769 : false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Catégories (libellés FR + icônes)
  const categories = [
    { label: 'Casques moto', path: '/helmets', icon: '🪖' },
    { label: 'Équipements motard', path: '/biker-equipments', icon: '🧥' },
    { label: 'Airbag & Protection', path: '/airbag-protection', icon: '🛡️' },
    { label: 'Pièces détachées & accessoires', path: '/spare-parts-accessories', icon: '⚙️' },
    { label: 'Vêtements de sport', path: '/sportswear', icon: '👕' },
    { label: 'Équipement scooter', path: '/scooter-equipment', icon: '🛵' },
  ];

  useEffect(() => {
    const measure = () => {
      setIsDesktop(window.innerWidth >= 769);
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(h);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <header className="header" ref={headerRef}>
      <div className="header__main">
        <div className="header__content">
          <button 
            className="header__menu-btn" 
            onClick={toggleSidebar} 
            aria-label="Ouvrir le menu"
          >
            <span>&#9776;</span>
          </button>
          
          <a href="/" className="header__logo">
            ÉQUIPEMENT MOTO
          </a>

          {/* Desktop Navigation */}
          <nav className="header__nav">
            <Link to="/" className="header__nav-link">Accueil</Link>
            <Link to="/contact" className="header__nav-link">Contact</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        >
          <nav
            className="sidebar"
            onClick={e => e.stopPropagation()}
            style={{ height: '100%', marginTop: headerHeight }}
          > 
            <button 
              className="sidebar__close-btn" 
              onClick={closeSidebar}
              aria-label="Fermer le menu"
            >
              &times;
            </button>
            {isDesktop ? (
              <ul className="sidebar__nav">
                {categories.map((cat) => (
                  <li key={cat.path}>
                    <Link to={cat.path} onClick={closeSidebar}>
                      <span style={{marginRight: 8}}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="sidebar__nav">
                <li><Link to="/" onClick={closeSidebar}>Accueil</Link></li>
                {/* Full categories list on mobile, same as desktop */}
                <li style={{marginTop: 8, fontWeight: 700}}>Catégories</li>
                {categories.map((cat) => (
                  <li key={cat.path} style={{paddingLeft: 8}}>
                    <Link to={cat.path} onClick={closeSidebar}>
                      <span style={{marginRight: 8}}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                ))}
                {/* Keep extra links too on mobile */}
                <li style={{marginTop: 12, fontWeight: 700}}>Plus</li>
                <li><Link to="/categories" onClick={closeSidebar}>Toutes les catégories</Link></li>
                <li><Link to="/helmets" onClick={closeSidebar}>Casques moto</Link></li>
                <li><Link to="/offers" onClick={closeSidebar}>Offres</Link></li>
                <li><Link to="/contact" onClick={closeSidebar}>Contact</Link></li>
              </ul>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;