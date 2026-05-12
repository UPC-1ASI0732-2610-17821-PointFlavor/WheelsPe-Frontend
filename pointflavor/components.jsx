// Shared components for PointFlavor
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Brand mark ---------- */
function BrandMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.2" opacity="0.25"/>
      <circle cx="16" cy="16" r="5.5" fill="currentColor"/>
    </svg>
  );
}

/* ---------- Icons ---------- */
const Icon = {
  search: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  pin: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-7.2 8-12.5A8 8 0 1 0 4 9.5C4 14.8 12 22 12 22Z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  star: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><path d="M12 2 14.9 9l7.1.6-5.4 4.7L18.2 22 12 18l-6.2 4 1.6-7.7L2 9.6 9.1 9z"/></svg>,
  heart: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s-7-4.5-9.3-9A5.7 5.7 0 0 1 12 6a5.7 5.7 0 0 1 9.3 6c-2.3 4.5-9.3 9-9.3 9z"/></svg>,
  filter: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m4 12 5 5L20 6"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14m-6-6 6 6-6 6"/></svg>,
  clock: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  phone: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.5.6a2 2 0 0 1 1.7 2z"/></svg>,
  globe: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  x: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  back: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5m6-6-6 6 6 6"/></svg>,
  layers: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></svg>,
  zap: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
};

/* ---------- Stars ---------- */
function Stars({ value = 0, max = 5, size }) {
  const cls = size === 'lg' ? 'stars stars--lg' : 'stars';
  return (
    <span className={cls} aria-label={`${value} de ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Icon.star key={i} style={{ opacity: i < Math.round(value) ? 1 : 0.18 }}/>
      ))}
    </span>
  );
}

/* ---------- Image with placeholder fallback ---------- */
function SmartImg({ src, alt, label, style, className }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className={`placeholder ${className||''}`} style={style}>
        {label || alt || 'imagen'}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      style={{ width:'100%', height:'100%', objectFit:'cover', ...style }}
      onError={() => setErr(true)}
    />
  );
}

/* ---------- Navbar ---------- */
function Navbar({ route, go, session, onLogout }) {
  const links = [
    { id:'home',       label:'Inicio'      },
    { id:'categories', label:'Categorías'  },
    { id:'map',        label:'Explorar'    },
    { id:'promos',     label:'Promos'      },
    { id:'plans',      label:'Planes'      },
    { id:'contact',    label:'Contacto'    },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="#" onClick={(e)=>{e.preventDefault(); go('home');}}>
          <span style={{color:'var(--accent)'}}><BrandMark size={26}/></span>
          <span>PointFlavor</span>
        </a>
        <div className="nav__links">
          {links.map(l => (
            <a key={l.id}
               href="#"
               className={`nav__link ${route===l.id?'nav__link--active':''}`}
               onClick={(e)=>{e.preventDefault(); go(l.id);}}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav__actions">
          {!session ? (
            <>
              <button className="btn btn--ghost btn--sm" onClick={()=>go('login')}>Ingresar</button>
              <button className="btn btn--accent btn--sm" onClick={()=>go('register')}>Crear cuenta</button>
            </>
          ) : (
            <div style={{position:'relative'}}>
              <button className="user-pill" onClick={()=>setMenuOpen(o=>!o)}>
                <span className="user-pill__avatar">{session.initials}</span>
                <span>{session.name}</span>
              </button>
              {menuOpen && (
                <div onMouseLeave={()=>setMenuOpen(false)}
                     style={{position:'absolute', right:0, top:'calc(100% + 8px)',
                       background:'var(--bg-elev)', border:'1px solid var(--line)',
                       borderRadius:'var(--r-md)', boxShadow:'var(--shadow-lg)',
                       minWidth:'200px', overflow:'hidden', zIndex:60}}>
                  <DropItem onClick={()=>{go('profile'); setMenuOpen(false);}}>Mi perfil</DropItem>
                  <DropItem onClick={()=>{go('favorites'); setMenuOpen(false);}}>Favoritos</DropItem>
                  <DropItem onClick={()=>{go('preferences'); setMenuOpen(false);}}>Preferencias</DropItem>
                  {session.role === 'owner' && (
                    <DropItem onClick={()=>{go('owner'); setMenuOpen(false);}}>Mi huarique</DropItem>
                  )}
                  <div style={{borderTop:'1px solid var(--line-soft)'}}/>
                  <DropItem onClick={()=>{onLogout(); setMenuOpen(false);}}
                            style={{color:'var(--danger)'}}>Salir</DropItem>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropItem({ children, onClick, style }) {
  return (
    <button onClick={onClick}
      style={{
        display:'block', width:'100%', textAlign:'left', padding:'10px 16px',
        background:'transparent', border:'none', fontSize:14, color:'var(--ink)', ...style
      }}
      onMouseEnter={(e)=>e.currentTarget.style.background='var(--bg-soft)'}
      onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
      {children}
    </button>
  );
}

/* ---------- Footer ---------- */
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <div className="nav__brand" style={{marginBottom: 16}}>
              <span style={{color:'var(--accent)'}}><BrandMark size={26}/></span>
              <span>PointFlavor</span>
            </div>
            <p style={{color:'var(--ink-2)', fontSize:14, maxWidth: 320}}>
              Una guía honesta para comer rico en cualquier barrio del Perú. Sin estrellas falsas, sin atajos.
            </p>
          </div>
          <div>
            <h4>Descubrir</h4>
            <ul>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('categories');}}>Categorías</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('map');}}>Mapa</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('promos');}}>Promociones</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('results');}}>Cerca de ti</a></li>
            </ul>
          </div>
          <div>
            <h4>Cuenta</h4>
            <ul>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('login');}}>Ingresar</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('register');}}>Crear cuenta</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('plans');}}>Planes</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('owner');}}>Para dueños</a></li>
            </ul>
          </div>
          <div>
            <h4>Compañía</h4>
            <ul>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); go('contact');}}>Contacto</a></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Términos</a></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 PointFlavor — Hecho en Lima</span>
          <span>v2.0 · Rediseño minimal</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Search field ---------- */
function SearchField({ value, onChange, onSubmit, placeholder, large }) {
  return (
    <form
      onSubmit={(e)=>{e.preventDefault(); onSubmit?.();}}
      style={{
        display:'flex', alignItems:'center', gap: 8,
        background:'var(--bg-elev)',
        border:'1px solid var(--line)',
        borderRadius: 'var(--r-pill)',
        padding: large ? '6px 6px 6px 22px' : '4px 4px 4px 16px',
        boxShadow: 'var(--shadow-sm)',
      }}>
      <span style={{color:'var(--ink-3)'}}><Icon.search/></span>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex:1, border:'none', outline:'none', background:'transparent',
          padding: large ? '14px 6px' : '10px 6px',
          fontSize: large ? 16 : 14,
        }}
      />
      <button type="submit" className={`btn btn--accent ${large?'':'btn--sm'}`}>
        Buscar
      </button>
    </form>
  );
}

/* ---------- Huarique card ---------- */
function HuariqueCard({ h, onOpen, isFav, onToggleFav, layout='grid' }) {
  if (layout === 'row') {
    return (
      <article className="card"
        style={{display:'flex', gap: 20, padding: 16, alignItems:'stretch', cursor:'pointer'}}
        onClick={()=>onOpen?.(h)}>
        <div style={{width:180, height:140, borderRadius:'var(--r-md)', overflow:'hidden', flexShrink:0}}>
          <SmartImg src={h.img} alt={h.name} label={h.cat}/>
        </div>
        <div style={{flex:1, display:'flex', flexDirection:'column', gap: 8, minWidth:0}}>
          <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'start'}}>
            <div style={{minWidth:0}}>
              <span className="eyebrow">{h.category}</span>
              <h3 style={{fontSize: 22, marginTop: 4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{h.name}</h3>
            </div>
            <button className="btn btn--icon btn--ghost"
              onClick={(e)=>{e.stopPropagation(); onToggleFav?.(h);}}
              aria-label="Favorito">
              <Icon.heart style={{ fill: isFav?'var(--warm)':'none', stroke: isFav?'var(--warm)':'currentColor'}}/>
            </button>
          </div>
          <p style={{color:'var(--ink-2)', fontSize:14, margin:0,
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
            {h.bio}
          </p>
          <div style={{marginTop:'auto', display:'flex', gap:14, alignItems:'center', flexWrap:'wrap'}}>
            <span style={{display:'inline-flex', alignItems:'center', gap:6, color:'var(--ink-2)', fontSize:13}}>
              <Icon.pin/> {h.district}
            </span>
            <span style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:13}}>
              <Stars value={h.rating}/> <strong>{h.rating}</strong>
              <span style={{color:'var(--ink-3)'}}>· {h.reviews}</span>
            </span>
            <span style={{marginLeft:'auto', fontFamily:'var(--font-display)', fontSize:18}}>
              S/ {h.price}<span style={{fontSize:12, color:'var(--ink-3)'}}> /persona</span>
            </span>
          </div>
        </div>
      </article>
    );
  }
  return (
    <article className="card" style={{cursor:'pointer'}} onClick={()=>onOpen?.(h)}>
      <div style={{position:'relative', aspectRatio: '5/4', overflow:'hidden'}}>
        <SmartImg src={h.img} alt={h.name} label={h.cat}/>
        {h.promo && (
          <span className="badge badge--solid"
            style={{position:'absolute', top:14, left:14,
              background:'var(--ink)', color:'var(--ink-inv)'}}>
            <Icon.zap/> {h.promo.discount}% off
          </span>
        )}
        <button className="btn btn--icon"
          onClick={(e)=>{e.stopPropagation(); onToggleFav?.(h);}}
          aria-label="Favorito"
          style={{position:'absolute', top:12, right:12,
            background: isFav?'var(--ink)':'rgba(255,255,255,.92)',
            color: isFav?'var(--ink-inv)':'var(--ink)',
            border:'none', backdropFilter:'blur(6px)'}}>
          <Icon.heart style={{ fill: isFav?'currentColor':'none' }}/>
        </button>
      </div>
      <div style={{padding: 'var(--pad-card)'}}>
        <span className="eyebrow">{h.category}</span>
        <h3 style={{fontSize: 22, marginTop: 4, marginBottom: 6}}>{h.name}</h3>
        <div style={{display:'flex', gap:10, alignItems:'center', color:'var(--ink-2)', fontSize:13, marginBottom: 12}}>
          <span style={{display:'inline-flex', alignItems:'center', gap:4}}><Icon.pin/> {h.district}</span>
          <span style={{color:'var(--ink-3)'}}>·</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:4}}><Stars value={h.rating}/> {h.rating}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontFamily:'var(--font-display)', fontSize: 19}}>
            S/ {h.price}
            <span style={{fontSize:12, color:'var(--ink-3)', fontFamily:'var(--font-sans)'}}> · {h.reviews} reseñas</span>
          </span>
          <span style={{color:'var(--ink-3)'}}><Icon.arrow/></span>
        </div>
      </div>
    </article>
  );
}

/* ---------- Section header ---------- */
function SectionHead({ eyebrow, title, lead, action }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow" style={{marginBottom: 10, display:'block'}}>{eyebrow}</span>}
        <h2>{title}</h2>
        {lead && <p style={{marginTop: 12, color:'var(--ink-2)'}}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ title, lead, cta, onCta }) {
  return (
    <div style={{
      textAlign:'center', padding: '80px 24px',
      border:'1px dashed var(--line)', borderRadius:'var(--r-lg)',
      background:'var(--bg-soft)'}}>
      <h3 style={{fontSize: 24, marginBottom: 8}}>{title}</h3>
      {lead && <p style={{color:'var(--ink-2)', marginBottom: 20}}>{lead}</p>}
      {cta && <button className="btn btn--accent" onClick={onCta}>{cta}</button>}
    </div>
  );
}

Object.assign(window, {
  BrandMark, Icon, Stars, SmartImg, Navbar, Footer, SearchField,
  HuariqueCard, SectionHead, EmptyState, DropItem,
});
