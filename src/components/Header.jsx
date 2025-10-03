import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 769 : false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Available categories to show in desktop hamburger sidebar
  const categories = [
    'Motorcycle Helmet',
    'Biker Equipment',
    'Airbag / Protection',
    'Spare Parts / Accessories',
    'Sportswear',
    'Scooter Equipment',
  ];

  const categoryRoute = (name) => {
    const map = {
      'Motorcycle Helmet': '/helmets',
      'Biker Equipment': '/biker-equipments',
      'Airbag / Protection': '/airbag-protection',
      'Spare Parts / Accessories': '/spare-parts-accessories',
      'Sportswear': '/sportswear',
      'Scooter Equipment': '/scooter-equipment',
    };
    return map[name] || '/';
  };

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
                  <li key={cat}>
                    <Link to={categoryRoute(cat)} onClick={closeSidebar}>{cat}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="sidebar__nav">
                <li><Link to="/" onClick={closeSidebar}>Accueil</Link></li>
                <li><Link to="/categories" onClick={closeSidebar}>Catégories</Link></li>
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