// Auth screens — Login, Register, RoleSelect, Profile, Preferences, ReviewNew
const { useState: useS2, useEffect: useE2 } = React;

/* ============================================================
   AUTH WRAPPER (split layout)
============================================================ */
function AuthLayout({ title, subtitle, children, asideTitle, asideText, asideImg }) {
  return (
    <div style={{
      minHeight:'calc(100vh - 73px)',
      display:'grid', gridTemplateColumns:'1fr 1fr',
    }}>
      <div style={{display:'grid', placeItems:'center', padding:'48px 24px'}}>
        <div style={{width:'100%', maxWidth: 420}}>
          <div style={{marginBottom: 40}}>
            <span style={{color:'var(--accent)'}}><BrandMark size={32}/></span>
          </div>
          <span className="eyebrow">{subtitle}</span>
          <h1 style={{fontSize: 'clamp(40px, 4vw, 56px)', lineHeight: 1, marginTop: 12, marginBottom: 32, letterSpacing:'-0.02em'}}>
            {title}
          </h1>
          {children}
        </div>
      </div>
      <div style={{
        position:'relative', overflow:'hidden',
        background: 'var(--ink)',
      }}>
        <SmartImg src={asideImg} alt="" style={{opacity: 0.7}}/>
        <div style={{position:'absolute', inset:0,
          background:'linear-gradient(135deg, rgba(20,15,10,.55), rgba(20,15,10,.85))'}}/>
        <div style={{position:'absolute', inset:0, padding: 56,
          display:'flex', flexDirection:'column', justifyContent:'flex-end', color:'#fff'}}>
          <span className="eyebrow" style={{color:'rgba(255,255,255,.6)'}}>— Bienvenido</span>
          <h2 style={{fontSize: 44, color:'#fff', marginTop: 12, lineHeight: 1.05, maxWidth: 440}}>
            {asideTitle}
          </h2>
          <p style={{color:'rgba(255,255,255,.78)', fontSize: 16, marginTop: 16, maxWidth: 420, lineHeight: 1.55}}>
            {asideText}
          </p>
          <div style={{display:'flex', gap: 12, marginTop: 32}}>
            <Stat2 n="1.8k+" label="Huariques"/>
            <Stat2 n="92k" label="Reseñas"/>
            <Stat2 n="4.7" label="Rating prom."/>
          </div>
        </div>
      </div>
    </div>
  );
}
function Stat2({ n, label }){
  return (
    <div style={{paddingRight: 24, borderRight:'1px solid rgba(255,255,255,.18)'}}>
      <div style={{fontFamily:'var(--font-display)', fontSize: 28, color:'#fff'}}>{n}</div>
      <div style={{fontSize: 11, color:'rgba(255,255,255,.55)', fontFamily:'var(--font-mono)',
        letterSpacing:'0.08em', textTransform:'uppercase'}}>{label}</div>
    </div>
  );
}

/* ============================================================
   LOGIN
============================================================ */
function LoginScreen({ go, onLogin }) {
  const [email, setEmail] = useS2('camila@pointflavor.pe');
  const [pass, setPass] = useS2('••••••••');
  const submit = (e) => { e.preventDefault(); onLogin({ name: email.split('@')[0] }); go('role-select'); };
  return (
    <div className="page-enter">
      <AuthLayout
        subtitle="Cuenta personal"
        title="Bienvenido de vuelta."
        asideTitle="Comer rico es un acto cotidiano. Hagámoslo bien."
        asideText="Guarda tus favoritos, descubre promos exclusivas y sigue a los curadores que te gustan."
        asideImg="img/h-brasero.jpg"
      >
        <form onSubmit={submit} style={{display:'grid', gap: 16}}>
          <div>
            <label className="field-label">Correo electrónico</label>
            <input className="input input--lg" type="email" value={email}
              onChange={(e)=>setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required/>
          </div>
          <div>
            <label className="field-label" style={{display:'flex', justifyContent:'space-between'}}>
              <span>Contraseña</span>
              <a href="#" style={{color:'var(--accent)', fontWeight: 500}}
                onClick={(e)=>{e.preventDefault(); go('password-recovery');}}>
                ¿Olvidaste tu contraseña?
              </a>
            </label>
            <input className="input input--lg" type="password" value={pass}
              onChange={(e)=>setPass(e.target.value)} required/>
          </div>
          <button type="submit" className="btn btn--accent btn--lg" style={{width:'100%', marginTop: 8}}>
            Ingresar
          </button>
          <div style={{
            display:'grid', gridTemplateColumns: '1fr auto 1fr',
            gap: 16, alignItems:'center', margin:'12px 0',
            color:'var(--ink-3)', fontSize: 12,
            fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.1em'
          }}>
            <hr style={{border:'none', borderTop:'1px solid var(--line)'}}/>
            <span>o continúa con</span>
            <hr style={{border:'none', borderTop:'1px solid var(--line)'}}/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
            <button type="button" className="btn btn--ghost">Google</button>
            <button type="button" className="btn btn--ghost">Apple</button>
          </div>
          <p style={{fontSize: 14, color:'var(--ink-2)', textAlign:'center', marginTop: 16}}>
            ¿Aún no tienes cuenta?{' '}
            <a href="#" style={{color:'var(--accent)', fontWeight: 500}}
              onClick={(e)=>{e.preventDefault(); go('register');}}>Crear una</a>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
}

/* ============================================================
   REGISTER
============================================================ */
function RegisterScreen({ go, onLogin }) {
  const [name, setName] = useS2('');
  const [email, setEmail] = useS2('');
  const [pass, setPass] = useS2('');
  const [accept, setAccept] = useS2(true);
  const submit = (e) => { e.preventDefault(); onLogin({ name: name || email.split('@')[0] }); go('role-select'); };
  return (
    <div className="page-enter">
      <AuthLayout
        subtitle="Únete"
        title="Tu próxima comida memorable empieza aquí."
        asideTitle="No es una app de delivery. Es un mapa de cocinas con alma."
        asideText="Te tomará menos de un minuto. Sin spam, sin promesas vacías."
        asideImg="img/h-lamarina.jpg"
      >
        <form onSubmit={submit} style={{display:'grid', gap: 14}}>
          <div>
            <label className="field-label">Nombre</label>
            <input className="input input--lg" value={name} onChange={(e)=>setName(e.target.value)}
              placeholder="¿Cómo te llamas?"/>
          </div>
          <div>
            <label className="field-label">Correo</label>
            <input className="input input--lg" type="email" value={email}
              onChange={(e)=>setEmail(e.target.value)} placeholder="tu@correo.com" required/>
          </div>
          <div>
            <label className="field-label">Contraseña</label>
            <input className="input input--lg" type="password" value={pass}
              onChange={(e)=>setPass(e.target.value)} placeholder="Mínimo 8 caracteres" required/>
            <div style={{height: 4, background:'var(--bg-soft)', borderRadius:4, marginTop: 8}}>
              <div style={{height:'100%', background:'var(--accent)', borderRadius: 4,
                width: `${Math.min(pass.length*12, 100)}%`, transition:'width .2s ease'}}/>
            </div>
          </div>
          <label style={{display:'flex', gap:10, alignItems:'flex-start', fontSize: 13, color:'var(--ink-2)', marginTop: 4}}>
            <input type="checkbox" checked={accept} onChange={(e)=>setAccept(e.target.checked)}
              style={{accentColor:'var(--accent)', marginTop: 3}}/>
            Acepto los términos y la política de privacidad. Quiero recibir el newsletter mensual con curaduría.
          </label>
          <button type="submit" className="btn btn--accent btn--lg" style={{width:'100%', marginTop: 8}}
            disabled={!email || !pass || !accept}>
            Crear cuenta
          </button>
          <p style={{fontSize: 14, color:'var(--ink-2)', textAlign:'center', marginTop: 12}}>
            ¿Ya tienes cuenta?{' '}
            <a href="#" style={{color:'var(--accent)', fontWeight: 500}}
              onClick={(e)=>{e.preventDefault(); go('login');}}>Ingresar</a>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
}

/* ============================================================
   ROLE SELECT
============================================================ */
function RoleSelectScreen({ go, onSelectRole }) {
  const [role, setRole] = useS2('user');
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap-narrow">
          <div style={{textAlign:'center', marginBottom: 56}}>
            <span className="eyebrow">Paso 2 de 2</span>
            <h1 style={{fontSize: 'clamp(40px, 5vw, 64px)', marginTop: 16, lineHeight: 1.05}}>
              ¿Cómo vas a usar PointFlavor?
            </h1>
            <p style={{color:'var(--ink-2)', fontSize: 16, marginTop: 16, maxWidth: 480, marginInline:'auto'}}>
              Podrás cambiar esto después. Solo nos ayuda a personalizar tu experiencia.
            </p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20, marginBottom: 32}}>
            <RoleCard
              id="user" current={role} onSelect={setRole}
              label="Como comensal"
              title="Quiero descubrir lugares."
              desc="Buscar, guardar favoritos, ver reseñas, conseguir promos."
              perks={['Acceso a +1.800 huariques', 'Reseñas de la comunidad', 'Listas curadas mensuales']}
            />
            <RoleCard
              id="owner" current={role} onSelect={setRole}
              label="Como dueño"
              title="Tengo un lugar para registrar."
              desc="Publica tu local, gestiona promociones y responde reseñas."
              perks={['Página de tu negocio', 'Crea promociones', 'Estadísticas de visitas']}
            />
          </div>
          <div style={{display:'flex', gap: 12, justifyContent:'center'}}>
            <button className="btn btn--ghost" onClick={()=>go('home')}>Saltar por ahora</button>
            <button className="btn btn--accent" onClick={()=>{onSelectRole(role); go('home');}}>
              Continuar como {role==='user'?'comensal':'dueño'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleCard({ id, current, onSelect, label, title, desc, perks }) {
  const on = current === id;
  return (
    <button onClick={()=>onSelect(id)}
      style={{
        textAlign:'left', cursor:'pointer',
        padding: 32, borderRadius:'var(--r-xl)',
        background: on ? 'var(--ink)' : 'var(--bg-elev)',
        color: on ? 'var(--ink-inv)' : 'var(--ink)',
        border:'1px solid', borderColor: on ? 'var(--ink)' : 'var(--line)',
        transition:'all .2s ease',
        boxShadow: on ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24}}>
        <span style={{
          fontSize: 11, fontFamily:'var(--font-mono)', textTransform:'uppercase',
          letterSpacing:'0.08em', color: on ? 'rgba(255,255,255,.65)' : 'var(--ink-3)'
        }}>{label}</span>
        <span style={{
          width: 22, height: 22, borderRadius:'50%',
          border:'1px solid', borderColor: on ? 'rgba(255,255,255,.4)' : 'var(--line)',
          display:'grid', placeItems:'center',
          background: on ? '#fff' : 'transparent', color: on ? 'var(--ink)' : 'transparent',
        }}><Icon.check/></span>
      </div>
      <h3 style={{fontSize: 28, lineHeight: 1.15, color: on ? '#fff' : 'var(--ink)'}}>{title}</h3>
      <p style={{color: on ? 'rgba(255,255,255,.7)' : 'var(--ink-2)', fontSize: 15, marginTop: 12, marginBottom: 24}}>
        {desc}
      </p>
      <ul style={{listStyle:'none', padding: 0, margin: 0, display:'grid', gap: 8}}>
        {perks.map(p => (
          <li key={p} style={{display:'flex', gap: 10, alignItems:'center',
            fontSize: 14, color: on ? 'rgba(255,255,255,.85)' : 'var(--ink-2)'}}>
            <Icon.check style={{color: on ? '#fff' : 'var(--accent)'}}/>
            {p}
          </li>
        ))}
      </ul>
    </button>
  );
}

/* ============================================================
   PASSWORD RECOVERY
============================================================ */
function PasswordRecoveryScreen({ go }) {
  const [email, setEmail] = useS2('');
  const [sent, setSent] = useS2(false);
  return (
    <div className="page-enter">
      <AuthLayout
        subtitle="Recuperación"
        title="Te enviaremos un enlace seguro."
        asideTitle="Olvidar la contraseña pasa. No es problema."
        asideText="Recibirás un correo con un enlace de un solo uso. Si no lo ves, revisa el spam."
        asideImg="img/cafe.jpg"
      >
        {sent ? (
          <div style={{
            padding: 24, borderRadius:'var(--r-md)',
            background:'var(--accent-soft)', color:'var(--accent)',
            display:'flex', gap: 14, alignItems:'flex-start'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius:'50%',
              background:'var(--accent)', color:'#fff',
              display:'grid', placeItems:'center', flexShrink: 0
            }}><Icon.check/></div>
            <div>
              <h3 style={{fontSize: 18, color:'var(--ink)'}}>Correo enviado</h3>
              <p style={{color:'var(--ink-2)', fontSize: 14, marginTop: 6}}>
                Revisa tu bandeja en <strong>{email}</strong>. El enlace caduca en 30 minutos.
              </p>
              <button className="btn btn--ghost btn--sm" onClick={()=>go('login')} style={{marginTop: 16}}>
                Volver a ingresar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}} style={{display:'grid', gap: 16}}>
            <div>
              <label className="field-label">Correo registrado</label>
              <input className="input input--lg" type="email" value={email}
                onChange={(e)=>setEmail(e.target.value)} placeholder="tu@correo.com" required/>
            </div>
            <button className="btn btn--accent btn--lg" style={{width:'100%'}}>Enviar enlace</button>
            <a href="#" style={{textAlign:'center', color:'var(--ink-2)', fontSize: 14}}
              onClick={(e)=>{e.preventDefault(); go('login');}}>← Volver</a>
          </form>
        )}
      </AuthLayout>
    </div>
  );
}

/* ============================================================
   PROFILE
============================================================ */
function ProfileScreen({ go, session, favs }) {
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap: 56, alignItems:'start'}}>
            {/* Sidebar */}
            <aside style={{
              padding: 32, borderRadius:'var(--r-xl)',
              background:'var(--bg-elev)', border:'1px solid var(--line-soft)',
              position:'sticky', top: 96
            }}>
              <div style={{
                width: 72, height: 72, borderRadius:'50%',
                background:'var(--accent)', color:'var(--accent-ink)',
                display:'grid', placeItems:'center',
                fontFamily:'var(--font-mono)', fontSize: 24, fontWeight: 600,
                marginBottom: 16
              }}>
                {session?.initials || 'P'}
              </div>
              <h2 style={{fontSize: 26, lineHeight: 1.1}}>{session?.name || 'Tu perfil'}</h2>
              <p style={{color:'var(--ink-2)', fontSize: 14, marginTop: 4}}>
                {session?.role === 'owner' ? 'Dueño · ' : ''}Miembro desde 2024
              </p>
              <div style={{display:'grid', gap: 8, marginTop: 20}}>
                <button className="btn btn--soft btn--sm">Editar perfil</button>
                <button className="btn btn--ghost btn--sm" onClick={()=>go('preferences')}>Preferencias</button>
              </div>
            </aside>

            {/* Main */}
            <div style={{display:'grid', gap: 40}}>
              <div>
                <span className="eyebrow">Tu actividad este año</span>
                <div style={{
                  display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16,
                  marginTop: 16
                }}>
                  <ActivityStat n={favs.length} label="Favoritos"/>
                  <ActivityStat n="14" label="Reseñas"/>
                  <ActivityStat n="38" label="Visitas"/>
                  <ActivityStat n="6" label="Distritos"/>
                </div>
              </div>

              <div>
                <SectionHead
                  eyebrow="Tu lista"
                  title="Últimos guardados"
                  action={<button className="btn btn--ghost btn--sm" onClick={()=>go('favorites')}>Ver todos <Icon.arrow/></button>}
                />
                {favs.length > 0 ? (
                  <div style={{display:'grid', gap: 12}}>
                    {favs.slice(0, 3).map(h => (
                      <article key={h.id} className="card"
                        style={{display:'flex', gap: 16, padding: 12, alignItems:'center', cursor:'pointer'}}
                        onClick={()=>go('detail', {id: h.id})}>
                        <div style={{width: 80, height: 80, borderRadius:'var(--r-md)', overflow:'hidden', flexShrink:0}}>
                          <SmartImg src={h.img} alt={h.name}/>
                        </div>
                        <div style={{flex: 1}}>
                          <span className="eyebrow">{h.category}</span>
                          <div style={{fontSize: 18, fontFamily:'var(--font-display)', marginTop: 2}}>{h.name}</div>
                          <div style={{fontSize: 13, color:'var(--ink-2)', marginTop: 4}}>
                            {h.district} · ★ {h.rating}
                          </div>
                        </div>
                        <Icon.arrow style={{color:'var(--ink-3)'}}/>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p style={{color:'var(--ink-3)', fontSize: 14}}>
                    Aún no tienes favoritos. <a href="#" style={{color:'var(--accent)'}}
                      onClick={(e)=>{e.preventDefault(); go('results');}}>Empezar a explorar →</a>
                  </p>
                )}
              </div>

              <div>
                <SectionHead
                  eyebrow="Membresía"
                  title="Plan actual"
                />
                <article style={{
                  padding: 24, borderRadius:'var(--r-lg)',
                  background:'var(--bg-soft)', border:'1px solid var(--line-soft)',
                  display:'flex', justifyContent:'space-between', alignItems:'center', gap: 24
                }}>
                  <div>
                    <span className="badge badge--accent">Sibarita · Premium</span>
                    <h3 style={{fontSize: 24, marginTop: 8}}>S/ 24 / mes · Renueva el 15 de junio</h3>
                    <p style={{color:'var(--ink-2)', fontSize: 14, marginTop: 4}}>
                      Acceso a promos exclusivas, reservas prioritarias y curaduría mensual.
                    </p>
                  </div>
                  <button className="btn btn--ghost" onClick={()=>go('plans')}>Cambiar plan</button>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivityStat({ n, label }) {
  return (
    <div style={{
      padding: 20, borderRadius:'var(--r-lg)',
      background:'var(--bg-elev)', border:'1px solid var(--line-soft)'
    }}>
      <div style={{fontFamily:'var(--font-display)', fontSize: 36, lineHeight: 1}}>{n}</div>
      <div style={{fontSize: 12, color:'var(--ink-3)', marginTop: 6,
        fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em'}}>
        {label}
      </div>
    </div>
  );
}

/* ============================================================
   PREFERENCES
============================================================ */
function PreferencesScreen({ go }) {
  const cuisines = ['Pollo a la brasa', 'Comida criolla', 'Comida marina', 'Chifa', 'Parrillas', 'Postres', 'Café', 'Italiana', 'Mexicana', 'Vegana', 'Sushi', 'Anticuchos'];
  const occasions = ['Familiar', 'Romántico', 'Trabajo', 'Solo', 'Amigos', 'Niños'];
  const [selected, setSelected] = useS2(['Pollo a la brasa', 'Comida criolla', 'Marina']);
  const [occ, setOcc] = useS2(['Familiar', 'Amigos']);
  const toggle = (set, val, fn) => {
    if (set.includes(val)) fn(set.filter(x => x !== val));
    else fn([...set, val]);
  };
  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap-narrow">
          <span className="eyebrow">Configuración</span>
          <h1 style={{fontSize: 'clamp(36px, 4vw, 52px)', marginTop: 12, marginBottom: 16, lineHeight: 1.05}}>
            Tus preferencias.
          </h1>
          <p style={{color:'var(--ink-2)', fontSize: 16, marginBottom: 48, maxWidth: 520}}>
            Cuanto mejor te conozcamos, mejor afinaremos las recomendaciones.
            Esto solo lo usamos nosotros.
          </p>
          <div style={{display:'grid', gap: 40}}>
            <PrefSection title="Cocinas favoritas" lead="Marca al menos tres." count={`${selected.length} seleccionadas`}>
              <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
                {cuisines.map(c => (
                  <button key={c} className={`chip ${selected.includes(c)?'chip--on':''}`}
                    onClick={()=>toggle(selected, c, setSelected)}>
                    {selected.includes(c) && <Icon.check/>} {c}
                  </button>
                ))}
              </div>
            </PrefSection>

            <PrefSection title="Ocasión" lead="¿Para qué tipo de salidas usas PointFlavor?">
              <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
                {occasions.map(c => (
                  <button key={c} className={`chip ${occ.includes(c)?'chip--on':''}`}
                    onClick={()=>toggle(occ, c, setOcc)}>
                    {occ.includes(c) && <Icon.check/>} {c}
                  </button>
                ))}
              </div>
            </PrefSection>

            <PrefSection title="Rango de precio típico">
              <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10}}>
                {[
                  {l:'Económico', s:'Hasta S/25'},
                  {l:'Moderado', s:'S/25-50'},
                  {l:'Generoso', s:'S/50-90'},
                  {l:'Sin límite', s:'+ S/90'},
                ].map((p, i) => (
                  <button key={p.l} className="card" style={{
                    padding: 18, textAlign:'left', cursor:'pointer',
                    background: i===1 ? 'var(--ink)':'var(--bg-elev)',
                    color: i===1 ? 'var(--ink-inv)':'var(--ink)',
                    borderColor: i===1 ? 'var(--ink)':'var(--line-soft)',
                  }}>
                    <div style={{fontFamily:'var(--font-display)', fontSize: 22}}>{p.l}</div>
                    <div style={{fontSize: 12, color: i===1?'rgba(255,255,255,.6)':'var(--ink-3)',
                      fontFamily:'var(--font-mono)', marginTop: 4}}>{p.s}</div>
                  </button>
                ))}
              </div>
            </PrefSection>

            <PrefSection title="Notificaciones">
              <div style={{display:'grid', gap: 14}}>
                <PrefToggle label="Promos en mis cocinas favoritas" desc="Te avisamos cuando un huarique top lance una promo."/>
                <PrefToggle label="Newsletter mensual" desc="Curaduría de la editora, primer viernes de cada mes."/>
                <PrefToggle label="Reseñas respondidas" desc="Cuando un dueño responde tu reseña." defaultOn={false}/>
              </div>
            </PrefSection>
          </div>
          <div style={{display:'flex', gap: 12, marginTop: 48}}>
            <button className="btn btn--accent" onClick={()=>go('home')}>Guardar cambios</button>
            <button className="btn btn--ghost" onClick={()=>go('home')}>Descartar</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PrefSection({ title, lead, count, children }) {
  return (
    <section>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 16}}>
        <div>
          <h3 style={{fontSize: 24}}>{title}</h3>
          {lead && <p style={{color:'var(--ink-3)', fontSize: 14, marginTop: 4}}>{lead}</p>}
        </div>
        {count && <span style={{fontSize: 12, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>{count}</span>}
      </div>
      {children}
    </section>
  );
}
function PrefToggle({ label, desc, defaultOn=true }) {
  const [on, setOn] = useS2(defaultOn);
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap: 16,
      padding: '14px 16px', borderRadius:'var(--r-md)', border:'1px solid var(--line-soft)'}}>
      <div>
        <div style={{fontWeight: 500}}>{label}</div>
        {desc && <div style={{fontSize: 13, color:'var(--ink-3)', marginTop: 2}}>{desc}</div>}
      </div>
      <button onClick={()=>setOn(!on)}
        style={{
          width: 44, height: 24, borderRadius: 24,
          background: on ? 'var(--accent)' : 'var(--line)',
          border:'none', position:'relative', cursor:'pointer',
          transition:'background .2s ease'
        }}>
        <span style={{
          position:'absolute', top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius:'50%', background:'#fff',
          transition:'left .2s ease', boxShadow:'0 1px 2px rgba(0,0,0,.2)'
        }}/>
      </button>
    </div>
  );
}

/* ============================================================
   REVIEW NEW
============================================================ */
function ReviewNewScreen({ go, params }) {
  const { HUARIQUES } = window.PF_DATA;
  const h = HUARIQUES.find(x => x.id === Number(params.huariqueId)) || HUARIQUES[0];
  const [rating, setRating] = useS2(0);
  const [hover, setHover] = useS2(0);
  const [text, setText] = useS2('');
  const [tags, setTags] = useS2([]);

  const tagOptions = ['Familiar','Romántico','Vale la espera','Tradicional','Buen servicio','Para llevar','Generoso'];

  const submit = (e) => { e.preventDefault(); go('detail', {id: h.id}); };

  return (
    <div className="page-enter">
      <section className="section">
        <div className="wrap-narrow">
          <button className="btn btn--ghost btn--sm" onClick={()=>go('detail', {id: h.id})} style={{marginBottom: 24}}>
            <Icon.back/> Volver al lugar
          </button>
          <article style={{
            display:'flex', gap: 18, padding: 18, marginBottom: 32,
            border:'1px solid var(--line-soft)', borderRadius:'var(--r-lg)',
            background: 'var(--bg-soft)'
          }}>
            <div style={{width: 96, height: 96, borderRadius:'var(--r-md)', overflow:'hidden', flexShrink: 0}}>
              <SmartImg src={h.img} alt={h.name}/>
            </div>
            <div>
              <span className="eyebrow">{h.category} · {h.district}</span>
              <h2 style={{fontSize: 26, marginTop: 4}}>{h.name}</h2>
              <p style={{fontSize: 14, color:'var(--ink-2)', marginTop: 4}}>
                Cuéntanos cómo te fue. Tu reseña ayuda a otros comensales.
              </p>
            </div>
          </article>

          <form onSubmit={submit} style={{display:'grid', gap: 32}}>
            <PrefSection title="Tu calificación" lead="Cinco estrellas si es para repetir.">
              <div style={{display:'flex', gap: 10}}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button"
                    onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)}
                    onClick={()=>setRating(n)}
                    style={{
                      width: 56, height: 56, borderRadius:'var(--r-md)',
                      border:'1px solid var(--line)', background: 'var(--bg-elev)',
                      cursor:'pointer', display:'grid', placeItems:'center',
                      color: (hover||rating) >= n ? 'var(--accent)' : 'var(--ink-3)',
                      transition: 'all .15s ease',
                    }}>
                    <Icon.star style={{width: 24, height: 24}}/>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p style={{marginTop: 12, fontSize: 14, color:'var(--ink-2)'}}>
                  {['','Mejorable','Aceptable','Bien','Muy bien','Excelente'][rating]}
                </p>
              )}
            </PrefSection>

            <PrefSection title="Tu reseña" count={`${text.length} / 500`}>
              <textarea className="textarea" value={text}
                onChange={(e)=>setText(e.target.value.slice(0, 500))}
                rows={6}
                placeholder="¿Qué probaste? ¿Cómo fue el servicio? ¿Volverías?"
                style={{resize:'vertical'}}/>
            </PrefSection>

            <PrefSection title="Etiquetas" lead="Hasta 3.">
              <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
                {tagOptions.map(t => (
                  <button key={t} type="button"
                    className={`chip ${tags.includes(t)?'chip--on':''}`}
                    onClick={()=>{
                      if (tags.includes(t)) setTags(tags.filter(x=>x!==t));
                      else if (tags.length < 3) setTags([...tags, t]);
                    }}>
                    {tags.includes(t) && <Icon.check/>} {t}
                  </button>
                ))}
              </div>
            </PrefSection>

            <PrefSection title="¿Subir fotos?" lead="Opcional, pero ayuda mucho.">
              <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10}}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="placeholder" style={{aspectRatio:'1/1', borderRadius:'var(--r-md)', cursor:'pointer'}}>
                    <Icon.plus/>
                  </div>
                ))}
              </div>
            </PrefSection>

            <div style={{display:'flex', gap: 12, paddingTop: 16, borderTop:'1px solid var(--line-soft)'}}>
              <button type="submit" className="btn btn--accent btn--lg" disabled={!rating || text.length < 20}>
                Publicar reseña
              </button>
              <button type="button" className="btn btn--ghost btn--lg" onClick={()=>go('detail', {id: h.id})}>
                Cancelar
              </button>
              <span style={{marginLeft:'auto', alignSelf:'center', fontSize: 13, color:'var(--ink-3)'}}>
                Mínimo 20 caracteres
              </span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, {
  LoginScreen, RegisterScreen, RoleSelectScreen, PasswordRecoveryScreen,
  ProfileScreen, PreferencesScreen, ReviewNewScreen,
});
