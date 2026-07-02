/**
 * src/pages/HomePage.jsx — the badminton marketing home page.
 * Rendered when the mount div has data-page="home" (front-page.php / index.php).
 */
import { useState, useEffect } from 'react';
import { Layout, useDSComponents, useViewport, getThemeData, FB, MediaSlot } from '../lib/shared.jsx';

// ─── Consistent section spacing ───────────────────────────────────────────────
const SECTION_MAX = 1184;                                          // content max-width
const sectionGap  = (isMobile) => (isMobile ? 56 : 120);            // vertical gap above each section
const sectionPadX = (isMobile) => (isMobile ? '0 16px' : '0 32px'); // horizontal padding

// ─── Page data ────────────────────────────────────────────────────────────────
// Fallback location cards (used before the live programs feed loads / if it fails)
// and the default Free Trial session options. Mobile abbreviates long province
// names (e.g. British Columbia → BC); desktop shows the full name.
const LOCATIONS = (isMobile) => [
  { city: 'Ontario',                            programs: 10, status: 'open',    lessons: 2, leagues: 8 },
  { city: isMobile ? 'BC' : 'British Columbia', programs: 10, status: 'open',    lessons: 2, leagues: 8 },
  { city: 'Alberta',                            programs:  6, status: 'limited', lessons: 1, leagues: 5 },
];

function HeroSection({ DS, isMobile, t }) {
  const { SectionHeading, Button } = DS;
  const heading = t.texts.heroHeading || 'Play pickleball in Ontario';
  const primaryCta = t.texts.heroBtnPrimary || 'Find a League Near You';
  const secondaryCta = t.texts.heroBtnSecondary || 'New to Pickleball? Start Here';
  return (
    <section style={{ textAlign: 'center', padding: isMobile ? '40px 20px 40px' : '60px 24px 36px', maxWidth: 1000, margin: '0 auto' }}>
      {SectionHeading
        ? <SectionHeading level={isMobile ? 'xl' : 'lg'} align="center" as="h1">{heading}</SectionHeading>
        : <h1 style={FB.h(isMobile ? 36 : 56)}>{heading}</h1>
      }
      <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: isMobile ? 16 : 18, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, margin: '16px auto 0', maxWidth: 650 }}>
        {t.texts.heroDesc || 'Join Canada’s most exciting and fastest-growing pickleball community! We welcome players of all skill levels onto the court.'}
      </p>
      {/* Outer wrapper centres the button group (works for inline-grid too). */}
      <div style={{ marginTop: isMobile ? 24 : 28, textAlign: 'center' }}>
        <div style={{
          // Equal-width buttons. Desktop: a shrink-to-fit inline-grid whose two equal
          // `1fr` auto-columns BOTH size to the wider button — so they always match,
          // with no clipping and no hardcoded width. Mobile: one full-width column.
          display: isMobile ? 'grid' : 'inline-grid',
          gridTemplateColumns: isMobile ? '1fr' : undefined,
          gridAutoFlow: isMobile ? 'row' : 'column',
          gridAutoColumns: isMobile ? undefined : '1fr',
          gap: 16,
          // Mobile: cap the width so the stacked buttons are shorter, and centre them.
          width: isMobile ? '100%' : undefined,
          maxWidth: isMobile ? 260 : undefined,
          marginLeft: isMobile ? 'auto' : undefined,
          marginRight: isMobile ? 'auto' : undefined,
        }}>
          {Button ? (
            <>
              <Button variant="primary"   size={isMobile ? 'md' : 'lg'} full>{primaryCta}</Button>
              <Button variant="secondary" size={isMobile ? 'md' : 'lg'} full>{secondaryCta}</Button>
            </>
          ) : (
            <>
              <button style={{ ...FB.btn('primary'),   width: '100%' }}>{primaryCta}</button>
              <button style={{ ...FB.btn('secondary'), width: '100%' }}>{secondaryCta}</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroImageSection({ isMobile, t }) {
  const src = isMobile
    ? (t.images.heroMobile || t.asset('mobile-hero.svg'))
    : (t.images.hero || t.asset('hero.png'));
  return (
    <div style={{ maxWidth: SECTION_MAX, margin: '0 auto', padding: isMobile ? 0 : sectionPadX(isMobile) }}>
      <img src={src} style={{ width: '100%' }} />
    </div>
  );
}

function NewProgramsSection({ DS, isMobile, t }) {
  const { Carousel, SectionHeading } = DS;

  // Slides for the carousel — admin-set Customizer photos (EA Images → Carousel
  // image 1–3) when present, else the bundled program photos so it's never empty.
  const carouselImages = [
    t.images.carousel1 || t.asset('hero.png'),
    t.images.carousel2 || t.asset('net.png'),
    t.images.carousel3 || t.asset('birdie.png'),
  ].filter(Boolean);

  // Portrait "poster"/flyer proportions (4:5).
  const carousel = Carousel
    ? <Carousel images={carouselImages} alt="Our new programs" ratio="4 / 5" autoPlay interval={4000} style={{ width: '100%', maxWidth: 380 }} />
    : <img src={carouselImages[0]} alt="Our new programs" style={{ width: '100%', maxWidth: 380, aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }} />;

  // Heading text. On mobile it matches the other section headers (SectionHeading "lg");
  // on desktop it's overlaid on top of the illustration in the left column.
  const headingText = t.texts.newProgramsHeading || 'Check out our new programs!';
  const mobileHeading = SectionHeading
    ? <SectionHeading level="lg" align="center">{headingText}</SectionHeading>
    : <h2 style={{ ...FB.h(28), textAlign: 'center' }}>{headingText}</h2>;

  // ── Mobile: heading (consistent with other sections) → carousel → full-bleed SVG ──
  if (isMobile) {
    return (
      <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: 0 }}>
        <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', width: '75%' }}>{mobileHeading}</div>
          <div style={{
            background: '#fff', marginTop: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 20px', width: '88%'
          }}>
            {carousel}
          </div>
        </div>
        {/* Full-bleed illustration below the carousel (no side padding) */}
        <img
          src={t.images.sectionImageMobile || t.asset('mobile-announcements.svg')}
          alt=""
          aria-hidden="true"
          style={{ display: 'block', width: '100%', height: 'auto', marginTop: 24 }}
        />
      </section>
    );
  }

  // ── Desktop: heading overlaid on the illustration (left), carousel panel (right) ──
  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Illustration — fills its column at its natural ratio; the carousel panel
            drives the row height and the image covers the area, cropping from the
            LEFT (objectPosition: right) so the form-facing side is always kept. */}
        <div style={{ position: 'relative', flex: '0 1 832px', minWidth: 0, overflow: 'hidden' }}>
          <img
            src={t.images.sectionImage || t.asset('new-programs-left.svg')}
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right' }}
          />
          {/* Height floor: an aspect-ratio spacer keeps the column at least the
              image's natural height (832×555). The panel can push it taller. */}
          <div aria-hidden="true" style={{ width: '100%', aspectRatio: '832 / 555' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 32px 0', width: '60%', textAlign: 'left' }}>
            {SectionHeading
              ? <SectionHeading level="md" align="left">{headingText}</SectionHeading>
              : <h2 style={{ ...FB.h(32), fontWeight: 'var(--fw-regular, 400)', margin: 0 }}>{headingText}</h2>
            }
          </div>
        </div>
        {/* Carousel panel — fills the remaining width and centres the photo strip. */}
        <div style={{
          flex: '1 1 0', minWidth: '35%', background: '#F9FDFF',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '48px 40px',
        }}>
          {carousel}
        </div>
      </div>
    </section>
  );
}

// Free Trial registration form. Shown in place of the carousel when the
// Customizer toggle "Show photo carousel" is unchecked (options.useCarousel = false).
function FreeTrialSection({ DS, isMobile, t }) {
  const { Button, SectionHeading } = DS;
  const [form, setForm] = useState({ name: '', email: '', session: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    // Client-side validation before hitting the server.
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter the athlete’s name and email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${t.apiUrl}ea/v1/free-trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': t.nonce },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data && data.message ? data.message : 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
      setForm({ name: '', email: '', session: '', website: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    fontSize: 14, fontWeight: 600, color: 'var(--ea-navy, #10414F)', marginBottom: 8,
  };
  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '12px 16px',
    border: '1px solid var(--border-card, #E5E5E5)', borderRadius: 8,
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16,
    color: 'var(--ea-ink, #1E526E)', background: '#fff',
  };

  // Session options for the dropdown — editable in Appearance → Customize → EA Text
  // ("Free Trial sessions", one per line). Falls back to the location list.
  const sessionOptions = (t.texts.freeTrialSessions || '')
    .split('\n').map((s) => s.trim()).filter(Boolean);
  const sessions = sessionOptions.length ? sessionOptions : LOCATIONS(isMobile).map((l) => l.city);

  // Heading text. On mobile it matches the other section headers (SectionHeading "lg");
  // on desktop it's overlaid on top of the illustration in the left column.
  const headingText = t.texts.freeTrialHeading || 'Register for your free trial!';
  const mobileHeading = SectionHeading
    ? <SectionHeading level="lg" align="center">{headingText}</SectionHeading>
    : <h2 style={{ ...FB.h(28), textAlign: 'center' }}>{headingText}</h2>;

  const formInner = (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 440 }}>
      <div>
        <label style={labelStyle} htmlFor="ft-name">{t.texts.freeTrialNameLabel || 'Athlete\'s Name'}</label>
        <input id="ft-name" style={inputStyle} placeholder="Name" value={form.name} onChange={update('name')} />
      </div>
      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="ft-email">{t.texts.freeTrialEmailLabel || 'Email'}</label>
        <input id="ft-email" type="email" style={inputStyle} placeholder="Email" value={form.email} onChange={update('email')} />
      </div>
      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="ft-session">{t.texts.freeTrialSessionLabel || 'Choose Session'}</label>
        <div style={{ position: 'relative' }}>
          <select
            id="ft-session" value={form.session} onChange={update('session')}
            style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: 40, cursor: 'pointer', color: form.session ? 'var(--ea-ink, #1E526E)' : 'var(--ea-muted, #787878)' }}
          >
            <option value="" disabled>Select Choice</option>
            {sessions.map((s) => <option key={s} value={s} style={{ color: 'var(--ea-ink, #1E526E)' }}>{s}</option>)}
          </select>
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ea-navy, #10414F)', display: 'inline-flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </span>
        </div>
      </div>
      {/* Honeypot — hidden from real users; bots that fill it are silently dropped. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="ft-website">Website</label>
        <input id="ft-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
      </div>

      {error && (
        <p role="alert" style={{ marginTop: 16, marginBottom: 0, fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 14, color: 'var(--ea-error, #C0392B)' }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 24, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
        {Button
          ? <Button variant="dark" type="submit" disabled={sending}>{sending ? 'Registering…' : (t.texts.freeTrialSubmit || 'Register')}</Button>
          : <button type="submit" disabled={sending} style={{ ...FB.btn('primary'), background: 'var(--ea-teal-900, #004356)', opacity: sending ? 0.7 : 1, cursor: sending ? 'default' : 'pointer' }}>{sending ? 'Registering…' : (t.texts.freeTrialSubmit || 'Register')}</button>
        }
      </div>
    </form>
  );

  const modal = submitted ? (
    <div
      role="dialog" aria-modal="true"
      onClick={() => setSubmitted(false)}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(16,65,79,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: '#fff', borderRadius: 12, padding: '44px 32px 36px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(16,65,79,.25)' }}>
        <button onClick={() => setSubmitted(false)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ea-navy, #10414F)', display: 'inline-flex', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <h3 style={{ ...FB.h(28), fontWeight: 'var(--fw-regular, 400)', margin: '0 0 12px' }}>{t.texts.freeTrialThanksTitle || 'Thank you!'}</h3>
        <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.5, margin: 0 }}>
          {t.texts.freeTrialThanksBody || 'We\'ll be in touch about your free trial.'}
        </p>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          {Button
            ? <Button variant="dark" onClick={() => setSubmitted(false)}>Close</Button>
            : <button onClick={() => setSubmitted(false)} style={{ ...FB.btn('primary'), background: 'var(--ea-teal-900, #004356)' }}>Close</button>
          }
        </div>
      </div>
    </div>
  ) : null;

  // ── Mobile: heading (consistent with other sections) → form → full-bleed SVG ──
  if (isMobile) {
    return (
      <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: 0 }}>
        <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', width: '75%' }}>{mobileHeading}</div>
          <div style={{
            background: '#fff', marginTop: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 20px', width: '88%'
          }}>
            {formInner}
          </div>
        </div>
        {/* Full-bleed illustration below the form (no side padding) */}
        <img
          src={t.images.sectionImageMobile || t.asset('free-trial-mobile.svg')}
          alt=""
          aria-hidden="true"
          style={{ display: 'block', width: '100%', height: 'auto', marginTop: 24 }}
        />
        {modal}
      </section>
    );
  }

  // ── Desktop: heading overlaid on the illustration (left), form panel (right) ──
  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ position: 'relative', flex: '0 1 832px', minWidth: 0, overflow: 'hidden' }}>
          <img
            src={t.images.sectionImage || t.asset('freetrial-left.svg')}
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right' }}
          />
          <div aria-hidden="true" style={{ width: '100%', aspectRatio: '832 / 555' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 32px 0', width: '60%', textAlign: 'left' }}>
            {SectionHeading
              ? <SectionHeading level="md" align="left">{headingText}</SectionHeading>
              : <h2 style={{ ...FB.h(32), fontWeight: 'var(--fw-regular, 400)', margin: 0 }}>{headingText}</h2>
            }
          </div>
        </div>
        <div style={{
          flex: '1 1 0', minWidth: '35%', background: '#F9FDFF',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
          padding: '48px 40px',
        }}>
          {formInner}
        </div>
      </div>
      {modal}
    </section>
  );
}

// Hover wrapper — signals a card is clickable with a pointer cursor and a
// subtle lift + shadow on hover.
function CardHover({ children }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer',
        borderRadius: 8,
        transition: 'transform .15s ease, box-shadow .15s ease',
        transform: hover ? 'translateY(-1.5px)' : 'none',
        boxShadow: hover ? '0 4px 24px rgba(16, 65, 79, 0.05)' : 'none',
      }}
    >
      {children}
    </div>
  );
}

// Status → dot colour, badge tone, and label. Mirrors the DS LocationCard.
const CARD_STATUS = {
  open:    { dot: 'var(--ea-success)', tone: 'success', label: 'Enrolment Open' },
  limited: { dot: 'var(--ea-warning)', tone: 'warning', label: 'Limited Spots Remaining' },
  closed:  { dot: 'var(--ea-neutral)', tone: 'neutral', label: 'Enrolment Closed' },
};

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

// Local copy of the DS LocationCard so the Subscribe button can swap its label
// to "Subscribe to <city>'s Newsletter" on hover (the DS card hardcodes the text).
function ProgramCard({ Badge, city, programs = 0, status = 'open', lessons = 0, leagues = 0, isMobile = false, onSubscribe }) {
  const [hover, setHover] = useState(false);
  const s = CARD_STATUS[status] || CARD_STATUS.open;
  const dim = status === 'closed';
  return (
    <div style={{
      background: 'var(--ea-white)', border: '1px solid var(--border-card)',
      borderRadius: 'var(--radius-location-card)', boxShadow: 'var(--shadow-card)',
      padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)', fontWeight: 'var(--fw-bold)', fontSize: 22,
          color: dim ? 'var(--ea-muted)' : 'var(--ea-teal-800)', margin: 0,
          textTransform: 'none', letterSpacing: 'var(--ls-body)',
        }}>{city}</h3>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: s.dot, flex: 'none', marginTop: 6 }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Badge tone={dim ? 'neutral' : 'info'}>{programs} Active Programs</Badge>
        <Badge tone={s.tone} dot={!dim}>{s.label}</Badge>
      </div>
      {(lessons || leagues) ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ea-slate)', margin: 0 }}>
          {lessons} Lessons · {leagues} Leagues
        </p>
      ) : null}
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => {
          // Card may be wrapped in a link; don't trigger it. Open the newsletter
          // popup tagged with this location instead.
          e.preventDefault();
          e.stopPropagation();
          if (onSubscribe) onSubscribe(city);
        }}
        style={{
          alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8,
          width: 'fit-content', padding: '6px 12px', borderRadius: 'var(--radius-button)',
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 'var(--fw-medium)',
          border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
          background: '#F9F4FF', color: '#6F677B',
        }}
      >
        <MailIcon />
        <span style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
          Subscribe
          {/* Expand-to-the-right: the extension animates its own max-width from 0,
              so the button (fit-content) hugs "Subscribe" + icon when collapsed and
              grows only as this text reveals + fades in. */}
          <span style={{
            display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap',
            maxWidth: hover ? 400 : 0, opacity: hover ? 1 : 0,
            transition: 'max-width .3s ease, opacity .3s ease',
          }}>&nbsp;to {city}{isMobile ? '' : '’s Newsletter'}</span>
        </span>
      </button>
    </div>
  );
}

// ─── Live programs feed (public JSON) ─────────────────────────────────────────
// Ported from the eabadminton embed: fetch the program rows, keep only active
// EA/TS badminton programs, and collapse them into one card per city with a count.
const PROGRAMS_DATA_URL = 'https://sleep-status.github.io/ea-programs-json/data/programs.json';
const CITY_FALLBACK_URLS = {
  'newmarket / aurora': 'https://eabadminton.com/signup/',
  'newmarket/aurora':   'https://eabadminton.com/signup/',
  'newmarket':          'https://eabadminton.com/signup/',
  'aurora':             'https://eabadminton.com/signup/',
  'richmond hill':      'https://eabadminton.com/richmond-hill-badminton/',
  'georgina / keswick': 'https://eabadminton.com/georgina-badminton/',
  'georgina/keswick':   'https://eabadminton.com/georgina-badminton/',
  'georgina':           'https://eabadminton.com/georgina-badminton/',
  'keswick':            'https://eabadminton.com/georgina-badminton/',
  'caledon':            'https://eabadminton.com/caledon/',
  'king city':          'https://eabadminton.com/king-city-badminton/',
  'king':               'https://eabadminton.com/king-city-badminton/',
};

// Approximate coordinates for the cities that appear in the feed, keyed by the
// normalized city name. Used to sort cards by distance from the visitor when they
// tap "Locations near me". A city missing here just sorts last (never breaks).
const CITY_COORDS = {
  'aurora':           [44.0065, -79.4504],
  'newmarket':        [44.0592, -79.4613],
  'newmarket/aurora': [44.0330, -79.4560],
  'richmond hill':    [43.8828, -79.4403],
  'vaughan':          [43.8361, -79.4983],
  'georgina':         [44.2496, -79.4665],
  'uxbridge':         [44.1092, -79.1204],
  'innisfil':         [44.3000, -79.5833],
  'essa':             [44.2501, -79.7833],
  'barrie':           [44.3894, -79.6903],
  'oro-medonte':      [44.5501, -79.5833],
  'severn':           [44.7501, -79.5333],
  'cambridge':        [43.3601, -80.3127],
  'kamloops':         [50.6745, -120.3273],
  'squamish':         [49.7016, -123.1558],
  'surrey':           [49.1913, -122.8490],
  'terrace':          [54.5182, -128.6032],
  'okotoks':          [50.7256, -113.9749],
};

// Great-circle distance (km) between two [lat, lng] points.
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const norm = (v) => String(v || '').trim().toLowerCase();

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) { const d = new Date(dateStr); return isNaN(d) ? null : d; }
  const [y, m, d] = parts.map(Number);
  const out = new Date(y, m - 1, d);
  return isNaN(out) ? null : out;
}

// Sports present in the feed (code → label + the raw values that map to it).
// Keys match the Customizer multi-select (EA Options → Active Programs sports).
const SPORTS = {
  pb:     { label: 'Pickleball',  aliases: ['pb', 'pickleball', 'pickle'] },
  bad:    { label: 'Badminton',   aliases: ['bad', 'badm', 'badmin', 'badminton'] },
  bask:   { label: 'Basketball',  aliases: ['bask', 'basketball', 'bball'] },
  s_camp: { label: 'Sports Camp', aliases: ['s_camp', 'camp', 'camps', 's_camps'] },
};

// Which sport key a program row belongs to (or null if unrecognised).
function rowSportKey(p) {
  const s = norm(p.sport || p.Sport || p.SPORT);
  for (const key in SPORTS) {
    if (SPORTS[key].aliases.indexOf(s) !== -1) return key;
  }
  return null;
}

function isEAorTS(p) {
  const c = String(p.Category || '').trim().toUpperCase();
  return c === 'EA' || c === 'TS';
}

function isActiveProgram(p) {
  const today = new Date();
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const sessionDates = (p.SessionDates || '')
    .split(',')
    .map((s) => parseLocalDate(s.trim()))
    .filter((d) => d instanceof Date && !isNaN(d));
  if (sessionDates.length) {
    const completed = sessionDates.filter((d) => d < today0).length;
    return completed < sessionDates.length;
  }
  const end = parseLocalDate(p['End Date'] || p.EndDate || p.endDate);
  if (!end) return true;
  return end >= today0;
}

// Collapse program rows → [{ city, programs, status, url, coords }], one per city,
// keeping only rows whose sport is in `sports` (a list of SPORTS keys). When
// `userCoords` is provided, sort nearest-first; otherwise alphabetically.
function buildCityList(programs, sports, userCoords) {
  const allow = new Set(sports && sports.length ? sports : ['bad']);
  const map = new Map();
  programs.forEach((p) => {
    const sportKey = rowSportKey(p);
    if (p && sportKey && allow.has(sportKey) && isEAorTS(p) && p.City && isActiveProgram(p)) {
      const cityName = String(p.City).trim();
      const key = norm(cityName);
      const url = (p.URL && String(p.URL).trim()) || CITY_FALLBACK_URLS[key] || 'https://eabadminton.com/signup/';
      if (!map.has(key)) map.set(key, { city: cityName, programs: 1, status: 'open', url, coords: CITY_COORDS[key] || null });
      else map.get(key).programs += 1;
    }
  });
  return [...map.values()].sort((a, b) => {
    if (userCoords) {
      // Cities with known coords sort by distance; unknown coords fall to the end.
      const da = a.coords ? haversineKm(userCoords, a.coords) : Infinity;
      const db = b.coords ? haversineKm(userCoords, b.coords) : Infinity;
      if (da !== db) return da - db;
    }
    return a.city.localeCompare(b.city);
  });
}

// Fetch the raw rows once on mount; returns null while loading or on error.
function useProgramsFeed() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch(`${PROGRAMS_DATA_URL}?v=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data) => { if (alive) setRows(Array.isArray(data) ? data : []); })
      .catch(() => { if (alive) setRows(null); });
    return () => { alive = false; };
  }, []);
  return rows;
}

const PROGRAMS_LIMIT = 6;   // max city cards shown in the Active Programs section

// Popup newsletter signup, opened from a location card's Subscribe button. Mirrors
// the Free Trial confirmation modal: enter email → submit → confirmation, all in place.
function NewsletterModal({ DS, t, location, onClose }) {
  const { Button } = DS;
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');   // honeypot
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${t.apiUrl}ea/v1/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': t.nonce },
        body: JSON.stringify({ email, location, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data && data.message ? data.message : 'Something went wrong. Please try again.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '12px 16px',
    border: '1px solid var(--border-card, #E5E5E5)', borderRadius: 8,
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16,
    color: 'var(--ea-ink, #1E526E)', background: '#fff',
  };

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(16,65,79,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: '#fff', borderRadius: 12, padding: '44px 32px 36px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(16,65,79,.25)' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ea-navy, #10414F)', display: 'inline-flex', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {submitted ? (
          <>
            <h3 style={{ ...FB.h(28), fontWeight: 'var(--fw-regular, 400)', margin: '0 0 12px' }}>Thank you!</h3>
            <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.5, margin: 0 }}>
              You're subscribed{location ? <> for <strong>{location}</strong></> : ''}. We'll keep you posted!
            </p>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              {Button
                ? <Button variant="dark" onClick={onClose}>Close</Button>
                : <button onClick={onClose} style={{ ...FB.btn('primary'), background: 'var(--ea-teal-900, #004356)' }}>Close</button>
              }
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ ...FB.h(28), fontWeight: 'var(--fw-regular, 400)', margin: '0 0 8px' }}>{t.texts.newsletterHeading || 'Join Our Newsletter!'}</h3>
            <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.5, margin: '0 0 20px' }}>
              {location ? <>Subscribing for <strong>{location}</strong></> : (t.texts.newsletterDesc || 'Stay updated on upcoming programs in your area.')}
            </p>
            <input type="email" placeholder="Your Email" value={email} autoFocus onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            {/* Honeypot — hidden from real users; bots that fill it are silently dropped. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="nlm-website">Website</label>
              <input id="nlm-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            {error && (
              <p role="alert" style={{ marginTop: 12, marginBottom: 0, fontFamily: 'var(--font-body, sans-serif)', fontSize: 14, color: 'var(--ea-error, #C0392B)' }}>{error}</p>
            )}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              {Button
                ? <Button variant="dark" type="submit" disabled={sending}>{sending ? 'Subscribing…' : (t.texts.newsletterSubscribe || 'Subscribe')}</Button>
                : <button type="submit" disabled={sending} style={{ ...FB.btn('primary'), background: 'var(--ea-teal-900, #004356)', opacity: sending ? 0.7 : 1 }}>{sending ? 'Subscribing…' : (t.texts.newsletterSubscribe || 'Subscribe')}</button>
              }
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProgramsSection({ DS, isMobile, t }) {
  const { SectionHeading, LocationCard, Badge, Button } = DS;
  const locationsHref = `${t.siteUrl || ''}/locations/`;
  // Sports to include come from the Customizer (EA Options → Active Programs sports).
  const selectedSports = (t.options && Array.isArray(t.options.sports) && t.options.sports.length)
    ? t.options.sports : ['bad'];
  // Visitor location for nearest-first sorting (null until they opt in).
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const findNearMe = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('Location isn’t available in this browser.');
      return;
    }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserCoords([pos.coords.latitude, pos.coords.longitude]); setLocating(false); },
      () => { setGeoError('Couldn’t get your location — showing some programs. Click on ’View All Locations’ to see all available programs.'); setLocating(false); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  };

  // Live feed when available, otherwise the bundled LOCATIONS. Capped at 6.
  const rows = useProgramsFeed();
  const feed = rows ? buildCityList(rows, selectedSports, userCoords) : null;
  const cards = ((feed && feed.length ? feed : LOCATIONS(isMobile)) || []).slice(0, PROGRAMS_LIMIT);
  // Which location's newsletter popup is open (null = closed).
  const [subscribeLoc, setSubscribeLoc] = useState(null);
  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      {SectionHeading
        ? <SectionHeading level={ isMobile ? 'lg' : 'md' }>{t.texts.programsHeading || 'Our Active Programs'}</SectionHeading>
        : <h2 style={FB.h(32)}>{t.texts.programsHeading || 'Our Active Programs'}</h2>
      }
      <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, marginTop: 16, maxWidth: 640 }}>
        {t.texts.programsDesc || 'We run pickleball programs across the country. Click on any location card below to visit its program page and see all the lessons and leagues available in that area.'}
      </p>
      <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Left of "View All Locations": sort the cards nearest-first. */}
        {Button
          ? <Button variant="secondary" onClick={findNearMe} disabled={locating}>{locating ? 'Locating…' : userCoords ? 'Nearest to You' : (t.texts.programsNearMe || 'Locations Near Me')}</Button>
          : <button onClick={findNearMe} disabled={locating} style={{ ...FB.btn('secondary'), opacity: locating ? 0.7 : 1 }}>{locating ? 'Locating…' : userCoords ? 'Nearest to You' : (t.texts.programsNearMe || 'Locations Near Me')}</button>
        }
        <a href={locationsHref} style={{ textDecoration: 'none', display: 'inline-flex' }}>
          {Button
            ? <Button variant="primary">{t.texts.programsViewAll || 'View All Locations'}</Button>
            : <span style={FB.btn('primary')}>{t.texts.programsViewAll || 'View All Locations'}</span>
          }
        </a>
      </div>
      {geoError && (
        <p role="alert" style={{ marginTop: 10, marginBottom: 0, fontFamily: 'var(--font-body, sans-serif)', fontSize: 14, color: 'var(--ea-error, #C0392B)' }}>{geoError}</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginTop: 32 }}>
        {cards.map((loc) => {
          const inner = Badge
            ? <ProgramCard Badge={Badge} city={loc.city} programs={loc.programs} status={loc.status} lessons={loc.lessons} leagues={loc.leagues} isMobile={isMobile} onSubscribe={setSubscribeLoc} />
            : LocationCard
            ? <LocationCard city={loc.city} programs={loc.programs} status={loc.status} lessons={loc.lessons} leagues={loc.leagues} />
            : (
              <div style={FB.card}>
                <strong>{loc.city}</strong>
                <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ea-slate, #47636B)' }}>
                  {loc.programs} programs{loc.lessons != null ? ` · ${loc.lessons} lessons · ${loc.leagues} leagues` : ''}
                </p>
              </div>
            );
          // Live feed rows carry a program URL; make the whole card link out to it.
          const body = loc.url
            ? <a href={loc.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{inner}</a>
            : inner;
          return <CardHover key={loc.city}>{body}</CardHover>;
        })}
      </div>
      {subscribeLoc !== null && (
        <NewsletterModal DS={DS} t={t} location={subscribeLoc} onClose={() => setSubscribeLoc(null)} />
      )}
    </section>
  );
}

function SpotlightSection({ DS, isMobile, isTablet, t }) {
  const { SectionHeading, Button } = DS;
  // Mobile: 2 columns → text spans both, then a 2×2 grid of four image tiles.
  const cols = isMobile ? 'repeat(2, 1fr)' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)';
  const coachingHeading = t.texts.coachingHeading || 'Small Group Coaching';
  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? 12 : 20, alignItems: 'start' }}>
        <div style={{ gridColumn: isMobile ? '1 / -1' : undefined }}>
          {SectionHeading
            ? <SectionHeading level={ isMobile ? 'lg' : 'md' }>{coachingHeading}</SectionHeading>
            : <h2 style={FB.h(32)}>{coachingHeading}</h2>
          }
          <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, marginTop: 16 }}>
            {t.texts.coachingDesc || 'Small group coaching that meets every player where they are. Our sessions build skills, confidence, and a love of the game.'}
          </p>
          <div style={{ marginTop: 24 }}>
            {Button
              ? <Button variant="primary">{t.texts.coachingCta || 'Learn More'}</Button>
              : <button style={FB.btn('primary')}>{t.texts.coachingCta || 'Learn More'}</button>
            }
          </div>
        </div>
        {/* Coloured tiles become real photos once set in Appearance → Customize → EA Images.
            Four show on mobile (2×2); the fifth is desktop-only. */}
        <MediaSlot url={t.images.spotlight1} color="var(--ea-sky-soft, #D0F5FF)" ratio="1/1" />
        <MediaSlot url={t.images.ball}       color="var(--ea-sky-soft, #D0F5FF)" ratio="1/1" />
        <MediaSlot url={t.images.spotlight2} color="var(--ea-sky, #46AFE3)"      ratio="1/1" />
        <MediaSlot url={t.images.net}        color="var(--ea-sky, #46AFE3)"      ratio="1/1" />
        {!isMobile && (
          <MediaSlot url={t.images.spotlight3} color="var(--ea-peach, #FFBB91)" ratio="1/1" />
        )}
      </div>
    </section>
  );
}

function CommunitySection({ DS, isMobile, t }) {
  const { SectionHeading, Button } = DS;
  const bodyStyle = {
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6,
  };

  // Which part of each community image stays visible when it's cropped to fill its box.
  // Options: 'center' | 'top' | 'bottom' | 'left' | 'right' (or a pair like 'top right' / '50% 20%').
  // The named side is the one that never gets cut off.
  const communityTopFocus   = 'top';
  const communityLeftFocus  = 'top';
  const communityRightFocus = 'top';

  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      {/* Top: solid-colour image block + intro copy (image hidden on mobile) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 0 : 24,   // match the bottom grid's gap so the image == card width
        alignItems: 'stretch',
      }}>
        {!isMobile && (
          <MediaSlot url={t.images.communityTop} color="var(--ea-sky-soft, #D0F5FF)" ratio="3 / 2" alt="Our community" style={{ height: 250, objectPosition: communityTopFocus }} />
        )}
        <div>
          {SectionHeading
            ? <SectionHeading level={ isMobile ? 'lg' : 'md' }>{t.texts.communityHeading || 'Want to be a part of the community?'}</SectionHeading>
            : <h2 style={FB.h(32)}>{t.texts.communityHeading || 'Want to be a part of the community?'}</h2>
          }
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            {t.texts.communityDesc1 || 'From first-timers to future champions, Elevation Athletics badminton is built around fun, inclusive play for every family.'}
          </p>
          <p style={{ ...bodyStyle, marginTop: 12 }}>
            {t.texts.communityDesc2 || 'Join a welcoming community of players, parents, and coaches who make every session something to look forward to.'}
          </p>
        </div>
      </div>

      {/* Bottom: two promo cards with solid-colour image areas */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginTop: isMobile ? 32 : 24 }}>
        {[
          { bg: 'var(--ea-sky, #46AFE3)',  img: t.images.communityLeft,  focus: communityLeftFocus,  title: t.texts.partnershipsTitle || 'Community Partnerships',   cta: t.texts.partnershipsCta || 'Learn More',  blurb: t.texts.partnershipsBlurb || 'Help bring inclusive, low-cost badminton to your township. We\'ll set you up with courts, coaching, and leagues.' },
          { bg: 'var(--ea-peach, #FFBB91)', img: t.images.communityRight, focus: communityRightFocus, title: t.texts.leadersTitle || 'Become a Community Leader', cta: t.texts.leadersCta || 'Apply Today', blurb: t.texts.leadersBlurb || 'Help bring inclusive, low-cost badminton to your township. We\'ll set you up with courts, coaching, and leagues.' },
        ].map(({ bg, img, focus, title, cta, blurb }) => (
          // Background is the admin image (cover) when set, else the solid colour.
          // `focus` sets which part of the image stays visible (never cropped).
          // Fixed height; the white card is pinned to the bottom and the image/colour
          // area fills the space above it.
          <div key={title} style={{
            background: img ? `url(${img}) ${focus} / cover no-repeat` : bg,
            height: isMobile ? 500 : 750,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '24px 28px', textAlign: 'center', boxShadow: '0 1px 4px rgba(16,65,79,.06)' }}>
              {SectionHeading
                ? <SectionHeading level="xs" align="center" as="h3">{title}</SectionHeading>
                : <h3 style={{ ...FB.h(20), textAlign: 'center' }}>{title}</h3>
              }
              <p style={{ fontFamily: 'var(--font-body, sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, margin: '12px 0 18px' }}>
                {blurb}
              </p>
              {Button
                ? <Button variant="primary">{cta}</Button>
                : <button style={FB.btn('primary')}>{cta}</button>
              }
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection({ DS, isMobile, t }) {
  const { SectionHeading, Button } = DS;
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');   // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${t.apiUrl}ea/v1/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': t.nonce },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data && data.message ? data.message : 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Decorative badminton scene behind the form (different art for mobile vs desktop).
  // Admin-set Customizer images (EA Images → Newsletter image / (mobile)) override the bundled art.
  const decor = isMobile
    ? (t.images.newsletterMobile || t.asset('newsletter-mobile.svg'))
    : (t.images.newsletter || t.asset('newsletter.svg'));

  return (
    <section style={{ position: 'relative', marginTop: sectionGap(isMobile), background: '#fff', overflow: 'hidden' }}>
      {/* Full-width decorative SVG; sets the section height. Content is overlaid on top. */}
      <img src={decor} alt="" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto' }} />

      {/* Centered newsletter content overlaid on the scene */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'start', justifyContent: 'center',
        padding: isMobile ? '24px 20px' : '24px',
      }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: isMobile ? 320 : 550 }}>
          {SectionHeading
            ? <SectionHeading level={ isMobile ? 'lg' : 'lg' } align="center">{t.texts.newsletterHeading || 'Join Our Newsletter!'}</SectionHeading>
            : <h2 style={{ ...FB.h(isMobile ? 28 : 44), textAlign: 'center' }}>{t.texts.newsletterHeading || 'Join Our Newsletter!'}</h2>
          }
          <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: isMobile ? 14 : 20, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, marginTop: 12 }}>
            {t.texts.newsletterDesc || 'Stay updated on upcoming training sessions, leagues, and tournaments for pickleball in your area.'}
          </p>
          {submitted ? (
            <p style={{ marginTop: 20, color: 'var(--ea-success, #2FA36B)', fontWeight: 600 }}>{t.texts.newsletterThanks || 'Thanks for subscribing!'}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Input + Subscribe joined into one pill (container clips the square button corners). */}
              <div style={{
                display: 'flex', marginTop: isMobile ? 16 : 24,
                border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', background: '#fff',
              }}>
                <input
                  type="email" placeholder="Your Email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, minWidth: 0, padding: '12px 16px', border: 'none', outline: 'none', fontFamily: 'var(--font-body, sans-serif)', fontSize: isMobile ? 14 : 16, background: 'transparent' }}
                />
                {Button
                  ? <Button variant="primary" type="submit" disabled={sending} style={{ borderRadius: 0 }}>{sending ? 'Subscribing…' : (t.texts.newsletterSubscribe || 'Subscribe')}</Button>
                  : <button type="submit" disabled={sending} style={{ ...FB.btn('primary'), borderRadius: 0, opacity: sending ? 0.7 : 1 }}>{sending ? 'Subscribing…' : (t.texts.newsletterSubscribe || 'Subscribe')}</button>
                }
              </div>
              {/* Honeypot — hidden from real users; bots that fill it are silently dropped. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="nl-website">Website</label>
                <input id="nl-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              {error && (
                <p role="alert" style={{ marginTop: 12, marginBottom: 0, fontFamily: 'var(--font-body, sans-serif)', fontSize: 14, color: 'var(--ea-error, #C0392B)' }}>
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const DS = useDSComponents();
  const { isMobile, isTablet } = useViewport();
  const t = getThemeData();
  return (
    <Layout>
      <HeroSection      DS={DS} isMobile={isMobile} t={t} />
      <HeroImageSection         isMobile={isMobile} t={t} />
      {/* Customizer toggle (EA Options → "Show photo carousel"): carousel when on
          (default), otherwise the Free Trial registration form. */}
      {t.options.useCarousel === false
        ? <FreeTrialSection   DS={DS} isMobile={isMobile} t={t} />
        : <NewProgramsSection DS={DS} isMobile={isMobile} t={t} />}
      <ProgramsSection  DS={DS} isMobile={isMobile} t={t} />
      <SpotlightSection DS={DS} isMobile={isMobile} isTablet={isTablet} t={t} />
      <CommunitySection DS={DS} isMobile={isMobile} t={t} />
      <NewsletterSection DS={DS} isMobile={isMobile} t={t} />
    </Layout>
  );
}
