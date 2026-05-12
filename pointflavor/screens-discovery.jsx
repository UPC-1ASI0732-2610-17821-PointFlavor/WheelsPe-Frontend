// Discovery screens — Home, Categories, Results, Detail, Map, Favorites
const { useState: useS1, useEffect: useE1, useMemo: useM1 } = React;

/* ============================================================
   HOME
============================================================ */
function HomeScreen({ go, addFav, favIds }) {
  const { CATEGORIES, HUARIQUES, PROMOS } = window.PF_DATA;
  const [q, setQ] = useS1('');
  const featured = HUARIQUES.slice(0, 3);
  const trending = HUARIQUES.slice(3, 7);
  const promo = PROMOS[0];

  const submit = () => go('results', { q });
  const quick = (term) => go('results', { q: term });

  return (
    <div className="page-enter">
      {/* HERO */}
      <section style={{padding: '72px 0 80px'}}>
        <div className="wrap">
          <div style={{
            display:'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 56,
            alignItems:'center'
          }}>
            <div>
              <span className="eyebrow" style={{marginBottom: 18, display:'block'}}>
                · Guía gastronómica · Lima 2026
              </span>
              <h1 style={{
                fontSize: 'clamp(48px, 6vw, 84px)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                marginBottom: 20,
              }}>
                Comer rico,<br/>
                <em style={{color: 'var(--accent)', fontStyle: 'italic'}}>
                  sin atajos
                </em>.
              </h1>
              <p style={{
                fontSize: 18,
                lineHeight: 1.55,
                color:'var(--ink-2)',
                maxWidth: 480,
                marginBottom: 36
              }}>
                Una selección honesta de huariques, mercados y mesas de barrio.
                Curada por gente que come, no por algoritmos.
              </p>
              <div style={{maxWidth: 560, marginBottom: 18}}>
                <SearchField
                  value={q} onChange={setQ} onSubmit={submit}
                  placeholder="¿Antojo de pollo, ceviche, anticucho?"
                  large
                />
              </div>
              <div style={{display:'flex', gap: 8, flexWrap:'wrap', alignItems:'center'}}>
                <span style={{fontSize: 12, color:'var(--ink-3)', marginRight: 6,
                  fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
                  prueba
                </span>
                {['Pollo a la brasa', 'Ceviche', 'Chifa', 'Anticucho', 'Postres'].map(t => (
                  <button key={t} className="chip" onClick={()=>quick(t)}>{t}</button>
                ))}
              </div>
            </div>
            <HeroCollage/>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section style={{padding: '32px 0', borderTop:'1px solid var(--line-soft)', borderBottom:'1px solid var(--line-soft)'}}>
        <div className="wrap" style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 32}}>
          <Stat n="1,840+" label="Huariques verificados"/>
          <Stat n="38" label="Distritos cubiertos"/>
          <Stat n="92k" label="Reseñas reales"/>
          <Stat n="14" label="Categorías de cocina"/>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="01 — Categorías"
            title="Empieza por el antojo."
            lead="Filtra por lo que te apetece hoy. Cada categoría es una puerta a varios barrios."
            action={
              <button className="btn btn--ghost btn--sm" onClick={()=>go('categories')}>
                Ver todas <Icon.arrow/>
              </button>
            }
          />
          <div style={{
            display:'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}>
            {CATEGORIES.slice(0,8).map((c, i) => (
              <CategoryTile key={c.id} cat={c} onClick={()=>go('results', { q: c.name })} feature={i===0}/>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EDITORIAL */}
      <section className="section" style={{paddingTop: 24}}>
        <div className="wrap">
          <SectionHead
            eyebrow="02 — Selección de la semana"
            title="Tres mesas que valen el viaje."
            lead="Visitamos, probamos, escuchamos. Esta semana destacamos:"
          />
          <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr', gap: 20}}>
            {featured.map((h, i) => (
              <article key={h.id}
                className="card"
                style={{cursor:'pointer', minHeight: i===0 ? 520 : 'auto'}}
                onClick={()=>go('detail', { id: h.id })}>
                <div style={{position:'relative', aspectRatio: i===0 ? '4/5' : '4/3', overflow:'hidden'}}>
                  <SmartImg src={h.img} alt={h.name}/>
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(to top, rgba(20,15,10,.6), transparent 50%)'}}/>
                  <div style={{position:'absolute', top:16, left:16}}>
                    <span className="badge" style={{background:'rgba(255,255,255,.96)', color:'var(--ink)'}}>
                      Nº 0{i+1}
                    </span>
                  </div>
                  <div style={{position:'absolute', bottom: 0, left: 0, right: 0, padding: 24, color:'#fff'}}>
                    <span className="eyebrow" style={{color:'rgba(255,255,255,.75)'}}>{h.category}</span>
                    <h3 style={{fontSize: i===0 ? 36 : 26, marginTop: 6, color:'#fff'}}>{h.name}</h3>
                    <div style={{display:'flex', gap: 14, marginTop: 8, fontSize: 13, opacity:.92}}>
                      <span><Icon.pin/> {h.district}</span>
                      <span>★ {h.rating}</span>
                      <span>S/ {h.price}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="section" style={{paddingTop: 0}}>
        <div className="wrap">
          <article style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            background:'var(--accent)', color:'var(--accent-ink)',
            borderRadius:'var(--r-xl)', overflow:'hidden', minHeight: 320,
          }}>
            <div style={{padding: '56px 56px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <span className="eyebrow" style={{color:'rgba(255,255,255,.7)'}}>Promo activa</span>
              <h2 style={{fontSize: 40, color:'#fff', marginTop: 12, marginBottom: 16}}>
                {promo.title}
              </h2>
              <p style={{color:'rgba(255,255,255,.85)', fontSize: 16, marginBottom: 24, maxWidth: 380}}>
                {promo.note} Aplica en sucursales seleccionadas hasta agotar stock.
              </p>
              <div style={{display:'flex', gap: 12}}>
                <button className="btn" style={{background:'#fff', color:'var(--accent)'}}
                  onClick={()=>go('promos')}>
                  Ver todas las promos
                </button>
                <button className="btn btn--ghost" style={{borderColor:'rgba(255,255,255,.3)', color:'#fff'}}
                  onClick={()=>go('detail',{id: promo.huariqueId})}>
                  Ver el huarique
                </button>
              </div>
            </div>
            <div style={{position:'relative'}}>
              <SmartImg src={promo.img} alt={promo.title}/>
            </div>
          </article>
        </div>
      </section>

      {/* TRENDING */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="03 — Cerca de ti"
            title="Los más visitados hoy."
            action={
              <button className="btn btn--ghost btn--sm" onClick={()=>go('results')}>
                Ver todos <Icon.arrow/>
              </button>
            }
          />
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 20}}>
            {trending.map(h => (
              <HuariqueCard key={h.id} h={h}
                onOpen={(h)=>go('detail', {id: h.id})}
                isFav={favIds.includes(h.id)}
                onToggleFav={addFav}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="section">
        <div className="wrap-narrow" style={{textAlign:'center'}}>
          <span className="eyebrow">— Manifiesto</span>
          <p style={{
            fontFamily:'var(--font-display)',
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            lineHeight: 1.25,
            marginTop: 24,
            letterSpacing:'-0.01em',
          }}>
            "Una buena mesa no se mide por su decoración, sino por la cantidad de
            historias que se cuentan en ella. Buscamos esas mesas, una por una."
          </p>
          <div style={{marginTop: 32, color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize: 12, letterSpacing:'0.08em'}}>
            EQUIPO POINTFLAVOR — LIMA, 2026
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div style={{fontFamily:'var(--font-display)', fontSize: 36, lineHeight:1, color:'var(--ink)'}}>{n}</div>
      <div style={{fontSize: 12, color:'var(--ink-3)', marginTop: 6,
        fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
        {label}
      </div>
    </div>
  );
}

function HeroCollage() {
  return (
    <div style={{
      position:'relative', aspectRatio:'4/5', maxWidth: 460, marginLeft:'auto'
    }}>
      <div style={{
        position:'absolute', top:0, right:0, width:'72%', aspectRatio:'3/4',
        borderRadius:'var(--r-lg)', overflow:'hidden', boxShadow:'var(--shadow-lg)'
      }}>
        <SmartImg src="img/h-brasero.jpg" alt="Pollo a la brasa"/>
      </div>
      <div style={{
        position:'absolute', bottom:'8%', left:0, width:'52%', aspectRatio:'1/1',
        borderRadius:'var(--r-lg)', overflow:'hidden', boxShadow:'var(--shadow-lg)',
        border:'4px solid var(--bg)',
      }}>
        <SmartImg src="img/h-lamarina.jpg" alt="Marina"/>
      </div>
      <div style={{
        position:'absolute', bottom:0, right:'8%', width:'34%', aspectRatio:'1/1',
        borderRadius:'var(--r-lg)', overflow:'hidden', boxShadow:'var(--shadow-md)',
        border:'4px solid var(--bg)',
      }}>
        <SmartImg src="img/h-pasteleria.jpg" alt="Postres"/>
      </div>
      <span style={{
        position:'absolute', top:'40%', left:'-8%',
        background:'var(--bg-elev)', border:'1px solid var(--line)',
        borderRadius:'var(--r-pill)', padding:'10px 16px',
        boxShadow:'var(--shadow-md)', fontSize: 13,
        display:'flex', alignItems:'center', gap: 8
      }}>
        <span style={{
          width:8, height:8, borderRadius:'50%', background:'var(--success)',
          boxShadow:'0 0 0 4px color-mix(in oklch, var(--success) 25%, transparent)'
        }}></span>
        184 personas comieron aquí esta semana
      </span>
    </div>
  );
}

function CategoryTile({ cat, onClick, feature }) {
  return (
    <a href="#" onClick={(e)=>{e.preventDefault(); onClick();}}
      className="card"
      style={{
        display:'block', position:'relative',
        aspectRatio: feature ? '1/1.4' : '1/1',
        textDecoration:'none', overflow:'hidden',
        gridRow: feature ? 'span 2' : 'auto',
        gridColumn: feature ? 'span 1' : 'auto',
      }}>
      <SmartImg src={cat.img} alt={cat.name} label={cat.id}/>
      <div style={{position:'absolute', inset:0,
        background:'linear-gradient(to top, rgba(20,15,10,.7), rgba(20,15,10,.1) 60%)'}}/>
      <div style={{position:'absolute', bottom: 0, left: 0, right: 0, padding: 18, color:'#fff'}}>
        <h3 style={{fontSize: feature ? 26 : 19, color:'#fff'}}>{cat.name}</h3>
        <span style={{fontSize: 12, color:'rgba(255,255,255,.78)', fontFamily:'var(--font-mono)'}}>
          {cat.count} lugares
        </span>
      </div>
    </a>
  );
}

/* ============================================================
   CATEGORIES
============================================================ */
function CategoriesScreen({ go }) {
  const { CATEGORIES } = window.PF_DATA;
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Categorías"
            title="¿Qué te provoca hoy?"
            lead="Cada categoría agrupa locales que comparten oficio, no solo ingredientes."
          />
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 20}}>
            {CATEGORIES.map(c => (
              <article key={c.id} className="card" style={{cursor:'pointer'}}
                onClick={()=>go('results', { q: c.name })}>
                <div style={{aspectRatio:'4/3', overflow:'hidden'}}>
                  <SmartImg src={c.img} alt={c.name} label={c.id}/>
                </div>
                <div style={{padding: 20}}>
                  <span className="eyebrow">{c.count} lugares</span>
                  <h3 style={{fontSize: 24, marginTop: 6, marginBottom: 8}}>{c.name}</h3>
                  <p style={{color:'var(--ink-2)', fontSize: 14, marginBottom: 16}}>{c.blurb}</p>
                  <span style={{display:'inline-flex', alignItems:'center', gap: 6,
                    fontSize: 13, color:'var(--accent)', fontWeight: 500}}>
                    Explorar <Icon.arrow/>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   RESULTS
============================================================ */
function ResultsScreen({ go, params, addFav, favIds }) {
  const { HUARIQUES, CATEGORIES } = window.PF_DATA;
  const [q, setQ] = useS1(params.q || '');
  const [cat, setCat] = useS1(params.cat || 'all');
  const [sort, setSort] = useS1('rating');
  const [layout, setLayout] = useS1('grid');
  const [district, setDistrict] = useS1('all');
  const [priceMax, setPriceMax] = useS1(80);

  useE1(() => { setQ(params.q || ''); }, [params.q]);

  const districts = ['all', ...Array.from(new Set(HUARIQUES.map(h => h.district)))];

  const results = useM1(() => {
    let r = HUARIQUES.slice();
    if (q) {
      const qn = q.toLowerCase();
      r = r.filter(h =>
        h.name.toLowerCase().includes(qn) ||
        h.category.toLowerCase().includes(qn) ||
        h.district.toLowerCase().includes(qn) ||
        h.tags.some(t => t.toLowerCase().includes(qn))
      );
    }
    if (cat !== 'all') r = r.filter(h => h.cat === cat);
    if (district !== 'all') r = r.filter(h => h.district === district);
    r = r.filter(h => h.price <= priceMax);
    if (sort === 'rating')   r.sort((a,b)=>b.rating - a.rating);
    if (sort === 'price')    r.sort((a,b)=>a.price - b.price);
    if (sort === 'reviews')  r.sort((a,b)=>b.reviews - a.reviews);
    return r;
  }, [q, cat, sort, district, priceMax]);

  return (
    <div className="page-enter" style={{paddingTop: 48, paddingBottom: 48}}>
      <div className="wrap">
        {/* Toolbar */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr auto', gap: 16, alignItems:'center',
          marginBottom: 28
        }}>
          <SearchField value={q} onChange={setQ}
            placeholder="Buscar por nombre, plato, distrito…"/>
          <div style={{display:'flex', gap: 8, alignItems:'center'}}>
            <button className={`btn btn--ghost btn--sm ${layout==='grid'?'chip--on':''}`}
              onClick={()=>setLayout('grid')}>Grid</button>
            <button className={`btn btn--ghost btn--sm ${layout==='row'?'chip--on':''}`}
              onClick={()=>setLayout('row')}>Lista</button>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap: 40, alignItems:'start'}}>
          {/* Sidebar */}
          <aside style={{
            position: 'sticky', top: 96,
            padding: 24, borderRadius:'var(--r-lg)',
            background:'var(--bg-elev)', border:'1px solid var(--line-soft)',
          }}>
            <h4 style={{fontFamily:'var(--font-sans)', fontSize: 12, fontWeight: 600,
              letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--ink-3)',
              marginBottom: 14}}>Categorías</h4>
            <div style={{display:'flex', flexDirection:'column', gap: 4, marginBottom: 24}}>
              <FilterChip label="Todas" on={cat==='all'} onClick={()=>setCat('all')}/>
              {CATEGORIES.map(c => (
                <FilterChip key={c.id} label={c.name} count={c.count}
                  on={cat===c.id} onClick={()=>setCat(c.id)}/>
              ))}
            </div>

            <h4 style={{fontFamily:'var(--font-sans)', fontSize: 12, fontWeight: 600,
              letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--ink-3)',
              marginBottom: 14}}>Distrito</h4>
            <select className="select" value={district} onChange={(e)=>setDistrict(e.target.value)}
              style={{marginBottom: 24}}>
              {districts.map(d => <option key={d} value={d}>{d==='all'?'Todos':d}</option>)}
            </select>

            <h4 style={{fontFamily:'var(--font-sans)', fontSize: 12, fontWeight: 600,
              letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--ink-3)',
              marginBottom: 14}}>Precio máximo</h4>
            <div style={{marginBottom: 8}}>
              <input type="range" min="15" max="80" step="1" value={priceMax}
                onChange={(e)=>setPriceMax(Number(e.target.value))}
                style={{width:'100%', accentColor:'var(--accent)'}}/>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--ink-3)',
                fontFamily:'var(--font-mono)'}}>
                <span>S/15</span>
                <span style={{color:'var(--ink)', fontWeight:600}}>S/{priceMax}</span>
                <span>S/80</span>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div>
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              marginBottom: 20
            }}>
              <h2 style={{fontSize: 32}}>
                {q ? <>Resultados para <em style={{color:'var(--accent)'}}>"{q}"</em></> : 'Todos los huariques'}
                <span style={{fontFamily:'var(--font-mono)', fontSize: 13, color:'var(--ink-3)',
                  marginLeft: 12, fontStyle:'normal'}}>{results.length}</span>
              </h2>
              <select className="select" style={{width: 'auto'}} value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value="rating">Mejor calificados</option>
                <option value="price">Precio menor</option>
                <option value="reviews">Más reseñas</option>
              </select>
            </div>

            {results.length === 0 ? (
              <EmptyState
                title="Nada coincide aún"
                lead="Probá con otro término o ajusta los filtros."
                cta="Limpiar filtros" onCta={()=>{setQ(''); setCat('all'); setDistrict('all'); setPriceMax(80);}}
              />
            ) : (
              <div style={{
                display:'grid',
                gridTemplateColumns: layout==='grid' ? 'repeat(3, 1fr)' : '1fr',
                gap: layout==='grid' ? 20 : 14
              }}>
                {results.map(h => (
                  <HuariqueCard key={h.id} h={h}
                    layout={layout}
                    onOpen={(h)=>go('detail', {id: h.id})}
                    isFav={favIds.includes(h.id)}
                    onToggleFav={addFav}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, count, on, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'9px 12px', borderRadius:'var(--r-sm)',
        background: on ? 'var(--bg-soft)' : 'transparent',
        color: on ? 'var(--ink)' : 'var(--ink-2)',
        border:'none', textAlign:'left', fontSize: 14,
        fontWeight: on ? 600 : 400, cursor:'pointer',
        position:'relative',
      }}
      onMouseEnter={(e)=>{if(!on) e.currentTarget.style.background='var(--bg-soft)';}}
      onMouseLeave={(e)=>{if(!on) e.currentTarget.style.background='transparent';}}>
      <span style={{display:'flex', alignItems:'center', gap: 8}}>
        {on && <span style={{width:6, height:6, borderRadius:'50%', background:'var(--accent)'}}/>}
        {label}
      </span>
      {count !== undefined && (
        <span style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>{count}</span>
      )}
    </button>
  );
}

/* ============================================================
   DETAIL
============================================================ */
function DetailScreen({ go, params, addFav, favIds }) {
  const { HUARIQUES, REVIEWS } = window.PF_DATA;
  const h = HUARIQUES.find(x => x.id === Number(params.id)) || HUARIQUES[0];
  const reviews = REVIEWS[h.id] || REVIEWS[1];
  const isFav = favIds.includes(h.id);
  const [tab, setTab] = useS1('about');

  return (
    <div className="page-enter">
      <div className="wrap" style={{paddingTop: 24, paddingBottom: 16}}>
        <button className="btn btn--ghost btn--sm" onClick={()=>history.length > 1 ? go('results') : go('home')}>
          <Icon.back/> Volver
        </button>
      </div>

      {/* Hero gallery */}
      <section className="wrap" style={{paddingBottom: 40}}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'2fr 1fr 1fr',
          gridTemplateRows: '220px 220px',
          gap: 12,
          marginBottom: 32
        }}>
          <div style={{gridRow:'span 2', borderRadius:'var(--r-lg)', overflow:'hidden'}}>
            <SmartImg src={h.img} alt={h.name}/>
          </div>
          <div style={{borderRadius:'var(--r-lg)', overflow:'hidden'}}>
            <SmartImg src="img/cafe.jpg" alt="ambiente" label="ambiente"/>
          </div>
          <div style={{borderRadius:'var(--r-lg)', overflow:'hidden'}}>
            <SmartImg src="img/criolla.jpg" alt="plato" label="plato"/>
          </div>
          <div style={{borderRadius:'var(--r-lg)', overflow:'hidden'}}>
            <SmartImg src="img/parrillas.jpg" alt="cocina" label="cocina"/>
          </div>
          <div className="placeholder" style={{borderRadius:'var(--r-lg)'}}>
            + 12 fotos
          </div>
        </div>

        {/* Header */}
        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap: 24, alignItems:'start'}}>
          <div>
            <span className="eyebrow">{h.category} · {h.district}</span>
            <h1 style={{fontSize: 'clamp(40px, 5vw, 64px)', marginTop: 10, lineHeight: 1, letterSpacing:'-0.02em'}}>
              {h.name}
            </h1>
            <div style={{display:'flex', gap:24, alignItems:'center', marginTop: 16, flexWrap:'wrap'}}>
              <span style={{display:'flex', alignItems:'center', gap: 8}}>
                <Stars value={h.rating} size="lg"/>
                <strong style={{fontSize: 18}}>{h.rating}</strong>
                <span style={{color:'var(--ink-3)'}}>· {h.reviews} reseñas</span>
              </span>
              <span style={{color:'var(--line)'}}>|</span>
              <span style={{display:'flex', alignItems:'center', gap: 6, color:'var(--ink-2)'}}>
                <Icon.pin/> {h.address}
              </span>
              <span style={{color:'var(--line)'}}>|</span>
              <span style={{display:'flex', alignItems:'center', gap: 6, color:'var(--ink-2)'}}>
                <Icon.clock/> {h.hours}
              </span>
            </div>
          </div>
          <div style={{display:'flex', gap: 8}}>
            <button className="btn btn--ghost"
              onClick={()=>addFav(h)}>
              <Icon.heart style={{ fill: isFav?'var(--warm)':'none', stroke: isFav?'var(--warm)':'currentColor' }}/>
              {isFav?'Guardado':'Guardar'}
            </button>
            <button className="btn btn--accent" onClick={()=>go('review-new', { huariqueId: h.id })}>
              Escribir reseña
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="wrap" style={{paddingBottom: 80}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap: 56, alignItems:'start'}}>
          <div>
            {/* Tabs */}
            <div style={{
              display:'flex', gap: 4, borderBottom:'1px solid var(--line)',
              marginBottom: 32
            }}>
              {[
                {id:'about', label:'Sobre el lugar'},
                {id:'menu', label:'Lo recomendado'},
                {id:'reviews', label:`Reseñas (${reviews.length})`},
                {id:'photos', label:'Fotos'},
              ].map(t => (
                <button key={t.id} onClick={()=>setTab(t.id)}
                  style={{
                    padding:'14px 18px', border:'none', background:'transparent',
                    fontSize: 14, fontWeight: tab===t.id ? 600 : 400,
                    color: tab===t.id ? 'var(--ink)' : 'var(--ink-2)',
                    borderBottom: tab===t.id ? '2px solid var(--accent)' : '2px solid transparent',
                    marginBottom:'-1px', cursor:'pointer'
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'about' && (
              <div style={{display:'grid', gap: 32}}>
                <div>
                  <span className="eyebrow">Historia</span>
                  <p style={{fontFamily:'var(--font-display)', fontSize: 24, lineHeight: 1.4, marginTop: 12,
                    letterSpacing:'-0.005em'}}>
                    {h.bio}
                  </p>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 16}}>
                  {h.tags.map(t => (
                    <div key={t} style={{
                      padding:'16px 18px', borderRadius:'var(--r-md)',
                      background:'var(--bg-soft)', border:'1px solid var(--line-soft)'}}>
                      <div style={{fontSize: 11, color:'var(--ink-3)',
                        fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
                        Característica
                      </div>
                      <div style={{fontSize: 16, fontWeight: 500, marginTop: 4}}>{t}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="eyebrow">Ratings detallados</span>
                  <div style={{display:'grid', gap: 12, marginTop: 16}}>
                    {[
                      {k:'Comida', v: 4.8},
                      {k:'Servicio', v: 4.5},
                      {k:'Ambiente', v: 4.6},
                      {k:'Relación precio/calidad', v: 4.7},
                    ].map(r => (
                      <div key={r.k} style={{display:'grid', gridTemplateColumns:'160px 1fr 40px',
                        alignItems:'center', gap: 16, fontSize: 14}}>
                        <span style={{color:'var(--ink-2)'}}>{r.k}</span>
                        <div style={{height: 6, background:'var(--bg-soft)', borderRadius:'var(--r-pill)', overflow:'hidden'}}>
                          <div style={{width:`${(r.v/5)*100}%`, height:'100%', background:'var(--accent)'}}/>
                        </div>
                        <span style={{fontFamily:'var(--font-mono)', fontWeight: 600}}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'menu' && (
              <div style={{display:'grid', gap: 14}}>
                {[
                  { name:'Cuarto de pollo + papas + ensalada', price:'S/ 32', note:'Lo clásico, hecho bien.' },
                  { name:'Pollo entero + 4 papas + 2 cremas',  price:'S/ 78', note:'Para 3-4 personas.' },
                  { name:'Anticuchos de la casa (4u)',          price:'S/ 24', note:'Maíz y papa golden incluidos.' },
                  { name:'Ensalada Brasero',                    price:'S/ 18', note:'Palta, tomate, queso fresco.' },
                ].map(m => (
                  <div key={m.name} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'baseline', gap: 24,
                    padding:'18px 20px', borderRadius:'var(--r-md)',
                    border:'1px solid var(--line-soft)'
                  }}>
                    <div>
                      <div style={{fontSize: 16, fontWeight: 500}}>{m.name}</div>
                      <div style={{fontSize: 13, color:'var(--ink-3)', marginTop: 2}}>{m.note}</div>
                    </div>
                    <span style={{fontFamily:'var(--font-display)', fontSize: 22, whiteSpace:'nowrap'}}>{m.price}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'reviews' && (
              <div>
                <div style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  marginBottom: 24
                }}>
                  <span className="eyebrow">{reviews.length} reseñas reales</span>
                  <button className="btn btn--soft btn--sm"
                    onClick={()=>go('review-new', { huariqueId: h.id })}>
                    <Icon.plus/> Aportar
                  </button>
                </div>
                <div style={{display:'grid', gap: 20}}>
                  {reviews.map(r => <ReviewCard key={r.id} r={r}/>)}
                </div>
              </div>
            )}

            {tab === 'photos' && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12}}>
                {[h.img, 'img/parrillas.jpg', 'img/criolla.jpg', 'img/cafe.jpg', 'img/marina.jpg', 'img/postres.jpg'].map((src, i) => (
                  <div key={i} style={{aspectRatio:'1/1', borderRadius:'var(--r-md)', overflow:'hidden'}}>
                    <SmartImg src={src} alt={`foto ${i+1}`}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{
            position:'sticky', top: 96,
            padding: 24, borderRadius:'var(--r-lg)',
            background:'var(--bg-elev)', border:'1px solid var(--line-soft)',
            boxShadow:'var(--shadow-sm)',
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 20}}>
              <div>
                <span className="eyebrow">Precio promedio</span>
                <div style={{fontFamily:'var(--font-display)', fontSize: 38, lineHeight:1, marginTop: 4}}>
                  S/ {h.price}
                </div>
                <div style={{fontSize: 12, color:'var(--ink-3)', marginTop: 4}}>por persona</div>
              </div>
            </div>

            {h.promo && (
              <div style={{
                padding: 14, borderRadius:'var(--r-md)',
                background:'var(--accent)', color:'#fff', marginBottom: 20
              }}>
                <div style={{fontSize: 11, opacity:.75,
                  fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
                  Promo activa
                </div>
                <div style={{fontSize: 18, fontWeight: 500, marginTop: 4}}>
                  {h.promo.discount}% off · {h.promo.label}
                </div>
              </div>
            )}

            <div style={{display:'grid', gap: 12, fontSize: 14, marginBottom: 20}}>
              <SidebarLine icon={<Icon.pin/>} label="Dirección" value={h.address}/>
              <SidebarLine icon={<Icon.clock/>} label="Horario" value={h.hours}/>
              <SidebarLine icon={<Icon.phone/>} label="Teléfono" value={h.phone}/>
            </div>

            <button className="btn btn--accent" style={{width:'100%', marginBottom: 8}}
              onClick={()=>go('review-new', {huariqueId: h.id})}>
              Reservar mesa
            </button>
            <button className="btn btn--ghost" style={{width:'100%'}}
              onClick={()=>go('map')}>
              Ver en el mapa
            </button>

            <div style={{
              marginTop: 24, paddingTop: 20, borderTop:'1px solid var(--line-soft)',
              fontSize: 13, color:'var(--ink-3)', textAlign:'center'
            }}>
              Verificado por PointFlavor · Última visita: hace 2 semanas
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function SidebarLine({ icon, label, value }) {
  return (
    <div style={{display:'flex', gap: 12}}>
      <span style={{color:'var(--ink-3)', marginTop: 2}}>{icon}</span>
      <div>
        <div style={{fontSize: 11, color:'var(--ink-3)',
          fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
          {label}
        </div>
        <div>{value}</div>
      </div>
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <article style={{
      padding: 24, borderRadius:'var(--r-lg)',
      border:'1px solid var(--line-soft)',
      background:'var(--bg-elev)'
    }}>
      <header style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 14}}>
        <span style={{
          width: 40, height: 40, borderRadius:'50%',
          background:'var(--accent-soft)', color:'var(--accent)',
          display:'grid', placeItems:'center',
          fontFamily:'var(--font-mono)', fontSize: 13, fontWeight: 600
        }}>{r.initials}</span>
        <div style={{flex: 1}}>
          <div style={{fontWeight: 500}}>{r.author}</div>
          <div style={{fontSize: 12, color:'var(--ink-3)'}}>{r.when}</div>
        </div>
        <Stars value={r.rating}/>
      </header>
      <p style={{fontSize: 15, lineHeight: 1.6, color:'var(--ink-2)', marginBottom: 14}}>
        {r.text}
      </p>
      <div style={{display:'flex', gap: 6, flexWrap:'wrap'}}>
        {r.tags.map(t => <span key={t} className="badge">{t}</span>)}
      </div>
    </article>
  );
}

/* ============================================================
   MAP
============================================================ */
function MapScreen({ go, addFav, favIds }) {
  const { HUARIQUES, MAP_PINS, CATEGORIES } = window.PF_DATA;
  const [selected, setSelected] = useS1(MAP_PINS[0].id);
  const [cat, setCat] = useS1('all');

  const pins = useM1(() => cat==='all' ? MAP_PINS : MAP_PINS.filter(p => p.cat === cat), [cat]);
  const sel = MAP_PINS.find(p => p.id === selected);

  return (
    <div className="page-enter" style={{height:'calc(100vh - 73px)', display:'grid', gridTemplateColumns:'380px 1fr', overflow:'hidden'}}>
      {/* Sidebar */}
      <aside style={{
        borderRight:'1px solid var(--line-soft)',
        background:'var(--bg-elev)',
        display:'flex', flexDirection:'column', overflow:'hidden'
      }}>
        <div style={{padding: 20, borderBottom:'1px solid var(--line-soft)'}}>
          <span className="eyebrow">Explorar</span>
          <h2 style={{fontSize: 28, marginTop: 4, marginBottom: 14}}>Mapa de huariques</h2>
          <SearchField value="" onChange={()=>{}} placeholder="Buscar barrio o plato…"/>
          <div style={{display:'flex', gap: 6, marginTop: 14, overflowX:'auto', paddingBottom: 4}}>
            <button className={`chip ${cat==='all'?'chip--on':''}`} onClick={()=>setCat('all')}>Todo</button>
            {CATEGORIES.slice(0, 6).map(c => (
              <button key={c.id} className={`chip ${cat===c.id?'chip--on':''}`} onClick={()=>setCat(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{flex: 1, overflowY:'auto', padding: 12}}>
          <div style={{
            padding:'8px 8px 12px', display:'flex', justifyContent:'space-between',
            fontSize: 12, color:'var(--ink-3)', fontFamily:'var(--font-mono)',
            textTransform:'uppercase', letterSpacing:'0.08em'
          }}>
            <span>{pins.length} en la vista</span>
            <span>Ordenar: cercanos</span>
          </div>
          {pins.map(p => (
            <button key={p.id} onClick={()=>setSelected(p.id)}
              style={{
                display:'flex', gap: 12, padding: 12, width:'100%',
                background: selected===p.id ? 'var(--bg-soft)' : 'transparent',
                border:'1px solid', borderColor: selected===p.id ? 'var(--line)' : 'transparent',
                borderRadius:'var(--r-md)', textAlign:'left', cursor:'pointer',
                marginBottom: 4
              }}>
              <div style={{width: 64, height: 64, borderRadius:'var(--r-sm)', overflow:'hidden', flexShrink: 0}}>
                <SmartImg src={p.img} alt={p.name}/>
              </div>
              <div style={{minWidth: 0, flex: 1}}>
                <div style={{fontSize: 11, color:'var(--ink-3)',
                  fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em'}}>
                  {p.category}
                </div>
                <div style={{fontWeight: 500, fontSize: 15, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                  {p.name}
                </div>
                <div style={{fontSize: 12, color:'var(--ink-2)', marginTop: 2,
                  display:'flex', gap: 8, alignItems:'center'}}>
                  <span>★ {p.rating}</span>
                  <span style={{color:'var(--ink-3)'}}>·</span>
                  <span>{p.district}</span>
                  <span style={{color:'var(--ink-3)'}}>·</span>
                  <span>S/{p.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <div style={{position:'relative', overflow:'hidden',
        background: 'oklch(0.93 0.012 85)',
        backgroundImage: `
          linear-gradient(to right, var(--line-soft) 1px, transparent 1px),
          linear-gradient(to bottom, var(--line-soft) 1px, transparent 1px),
          radial-gradient(circle at 30% 40%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 50%),
          radial-gradient(circle at 70% 70%, color-mix(in oklch, var(--warm) 12%, transparent), transparent 50%)
        `,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%'
      }}>
        {/* fake roads */}
        <svg style={{position:'absolute', inset:0, width:'100%', height:'100%'}} preserveAspectRatio="none">
          <path d="M 0,180 Q 250,250 500,200 T 1000,260 T 1600,300" stroke="var(--line)" strokeWidth="14" fill="none" opacity=".6"/>
          <path d="M 0,180 Q 250,250 500,200 T 1000,260 T 1600,300" stroke="var(--bg-elev)" strokeWidth="8" fill="none"/>
          <path d="M 200,0 Q 280,300 360,500 T 500,1000" stroke="var(--line)" strokeWidth="10" fill="none" opacity=".5"/>
          <path d="M 200,0 Q 280,300 360,500 T 500,1000" stroke="var(--bg-elev)" strokeWidth="6" fill="none"/>
          <path d="M 800,0 L 820,600 L 900,1000" stroke="var(--line)" strokeWidth="10" fill="none" opacity=".5"/>
          <path d="M 800,0 L 820,600 L 900,1000" stroke="var(--bg-elev)" strokeWidth="6" fill="none"/>
          <path d="M 0,500 L 1600,540" stroke="var(--line)" strokeWidth="8" fill="none" opacity=".5"/>
          <path d="M 0,500 L 1600,540" stroke="var(--bg-elev)" strokeWidth="5" fill="none"/>
        </svg>

        {/* "park" patch */}
        <div style={{position:'absolute', left:'12%', top:'58%', width:'18%', height:'22%',
          background:'color-mix(in oklch, var(--success) 18%, transparent)',
          borderRadius: '40% 60% 50% 50%'}}/>
        <div style={{position:'absolute', left:'62%', top:'18%', width:'22%', height:'18%',
          background:'color-mix(in oklch, var(--success) 14%, transparent)',
          borderRadius: '50% 40% 60% 50%'}}/>

        {/* labels */}
        <div style={{position:'absolute', left:'18%', top:'24%', fontFamily:'var(--font-mono)',
          fontSize: 11, color:'var(--ink-3)', letterSpacing:'0.1em', textTransform:'uppercase'}}>
          Miraflores
        </div>
        <div style={{position:'absolute', left:'58%', top:'52%', fontFamily:'var(--font-mono)',
          fontSize: 11, color:'var(--ink-3)', letterSpacing:'0.1em', textTransform:'uppercase'}}>
          Surco
        </div>
        <div style={{position:'absolute', left:'30%', top:'78%', fontFamily:'var(--font-mono)',
          fontSize: 11, color:'var(--ink-3)', letterSpacing:'0.1em', textTransform:'uppercase'}}>
          Barranco
        </div>

        {/* pins */}
        {pins.map(p => (
          <button key={p.id} onClick={()=>setSelected(p.id)}
            style={{
              position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
              transform:'translate(-50%, -100%)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              zIndex: selected===p.id ? 20 : 10,
            }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap: 6,
              padding: selected===p.id ? '8px 14px' : '6px 12px',
              borderRadius:'var(--r-pill)',
              background: selected===p.id ? 'var(--ink)' : 'var(--bg-elev)',
              color: selected===p.id ? 'var(--ink-inv)' : 'var(--ink)',
              border:'1px solid', borderColor: selected===p.id ? 'var(--ink)' : 'var(--line)',
              boxShadow:'var(--shadow-md)',
              fontSize: 13, fontWeight: 500, whiteSpace:'nowrap',
              transition:'all .2s ease',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius:'50%',
                background: selected===p.id ? '#fff' : 'var(--accent)'
              }}/>
              S/{p.price}
            </span>
          </button>
        ))}

        {/* Floating preview card */}
        {sel && (
          <article style={{
            position:'absolute', bottom: 24, left: 24, right: 24,
            maxWidth: 480, marginInline: 'auto',
            background:'var(--bg-elev)',
            border:'1px solid var(--line)',
            borderRadius:'var(--r-xl)',
            boxShadow:'var(--shadow-lg)',
            display:'flex', overflow:'hidden',
            zIndex: 30,
          }}>
            <div style={{width: 130, flexShrink: 0}}>
              <SmartImg src={sel.img} alt={sel.name}/>
            </div>
            <div style={{padding: 16, flex: 1}}>
              <span className="eyebrow">{sel.category}</span>
              <h3 style={{fontSize: 22, marginTop: 4}}>{sel.name}</h3>
              <div style={{display:'flex', gap: 12, fontSize: 13, color:'var(--ink-2)', marginTop: 8}}>
                <span>★ {sel.rating}</span>
                <span>·</span>
                <span>{sel.district}</span>
                <span>·</span>
                <span>S/ {sel.price}</span>
              </div>
              <div style={{display:'flex', gap: 8, marginTop: 14}}>
                <button className="btn btn--accent btn--sm" onClick={()=>go('detail', {id: sel.id})}>
                  Ver detalles
                </button>
                <button className="btn btn--ghost btn--sm"
                  onClick={()=>addFav(sel)}>
                  <Icon.heart style={{ fill: favIds.includes(sel.id)?'var(--warm)':'none', stroke: favIds.includes(sel.id)?'var(--warm)':'currentColor' }}/>
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Map controls */}
        <div style={{position:'absolute', top: 16, right: 16,
          display:'flex', flexDirection:'column', gap: 4,
          background:'var(--bg-elev)', borderRadius:'var(--r-md)',
          border:'1px solid var(--line)', boxShadow:'var(--shadow-md)', overflow:'hidden'
        }}>
          <button className="btn btn--icon btn--ghost" style={{borderRadius: 0, border:'none'}}><Icon.plus/></button>
          <div style={{height: 1, background:'var(--line-soft)'}}/>
          <button className="btn btn--icon btn--ghost" style={{borderRadius: 0, border:'none'}}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FAVORITES
============================================================ */
function FavoritesScreen({ go, favs, addFav, favIds }) {
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Tu colección"
            title="Favoritos."
            lead={favs.length === 0
              ? 'Aún no has guardado ningún huarique. Toca el corazón para empezar.'
              : `${favs.length} ${favs.length===1?'lugar guardado':'lugares guardados'}.`}
          />
          {favs.length === 0 ? (
            <EmptyState
              title="Tu lista está esperando"
              lead="Guarda los lugares que quieras visitar y los tendrás siempre a mano."
              cta="Explorar huariques" onCta={()=>go('results')}
            />
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 20}}>
              {favs.map(h => (
                <HuariqueCard key={h.id} h={h}
                  onOpen={(h)=>go('detail', {id: h.id})}
                  isFav={true}
                  onToggleFav={addFav}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, CategoriesScreen, ResultsScreen, DetailScreen, MapScreen, FavoritesScreen,
});
