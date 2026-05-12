// PointFlavor — main app shell, routing & tweaks
const { useState, useEffect, useMemo } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C5481E",
  "tone": "warm",
  "density": "comfortable",
  "displayFont": "Fraunces",
  "imageMode": "placeholder",
  "showCornerLogo": true
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  '#C5481E', // brasa
  '#1F6F4A', // hierba
  '#2E4FB8', // azul lima
  '#7A4AB8', // morado peruano
  '#B89742', // mostaza
];

const FONT_OPTIONS = ['Fraunces', 'Playfair Display', 'DM Serif Display', 'Instrument Serif'];

function App() {
  const [route, setRoute] = useState({ name: 'home', params: {} });
  const [session, setSession] = useState(null);
  const [favs, setFavs] = useState([]);

  // Tweaks
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAKS_DEFAULTS)
    : [TWEAKS_DEFAULTS, ()=>{}];

  // Apply tokens to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', tweaks.accent);
    root.style.setProperty('--font-display', `'${tweaks.displayFont}', Georgia, serif`);

    if (tweaks.tone === 'cool') {
      root.style.setProperty('--bg', 'oklch(0.985 0.005 250)');
      root.style.setProperty('--bg-soft', 'oklch(0.965 0.008 250)');
      root.style.setProperty('--bg-elev', '#FFFFFF');
      root.style.setProperty('--ink', 'oklch(0.20 0.02 250)');
      root.style.setProperty('--ink-2', 'oklch(0.40 0.015 250)');
      root.style.setProperty('--ink-3', 'oklch(0.58 0.012 250)');
      root.style.setProperty('--line', 'oklch(0.88 0.008 250)');
      root.style.setProperty('--line-soft', 'oklch(0.93 0.008 250)');
    } else if (tweaks.tone === 'mono') {
      root.style.setProperty('--bg', '#FAFAFA');
      root.style.setProperty('--bg-soft', '#F2F2F2');
      root.style.setProperty('--bg-elev', '#FFFFFF');
      root.style.setProperty('--ink', '#181818');
      root.style.setProperty('--ink-2', '#525252');
      root.style.setProperty('--ink-3', '#8a8a8a');
      root.style.setProperty('--line', '#E2E2E2');
      root.style.setProperty('--line-soft', '#EDEDED');
    } else {
      root.style.setProperty('--bg', 'oklch(0.985 0.008 75)');
      root.style.setProperty('--bg-soft', 'oklch(0.965 0.012 75)');
      root.style.setProperty('--bg-elev', '#FFFFFF');
      root.style.setProperty('--ink', 'oklch(0.22 0.018 60)');
      root.style.setProperty('--ink-2', 'oklch(0.42 0.015 60)');
      root.style.setProperty('--ink-3', 'oklch(0.60 0.012 60)');
      root.style.setProperty('--line', 'oklch(0.88 0.012 70)');
      root.style.setProperty('--line-soft', 'oklch(0.93 0.010 70)');
    }

    if (tweaks.density === 'compact') {
      root.style.setProperty('--space-section', '64px');
    } else if (tweaks.density === 'spacious') {
      root.style.setProperty('--space-section', '120px');
    } else {
      root.style.setProperty('--space-section', '88px');
    }
  }, [tweaks]);

  // Favorites toggle
  const addFav = (h) => {
    setFavs(prev => {
      if (prev.find(x => x.id === h.id)) return prev.filter(x => x.id !== h.id);
      return [...prev, h];
    });
  };
  const favIds = favs.map(f => f.id);

  // Routing
  const go = (name, params = {}) => {
    setRoute({ name, params });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const onLogin = (data) => setSession({ ...data, initials: (data.name || 'U').slice(0,2).toUpperCase() });
  const onSelectRole = (role) => setSession(s => ({ ...(s||{}), role }));

  const screen = useMemo(() => {
    const props = { go, params: route.params, addFav, favIds, favs, session, onLogin, onSelectRole };
    switch (route.name) {
      case 'home':              return <window.HomeScreen {...props}/>;
      case 'categories':        return <window.CategoriesScreen {...props}/>;
      case 'results':           return <window.ResultsScreen {...props}/>;
      case 'detail':            return <window.DetailScreen {...props}/>;
      case 'map':               return <window.MapScreen {...props}/>;
      case 'favorites':         return <window.FavoritesScreen {...props}/>;
      case 'login':             return <window.LoginScreen {...props}/>;
      case 'register':          return <window.RegisterScreen {...props}/>;
      case 'role-select':       return <window.RoleSelectScreen {...props}/>;
      case 'password-recovery': return <window.PasswordRecoveryScreen {...props}/>;
      case 'profile':           return <window.ProfileScreen {...props}/>;
      case 'preferences':       return <window.PreferencesScreen {...props}/>;
      case 'review-new':        return <window.ReviewNewScreen {...props}/>;
      case 'promos':            return <window.PromosScreen {...props}/>;
      case 'plans':             return <window.PlansScreen {...props}/>;
      case 'payment':           return <window.PaymentScreen {...props}/>;
      case 'owner':             return <window.OwnerDashboardScreen {...props}/>;
      case 'owner-promos':      return <window.OwnerPromosScreen {...props}/>;
      case 'owner-promo-new':   return <window.OwnerPromoNewScreen {...props}/>;
      case 'contact':           return <window.ContactScreen {...props}/>;
      default:                  return <window.HomeScreen {...props}/>;
    }
  }, [route, session, favs]);

  return (
    <>
      <window.Navbar route={route.name} go={go} session={session} favCount={favs.length}/>
      <main data-screen-label={route.name}>{screen}</main>
      <window.Footer go={go}/>

      {/* Tweaks */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Marca">
            <window.TweakColor
              label="Color de acento"
              value={tweaks.accent}
              options={ACCENT_OPTIONS}
              onChange={(v)=>setTweak('accent', v)}/>
            <window.TweakSelect
              label="Fuente display"
              value={tweaks.displayFont}
              options={FONT_OPTIONS}
              onChange={(v)=>setTweak('displayFont', v)}/>
            <window.TweakToggle
              label="Logo en la esquina"
              value={tweaks.showCornerLogo}
              onChange={(v)=>setTweak('showCornerLogo', v)}/>
          </window.TweakSection>
          <window.TweakSection title="Atmósfera">
            <window.TweakRadio
              label="Tono"
              value={tweaks.tone}
              options={[
                {value:'warm',  label:'Cálido'},
                {value:'cool',  label:'Frío'},
                {value:'mono',  label:'Mono'},
              ]}
              onChange={(v)=>setTweak('tone', v)}/>
            <window.TweakRadio
              label="Densidad"
              value={tweaks.density}
              options={[
                {value:'compact',     label:'Compacto'},
                {value:'comfortable', label:'Normal'},
                {value:'spacious',    label:'Aireado'},
              ]}
              onChange={(v)=>setTweak('density', v)}/>
          </window.TweakSection>
          <window.TweakSection title="Navegar">
            <NavTweak go={go} setRoute={setRoute}/>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </>
  );
}

function NavTweak({ go }) {
  const groups = [
    { label: 'Discovery', items: [
      ['Home','home'], ['Categorías','categories'], ['Resultados','results'],
      ['Detalle','detail'], ['Mapa','map'], ['Favoritos','favorites']
    ]},
    { label: 'Auth', items: [
      ['Login','login'], ['Registro','register'], ['Rol','role-select'], ['Recuperar','password-recovery']
    ]},
    { label: 'Cuenta', items: [
      ['Perfil','profile'], ['Preferencias','preferences'], ['Nueva reseña','review-new']
    ]},
    { label: 'Comercial', items: [
      ['Promos','promos'], ['Planes','plans'], ['Pago','payment'], ['Contacto','contact']
    ]},
    { label: 'Dueño', items: [
      ['Panel','owner'], ['Mis promos','owner-promos'], ['Crear promo','owner-promo-new']
    ]},
  ];
  return (
    <div style={{display:'grid', gap: 14}}>
      {groups.map(g => (
        <div key={g.label}>
          <div style={{
            fontSize: 10, opacity: 0.55, textTransform:'uppercase', letterSpacing: '0.08em',
            marginBottom: 6, fontFamily:'var(--font-mono)'
          }}>{g.label}</div>
          <div style={{display:'flex', flexWrap:'wrap', gap: 4}}>
            {g.items.map(([label, route]) => (
              <button key={route} onClick={()=>go(route)}
                style={{
                  padding:'4px 10px', borderRadius: 999,
                  background:'rgba(255,255,255,.08)',
                  color:'#fff', border:'1px solid rgba(255,255,255,.14)',
                  fontSize: 11, cursor:'pointer'
                }}>{label}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
