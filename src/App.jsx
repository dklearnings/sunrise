import React, { useState, useEffect, useRef } from "react";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Facebook, Youtube, Instagram,
  ChevronRight, ChevronDown, GraduationCap, BookOpen, Users, Trophy,
  Microscope, Palette, Dumbbell, Bus, ShieldCheck, Calendar, ArrowRight,
  Pin, Award, Library, Building2, Sparkles, Quote as QuoteIcon, ExternalLink,
  Loader2,
} from "lucide-react";

/* =====================================================================
   All school-specific content lives in /public/config.json (a physical
   file on disk, fetched at runtime). This component contains layout
   and behaviour only — re-skinning the site for another school means
   editing config.json, not this file.
   ===================================================================== */

const ICONS = {
  Sparkles, BookOpen, Microscope, GraduationCap, Library, Dumbbell,
  Palette, Building2, Bus, Award, Users, Trophy, ShieldCheck, Calendar,
};

function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp {...props} />;
}

const toneMap = {
  navy: { bg: "#152447", text: "#F3EEDF" },
  gold: { bg: "#B9822A", text: "#FAF7EF" },
  maroon: { bg: "#7C2D33", text: "#F3EEDF" },
  teal: { bg: "#2F6E62", text: "#F3EEDF" },
  coral: { bg: "#9C4A2E", text: "#FAF7EF" },
};

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const month = d.toLocaleString("en-IN", { month: "short" });
  const year = d.getFullYear();
  return { day: String(day).padStart(2, "0"), month: month.toUpperCase(), year };
}

/* --------------------------- crest --------------------------- */
function Crest({ size = 56, light = false, cfg }) {
  const ring = light ? cfg.colors.paper : cfg.colors.navy;
  const accent = cfg.colors.gold;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke={ring} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke={accent} strokeWidth="1.4" />
      <path
        d="M50 26 L58 44 L78 44 L61 56 L68 76 L50 63 L32 76 L39 56 L22 44 L42 44 Z"
        fill="none" stroke={ring} strokeWidth="2" strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="3.2" fill={accent} />
      <path d="M18 68 Q50 82 82 68" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------- top bar --------------------------- */
function TopBar({ cfg }) {
  const { contact, socials, payments } = cfg;
  return (
    <div className="topbar">
      <div className="shell topbar-inner">
        <div className="topbar-left">
          <span className="tb-item"><MapPin size={13} /> {contact.address}</span>
          <span className="tb-item tb-hide-sm"><Phone size={13} /> {contact.phone}</span>
        </div>
        <div className="topbar-right">
          <a className="tb-pay" href={payments.feePaymentUrl} target="_blank" rel="noopener noreferrer">
            Pay fees online <ExternalLink size={12} />
          </a>
          <span className="tb-item tb-hide-md"><Clock size={13} /> {contact.officeHours}</span>
          <a href={socials.facebook} aria-label="Facebook" className="tb-social"><Facebook size={14} /></a>
          <a href={socials.instagram} aria-label="Instagram" className="tb-social"><Instagram size={14} /></a>
          <a href={socials.youtube} aria-label="YouTube" className="tb-social"><Youtube size={14} /></a>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- header / nav --------------------------- */
function Header({ cfg, scrollTo, active }) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(null);

  const handleClick = (id) => {
    scrollTo(id);
    setOpen(false);
    setSubOpen(null);
  };

  return (
    <header className="header">
      <div className="shell header-inner">
        <button className="brand" onClick={() => handleClick("home")} aria-label="Go to homepage">
          <Crest size={50} cfg={cfg} />
          <span className="brand-text">
            <span className="brand-name">{cfg.schoolName}</span>
            <span className="brand-sub">{cfg.mottoTranslation}</span>
          </span>
        </button>

        <nav className="nav-desktop" aria-label="Primary">
          {cfg.nav.map((item) => (
            <div
              key={item.label}
              className="nav-item"
              onMouseEnter={() => item.children && setSubOpen(item.label)}
              onMouseLeave={() => item.children && setSubOpen(null)}
            >
              <button
                className={"nav-link" + (active === item.id ? " nav-link-active" : "")}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
                {item.children && <ChevronDown size={14} />}
              </button>
              {item.children && subOpen === item.label && (
                <div className="nav-dropdown">
                  {item.children.map((c) => (
                    <button key={c.label} className="nav-dropdown-link" onClick={() => handleClick(c.id)}>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="header-cta-group">
          <a
            className="fees-pill"
            href={cfg.payments.feePaymentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pay fees <ExternalLink size={13} />
          </a>
          <button className="admissions-pill" onClick={() => handleClick("admissions")}>
            Apply now <ArrowRight size={15} />
          </button>
        </div>

        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {cfg.nav.map((item) => (
            <div key={item.label} className="nav-mobile-group">
              <button className="nav-mobile-link" onClick={() => handleClick(item.id)}>
                {item.label}
              </button>
              {item.children && (
                <div className="nav-mobile-children">
                  {item.children.map((c) => (
                    <button key={c.label} className="nav-mobile-sublink" onClick={() => handleClick(c.id)}>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            className="fees-pill fees-pill-mobile"
            href={cfg.payments.feePaymentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pay fees online <ExternalLink size={13} />
          </a>
          <button className="admissions-pill admissions-pill-mobile" onClick={() => handleClick("admissions")}>
            Apply now <ArrowRight size={15} />
          </button>
        </div>
      )}
    </header>
  );
}

/* --------------------------- ticker --------------------------- */
function Ticker({ cfg }) {
  return (
    <div className="ticker">
      <div className="ticker-label">Notice</div>
      <div className="ticker-track">
        <div className="ticker-content">
          <span>{cfg.announcementBar}</span>
          <span className="ticker-dot">●</span>
          <span>{cfg.announcementBar}</span>
          <span className="ticker-dot">●</span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- hero --------------------------- */
function Hero({ cfg, scrollTo }) {
  return (
    <section id="home" className="hero">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-copy">
          <div className="eyebrow eyebrow-light">{cfg.hero.eyebrow}</div>
          <h1 className="hero-heading">{cfg.hero.heading}</h1>
          <p className="hero-body">{cfg.hero.body}</p>
          <div className="hero-ctas">
            <button className="btn btn-gold" onClick={() => scrollTo(cfg.hero.primaryCta.target)}>
              {cfg.hero.primaryCta.label} <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => scrollTo(cfg.hero.secondaryCta.target)}>
              {cfg.hero.secondaryCta.label}
            </button>
          </div>
        </div>

        <div className="hero-card">
          <Crest size={64} light cfg={cfg} />
          <p className="hero-quote">"{cfg.hero.quote.text}"</p>
          <span className="hero-quote-author">— {cfg.hero.quote.author}</span>
          <div className="hero-card-foot">
            <span>{cfg.board}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- stats --------------------------- */
function Stats({ cfg }) {
  return (
    <section className="stats">
      <div className="shell stats-grid">
        {cfg.stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <Icon name={s.icon} size={22} strokeWidth={1.6} />
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- principal --------------------------- */
function Principal({ cfg }) {
  const initials = cfg.principal.name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase() && w.length > 2)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <section id="principal" className="section">
      <div className="shell principal-grid">
        <div className="principal-photo">
          <div className="principal-avatar">{initials}</div>
        </div>
        <div className="principal-copy">
          <div className="eyebrow">From the Principal's desk</div>
          <QuoteIcon size={30} className="principal-quote-icon" />
          <p className="principal-message">{cfg.principal.message}</p>
          <div className="principal-name-block">
            <span className="principal-name">{cfg.principal.name}</span>
            <span className="principal-role">{cfg.principal.designation}, {cfg.schoolName}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- programs --------------------------- */
function Programs({ cfg }) {
  return (
    <section id="programs" className="section section-cream">
      <div className="shell">
        <div className="section-head">
          <div className="eyebrow">Academics</div>
          <h2 className="section-title">A clear path from Nursery to Class XII</h2>
          <p className="section-sub">Four stages, one continuous journey — each building the confidence and skills for the next.</p>
        </div>
        <div className="programs-grid">
          {cfg.programs.map((p) => (
            <div className="program-card" key={p.title}>
              <div className="program-icon"><Icon name={p.icon} size={24} strokeWidth={1.6} /></div>
              <h3 className="program-title">{p.title}</h3>
              <span className="program-range">{p.range}</span>
              <p className="program-desc">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- notice board (signature element) --------------------------- */
function NoticeBoard({ cfg }) {
  return (
    <section id="notices" className="section">
      <div className="shell">
        <div className="section-head-row">
          <div>
            <div className="eyebrow">Stay informed</div>
            <h2 className="section-title">Notice board</h2>
          </div>
          <button className="link-more">View all notices <ChevronRight size={16} /></button>
        </div>

        <div className="corkboard">
          {cfg.notices.map((n, i) => {
            const d = formatDate(n.date);
            return (
              <div className="pin-note" key={i} style={{ "--tilt": `${(i % 2 === 0 ? -1 : 1) * (1.5 + (i % 3))}deg` }}>
                <Pin size={16} className="pin-icon" />
                <div className="pin-date">
                  <span className="pin-day">{d.day}</span>
                  <span className="pin-month">{d.month} {d.year}</span>
                </div>
                <span className="pin-tag">{n.tag}</span>
                <p className="pin-title">{n.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- infrastructure --------------------------- */
function Infrastructure({ cfg }) {
  return (
    <section id="infrastructure" className="section section-navy">
      <div className="shell">
        <div className="section-head">
          <div className="eyebrow eyebrow-light">Campus</div>
          <h2 className="section-title section-title-light">Built for how children actually learn</h2>
          <p className="section-sub section-sub-light">Six spaces on campus that carry the weight of every school day.</p>
        </div>
        <div className="infra-grid">
          {cfg.infrastructure.map((f) => (
            <div className="infra-card" key={f.title}>
              <Icon name={f.icon} size={22} strokeWidth={1.6} />
              <h3 className="infra-title">{f.title}</h3>
              <p className="infra-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- gallery --------------------------- */
function Gallery({ cfg }) {
  return (
    <section id="gallery" className="section section-cream">
      <div className="shell">
        <div className="section-head">
          <div className="eyebrow">Life at {cfg.shortName}</div>
          <h2 className="section-title">Moments from the school year</h2>
        </div>
        <div className="gallery-grid">
          {cfg.gallery.map((g, i) => {
            const t = toneMap[g.tone] || toneMap.navy;
            return (
              <div className="gallery-tile" key={i} style={{ background: t.bg, color: t.text }}>
                <span className="gallery-category">{g.category}</span>
                <span className="gallery-caption">{g.caption}</span>
              </div>
            );
          })}
        </div>
        <p className="gallery-note">Photographs are placeholders — replace each tile with real campus photography.</p>
      </div>
    </section>
  );
}

/* --------------------------- admissions CTA --------------------------- */
function AdmissionsCta({ cfg, scrollTo }) {
  return (
    <section id="admissions" className="admissions">
      <div className="shell admissions-inner">
        <div>
          <h2 className="admissions-title">Admissions for 2027–28 are open</h2>
          <p className="admissions-body">Seats available from Preparatory-I to Class IX. Book a campus visit or begin your application on our admissions portal.</p>
        </div>
        <div className="admissions-ctas">
          <button className="btn btn-gold" onClick={() => scrollTo("contact")}>Book a campus visit</button>
          <a
            className="btn btn-outline-dark"
            href={cfg.payments.onlineAdmissionUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Start application <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- contact / location --------------------------- */
function ContactLocation({ cfg }) {
  const { contact, payments } = cfg;
  return (
    <section id="contact" className="section">
      <div className="shell contact-grid">
        <div className="contact-form-card">
          <div className="eyebrow">Get in touch</div>
          <h2 className="section-title">Ask us anything</h2>
          <p className="section-sub">Reach out about admissions, fees or a campus tour — our office responds within one working day.</p>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <label>
                Your name
                <input type="text" placeholder="Full name" />
              </label>
              <label>
                Phone number
                <input type="tel" placeholder="10-digit mobile number" />
              </label>
            </div>
            <label>
              Email address
              <input type="email" placeholder="name@example.com" />
            </label>
            <label>
              Message
              <textarea rows="4" placeholder="Tell us what you'd like to know" />
            </label>
            <button type="submit" className="btn btn-navy">Send message <ArrowRight size={16} /></button>
          </form>

          <div className="portal-links">
            <a href={payments.feePaymentUrl} target="_blank" rel="noopener noreferrer" className="portal-link">
              <span>Fee payment portal</span> <ExternalLink size={14} />
            </a>
            <a href={payments.onlineAdmissionUrl} target="_blank" rel="noopener noreferrer" className="portal-link">
              <span>Online admission portal</span> <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="contact-side">
          <div className="map-frame">
            <iframe
              title="School location"
              src={cfg.mapEmbedUrl}
              width="100%"
              height="260"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="contact-detail"><MapPin size={18} /><span>{contact.address}</span></div>
          <div className="contact-detail"><Phone size={18} /><span>{contact.phone} · {contact.altPhone}</span></div>
          <div className="contact-detail"><Mail size={18} /><span>{contact.email}</span></div>
          <div className="contact-detail"><Clock size={18} /><span>{contact.officeHours}</span></div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- footer --------------------------- */
function Footer({ cfg, scrollTo }) {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <Crest size={44} light cfg={cfg} />
            <span className="footer-school-name">{cfg.schoolName}</span>
          </div>
          <p className="footer-tagline">{cfg.tagline}</p>
          <div className="footer-socials">
            <a href={cfg.socials.facebook} aria-label="Facebook"><Facebook size={16} /></a>
            <a href={cfg.socials.instagram} aria-label="Instagram"><Instagram size={16} /></a>
            <a href={cfg.socials.youtube} aria-label="YouTube"><Youtube size={16} /></a>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Explore</span>
          {cfg.nav.map((n) => (
            <button key={n.label} className="footer-link" onClick={() => scrollTo(n.id)}>{n.label}</button>
          ))}
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Resources</span>
          {cfg.footerLinks.map((f) => (
            <button key={f.label} className="footer-link" onClick={() => scrollTo(f.id)}>{f.label}</button>
          ))}
          <a className="footer-link" href={cfg.payments.feePaymentUrl} target="_blank" rel="noopener noreferrer">
            Pay fees online
          </a>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <span className="footer-text">{cfg.contact.address}</span>
          <span className="footer-text">{cfg.contact.phone}</span>
          <span className="footer-text">{cfg.contact.email}</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {cfg.schoolName}. All rights reserved.</span>
        <span>{cfg.board}</span>
      </div>
    </footer>
  );
}

/* --------------------------- global styles --------------------------- */
function SiteStyles({ cfg }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

      .site {
        --navy: ${cfg.colors.navy};
        --navy-light: ${cfg.colors.navyLight};
        --navy-soft: ${cfg.colors.navySoft};
        --gold: ${cfg.colors.gold};
        --gold-deep: ${cfg.colors.goldDeep};
        --maroon: ${cfg.colors.maroon};
        --paper: ${cfg.colors.paper};
        --cream: ${cfg.colors.cream};
        --ink: ${cfg.colors.ink};
        --ink-soft: ${cfg.colors.inkSoft};
        --line: ${cfg.colors.line};
        --teal: ${cfg.colors.teal};
        --white: ${cfg.colors.white};
        font-family: 'Inter', sans-serif;
        background: var(--paper);
        color: var(--ink);
        -webkit-font-smoothing: antialiased;
      }
      .site * { box-sizing: border-box; }
      .site h1, .site h2, .site h3 { font-family: 'Fraunces', serif; margin: 0; }
      .site p { margin: 0; }
      .site button { font-family: 'Inter', sans-serif; cursor: pointer; }
      .shell { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
      .section { padding: 72px 0; }
      .section-cream { background: var(--cream); }
      .section-navy { background: var(--navy); }
      .eyebrow {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--gold-deep);
        margin-bottom: 12px;
        font-weight: 500;
      }
      .eyebrow-light { color: var(--gold); }
      .section-head { max-width: 620px; margin-bottom: 40px; }
      .section-head-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
      .section-title { font-size: 32px; line-height: 1.2; font-weight: 600; color: var(--navy); }
      .section-title-light { color: var(--paper); }
      .section-sub { margin-top: 12px; color: var(--ink-soft); font-size: 15.5px; line-height: 1.6; }
      .section-sub-light { color: #C7CEE0; }
      .link-more { display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--navy); font-weight: 600; font-size: 14px; padding: 0; }

      .topbar { background: var(--navy); color: #C7CEE0; font-size: 12.5px; }
      .topbar-inner { display: flex; align-items: center; justify-content: space-between; padding: 8px 24px; gap: 12px; }
      .topbar-left, .topbar-right { display: flex; align-items: center; gap: 18px; }
      .tb-item { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
      .tb-pay { display: flex; align-items: center; gap: 5px; color: var(--gold); font-weight: 600; white-space: nowrap; }
      .tb-pay:hover { color: var(--paper); }
      .tb-social { color: #C7CEE0; display: flex; }
      .tb-social:hover { color: var(--gold); }

      .header { background: var(--paper); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 40; }
      .header-inner { display: flex; align-items: center; gap: 20px; padding: 12px 24px; }
      .brand { display: flex; align-items: center; gap: 12px; background: none; border: none; padding: 0; text-align: left; }
      .brand-text { display: flex; flex-direction: column; }
      .brand-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: var(--navy); line-height: 1.15; }
      .brand-sub { font-size: 11.5px; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; }
      .nav-desktop { display: flex; align-items: center; gap: 4px; margin-left: auto; }
      .nav-item { position: relative; }
      .nav-link { display: flex; align-items: center; gap: 4px; background: none; border: none; padding: 10px 12px; font-size: 14.5px; font-weight: 500; color: var(--ink); border-radius: 6px; }
      .nav-link:hover { color: var(--navy); background: var(--navy-soft); }
      .nav-link-active { color: var(--navy); font-weight: 600; }
      .nav-dropdown { position: absolute; top: 100%; left: 0; background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 6px; min-width: 190px; box-shadow: 0 12px 28px rgba(21,36,71,0.12); }
      .nav-dropdown-link { display: block; width: 100%; text-align: left; background: none; border: none; padding: 9px 12px; font-size: 14px; color: var(--ink); border-radius: 6px; }
      .nav-dropdown-link:hover { background: var(--navy-soft); color: var(--navy); }
      .header-cta-group { display: flex; align-items: center; gap: 10px; }
      .fees-pill { display: flex; align-items: center; gap: 6px; background: var(--navy-soft); color: var(--navy); border: 1px solid var(--line); padding: 9px 16px; border-radius: 999px; font-size: 13.5px; font-weight: 600; }
      .fees-pill:hover { border-color: var(--gold-deep); color: var(--gold-deep); }
      .admissions-pill { display: flex; align-items: center; gap: 6px; background: var(--navy); color: var(--paper); border: none; padding: 10px 18px; border-radius: 999px; font-size: 14px; font-weight: 600; }
      .admissions-pill:hover { background: var(--navy-light); }
      .menu-toggle { display: none; background: none; border: none; color: var(--navy); }

      .nav-mobile { display: none; }

      .ticker { background: var(--gold); display: flex; align-items: stretch; overflow: hidden; }
      .ticker-label { background: var(--maroon); color: var(--cream); font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; padding: 8px 16px; letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; display: flex; align-items: center; }
      .ticker-track { flex: 1; overflow: hidden; display: flex; align-items: center; }
      .ticker-content { display: flex; align-items: center; gap: 28px; white-space: nowrap; padding-left: 100%; animation: marquee 26s linear infinite; color: var(--navy); font-size: 13.5px; font-weight: 600; }
      .ticker-dot { color: var(--navy); opacity: 0.5; font-size: 8px; }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-100%); } }
      @media (prefers-reduced-motion: reduce) { .ticker-content { animation: none; padding-left: 16px; } }

      .hero { background: var(--navy); position: relative; overflow: hidden; }
      .hero-pattern { position: absolute; inset: 0; opacity: 0.10; background-image: radial-gradient(circle, var(--gold) 1.4px, transparent 1.4px); background-size: 26px 26px; }
      .hero-inner { position: relative; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; align-items: center; padding: 88px 24px 96px; }
      .hero-heading { font-size: 44px; line-height: 1.14; color: var(--paper); font-weight: 600; margin: 4px 0 20px; }
      .hero-body { color: #C7CEE0; font-size: 16.5px; line-height: 1.65; max-width: 480px; }
      .hero-ctas { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
      .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 22px; border-radius: 8px; font-size: 14.5px; font-weight: 600; border: none; text-decoration: none; }
      .btn-gold { background: var(--gold); color: var(--navy); }
      .btn-gold:hover { background: var(--gold-deep); }
      .btn-outline { background: transparent; color: var(--paper); border: 1.5px solid rgba(250,247,239,0.35); }
      .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
      .btn-outline-dark { background: transparent; color: var(--navy); border: 1.5px solid rgba(21,36,71,0.3); }
      .btn-outline-dark:hover { border-color: var(--navy); }
      .btn-navy { background: var(--navy); color: var(--paper); width: 100%; justify-content: center; margin-top: 4px; }
      .btn-navy:hover { background: var(--navy-light); }

      .hero-card { background: rgba(250,247,239,0.06); border: 1px solid rgba(250,247,239,0.16); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
      .hero-quote { font-family: 'Fraunces', serif; font-size: 19px; line-height: 1.5; color: var(--paper); font-style: italic; }
      .hero-quote-author { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--gold); }
      .hero-card-foot { border-top: 1px solid rgba(250,247,239,0.16); padding-top: 14px; margin-top: 6px; font-size: 12.5px; color: #C7CEE0; }

      .stats { background: var(--paper); border-bottom: 1px solid var(--line); }
      .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
      .stat-card { background: var(--paper); padding: 30px 22px; display: flex; flex-direction: column; gap: 8px; color: var(--navy); }
      .stat-value { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; }
      .stat-label { font-size: 13px; color: var(--ink-soft); }

      .principal-grid { display: grid; grid-template-columns: 0.34fr 0.66fr; gap: 56px; align-items: center; }
      .principal-avatar { width: 100%; aspect-ratio: 1; border-radius: 16px; background: var(--navy-soft); color: var(--navy); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 56px; font-weight: 600; border: 1px solid var(--line); }
      .principal-quote-icon { color: var(--gold); margin-bottom: 8px; }
      .principal-message { font-family: 'Fraunces', serif; font-size: 22px; line-height: 1.55; color: var(--navy); font-weight: 500; }
      .principal-name-block { margin-top: 22px; display: flex; flex-direction: column; }
      .principal-name { font-weight: 700; color: var(--navy); font-size: 15px; }
      .principal-role { font-size: 13px; color: var(--ink-soft); }

      .programs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      .program-card { background: var(--white); border: 1px solid var(--line); border-radius: 14px; padding: 26px 22px; display: flex; flex-direction: column; gap: 6px; }
      .program-icon { width: 44px; height: 44px; border-radius: 10px; background: var(--navy-soft); color: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
      .program-title { font-size: 18px; color: var(--navy); font-weight: 600; }
      .program-range { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--gold-deep); letter-spacing: 0.04em; }
      .program-desc { font-size: 13.8px; color: var(--ink-soft); line-height: 1.55; margin-top: 8px; }

      .corkboard { background: #E9DEC3; border: 1px solid #D9C79F; border-radius: 18px; padding: 34px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; background-image: radial-gradient(#D9C79F 0.7px, transparent 0.7px); background-size: 14px 14px; }
      .pin-note { background: #FFFDF6; border-radius: 3px; padding: 20px 18px 18px; position: relative; box-shadow: 0 6px 14px rgba(76,58,20,0.16); transform: rotate(var(--tilt)); transition: transform 0.2s ease; }
      .pin-note:hover { transform: rotate(0deg) translateY(-2px); }
      .pin-icon { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); color: var(--maroon); }
      .pin-date { display: flex; align-items: baseline; gap: 6px; margin-bottom: 10px; }
      .pin-day { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: var(--navy); }
      .pin-month { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-soft); }
      .pin-tag { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--maroon); background: rgba(124,45,51,0.08); padding: 3px 8px; border-radius: 4px; margin-bottom: 10px; }
      .pin-title { font-size: 14px; line-height: 1.45; color: var(--ink); }

      .infra-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(250,247,239,0.14); border: 1px solid rgba(250,247,239,0.14); border-radius: 14px; overflow: hidden; }
      .infra-card { background: var(--navy); padding: 30px 26px; color: var(--gold); }
      .infra-title { font-size: 17px; color: var(--paper); font-weight: 600; margin: 14px 0 8px; }
      .infra-desc { font-size: 13.6px; color: #C7CEE0; line-height: 1.55; }

      .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .gallery-tile { border-radius: 12px; aspect-ratio: 4/3; padding: 16px; display: flex; flex-direction: column; justify-content: flex-end; gap: 4px; }
      .gallery-category { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.85; }
      .gallery-caption { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; }
      .gallery-note { margin-top: 18px; font-size: 12.5px; color: var(--ink-soft); font-style: italic; }

      .admissions { background: var(--maroon); }
      .admissions-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 48px 24px; flex-wrap: wrap; }
      .admissions-title { font-size: 27px; color: var(--paper); font-weight: 600; }
      .admissions-body { color: #E8D2D2; font-size: 14.5px; margin-top: 8px; max-width: 460px; }
      .admissions-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
      .admissions-ctas .btn-outline-dark { color: var(--paper); border-color: rgba(250,247,239,0.4); }
      .admissions-ctas .btn-outline-dark:hover { border-color: var(--gold); color: var(--gold); }

      .contact-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; }
      .contact-form-card { background: var(--white); border: 1px solid var(--line); border-radius: 16px; padding: 34px; }
      .contact-form { display: flex; flex-direction: column; gap: 16px; margin-top: 22px; }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .contact-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--navy); }
      .contact-form input, .contact-form textarea { font-family: 'Inter', sans-serif; border: 1px solid var(--line); border-radius: 8px; padding: 11px 13px; font-size: 14px; color: var(--ink); background: var(--paper); resize: vertical; }
      .contact-form input:focus, .contact-form textarea:focus { outline: 2px solid var(--gold); outline-offset: 1px; border-color: transparent; }
      .portal-links { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--line); }
      .portal-link { display: flex; align-items: center; justify-content: space-between; font-size: 13.5px; font-weight: 600; color: var(--navy); padding: 4px 0; }
      .portal-link:hover { color: var(--gold-deep); }
      .contact-side { display: flex; flex-direction: column; gap: 14px; }
      .map-frame { border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
      .contact-detail { display: flex; align-items: flex-start; gap: 12px; background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; font-size: 13.8px; color: var(--ink); }
      .contact-detail svg { color: var(--navy); flex-shrink: 0; margin-top: 1px; }

      .footer { background: var(--navy); color: #C7CEE0; }
      .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; padding: 56px 24px 40px; }
      .footer-brand-row { display: flex; align-items: center; gap: 12px; }
      .footer-school-name { font-family: 'Fraunces', serif; font-size: 18px; color: var(--paper); font-weight: 600; }
      .footer-tagline { margin-top: 14px; font-size: 13.5px; line-height: 1.6; max-width: 260px; }
      .footer-socials { display: flex; gap: 10px; margin-top: 18px; }
      .footer-socials a { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(250,247,239,0.2); display: flex; align-items: center; justify-content: center; color: var(--paper); }
      .footer-socials a:hover { border-color: var(--gold); color: var(--gold); }
      .footer-col { display: flex; flex-direction: column; gap: 10px; }
      .footer-col-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gold); margin-bottom: 4px; }
      .footer-link { background: none; border: none; text-align: left; padding: 0; color: #C7CEE0; font-size: 13.8px; }
      .footer-link:hover { color: var(--paper); }
      .footer-text { font-size: 13.5px; }
      .footer-bottom { border-top: 1px solid rgba(250,247,239,0.14); display: flex; justify-content: space-between; padding: 18px 24px; font-size: 12px; color: #9AA4C0; flex-wrap: wrap; gap: 8px; }

      .site button:focus-visible, .site a:focus-visible, .site input:focus-visible, .site textarea:focus-visible {
        outline: 2px solid var(--gold); outline-offset: 2px;
      }

      .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: #FAF7EF; color: #152447; font-family: 'Inter', sans-serif; }
      .loading-spin { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .error-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #FAF7EF; color: #7C2D33; font-family: 'Inter', sans-serif; text-align: center; padding: 24px; }

      @media (max-width: 980px) {
        .hero-inner { grid-template-columns: 1fr; padding: 56px 24px 64px; }
        .hero-heading { font-size: 34px; }
        .principal-grid { grid-template-columns: 1fr; gap: 32px; }
        .principal-avatar { max-width: 200px; margin: 0 auto; }
        .programs-grid { grid-template-columns: repeat(2, 1fr); }
        .infra-grid { grid-template-columns: repeat(2, 1fr); }
        .corkboard { grid-template-columns: repeat(2, 1fr); }
        .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        .contact-grid { grid-template-columns: 1fr; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .footer-grid { grid-template-columns: 1fr 1fr; }
      }

      @media (max-width: 760px) {
        .nav-desktop { display: none; }
        .menu-toggle { display: flex; }
        .header-cta-group { display: none; }
        .header-inner { padding: 12px 20px; }
        .nav-mobile { display: flex; flex-direction: column; padding: 8px 20px 20px; border-top: 1px solid var(--line); gap: 2px; }
        .nav-mobile-link { text-align: left; background: none; border: none; padding: 11px 4px; font-size: 15px; font-weight: 600; color: var(--navy); border-bottom: 1px solid var(--line); }
        .nav-mobile-children { display: flex; flex-direction: column; padding-left: 12px; }
        .nav-mobile-sublink { text-align: left; background: none; border: none; padding: 9px 4px; font-size: 13.8px; color: var(--ink-soft); }
        .fees-pill-mobile, .admissions-pill-mobile { display: flex; justify-content: center; margin-top: 10px; }
        .tb-hide-sm, .tb-hide-md { display: none; }
        .topbar-inner { padding: 8px 20px; }
        .shell { padding: 0 20px; }
        .hero-heading { font-size: 28px; }
        .programs-grid { grid-template-columns: 1fr; }
        .infra-grid { grid-template-columns: 1fr; }
        .corkboard { grid-template-columns: 1fr; padding: 22px; }
        .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        .stats-grid { grid-template-columns: 1fr 1fr; }
        .footer-grid { grid-template-columns: 1fr; padding: 44px 20px 32px; }
        .footer-bottom { padding: 16px 20px; }
        .form-row { grid-template-columns: 1fr; }
        .admissions-inner { padding: 40px 20px; }
        .section { padding: 52px 0; }
        .section-title { font-size: 26px; }
      }
    `}</style>
  );
}

/* ===================================================================== */

export default function App() {
  const [cfg, setCfg] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("home");
  const observing = useRef(false);

  useEffect(() => {
    fetch("/config.json")
      .then((res) => {
        if (!res.ok) throw new Error("config.json responded with " + res.status);
        return res.json();
      })
      .then(setCfg)
      .catch((err) => setError(err.message));
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!cfg || observing.current) return;
    observing.current = true;
    const sectionIds = ["home", "principal", "programs", "notices", "infrastructure", "gallery", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [cfg]);

  if (error) {
    return (
      <div className="error-screen">
        <strong>Couldn't load config.json</strong>
        <span>{error}</span>
        <span>Make sure public/config.json exists and the dev server is running.</span>
      </div>
    );
  }

  if (!cfg) {
    return (
      <div className="loading-screen">
        <Loader2 className="loading-spin" size={28} />
        <span>Loading school details…</span>
      </div>
    );
  }

  return (
    <div className="site">
      <SiteStyles cfg={cfg} />
      <TopBar cfg={cfg} />
      <Header cfg={cfg} scrollTo={scrollTo} active={active} />
      <Ticker cfg={cfg} />
      <Hero cfg={cfg} scrollTo={scrollTo} />
      <Stats cfg={cfg} />
      <Principal cfg={cfg} />
      <Programs cfg={cfg} />
      <NoticeBoard cfg={cfg} />
      <Infrastructure cfg={cfg} />
      <Gallery cfg={cfg} />
      <AdmissionsCta cfg={cfg} scrollTo={scrollTo} />
      <ContactLocation cfg={cfg} />
      <Footer cfg={cfg} scrollTo={scrollTo} />
    </div>
  );
}
