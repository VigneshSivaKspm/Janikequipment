import React, { useEffect, useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    name: !form.name ? 'Veuillez entrer votre nom' : '',
    email: !form.email ? 'Veuillez entrer votre email' : (!emailRegex.test(form.email) ? 'Email invalide' : ''),
    message: !form.message ? 'Veuillez entrer un message' : '',
  };
  const isValid = !errors.name && !errors.email && !errors.message;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!isValid) {
      setStatus({ type: 'error', msg: 'Veuillez corriger les erreurs du formulaire.' });
      return;
    }
    // No backend connected yet — simulate success
    setStatus({ type: 'success', msg: 'Merci ! Votre message a été envoyé. Nous vous contacterons prochainement.' });
    setForm({ name: '', email: '', message: '' });
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isDesktop = windowWidth >= 1024;

  const card = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
  };

  const label = { fontWeight: 600, marginBottom: 8, color: '#111827' };
  const input = (hasError) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: `1px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    outline: 'none',
    fontSize: 15,
    background: '#fafafa',
  });
  const errorText = { color: '#ef4444', fontSize: 13, marginTop: 6 };

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>Contactez-nous</h1>
        <p style={{ color: '#6b7280' }}>Nous répondrons rapidement à votre demande.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 2fr' : '1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ ...card, padding: 24, width: '100%' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Coordonnées</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, lineHeight: 1.8 }}>
            <div style={{ color: '#374151' }}>6 rue de Sarrebourg</div>
            <div style={{ color: '#374151' }}>18000 Bourges</div>
            <div style={{ color: '#374151' }}>France</div>
            <div style={{ color: '#111827', fontWeight: 600, marginTop: 8 }}>SIRET&nbsp;94449286700014</div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ ...card, padding: 24, width: '100%' }} noValidate>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Formulaire de contact</h2>

          {status.msg && (
            <div style={{
              padding: '12px 14px',
              borderRadius: 10,
              marginBottom: 16,
              border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`,
              background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: status.type === 'success' ? '#065f46' : '#991b1b',
            }}>
              {status.msg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 14, marginBottom: 14 }}>
            <div style={{ width: '100%' }}>
              <div style={label}>Nom</div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Votre nom"
                style={input(touched.name && !!errors.name)}
              />
              {touched.name && errors.name && <div style={errorText}>{errors.name}</div>}
            </div>

            <div style={{ width: '100%' }}>
              <div style={label}>Email</div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="vous@exemple.com"
                style={input(touched.email && !!errors.email)}
              />
              {touched.email && errors.email && <div style={errorText}>{errors.email}</div>}
            </div>

            <div style={{ gridColumn: isDesktop ? '1 / span 2' : 'auto', width: '100%' }}>
              <div style={label}>Message</div>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Comment pouvons-nous vous aider ?"
                rows={6}
                style={{ ...input(touched.message && !!errors.message), resize: 'vertical' }}
              />
              {touched.message && errors.message && <div style={errorText}>{errors.message}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="submit"
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 18px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(37,99,235,0.2)'
              }}
            >
              Envoyer
            </button>
            <button
              type="button"
              onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus({ type: '', msg: '' }); setTouched({}); }}
              style={{
                background: '#f3f4f6',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
