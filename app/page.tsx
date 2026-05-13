"use client";
import { useState, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode, RefObject, ChangeEvent, FormEvent } from "react";

type PageId = "home" | "brands" | "drivers";

// ─── Shared constants ────────────────────────────────────────────────────────
const BLUE = "#3d8eff";
const BLUE_GLOW = "rgba(30,100,255,0.18)";
const BLUE_SUBTLE = "rgba(30,100,255,0.08)";

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Global Styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #08080C; }

  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes scanLine { 0%{top:-2px} 100%{top:100%} }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes borderGlow { 0%,100%{border-color:rgba(60,130,255,0.14)} 50%{border-color:rgba(60,130,255,0.42)} }
  @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.03)} }

  .fade-up         { opacity:0; transform:translateY(36px); transition:opacity 0.9s cubic-bezier(.22,.8,.36,1), transform 0.9s cubic-bezier(.22,.8,.36,1); }
  .fade-up.visible { opacity:1; transform:translateY(0); }
  .fade-up.d1 { transition-delay:0.1s; }
  .fade-up.d2 { transition-delay:0.22s; }

  .cta-btn     { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; letter-spacing:0.13em; text-transform:uppercase; border-radius:2px; padding:0.95rem 2.1rem; cursor:pointer; transition:all 0.28s cubic-bezier(.22,.8,.36,1); }
  .cta-primary { background:rgba(30,100,255,0.22); border:1px solid rgba(61,142,255,0.55); color:#fff; }
  .cta-primary:hover { background:rgba(30,100,255,0.42); border-color:#3d8eff; box-shadow:0 0 28px rgba(30,100,255,0.22); }
  .cta-ghost   { background:transparent; border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.65); }
  .cta-ghost:hover { border-color:rgba(255,255,255,0.45); color:#fff; }

  .card-hover { transition:border-color 0.3s ease, transform 0.3s ease; }
  .card-hover:hover { border-color:rgba(61,142,255,0.35) !important; transform:translateY(-3px); }

  .path-card  { transition:border-color 0.35s ease, background 0.35s ease; }
  .path-card:hover { border-color:rgba(61,142,255,0.42) !important; }

  .nav-link   { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:rgba(255,255,255,0.5); transition:color 0.22s; }
  .nav-link:hover { color:rgba(255,255,255,0.9); }

  .form-input {
    width:100%; padding:0.9rem 1.1rem;
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:2px; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:0.9rem;
    outline:none; transition:border-color 0.25s, background 0.25s;
  }
  .form-input:focus { border-color:rgba(61,142,255,0.55); background:rgba(30,100,255,0.05); }
  .form-input::placeholder { color:rgba(255,255,255,0.18); }

  .submit-btn {
    padding:1rem 2.2rem; border-radius:2px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:0.82rem;
    font-weight:600; letter-spacing:0.13em; text-transform:uppercase;
    transition:all 0.28s cubic-bezier(.22,.8,.36,1);
  }

  input:-webkit-autofill, input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0 100px #0d0d18 inset !important;
    -webkit-text-fill-color:#fff !important;
    caret-color:#fff;
  }
`;

// ─── Visual Atoms ─────────────────────────────────────────────────────────────
function CityOrbs({ intensity = 1 }) {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{
        position:"absolute", top:"14%", left:"6%",
        width:700, height:700, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(20,80,220,${0.1*intensity}) 0%, transparent 68%)`,
        filter:"blur(55px)", animation:"orbFloat 9s ease-in-out infinite",
      }}/>
      <div style={{
        position:"absolute", top:"55%", right:"4%",
        width:500, height:500, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(0,140,255,${0.07*intensity}) 0%, transparent 70%)`,
        filter:"blur(70px)", animation:"orbFloat 12s ease-in-out infinite 3s",
      }}/>
      <div style={{
        position:"absolute", bottom:"8%", left:"40%",
        width:380, height:380, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(50,120,255,${0.05*intensity}) 0%, transparent 70%)`,
        filter:"blur(65px)", animation:"orbFloat 10s ease-in-out infinite 6s",
      }}/>
    </div>
  );
}

function QRGrid({ opacity = 0.028 }) {
  const cells = Array.from({ length: 81 });
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{
        position:"absolute", inset:0,
        display:"grid", gridTemplateColumns:"repeat(9, 1fr)", opacity,
      }}>
        {cells.map((_, i) => (
          <div key={i} style={{
            border:"1px solid #4da6ff", aspectRatio:"1",
            background:(i%7===0||i%11===0) ? "rgba(77,166,255,0.22)" : "transparent",
          }}/>
        ))}
      </div>
    </div>
  );
}

function ScanLine() {
  return (
    <div style={{
      position:"absolute", left:0, right:0, height:1,
      background:"linear-gradient(90deg, transparent 0%, rgba(61,142,255,0.3) 40%, rgba(61,142,255,0.5) 50%, rgba(61,142,255,0.3) 60%, transparent 100%)",
      animation:"scanLine 11s linear infinite",
      pointerEvents:"none", zIndex:3,
    }}/>
  );
}

function Label({ children, style = {} }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      fontFamily:"'DM Sans',sans-serif",
      fontSize:"0.72rem", letterSpacing:"0.2em",
      color:BLUE, textTransform:"uppercase", marginBottom:"1.2rem",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeading({ children, style = {} }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <h2 style={{
      fontFamily:"'Syne',sans-serif",
      fontSize:"clamp(2rem, 5vw, 4rem)",
      fontWeight:800, lineHeight:1.08,
      letterSpacing:"-0.015em", color:"#fff",
      ...style,
    }}>
      {children}
    </h2>
  );
}

function SubText({ children, style = {} }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <p style={{
      fontFamily:"'DM Sans',sans-serif",
      fontSize:"1.05rem", color:"rgba(255,255,255,0.42)", lineHeight:1.85,
      ...style,
    }}>
      {children}
    </p>
  );
}

// ─── Premium Footer ───────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: PageId) => void }) {
  return (
    <footer style={{
      borderTop:"1px solid rgba(255,255,255,0.055)",
      padding:"3.5rem 2.5rem",
    }}>
      <div style={{
        maxWidth:1100, margin:"0 auto",
        display:"flex", justifyContent:"space-between",
        alignItems:"flex-end", flexWrap:"wrap", gap:"2rem",
      }}>
        <div>
          <button onClick={() => setPage("home")} style={{
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:800,
            letterSpacing:"0.18em", color:"rgba(255,255,255,0.82)",
            textTransform:"uppercase", display:"block", marginBottom:"0.5rem",
          }}>
            ESCANEA
          </button>
          <div style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem",
            color:"rgba(255,255,255,0.22)", letterSpacing:"0.04em",
          }}>
            Transformando el tráfico en atención.
          </div>
        </div>
        <div style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem",
          color:"rgba(255,255,255,0.18)", letterSpacing:"0.05em", textAlign:"center",
        }}>
          www.escanea.co
        </div>
        <div style={{ textAlign:"right" }}>
          <a href="mailto:contacto@escanea.co" style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem",
            color:"rgba(255,255,255,0.28)", textDecoration:"none",
            letterSpacing:"0.04em", display:"block", marginBottom:"0.4rem",
            transition:"color 0.2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.color="rgba(255,255,255,0.58)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.color="rgba(255,255,255,0.28)"; }}
          >
            contacto@escanea.co
          </a>
          <div style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
            color:"rgba(255,255,255,0.13)", letterSpacing:"0.04em",
          }}>
            © 2025 Escanea
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, scrolled }: { page: PageId; setPage: (p: PageId) => void; scrolled: boolean }) {
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      padding:"0 2.5rem", height:70,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? "rgba(8,8,12,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.055)" : "none",
      transition:"all 0.45s cubic-bezier(.22,.8,.36,1)",
    }}>
      <button onClick={() => setPage("home")} style={{
        background:"none", border:"none", cursor:"pointer",
        fontFamily:"'Syne',sans-serif", fontSize:"1.15rem", fontWeight:800,
        letterSpacing:"0.18em", color:"#fff", textTransform:"uppercase",
      }}>
        ESCANEA
      </button>
      <div style={{ display:"flex", gap:"2.2rem", alignItems:"center" }}>
        {([{label:"Marcas",page:"brands"},{label:"Conductores",page:"drivers"}] as const).map(l=>(
          <button key={l.page} className="nav-link" onClick={()=>setPage(l.page)}
            style={{ color:page===l.page?"rgba(255,255,255,0.9)":undefined }}>
            {l.label}
          </button>
        ))}
        <button className="cta-btn cta-primary" onClick={()=>setPage("brands")}
          style={{ padding:"0.5rem 1.15rem", fontSize:"0.75rem" }}>
          Anunciar
        </button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage({ setPage }: { setPage: (p: PageId) => void }) {
  const [r1, iv1] = useInView();
  const [r2, iv2] = useInView();
  const [r3, iv3] = useInView();

  return (
    <div style={{ background:"#08080C", color:"#fff", minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HERO ── */}
      <section style={{
        position:"relative", minHeight:"100vh",
        display:"flex", alignItems:"center", overflow:"hidden",
      }}>
        <CityOrbs intensity={1.2}/>
        <QRGrid opacity={0.03}/>
        <ScanLine/>
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(135deg, rgba(0,15,50,0.32) 0%, rgba(8,8,12,0.52) 55%, rgba(0,0,0,0.78) 100%)",
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:240,
          background:"linear-gradient(to bottom, transparent, #08080C)",
          pointerEvents:"none",
        }}/>

        <div style={{
          position:"relative", zIndex:2,
          maxWidth:1100, margin:"0 auto",
          padding:"140px 2.5rem 80px",
        }}>
          {/* Pill badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(30,100,255,0.09)", border:"1px solid rgba(61,142,255,0.26)",
            borderRadius:2, padding:"0.38rem 1rem", marginBottom:"3rem",
            animation:"fadeIn 1s ease 0.15s both",
          }}>
            <div style={{
              width:5, height:5, borderRadius:"50%",
              background:BLUE, animation:"pulse 2.5s ease infinite",
            }}/>
            <span style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem",
              letterSpacing:"0.18em", color:"rgba(140,190,255,0.82)", textTransform:"uppercase",
            }}>
              Media urbana en movimiento
            </span>
          </div>

          <h1 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:"clamp(3.2rem, 8.5vw, 7.5rem)",
            fontWeight:800, lineHeight:0.97,
            letterSpacing:"-0.025em", color:"#fff",
            marginBottom:"1.8rem",
            animation:"fadeUp 1s ease 0.35s both",
          }}>
            ¿Y si el tráfico<br/>
            <span style={{
              background:"linear-gradient(100deg, #5aabff 0%, #1e64ff 45%, #5aabff 100%)",
              backgroundSize:"250% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text", animation:"shimmer 6s linear infinite",
            }}>
              sí funcionara?
            </span>
          </h1>

          <p style={{
            fontFamily:"'DM Sans',sans-serif",
            fontSize:"clamp(1.05rem, 2.2vw, 1.4rem)",
            fontWeight:300, color:"rgba(255,255,255,0.46)",
            marginBottom:"3.2rem", letterSpacing:"0.01em",
            animation:"fadeUp 1s ease 0.55s both",
          }}>
            Transformando el tráfico en atención.
          </p>

          <div style={{
            display:"flex", gap:"0.85rem", flexWrap:"wrap",
            animation:"fadeUp 1s ease 0.72s both",
          }}>
            <button className="cta-btn cta-primary" onClick={()=>setPage("brands")}>
              Anunciar mi marca
            </button>
            <button className="cta-btn cta-ghost" onClick={()=>setPage("drivers")}>
              Conducir con Escanea
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY MOVEMENT ── */}
      <section ref={r1} style={{ padding:"10rem 2.5rem", maxWidth:1100, margin:"0 auto" }}>
        <div className={`fade-up ${iv1?"visible":""}`} style={{ marginBottom:"5.5rem" }}>
          <Label>Por qué Escanea</Label>
          <SectionHeading style={{ maxWidth:680, marginBottom:"1.5rem" }}>
            El movimiento<br/>captura la atención.
          </SectionHeading>
          <SubText style={{ maxWidth:510 }}>
            Mientras la publicidad digital se ignora y los billboards tradicionales
            permanecen estáticos, nuestros vehículos recorren la ciudad — donde vive,
            trabaja y transita tu audiencia.
          </SubText>
        </div>

        {/* Contrast grid */}
        <div className={`fade-up d1 ${iv1?"visible":""}`} style={{
          display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:"1px", background:"rgba(255,255,255,0.05)", marginBottom:"5rem",
        }}>
          {[
            {
              label:"Publicidad estática",
              text:"Un punto fijo. Todo el día, mismo lugar. Espera a que tu audiencia pase — una sola vez.",
              accent:false,
            },
            {
              label:"ESCANEA",
              text:"Tu campaña recorre la ciudad. Zonas residenciales, comerciales y corporativas en una sola campaña.",
              accent:true,
            },
            {
              label:"Publicidad digital",
              text:"Ignorada por saturación. Bloqueada por hábito. El usuario promedio ignora la mayoría de los anuncios que ve.",
              accent:false,
            },
            {
              label:"ESCANEA",
              text:"Atención física real. Exposición repetida en múltiples zonas. Interacción QR medible y verificable.",
              accent:true,
            },
          ].map(({label,text,accent},i)=>(
            <div key={i} style={{
              padding:"2.8rem",
              background: accent ? "rgba(30,100,255,0.055)" : "rgba(255,255,255,0.018)",
              borderLeft: `2px solid ${accent ? "rgba(61,142,255,0.42)" : "transparent"}`,
            }}>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                letterSpacing:"0.18em", textTransform:"uppercase",
                color: accent ? BLUE : "rgba(255,255,255,0.24)",
                marginBottom:"0.9rem",
              }}>
                {label}
              </div>
              <p style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.95rem",
                color: accent ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.33)",
                lineHeight:1.78,
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Three pillars */}
        <div className={`fade-up d2 ${iv1?"visible":""}`} style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))",
          gap:"1.4rem",
        }}>
          {[
            {
              icon:"◈",
              title:"Exposición urbana constante",
              desc:"Presencia diaria en múltiples zonas. Tu marca donde está la gente — en movimiento, todos los días.",
            },
            {
              icon:"◎",
              title:"Interacciones QR medibles",
              desc:"Cada instalación lleva un QR único. Cada escaneo es un dato real — no una estimación ni una proyección.",
            },
            {
              icon:"⬡",
              title:"Cobertura en múltiples zonas",
              desc:"Una flota activa que circula por zonas residenciales, comerciales y corporativas dentro de una sola campaña.",
            },
          ].map((p,i)=>(
            <div key={i} className="card-hover" style={{
              padding:"2.2rem",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:3, background:"rgba(255,255,255,0.02)",
              position:"relative", overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", bottom:-24, right:-24,
                width:100, height:100, borderRadius:"50%",
                background:`radial-gradient(circle, ${BLUE_GLOW}, transparent)`,
                pointerEvents:"none",
              }}/>
              <div style={{ fontSize:"1.55rem", color:"rgba(61,142,255,0.5)", marginBottom:"1.1rem" }}>{p.icon}</div>
              <h3 style={{
                fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:700,
                color:"#fff", marginBottom:"0.7rem",
              }}>{p.title}</h3>
              <p style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem",
                color:"rgba(255,255,255,0.36)", lineHeight:1.78,
              }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CINEMATIC BENTO ── */}
      <section ref={r2} style={{
        position:"relative", overflow:"hidden",
        padding:"7rem 2.5rem",
        background:"linear-gradient(180deg, #08080C 0%, #060710 50%, #08080C 100%)",
      }}>
        <CityOrbs intensity={0.65}/>
        <div className={`fade-up ${iv2?"visible":""}`} style={{ position:"relative", zIndex:2, maxWidth:1100, margin:"0 auto" }}>
          <Label>Publicidad que se puede medir.</Label>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(3, 1fr)",
            gap:"0.75rem",
          }}>
            {/* Wide left — statement */}
            <div style={{
              gridColumn:"1 / 3",
              padding:"3rem",
              background:"linear-gradient(135deg, rgba(0,18,55,0.78) 0%, rgba(8,20,70,0.32) 100%)",
              border:"1px solid rgba(61,142,255,0.14)",
              borderRadius:3,
              position:"relative", overflow:"hidden",
              minHeight:240,
              display:"flex", flexDirection:"column", justifyContent:"flex-end",
              animation:"borderGlow 7s ease-in-out infinite",
            }}>
              {/* QR art */}
              <div style={{
                position:"absolute", top:"50%", right:"9%",
                transform:"translateY(-50%)",
                width:128, height:128,
                display:"grid", gridTemplateColumns:"repeat(7, 1fr)",
                gap:3, opacity:0.16,
              }}>
                {Array.from({length:49}).map((_,i)=>(
                  <div key={i} style={{
                    background:(i%3===0||i%5===0||i===0||i===6||i===42||i===48) ? "#4d9eff" : "transparent",
                    borderRadius:1,
                  }}/>
                ))}
              </div>
              <div style={{
                position:"absolute", inset:0,
                background:"radial-gradient(ellipse at 25% 75%, rgba(30,100,255,0.17), transparent 60%)",
                pointerEvents:"none",
              }}/>
              <div style={{ position:"relative", zIndex:2 }}>
                <SectionHeading style={{ fontSize:"clamp(1.8rem, 4vw, 3rem)", marginBottom:"0.6rem" }}>
                  Presencia urbana<br/>repetitiva.
                </SectionHeading>
                <SubText style={{ fontSize:"0.9rem" }}>Movimiento que genera atención.</SubText>
              </div>
            </div>

            {/* Right tall — 90 days */}
            <div style={{
              gridRow:"1 / 3",
              padding:"2.5rem",
              background:BLUE_SUBTLE,
              border:"1px solid rgba(61,142,255,0.17)",
              borderRadius:3,
              display:"flex", flexDirection:"column", justifyContent:"space-between",
              animation:"borderGlow 9s ease-in-out infinite 2.5s",
            }}>
              <div>
                <div style={{
                  width:9, height:9, borderRadius:"50%",
                  background:BLUE, marginBottom:"1.5rem",
                  animation:"pulse 2.5s ease infinite",
                }}/>
                <div style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                  letterSpacing:"0.18em", textTransform:"uppercase",
                  color:"rgba(100,170,255,0.65)", marginBottom:"0.6rem",
                }}>Campaña activa</div>
                <div style={{
                  fontFamily:"'Syne',sans-serif", fontSize:"2.4rem",
                  fontWeight:800, color:"#fff", lineHeight:1.08,
                }}>90<br/>días</div>
              </div>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem",
                color:"rgba(255,255,255,0.33)", lineHeight:1.72,
              }}>
                Presencia sostenida que construye reconocimiento real de marca.
              </div>
            </div>

            {/* Bottom left */}
            <div style={{
              padding:"2rem",
              background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:3, display:"flex", flexDirection:"column", justifyContent:"center",
            }}>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                letterSpacing:"0.15em", textTransform:"uppercase",
                color:BLUE, marginBottom:"0.6rem",
              }}>Reportes verificables</div>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontSize:"1.45rem",
                fontWeight:800, color:"#fff",
              }}>QR único<br/>por vehículo.</div>
            </div>

            {/* Bottom mid */}
            <div style={{
              padding:"2rem",
              background:"rgba(30,100,255,0.06)",
              border:"1px solid rgba(61,142,255,0.14)",
              borderRadius:3, display:"flex", flexDirection:"column", justifyContent:"center",
            }}>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                letterSpacing:"0.15em", textTransform:"uppercase",
                color:"rgba(100,170,255,0.6)", marginBottom:"0.6rem",
              }}>Sin estimaciones</div>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontSize:"1.45rem",
                fontWeight:800, color:"#fff",
              }}>Datos reales<br/>de campaña.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PATHWAY SPLIT ── */}
      <section ref={r3} style={{ padding:"10rem 2.5rem 12rem", maxWidth:980, margin:"0 auto" }}>
        <div className={`fade-up ${iv3?"visible":""}`}>
          <div style={{ textAlign:"center", marginBottom:"5rem" }}>
            <Label style={{ display:"block" }}>Tu camino</Label>
            <SectionHeading style={{ fontSize:"clamp(2rem, 4vw, 3.5rem)" }}>
              Empieza aquí.
            </SectionHeading>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
            {/* Brands card */}
            <button className="path-card" onClick={()=>setPage("brands")} style={{
              background:"rgba(8,16,42,0.5)",
              border:"1px solid rgba(61,142,255,0.22)",
              borderRadius:3, padding:"3.5rem",
              textAlign:"left", cursor:"pointer",
              position:"relative", overflow:"hidden", display:"block", width:"100%",
            }}>
              <div style={{
                position:"absolute", top:0, right:0, width:260, height:260,
                background:"radial-gradient(circle, rgba(30,100,255,0.1), transparent 70%)",
                pointerEvents:"none",
              }}/>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                letterSpacing:"0.2em", textTransform:"uppercase",
                color:BLUE, marginBottom:"1.8rem",
              }}>Para Marcas</div>
              <h3 style={{
                fontFamily:"'Syne',sans-serif",
                fontSize:"clamp(1.3rem, 2.5vw, 1.6rem)",
                fontWeight:800, color:"#fff", lineHeight:1.18, marginBottom:"2.2rem",
              }}>
                Transforma tráfico<br/>urbano en atención<br/>medible.
              </h3>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:BLUE, display:"flex", alignItems:"center", gap:"0.5rem",
              }}>
                Anunciar mi marca <span style={{fontSize:"1rem"}}>→</span>
              </div>
            </button>

            {/* Drivers card */}
            <button className="path-card" onClick={()=>setPage("drivers")} style={{
              background:"rgba(255,255,255,0.018)",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:3, padding:"3.5rem",
              textAlign:"left", cursor:"pointer",
              position:"relative", overflow:"hidden", display:"block", width:"100%",
            }}>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                letterSpacing:"0.2em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.3)", marginBottom:"1.8rem",
              }}>Para Conductores</div>
              <h3 style={{
                fontFamily:"'Syne',sans-serif",
                fontSize:"clamp(1.3rem, 2.5vw, 1.6rem)",
                fontWeight:800, color:"#fff", lineHeight:1.18, marginBottom:"2.2rem",
              }}>
                Genera ingresos<br/>sin cambiar<br/>tus rutas.
              </h3>
              <div style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.38)",
                display:"flex", alignItems:"center", gap:"0.5rem",
              }}>
                Conducir con Escanea <span style={{fontSize:"1rem"}}>→</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <Footer setPage={setPage}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRANDS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
type BrandsForm = { nombre: string; empresa: string; email: string; telefono: string; mensaje: string };

function BrandsPage({ setPage }: { setPage: (p: PageId) => void }) {
  const [form, setForm] = useState<BrandsForm>({ nombre:"", empresa:"", email:"", telefono:"", mensaje:"" });
  const [sent, setSent] = useState(false);
  const [r1, iv1] = useInView();
  const [r2, iv2] = useInView();
  const [r3, iv3] = useInView();
  const upd = (k: keyof BrandsForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{ background:"#08080C", color:"#fff", minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>

      <section style={{ position:"relative", padding:"15rem 2.5rem 9rem", overflow:"hidden" }}>
        <CityOrbs intensity={0.9}/>
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(180deg, rgba(0,14,45,0.26) 0%, #08080C 100%)",
          pointerEvents:"none",
        }}/>
        <div style={{ position:"relative", zIndex:2, maxWidth:900, margin:"0 auto" }}>
          <Label>Para Marcas</Label>
          <h1 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:"clamp(2.8rem, 6.5vw, 6rem)",
            fontWeight:800, lineHeight:1.02,
            letterSpacing:"-0.02em", color:"#fff", marginBottom:"1.6rem",
            animation:"fadeUp 0.9s ease 0.2s both",
          }}>
            Tu campaña<br/>recorre la ciudad.
          </h1>
          <SubText style={{ maxWidth:500, animation:"fadeUp 0.9s ease 0.38s both" }}>
            Publicidad exterior en movimiento. Medible, verificable y presente
            donde está tu audiencia — todos los días.
          </SubText>
        </div>
      </section>

      {/* Value props */}
      <section ref={r1} style={{ padding:"2rem 2.5rem 7rem", maxWidth:1100, margin:"0 auto" }}>
        <div className={`fade-up ${iv1?"visible":""}`}>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(310px, 1fr))",
            gap:"1px", background:"rgba(255,255,255,0.05)",
          }}>
            {[
              {n:"01",title:"Exposición urbana constante",
                desc:"Tu marca en movimiento — zonas residenciales, comerciales y corporativas en una sola campaña."},
              {n:"02",title:"Interacciones QR medibles",
                desc:"Cada vehículo lleva un QR único. Cada escaneo queda registrado. Sin estimaciones ni suposiciones."},
              {n:"03",title:"Presencia de 90 días",
                desc:"Campañas sostenidas que construyen familiaridad real. No exposición fugaz — presencia constante."},
              {n:"04",title:"Cobertura en múltiples zonas",
                desc:"Una flota activa cubre la ciudad entera. Alcance urbano que un punto fijo no puede lograr."},
              {n:"05",title:"Reportes verificables de campaña",
                desc:"Datos reales de zonas activas e interacciones por campaña. Transparencia total en tu inversión."},
              {n:"06",title:"Escala a demanda",
                desc:"Incorpora más vehículos para ampliar cobertura. Una plataforma diseñada para crecer con tu marca."},
            ].map(v=>(
              <div key={v.n} style={{ padding:"2.8rem", background:"rgba(255,255,255,0.018)" }}>
                <div style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem",
                  letterSpacing:"0.2em", color:"rgba(61,142,255,0.4)", marginBottom:"1.1rem",
                }}>{v.n}</div>
                <h3 style={{
                  fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:700,
                  color:"#fff", marginBottom:"0.75rem",
                }}>{v.title}</h3>
                <p style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem",
                  color:"rgba(255,255,255,0.36)", lineHeight:1.78,
                }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section ref={r2} style={{ padding:"4rem 2.5rem 8rem", maxWidth:780, margin:"0 auto" }}>
        <div className={`fade-up ${iv2?"visible":""}`}>
          <Label>Proceso</Label>
          <SectionHeading style={{ fontSize:"clamp(1.8rem, 4vw, 3rem)", marginBottom:"3.5rem" }}>
            Simple. Rápido. Medible.
          </SectionHeading>
          {[
            ["Contacto","Cuéntanos sobre tu marca y objetivos de campaña."],
            ["Diseño creativo","Desarrollamos el concepto visual y materiales para tu campaña."],
            ["Instalación","Instalaciones removibles y profesionales en nuestra flota activa."],
            ["Campaña activa","90 días de cobertura urbana con seguimiento de interacciones QR."],
            ["Reporte de campaña","Datos verificables de exposición e interacciones al cierre."],
          ].map(([step,desc],i)=>(
            <div key={i} style={{
              display:"flex", gap:"2rem", alignItems:"flex-start",
              padding:"2rem 0",
              borderBottom:"1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                flexShrink:0, width:34, height:34,
                border:"1px solid rgba(61,142,255,0.26)", borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Syne',sans-serif", fontSize:"0.7rem", color:BLUE,
              }}>
                {String(i+1).padStart(2,"0")}
              </div>
              <div>
                <div style={{
                  fontFamily:"'Syne',sans-serif", fontSize:"1rem",
                  fontWeight:700, color:"#fff", marginBottom:"0.35rem",
                }}>{step}</div>
                <div style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem",
                  color:"rgba(255,255,255,0.36)", lineHeight:1.72,
                }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section ref={r3} style={{ padding:"4rem 2.5rem 10rem", maxWidth:640, margin:"0 auto" }}>
        <div className={`fade-up ${iv3?"visible":""}`}>
          <Label>Anunciar</Label>
          <SectionHeading style={{ fontSize:"clamp(1.8rem, 4vw, 3rem)", marginBottom:"0.75rem" }}>
            Hablemos de tu campaña.
          </SectionHeading>
          <SubText style={{ marginBottom:"3.5rem" }}>
            Nuestro equipo te contacta en menos de 24 horas.
          </SubText>

          {sent ? (
            <div style={{
              padding:"3.5rem", border:"1px solid rgba(61,142,255,0.26)",
              borderRadius:3, background:BLUE_SUBTLE, textAlign:"center",
            }}>
              <div style={{ fontSize:"1.8rem", marginBottom:"1rem", color:BLUE }}>◈</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", color:"#fff", marginBottom:"0.6rem" }}>
                Mensaje recibido.
              </h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.36)" }}>
                Te contactamos pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {([
                {k:"nombre" as const,   label:"Nombre completo",    type:"text" },
                {k:"empresa" as const,  label:"Empresa o marca",    type:"text" },
                {k:"email" as const,    label:"Email corporativo",  type:"email"},
                {k:"telefono" as const, label:"WhatsApp / Teléfono",type:"tel"  },
              ]).map(f=>(
                <div key={f.k}>
                  <label style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                    letterSpacing:"0.12em", color:"rgba(255,255,255,0.32)",
                    textTransform:"uppercase", display:"block", marginBottom:"0.45rem",
                  }}>{f.label}</label>
                  <input className="form-input" type={f.type} required
                    value={form[f.k]} onChange={upd(f.k)}/>
                </div>
              ))}
              <div>
                <label style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                  letterSpacing:"0.12em", color:"rgba(255,255,255,0.32)",
                  textTransform:"uppercase", display:"block", marginBottom:"0.45rem",
                }}>Cuéntanos sobre tu campaña</label>
                <textarea className="form-input" rows={4}
                  value={form.mensaje} onChange={upd("mensaje")}
                  style={{ resize:"vertical" }}/>
              </div>
              <button type="submit" className="submit-btn" style={{
                alignSelf:"flex-start", marginTop:"0.5rem",
                background:"rgba(30,100,255,0.22)",
                border:"1px solid rgba(61,142,255,0.5)", color:"#fff",
              }}
                onMouseEnter={e=>{
                  e.currentTarget.style.background="rgba(30,100,255,0.42)";
                  e.currentTarget.style.borderColor=BLUE;
                  e.currentTarget.style.boxShadow="0 0 28px rgba(30,100,255,0.2)";
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background="rgba(30,100,255,0.22)";
                  e.currentTarget.style.borderColor="rgba(61,142,255,0.5)";
                  e.currentTarget.style.boxShadow="none";
                }}
              >
                Enviar solicitud →
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer setPage={setPage}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DRIVERS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
type DriversForm = { nombre: string; ciudad: string; email: string; telefono: string; vehiculo: string };

function DriversPage({ setPage }: { setPage: (p: PageId) => void }) {
  const [form, setForm] = useState<DriversForm>({ nombre:"", ciudad:"", email:"", telefono:"", vehiculo:"" });
  const [sent, setSent] = useState(false);
  const [r1, iv1] = useInView();
  const [r2, iv2] = useInView();
  const upd = (k: keyof DriversForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{ background:"#08080C", color:"#fff", minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>

      <section style={{ position:"relative", padding:"15rem 2.5rem 9rem", overflow:"hidden" }}>
        <CityOrbs intensity={0.85}/>
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(180deg, rgba(0,10,28,0.26) 0%, #08080C 100%)",
          pointerEvents:"none",
        }}/>
        <div style={{ position:"relative", zIndex:2, maxWidth:900, margin:"0 auto" }}>
          <Label>Para Conductores</Label>
          <h1 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:"clamp(2.8rem, 6.5vw, 6rem)",
            fontWeight:800, lineHeight:1.02,
            letterSpacing:"-0.02em", color:"#fff", marginBottom:"1.6rem",
            animation:"fadeUp 0.9s ease 0.2s both",
          }}>
            Tu vehículo ya<br/>trabaja para ti.
          </h1>
          <SubText style={{ maxWidth:500, animation:"fadeUp 0.9s ease 0.38s both" }}>
            Genera ingresos adicionales mientras conduces. Sin cambiar tus rutas,
            sin compromisos rígidos. Monetiza lo que ya haces.
          </SubText>
        </div>
      </section>

      {/* Benefits */}
      <section ref={r1} style={{ padding:"2rem 2.5rem 7rem", maxWidth:1000, margin:"0 auto" }}>
        <div className={`fade-up ${iv1?"visible":""}`}>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",
            gap:"1.25rem", marginBottom:"4rem",
          }}>
            {[
              {icon:"◎",title:"Sin cambiar tus rutas",
                desc:"Conduce exactamente como siempre. Nuestro modelo trabaja con tu recorrido habitual — no contra él."},
              {icon:"⬡",title:"Ingresos adicionales mensuales",
                desc:"Genera un ingreso constante todos los meses mientras haces lo que ya haces: moverte por la ciudad."},
              {icon:"◈",title:"Instalación removible",
                desc:"Sin modificaciones permanentes a tu vehículo. Instalación y retiro profesional incluidos."},
              {icon:"⬢",title:"Participación flexible",
                desc:"Tú decides cuándo participar. Sin penalizaciones ni obligaciones rígidas."},
              {icon:"◇",title:"Registro simple",
                desc:"Proceso en línea. Verificación rápida. Instalación programada a tu conveniencia."},
              {icon:"○",title:"Soporte permanente",
                desc:"Equipo activo disponible ante cualquier duda o situación durante tu campaña."},
            ].map((b,i)=>(
              <div key={i} className="card-hover" style={{
                padding:"2.2rem",
                border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:3, background:"rgba(255,255,255,0.02)",
              }}>
                <div style={{ fontSize:"1.4rem", color:"rgba(61,142,255,0.45)", marginBottom:"1rem" }}>{b.icon}</div>
                <h3 style={{
                  fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700,
                  color:"#fff", marginBottom:"0.6rem",
                }}>{b.title}</h3>
                <p style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"0.87rem",
                  color:"rgba(255,255,255,0.36)", lineHeight:1.78,
                }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div style={{
            padding:"2.5rem 3rem",
            border:"1px solid rgba(61,142,255,0.17)",
            borderRadius:3, background:BLUE_SUBTLE,
          }}>
            <Label>Requisitos básicos</Label>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))",
              gap:"1rem",
            }}>
              {[
                "Vehículo propio en buen estado",
                "Documentación al día",
                "Mayor de 21 años",
                "Circulación urbana habitual",
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:BLUE, flexShrink:0 }}/>
                  <span style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:"0.87rem",
                    color:"rgba(255,255,255,0.5)",
                  }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section ref={r2} style={{ padding:"4rem 2.5rem 10rem", maxWidth:620, margin:"0 auto" }}>
        <div className={`fade-up ${iv2?"visible":""}`}>
          <Label>Registro</Label>
          <SectionHeading style={{ fontSize:"clamp(1.8rem, 4vw, 3rem)", marginBottom:"0.75rem" }}>
            Únete a la red.
          </SectionHeading>
          <SubText style={{ marginBottom:"3.5rem" }}>
            Completa el formulario y nuestro equipo te contacta en los próximos días.
          </SubText>

          {sent ? (
            <div style={{
              padding:"3.5rem", border:"1px solid rgba(61,142,255,0.26)",
              borderRadius:3, background:BLUE_SUBTLE, textAlign:"center",
            }}>
              <div style={{ fontSize:"1.8rem", marginBottom:"1rem", color:BLUE }}>◈</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", color:"#fff", marginBottom:"0.6rem" }}>
                Registro recibido.
              </h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.36)" }}>
                Nuestro equipo te contacta en las próximas 48 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {([
                {k:"nombre" as const,   label:"Nombre completo",              type:"text"},
                {k:"ciudad" as const,   label:"Ciudad donde conduces",        type:"text"},
                {k:"email" as const,    label:"Email",                        type:"email"},
                {k:"telefono" as const, label:"WhatsApp / Teléfono",          type:"tel"},
                {k:"vehiculo" as const, label:"Tipo de vehículo (marca · año)",type:"text"},
              ]).map(f=>(
                <div key={f.k}>
                  <label style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
                    letterSpacing:"0.12em", color:"rgba(255,255,255,0.32)",
                    textTransform:"uppercase", display:"block", marginBottom:"0.45rem",
                  }}>{f.label}</label>
                  <input className="form-input" type={f.type} required
                    value={form[f.k]} onChange={upd(f.k)}/>
                </div>
              ))}
              <button type="submit" className="submit-btn" style={{
                alignSelf:"flex-start", marginTop:"0.5rem",
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.13)",
                color:"rgba(255,255,255,0.75)",
              }}
                onMouseEnter={e=>{
                  e.currentTarget.style.background="rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor="rgba(255,255,255,0.3)";
                  e.currentTarget.style.color="#fff";
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background="rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor="rgba(255,255,255,0.13)";
                  e.currentTarget.style.color="rgba(255,255,255,0.75)";
                }}
              >
                Enviar registro →
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer setPage={setPage}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]         = useState<PageId>("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    window.scrollTo({ top:0, behavior:"smooth" });
  }, [page]);

  return (
    <>
      <Navbar page={page} setPage={setPage} scrolled={scrolled}/>
      {page === "home"    && <HomePage    setPage={setPage}/>}
      {page === "brands"  && <BrandsPage  setPage={setPage}/>}
      {page === "drivers" && <DriversPage setPage={setPage}/>}
    </>
  );
}