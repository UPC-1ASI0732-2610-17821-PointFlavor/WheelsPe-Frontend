// Promos, Plans, Owner screens, Contact
const { useState: useS3, useMemo: useM3 } = React;

/* ============================================================
   PROMOS
============================================================ */
function PromosScreen({ go }) {
  const { PROMOS, HUARIQUES } = window.PF_DATA;
  const [filter, setFilter] = useS3('all');
  const filters = ['all', '2x1', 'descuento', 'menú', 'happy hour'];
  const promos = useM3(() => filter === 'all' ? PROMOS : PROMOS.filter(p => p.type === filter), [filter]);
  const featured = PROMOS[0];
  const fHuar = HUARIQUES.find(h => h.id === featured.huariqueId);

  return (
    <div className="page-enter">
      {/* Hero promo */}
      <section className="section" style={{paddingBottom: 32}}>
        <div className="wrap">
          <SectionHead
            eyebrow="Promociones activas"
            title="Comer rico, pagar menos."
            lead="Las promos cambian cada semana. Te mostramos las verificadas, sin letras chiquitas."
          />
          <article style={{
            display:'grid', gridTemplateColumns:'1.2fr 1fr',
            background:'var(--ink)', color:'#fff',
            borderRadius:'var(--r-xl)', overflow:'hidden', minHeight: 380,
            cursor:'pointer'
          }} onClick={()=>go('detail', {id: featured.huariqueId})}>
            <div style={{position:'relative'}}>
              <SmartImg src={featured.img} alt={featured.title}/>
              <div style={{position:'absolute', top: 24, left: 24,
                padding:'8px 14px', borderRadius:'var(--r-pill)',
                background:'var(--accent)', color:'#fff', fontSize: 12,
                fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'
              }}>★ Promo destacada</div>
            </div>
            <div style={{padding:'56px 56px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <span className="eyebrow" style={{color:'rgba(255,255,255,.5)'}}>{featured.type}</span>
              <h2 style={{fontSize: 42, color:'#fff', marginTop: 12, lineHeight: 1.05}}>{featured.title}</h2>
              <p style={{color:'rgba(255,255,255,.7)', fontSize: 16, marginTop: 14, marginBottom: 28}}>{featured.note}</p>
              <div style={{display:'grid', gridTemplateColumns:'auto auto auto', gap: 24, fontSize: 13,
                color:'rgba(255,255,255,.7)', marginBottom: 28, alignItems:'center'}}>
                <div>
                  <div style={{fontFamily:'var(--font-mono)', fontSize: 11,
                    textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,.5)'}}>
                    Lugar
                  </div>
                  <div style={{color:'#fff', fontSize: 15, marginTop: 2}}>{fHuar?.name}</div>
                </div>
                <div>
                  <div style={{fontFamily:'var(--font-mono)', fontSize: 11,
                    textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,.5)'}}>
                    Vence
                  </div>
                  <div style={{color:'#fff', fontSize: 15, marginTop: 2}}>{featured.expires}</div>
                </div>
                <div>
                  <div style={{fontFamily:'var(--font-mono)', fontSize: 11,
                    textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,.5)'}}>
                    Código
                  </div>
                  <div style={{color:'#fff', fontSize: 15, marginTop: 2,
                    fontFamily:'var(--font-mono)'}}>{featured.code}</div>
                </div>
              </div>
              <button className="btn btn--accent" style={{justifySelf:'flex-start'}}>
                Ver el lugar <Icon.arrow/>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="section" style={{paddingTop: 24}}>
        <div className="wrap">
          <div style={{display:'flex', gap: 8, marginBottom: 32, flexWrap:'wrap'}}>
            {filters.map(f => (
              <button key={f} className={`chip ${filter===f?'chip--on':''}`}
                onClick={()=>setFilter(f)}>
                {filter===f && <Icon.check/>} {f === 'all' ? 'Todas' : f}
              </button>
            ))}
            <span style={{marginLeft:'auto', alignSelf:'center', fontSize: 12, color:'var(--ink-3)',
              fontFamily:'var(--font-mono)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
              {promos.length} activas
            </span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 20}}>
            {promos.map(p => {
              const h = HUARIQUES.find(x => x.id === p.huariqueId);
              return (
                <article key={p.id} className="card" style={{cursor:'pointer'}}
                  onClick={()=>go('detail', {id: p.huariqueId})}>
                  <div style={{position:'relative', aspectRatio:'4/3', overflow:'hidden'}}>
                    <SmartImg src={p.img} alt={p.title}/>
                    <div style={{position:'absolute', top: 14, left: 14}}>
                      <span className="badge badge--accent">{p.type}</span>
                    </div>
                    <div style={{
                      position:'absolute', bottom: 14, right: 14,
                      width: 70, height: 70, borderRadius:'50%',
                      background:'var(--bg-elev)', display:'grid', placeItems:'center',
                      boxShadow:'var(--shadow-md)', textAlign:'center', lineHeight: 1
                    }}>
                      <div>
                        <div style={{fontFamily:'var(--font-display)', fontSize: 22, color:'var(--accent)'}}>
                          {p.discount}%
                        </div>
                        <div style={{fontSize: 9, color:'var(--ink-3)',
                          fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em',
                          marginTop: 2}}>
                          off
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{padding: 20}}>
                    <span className="eyebrow">{h?.name} · {h?.district}</span>
                    <h3 style={{fontSize: 20, marginTop: 6, marginBottom: 8}}>{p.title}</h3>
                    <p style={{fontSize: 13, color:'var(--ink-2)', marginBottom: 14, minHeight: 36}}>{p.note}</p>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                      paddingTop: 14, borderTop:'1px dashed var(--line)',
                      fontSize: 12, color:'var(--ink-3)',
                      fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em'}}>
                      <span>{p.code}</span>
                      <span>vence {p.expires}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PLANS
============================================================ */
function PlansScreen({ go }) {
  const [billing, setBilling] = useS3('monthly');
  const plans = [
    { id:'free', name:'Curioso', price:{monthly:0, yearly:0}, tag:'Para empezar',
      desc:'Explora el mapa de huariques sin compromisos.',
      features:['+1.800 huariques','Reseñas de la comunidad','Búsqueda por barrio','Listas curadas (1 al mes)'], cta:'Plan actual', muted:true },
    { id:'pro', name:'Sibarita', price:{monthly:24, yearly:228}, tag:'Más popular',
      desc:'Para quien come fuera con frecuencia y quiere ahorrar.', highlight: true,
      features:['Todo lo del plan Curioso','Promos exclusivas (hasta 30% off)','Reservas con prioridad','Listas curadas semanales','Sin anuncios'], cta:'Suscribirme' },
    { id:'foodie', name:'Foodie Pro', price:{monthly:49, yearly:468}, tag:'Para acompañantes',
      desc:'Beneficios para ti y para una persona acompañante.',
      features:['Todo lo del plan Sibarita','2 cuentas vinculadas','Acceso a eventos exclusivos','Curador personal vía chat','Cancelación gratuita en reservas'], cta:'Probar 14 días' },
  ];

  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <div style={{textAlign:'center', maxWidth: 720, marginInline:'auto', marginBottom: 56}}>
            <span className="eyebrow">Planes</span>
            <h1 style={{fontSize:'clamp(44px, 5vw, 72px)', marginTop: 12, lineHeight: 1, letterSpacing:'-0.02em'}}>
              Elige cómo quieres comer.
            </h1>
            <p style={{color:'var(--ink-2)', fontSize: 17, marginTop: 18}}>
              Sin permanencias. Cancelas cuando quieras. La curaduría es la misma:
              honesta y hecha por personas.
            </p>
            <div style={{
              display:'inline-flex', marginTop: 28, padding: 4,
              background:'var(--bg-soft)', borderRadius:'var(--r-pill)'
            }}>
              <button onClick={()=>setBilling('monthly')}
                style={{
                  padding:'10px 18px', borderRadius:'var(--r-pill)', border:'none',
                  fontSize: 14, fontWeight: 500, cursor:'pointer',
                  background: billing==='monthly' ? 'var(--bg-elev)' : 'transparent',
                  boxShadow: billing==='monthly' ? 'var(--shadow-sm)' : 'none',
                }}>Mensual</button>
              <button onClick={()=>setBilling('yearly')}
                style={{
                  padding:'10px 18px', borderRadius:'var(--r-pill)', border:'none',
                  fontSize: 14, fontWeight: 500, cursor:'pointer', display:'flex', alignItems:'center', gap: 8,
                  background: billing==='yearly' ? 'var(--bg-elev)' : 'transparent',
                  boxShadow: billing==='yearly' ? 'var(--shadow-sm)' : 'none',
                }}>
                Anual <span className="badge badge--accent" style={{fontSize: 10, padding:'2px 8px'}}>-20%</span>
              </button>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 20}}>
            {plans.map(p => (
              <article key={p.id} style={{
                padding: 32, borderRadius:'var(--r-xl)',
                background: p.highlight ? 'var(--ink)' : 'var(--bg-elev)',
                color: p.highlight ? '#fff' : 'var(--ink)',
                border: '1px solid', borderColor: p.highlight ? 'var(--ink)' : 'var(--line-soft)',
                position:'relative',
                boxShadow: p.highlight ? 'var(--shadow-lg)' : 'none',
              }}>
                {p.highlight && (
                  <div style={{
                    position:'absolute', top:-12, left: 32,
                    padding:'4px 12px', borderRadius:'var(--r-pill)',
                    background:'var(--accent)', color:'#fff',
                    fontSize: 11, fontFamily:'var(--font-mono)',
                    textTransform:'uppercase', letterSpacing:'0.08em'
                  }}>{p.tag}</div>
                )}
                <span className="eyebrow" style={{color: p.highlight?'rgba(255,255,255,.6)':undefined}}>
                  {!p.highlight && p.tag}
                </span>
                <h3 style={{fontSize: 32, marginTop: 6, color: p.highlight?'#fff':'var(--ink)'}}>{p.name}</h3>
                <p style={{color: p.highlight?'rgba(255,255,255,.7)':'var(--ink-2)',
                  fontSize: 14, marginTop: 8, marginBottom: 24, minHeight: 40}}>{p.desc}</p>
                <div style={{display:'flex', alignItems:'baseline', gap: 6, marginBottom: 24}}>
                  <span style={{fontFamily:'var(--font-display)', fontSize: 56, lineHeight: 1, letterSpacing:'-0.02em',
                    color: p.highlight?'#fff':'var(--ink)'}}>
                    S/{billing==='yearly' ? Math.round(p.price.yearly/12) : p.price.monthly}
                  </span>
                  <span style={{fontSize: 13, color: p.highlight?'rgba(255,255,255,.5)':'var(--ink-3)'}}>
                    /mes
                  </span>
                </div>
                {billing==='yearly' && p.price.yearly > 0 && (
                  <div style={{
                    fontSize: 12, color: p.highlight?'rgba(255,255,255,.55)':'var(--ink-3)',
                    fontFamily:'var(--font-mono)', marginBottom: 24, marginTop:-12
                  }}>
                    S/{p.price.yearly} cobrado anualmente
                  </div>
                )}
                <button className="btn"
                  style={{
                    width:'100%', marginBottom: 28,
                    background: p.muted ? 'transparent' : (p.highlight ? '#fff' : 'var(--accent)'),
                    color: p.muted ? 'var(--ink-2)' : (p.highlight ? 'var(--ink)' : '#fff'),
                    border: p.muted ? '1px solid var(--line)' : 'none',
                  }}
                  onClick={()=>!p.muted && go('payment', {planId: p.id, billing})}
                  disabled={p.muted}>
                  {p.cta}
                </button>
                <div style={{height: 1, background: p.highlight?'rgba(255,255,255,.12)':'var(--line-soft)', marginBottom: 20}}/>
                <span className="eyebrow" style={{color: p.highlight?'rgba(255,255,255,.5)':undefined}}>Incluye</span>
                <ul style={{listStyle:'none', padding: 0, margin:'12px 0 0', display:'grid', gap: 10}}>
                  {p.features.map(f => (
                    <li key={f} style={{display:'flex', gap: 10, alignItems:'flex-start',
                      fontSize: 14,
                      color: p.highlight?'rgba(255,255,255,.85)':'var(--ink-2)'}}>
                      <Icon.check style={{color: p.highlight ? '#fff' : 'var(--accent)', marginTop: 3, flexShrink: 0}}/>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div style={{marginTop: 64, textAlign:'center'}}>
            <p style={{color:'var(--ink-2)', fontSize: 14}}>
              ¿Tienes un equipo o empresa? <a href="#" style={{color:'var(--accent)', fontWeight: 500}}
                onClick={(e)=>{e.preventDefault(); go('contact');}}>Hablemos →</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PAYMENT
============================================================ */
function PaymentScreen({ go, params }) {
  const [tab, setTab] = useS3('card');
  const [number, setNumber] = useS3('4242 4242 4242 4242');
  const [expiry, setExpiry] = useS3('12/27');
  const [cvc, setCvc] = useS3('123');
  const [name, setName] = useS3('CAMILA TORRES');
  const billing = params.billing || 'monthly';
  const planLabel = params.planId === 'foodie' ? 'Foodie Pro' : 'Sibarita';
  const price = params.planId === 'foodie' ? (billing==='yearly'?39:49) : (billing==='yearly'?19:24);
  const submit = (e) => { e.preventDefault(); go('home'); };

  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <button className="btn btn--ghost btn--sm" onClick={()=>go('plans')} style={{marginBottom: 24}}>
            <Icon.back/> Volver a planes
          </button>
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 56, alignItems:'start'}}>
            {/* Form */}
            <div>
              <span className="eyebrow">Pago seguro</span>
              <h1 style={{fontSize:'clamp(36px, 4vw, 52px)', marginTop: 12, marginBottom: 24, lineHeight: 1.05}}>
                Confirma tu suscripción.
              </h1>
              <div style={{display:'flex', gap: 6, marginBottom: 24, padding: 4,
                background:'var(--bg-soft)', borderRadius:'var(--r-md)', width:'fit-content'}}>
                {[
                  {id:'card', label:'Tarjeta'},
                  {id:'yape', label:'Yape / Plin'},
                  {id:'paypal', label:'PayPal'},
                ].map(t => (
                  <button key={t.id} onClick={()=>setTab(t.id)}
                    style={{
                      padding:'8px 14px', border:'none', borderRadius:'var(--r-sm)',
                      background: tab===t.id ? 'var(--bg-elev)' : 'transparent',
                      fontSize: 13, fontWeight: 500, cursor:'pointer',
                      boxShadow: tab===t.id ? 'var(--shadow-sm)' : 'none'
                    }}>{t.label}</button>
                ))}
              </div>

              {tab === 'card' && (
                <form onSubmit={submit} style={{display:'grid', gap: 16}}>
                  <div style={{
                    padding: 24, borderRadius:'var(--r-lg)',
                    background:'linear-gradient(135deg, var(--ink), oklch(0.30 0.02 70))',
                    color:'#fff', minHeight: 200, position:'relative', overflow:'hidden',
                    boxShadow:'var(--shadow-lg)'
                  }}>
                    <span className="eyebrow" style={{color:'rgba(255,255,255,.55)'}}>PointFlavor — Sibarita</span>
                    <div style={{
                      fontFamily:'var(--font-mono)', fontSize: 22, letterSpacing:'0.1em',
                      marginTop: 32, marginBottom: 24
                    }}>{number}</div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize: 13}}>
                      <div>
                        <div style={{fontSize: 10, color:'rgba(255,255,255,.5)',
                          fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
                          Titular
                        </div>
                        <div style={{marginTop: 4, fontWeight: 500}}>{name}</div>
                      </div>
                      <div>
                        <div style={{fontSize: 10, color:'rgba(255,255,255,.5)',
                          fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
                          Vence
                        </div>
                        <div style={{marginTop: 4, fontFamily:'var(--font-mono)'}}>{expiry}</div>
                      </div>
                    </div>
                    <div style={{position:'absolute', top: 24, right: 24,
                      width: 36, height: 24, borderRadius: 4,
                      background:'linear-gradient(135deg, #f9b234, #f55249)'
                    }}/>
                  </div>

                  <div>
                    <label className="field-label">Número de tarjeta</label>
                    <input className="input input--lg" value={number}
                      onChange={(e)=>setNumber(e.target.value)} maxLength={19}/>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
                    <div>
                      <label className="field-label">Vencimiento</label>
                      <input className="input input--lg" value={expiry}
                        onChange={(e)=>setExpiry(e.target.value)} maxLength={5}/>
                    </div>
                    <div>
                      <label className="field-label">CVC</label>
                      <input className="input input--lg" value={cvc}
                        onChange={(e)=>setCvc(e.target.value)} maxLength={4}/>
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Nombre del titular</label>
                    <input className="input input--lg" value={name}
                      onChange={(e)=>setName(e.target.value.toUpperCase())}/>
                  </div>
                  <button type="submit" className="btn btn--accent btn--lg" style={{marginTop: 16}}>
                    Confirmar pago · S/{price}
                  </button>
                  <p style={{fontSize: 12, color:'var(--ink-3)', textAlign:'center'}}>
                    🔒 Procesado por Stripe. PointFlavor no almacena tus datos de tarjeta.
                  </p>
                </form>
              )}

              {tab === 'yape' && (
                <div style={{textAlign:'center', padding: 40, borderRadius:'var(--r-lg)',
                  border:'1px solid var(--line-soft)'}}>
                  <div style={{
                    width: 200, height: 200, marginInline:'auto',
                    background:'#fff', border:'1px solid var(--line)',
                    borderRadius:'var(--r-md)', backgroundImage:`
                      linear-gradient(45deg, var(--ink) 25%, transparent 25%),
                      linear-gradient(-45deg, var(--ink) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, var(--ink) 75%),
                      linear-gradient(-45deg, transparent 75%, var(--ink) 75%)`,
                    backgroundSize: '12px 12px',
                    backgroundPosition:'0 0, 0 6px, 6px -6px, -6px 0',
                  }}/>
                  <p style={{marginTop: 24, color:'var(--ink-2)'}}>
                    Escanea el código con la app de Yape o Plin
                  </p>
                  <p style={{fontFamily:'var(--font-mono)', fontSize: 22, marginTop: 8}}>
                    S/ {price}.00
                  </p>
                </div>
              )}

              {tab === 'paypal' && (
                <div style={{textAlign:'center', padding: 40, borderRadius:'var(--r-lg)',
                  border:'1px solid var(--line-soft)'}}>
                  <p style={{color:'var(--ink-2)'}}>Te redirigiremos a PayPal para confirmar el pago.</p>
                  <button className="btn btn--accent btn--lg" style={{marginTop: 24}}
                    onClick={submit}>Continuar con PayPal</button>
                </div>
              )}
            </div>

            {/* Summary */}
            <aside style={{
              position:'sticky', top: 96,
              padding: 28, borderRadius:'var(--r-xl)',
              background:'var(--bg-soft)', border:'1px solid var(--line-soft)'
            }}>
              <span className="eyebrow">Tu compra</span>
              <h3 style={{fontSize: 24, marginTop: 8, marginBottom: 24}}>Plan {planLabel}</h3>
              <div style={{display:'grid', gap: 12, fontSize: 14, marginBottom: 20}}>
                <Row k="Plan" v={planLabel}/>
                <Row k="Facturación" v={billing==='yearly'?'Anual':'Mensual'}/>
                <Row k="Próximo cobro" v="15 de junio, 2026"/>
                <Row k="Subtotal" v={`S/ ${price}.00`}/>
                {billing==='yearly' && <Row k="Descuento anual" v="-20%" accent/>}
                <Row k="Impuestos" v="Incluidos"/>
              </div>
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'baseline',
                paddingTop: 16, borderTop:'1px solid var(--line)'
              }}>
                <span style={{fontSize: 15, fontWeight: 500}}>Total hoy</span>
                <span style={{fontFamily:'var(--font-display)', fontSize: 32}}>S/ {price}</span>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin:'24px 0 0', display:'grid', gap: 10}}>
                {['Cancela cuando quieras','Garantía 14 días','Soporte humano vía chat'].map(p => (
                  <li key={p} style={{display:'flex', gap: 8, alignItems:'center', fontSize: 13, color:'var(--ink-2)'}}>
                    <Icon.check style={{color:'var(--success)'}}/> {p}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
function Row({ k, v, accent }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between'}}>
      <span style={{color:'var(--ink-3)'}}>{k}</span>
      <span style={{fontWeight: 500, color: accent?'var(--accent)':'var(--ink)'}}>{v}</span>
    </div>
  );
}

/* ============================================================
   OWNER DASHBOARD
============================================================ */
function OwnerDashboardScreen({ go }) {
  const stats = [
    { k: 'Visitas', v: '1,284', d: '+12% vs sem. pasada', up: true },
    { k: 'Reservas', v: '46', d: '+4 esta semana', up: true },
    { k: 'Reseñas nuevas', v: '8', d: '2 sin responder', up: false },
    { k: 'Rating', v: '4.7', d: 'estable', up: true },
  ];
  const reviewsPending = [
    { id: 1, who:'Diego F.', when:'hace 2 días', stars: 4,
      text:'Buen pollo, pero la atención fue muy lenta un sábado. Volveré entre semana.' },
    { id: 2, who:'María Q.', when:'hace 5 días', stars: 5,
      text:'¡La mejor brasa de Lima! El brasero le da un sabor único.' },
  ];
  const promos = [
    { id: 1, title:'2x1 en cuartos los martes', state:'activa', end:'Vence 28 jun', uses: 38 },
    { id: 2, title:'10% off para grupos +6',  state:'activa', end:'Sin vencimiento', uses: 14 },
    { id: 3, title:'Combo familia',            state:'borrador', end:'—', uses: 0 },
  ];

  return (
    <div className="page-enter">
      <section style={{padding:'40px 0', borderBottom:'1px solid var(--line-soft)',
        background:'var(--bg-soft)'}}>
        <div className="wrap" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap: 16}}>
          <div>
            <span className="eyebrow">Panel de dueño</span>
            <h1 style={{fontSize: 'clamp(32px, 4vw, 44px)', marginTop: 8, lineHeight: 1.05}}>
              El Brasero del Maestro
            </h1>
            <p style={{color:'var(--ink-2)', fontSize: 15, marginTop: 8}}>
              Av. Comandante Espinar 410, Miraflores · Verificado
            </p>
          </div>
          <div style={{display:'flex', gap: 10}}>
            <button className="btn btn--ghost" onClick={()=>go('owner-promos')}>Mis promos</button>
            <button className="btn btn--accent" onClick={()=>go('owner-promo-new')}>
              <Icon.plus/> Nueva promo
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {/* Stats */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16, marginBottom: 48}}>
            {stats.map(s => (
              <article key={s.k} style={{
                padding: 24, borderRadius:'var(--r-lg)',
                background:'var(--bg-elev)', border:'1px solid var(--line-soft)'
              }}>
                <span className="eyebrow">{s.k}</span>
                <div style={{fontFamily:'var(--font-display)', fontSize: 44, lineHeight: 1, marginTop: 8}}>
                  {s.v}
                </div>
                <div style={{
                  marginTop: 10, fontSize: 12,
                  color: s.up ? 'var(--success)' : 'var(--warm)',
                  fontFamily:'var(--font-mono)', letterSpacing:'0.05em'
                }}>
                  {s.up ? '↑ ' : '· '}{s.d}
                </div>
              </article>
            ))}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap: 32, alignItems:'start'}}>
            {/* Reviews */}
            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 16}}>
                <h2 style={{fontSize: 26}}>Reseñas por responder</h2>
                <a href="#" style={{color:'var(--accent)', fontSize: 14, fontWeight: 500}}>Ver todas →</a>
              </div>
              <div style={{display:'grid', gap: 12}}>
                {reviewsPending.map(r => (
                  <article key={r.id} style={{
                    padding: 20, borderRadius:'var(--r-lg)',
                    border:'1px solid var(--line-soft)', background:'var(--bg-elev)'
                  }}>
                    <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
                      <div>
                        <strong>{r.who}</strong>
                        <span style={{color:'var(--ink-3)', fontSize: 13, marginLeft: 8}}>· {r.when}</span>
                      </div>
                      <Stars value={r.stars}/>
                    </header>
                    <p style={{color:'var(--ink-2)', fontSize: 14, marginBottom: 14}}>{r.text}</p>
                    <div style={{display:'flex', gap: 8}}>
                      <button className="btn btn--soft btn--sm">Responder</button>
                      <button className="btn btn--ghost btn--sm">Marcar como vista</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Promos quick */}
            <aside>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 16}}>
                <h3 style={{fontSize: 20}}>Tus promos</h3>
                <button className="btn btn--ghost btn--sm" onClick={()=>go('owner-promos')}>Gestionar</button>
              </div>
              <div style={{display:'grid', gap: 8}}>
                {promos.map(p => (
                  <div key={p.id} style={{
                    padding: 16, borderRadius:'var(--r-md)',
                    border:'1px solid var(--line-soft)', background:'var(--bg-elev)'
                  }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                      <strong style={{fontSize: 14}}>{p.title}</strong>
                      <span className={`badge ${p.state==='activa'?'badge--accent':''}`}>{p.state}</span>
                    </div>
                    <div style={{fontSize: 12, color:'var(--ink-3)', marginTop: 6,
                      display:'flex', justifyContent:'space-between'}}>
                      <span>{p.end}</span>
                      <span style={{fontFamily:'var(--font-mono)'}}>{p.uses} usos</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   OWNER PROMOS LIST
============================================================ */
function OwnerPromosScreen({ go }) {
  const promos = [
    { id: 1, title:'2x1 en cuartos', type:'2x1', state:'activa', end:'28 jun', uses: 38, max: 50 },
    { id: 2, title:'10% off para grupos +6', type:'descuento', state:'activa', end:'sin vencer', uses: 14, max: 999 },
    { id: 3, title:'Combo familia (4 pers.)', type:'menú', state:'borrador', end:'—', uses: 0, max: 0 },
    { id: 4, title:'Happy hour anticuchos', type:'happy hour', state:'pausada', end:'15 may', uses: 92, max: 100 },
  ];
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 32}}>
            <div>
              <span className="eyebrow">Promociones</span>
              <h1 style={{fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 12, lineHeight: 1.05}}>
                Tus promociones
              </h1>
            </div>
            <button className="btn btn--accent" onClick={()=>go('owner-promo-new')}>
              <Icon.plus/> Nueva promo
            </button>
          </div>
          <div style={{
            border:'1px solid var(--line-soft)', borderRadius:'var(--r-lg)',
            background:'var(--bg-elev)', overflow:'hidden'
          }}>
            <header style={{
              display:'grid',
              gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr',
              padding:'14px 20px', background:'var(--bg-soft)',
              borderBottom:'1px solid var(--line-soft)',
              fontSize: 11, color:'var(--ink-3)',
              fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'
            }}>
              <span>Promo</span><span>Tipo</span><span>Estado</span><span>Vence</span><span>Usos</span><span></span>
            </header>
            {promos.map(p => (
              <div key={p.id} style={{
                display:'grid',
                gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr',
                padding:'18px 20px',
                borderBottom:'1px solid var(--line-soft)',
                alignItems:'center', fontSize: 14
              }}>
                <strong>{p.title}</strong>
                <span style={{color:'var(--ink-2)'}}>{p.type}</span>
                <span><span className={`badge ${p.state==='activa'?'badge--accent':''}`}>{p.state}</span></span>
                <span style={{color:'var(--ink-2)', fontFamily:'var(--font-mono)', fontSize: 13}}>{p.end}</span>
                <span style={{display:'flex', alignItems:'center', gap: 8}}>
                  <span style={{fontFamily:'var(--font-mono)', fontSize: 13}}>{p.uses}</span>
                  {p.max > 0 && p.max < 999 && (
                    <span style={{flex: 1, height: 4, background:'var(--bg-soft)', borderRadius: 4, maxWidth: 60}}>
                      <span style={{display:'block', width:`${(p.uses/p.max)*100}%`, height:'100%',
                        background:'var(--accent)', borderRadius: 4}}/>
                    </span>
                  )}
                </span>
                <span style={{display:'flex', gap: 6, justifyContent:'flex-end'}}>
                  <button className="btn btn--ghost btn--sm">Editar</button>
                  <button className="btn btn--ghost btn--sm">···</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   OWNER NEW PROMO
============================================================ */
function OwnerPromoNewScreen({ go }) {
  const [title, setTitle] = useS3('');
  const [type, setType] = useS3('descuento');
  const [discount, setDiscount] = useS3(20);
  const [start, setStart] = useS3('2026-05-15');
  const [end, setEnd] = useS3('2026-06-30');
  const [days, setDays] = useS3(['mar','mie','jue']);
  const [code, setCode] = useS3('BRASA20');

  const dayList = [['lun','Lun'], ['mar','Mar'], ['mie','Mié'], ['jue','Jue'], ['vie','Vie'], ['sab','Sáb'], ['dom','Dom']];
  const toggleDay = (d) => {
    if (days.includes(d)) setDays(days.filter(x => x!==d));
    else setDays([...days, d]);
  };

  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <button className="btn btn--ghost btn--sm" onClick={()=>go('owner-promos')} style={{marginBottom: 16}}>
            <Icon.back/> Volver a promociones
          </button>
          <span className="eyebrow">Nueva promoción</span>
          <h1 style={{fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 12, marginBottom: 32, lineHeight: 1.05}}>
            Crea una promo que enganche.
          </h1>

          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 48, alignItems:'start'}}>
            <form style={{display:'grid', gap: 28}}>
              <PrefSection title="Lo básico">
                <div style={{display:'grid', gap: 14}}>
                  <div>
                    <label className="field-label">Título</label>
                    <input className="input input--lg" value={title}
                      onChange={(e)=>setTitle(e.target.value)}
                      placeholder='Ej. "2x1 en cuartos los martes"'/>
                  </div>
                  <div>
                    <label className="field-label">Tipo</label>
                    <div style={{display:'flex', gap: 6, flexWrap:'wrap'}}>
                      {['descuento','2x1','menú','happy hour','combo'].map(t => (
                        <button key={t} type="button"
                          className={`chip ${type===t?'chip--on':''}`}
                          onClick={()=>setType(t)}>
                          {type===t && <Icon.check/>} {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Descuento ({discount}%)</label>
                    <input type="range" min="5" max="50" step="5" value={discount}
                      onChange={(e)=>setDiscount(Number(e.target.value))}
                      style={{width:'100%', accentColor:'var(--accent)'}}/>
                    <div style={{display:'flex', justifyContent:'space-between',
                      fontSize: 11, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>
                      <span>5%</span><span>25%</span><span>50%</span>
                    </div>
                  </div>
                </div>
              </PrefSection>

              <PrefSection title="Disponibilidad">
                <div style={{display:'grid', gap: 14}}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
                    <div>
                      <label className="field-label">Inicia</label>
                      <input className="input" type="date" value={start} onChange={(e)=>setStart(e.target.value)}/>
                    </div>
                    <div>
                      <label className="field-label">Termina</label>
                      <input className="input" type="date" value={end} onChange={(e)=>setEnd(e.target.value)}/>
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Días aplicables</label>
                    <div style={{display:'flex', gap: 6, flexWrap:'wrap'}}>
                      {dayList.map(([d, label]) => (
                        <button key={d} type="button"
                          className={`chip ${days.includes(d)?'chip--on':''}`}
                          onClick={()=>toggleDay(d)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PrefSection>

              <PrefSection title="Código de canje">
                <div>
                  <label className="field-label">Código</label>
                  <input className="input input--lg" value={code}
                    onChange={(e)=>setCode(e.target.value.toUpperCase())}
                    style={{fontFamily:'var(--font-mono)', letterSpacing:'0.1em', fontSize: 16}}/>
                  <p style={{fontSize: 12, color:'var(--ink-3)', marginTop: 6}}>
                    Los usuarios deberán mostrar este código al pedir.
                  </p>
                </div>
              </PrefSection>

              <div style={{display:'flex', gap: 12, paddingTop: 20, borderTop:'1px solid var(--line-soft)'}}>
                <button type="button" className="btn btn--accent btn--lg"
                  onClick={()=>go('owner-promos')}>
                  Publicar promoción
                </button>
                <button type="button" className="btn btn--ghost btn--lg">Guardar borrador</button>
              </div>
            </form>

            {/* Live preview */}
            <aside style={{position:'sticky', top: 96}}>
              <span className="eyebrow">Vista previa</span>
              <article className="card" style={{marginTop: 12}}>
                <div style={{position:'relative', aspectRatio:'4/3', overflow:'hidden'}}>
                  <SmartImg src="img/promo-1.jpg" alt="preview"/>
                  <div style={{position:'absolute', top: 14, left: 14}}>
                    <span className="badge badge--accent">{type}</span>
                  </div>
                  <div style={{position:'absolute', bottom: 14, right: 14,
                    width: 70, height: 70, borderRadius:'50%',
                    background:'var(--bg-elev)', display:'grid', placeItems:'center',
                    boxShadow:'var(--shadow-md)', textAlign:'center', lineHeight: 1}}>
                    <div>
                      <div style={{fontFamily:'var(--font-display)', fontSize: 22, color:'var(--accent)'}}>
                        {discount}%
                      </div>
                      <div style={{fontSize: 9, color:'var(--ink-3)',
                        fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em',
                        marginTop: 2}}>off</div>
                    </div>
                  </div>
                </div>
                <div style={{padding: 18}}>
                  <span className="eyebrow">El Brasero del Maestro · Miraflores</span>
                  <h3 style={{fontSize: 18, marginTop: 6}}>
                    {title || 'Título de tu promoción'}
                  </h3>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                    paddingTop: 12, borderTop:'1px dashed var(--line)', marginTop: 12,
                    fontSize: 12, color:'var(--ink-3)',
                    fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em'}}>
                    <span>{code}</span>
                    <span>{days.length} días/sem</span>
                  </div>
                </div>
              </article>
              <div style={{
                marginTop: 16, padding: 16, borderRadius:'var(--r-md)',
                background:'var(--bg-soft)', border:'1px dashed var(--line)',
                fontSize: 12, color:'var(--ink-3)', lineHeight: 1.5
              }}>
                <strong style={{color:'var(--ink-2)', display:'block', marginBottom: 6}}>Tip</strong>
                Las promos con foto generan 3x más clics. Asegúrate de tener una imagen del plato en alta calidad.
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   CONTACT
============================================================ */
function ContactScreen({ go }) {
  const [name, setName] = useS3('');
  const [email, setEmail] = useS3('');
  const [topic, setTopic] = useS3('partnership');
  const [msg, setMsg] = useS3('');
  const [sent, setSent] = useS3(false);
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap: 80, alignItems:'start'}}>
            <div>
              <span className="eyebrow">Hablemos</span>
              <h1 style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop: 12, lineHeight: 1, letterSpacing:'-0.02em'}}>
                Cuéntanos en qué podemos ayudar.
              </h1>
              <p style={{color:'var(--ink-2)', fontSize: 16, marginTop: 18, marginBottom: 40, maxWidth: 380}}>
                Respondemos en menos de 24 horas (días hábiles).
                También puedes escribirnos directo.
              </p>
              <div style={{display:'grid', gap: 18}}>
                <ContactLine k="Email" v="hola@pointflavor.pe"/>
                <ContactLine k="Soporte" v="ayuda@pointflavor.pe"/>
                <ContactLine k="Prensa" v="prensa@pointflavor.pe"/>
                <ContactLine k="Oficina" v="Calle Berlín 442 · Miraflores, Lima 15074"/>
                <ContactLine k="Horario" v="Lun a Vie · 09:00 — 18:00"/>
              </div>
            </div>
            <article style={{
              padding: 40, borderRadius:'var(--r-xl)',
              background:'var(--bg-elev)', border:'1px solid var(--line-soft)',
              boxShadow:'var(--shadow-md)',
            }}>
              {sent ? (
                <div style={{textAlign:'center', padding:'32px 0'}}>
                  <div style={{
                    width: 56, height: 56, borderRadius:'50%',
                    background:'var(--accent)', color:'#fff',
                    display:'grid', placeItems:'center', marginInline:'auto',
                    marginBottom: 24
                  }}><Icon.check/></div>
                  <h3 style={{fontSize: 28}}>Mensaje recibido</h3>
                  <p style={{color:'var(--ink-2)', marginTop: 12, maxWidth: 320, marginInline:'auto'}}>
                    Gracias, {name.split(' ')[0] || 'amig@'}. Te responderemos a {email} cuanto antes.
                  </p>
                  <button className="btn btn--ghost" style={{marginTop: 24}} onClick={()=>go('home')}>
                    Volver al inicio
                  </button>
                </div>
              ) : (
                <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}} style={{display:'grid', gap: 16}}>
                  <h3 style={{fontSize: 24, marginBottom: 8}}>Escríbenos</h3>
                  <div>
                    <label className="field-label">Nombre</label>
                    <input className="input input--lg" value={name} onChange={(e)=>setName(e.target.value)} required/>
                  </div>
                  <div>
                    <label className="field-label">Correo</label>
                    <input className="input input--lg" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                  </div>
                  <div>
                    <label className="field-label">Tema</label>
                    <select className="select" value={topic} onChange={(e)=>setTopic(e.target.value)}>
                      <option value="partnership">Quiero registrar mi negocio</option>
                      <option value="press">Prensa / colaboración</option>
                      <option value="bug">Reportar un problema</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Mensaje</label>
                    <textarea className="textarea" rows={5} value={msg}
                      onChange={(e)=>setMsg(e.target.value)} required
                      placeholder="Cuéntanos un poco más…"/>
                  </div>
                  <button type="submit" className="btn btn--accent btn--lg" style={{marginTop: 8}}
                    disabled={!name || !email || !msg}>
                    Enviar mensaje
                  </button>
                </form>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
function ContactLine({ k, v }){
  return (
    <div style={{display:'grid', gridTemplateColumns:'120px 1fr', alignItems:'baseline', gap: 16,
      paddingBottom: 18, borderBottom:'1px solid var(--line-soft)'}}>
      <span style={{fontSize: 12, color:'var(--ink-3)',
        fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>{k}</span>
      <span style={{fontSize: 16}}>{v}</span>
    </div>
  );
}

Object.assign(window, {
  PromosScreen, PlansScreen, PaymentScreen,
  OwnerDashboardScreen, OwnerPromosScreen, OwnerPromoNewScreen,
  ContactScreen,
});
