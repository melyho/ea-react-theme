/**
 * src/pages/HomePage.jsx — the badminton marketing home page.
 * Rendered when the mount div has data-page="home" (front-page.php / index.php).
 */
import { useState } from 'react';
import { Layout, useDSComponents, useViewport, getThemeData, FB, MediaSlot } from '../lib/shared.jsx';

// ─── Consistent section spacing ───────────────────────────────────────────────
const SECTION_MAX = 1184;                                          // content max-width
const sectionGap  = (isMobile) => (isMobile ? 56 : 120);            // vertical gap above each section
const sectionPadX = (isMobile) => (isMobile ? '0 16px' : '0 32px'); // horizontal padding

// ─── Page data ────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { city: 'Richmond Hill', programs: 10, status: 'open',    lessons: 2, leagues: 8 },
  { city: 'Vaughan',       programs: 10, status: 'open',    lessons: 2, leagues: 8 },
  { city: 'Markham',       programs:  6, status: 'limited', lessons: 1, leagues: 5 },
  { city: 'Aurora',        programs:  4, status: 'open',    lessons: 2, leagues: 2 },
];

function HeroSection({ DS, isMobile }) {
  const { SectionHeading, Button } = DS;
  return (
    <section style={{ textAlign: 'center', padding: isMobile ? '40px 20px 40px' : '60px 24px 36px', maxWidth: 720, margin: '0 auto' }}>
      {SectionHeading
        ? <SectionHeading level={isMobile ? 'xl' : 'lg'} align="center" as="h1">Badminton Starts Here</SectionHeading>
        : <h1 style={FB.h(isMobile ? 36 : 56)}>Badminton Starts Here</h1>
      }
      <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: isMobile ? 16 : 18, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, margin: '16px auto 0', maxWidth: 520 }}>
        We offer badminton programs for children of all ages and skill levels.
        Experienced coaches, small group sessions, and a focus on fun and improvement.
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
              <Button variant="primary"   size={isMobile ? 'md' : 'lg'} full>Book Your Free Trial</Button>
              <Button variant="secondary" size={isMobile ? 'md' : 'lg'} full>Find Lessons &amp; Leagues</Button>
            </>
          ) : (
            <>
              <button style={{ ...FB.btn('primary'),   width: '100%' }}>Book Your Free Trial</button>
              <button style={{ ...FB.btn('secondary'), width: '100%' }}>Find Lessons &amp; Leagues</button>
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

  // Heading text. On mobile it matches the other section headers (SectionHeading "lg");
  // on desktop it's overlaid on top of the illustration in the left column.
  const headingText = 'Register for your free trial!';
  const mobileHeading = SectionHeading
    ? <SectionHeading level="lg" align="center">{headingText}</SectionHeading>
    : <h2 style={{ ...FB.h(28), textAlign: 'center' }}>{headingText}</h2>;

  const formInner = (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 440 }}>
      <div>
        <label style={labelStyle} htmlFor="ft-name">Athlete's Name</label>
        <input id="ft-name" style={inputStyle} placeholder="Name" value={form.name} onChange={update('name')} />
      </div>
      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="ft-email">Email</label>
        <input id="ft-email" type="email" style={inputStyle} placeholder="Email" value={form.email} onChange={update('email')} />
      </div>
      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="ft-session">Choose Session</label>
        <div style={{ position: 'relative' }}>
          <select
            id="ft-session" value={form.session} onChange={update('session')}
            style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: 40, cursor: 'pointer', color: form.session ? 'var(--ea-ink, #1E526E)' : 'var(--ea-muted, #787878)' }}
          >
            <option value="" disabled>Select Choice</option>
            {LOCATIONS.map((l) => <option key={l.city} value={l.city} style={{ color: 'var(--ea-ink, #1E526E)' }}>{l.city}</option>)}
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
          ? <Button variant="dark" type="submit" disabled={sending}>{sending ? 'Registering…' : 'Register'}</Button>
          : <button type="submit" disabled={sending} style={{ ...FB.btn('primary'), background: 'var(--ea-teal-900, #004356)', opacity: sending ? 0.7 : 1, cursor: sending ? 'default' : 'pointer' }}>{sending ? 'Registering…' : 'Register'}</button>
        }
      </div>
    </form>
  );

  // The form's div never changes — the confirmation is a separate overlay popup.
  const formBody = formInner;

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
        <h3 style={{ ...FB.h(28), fontWeight: 'var(--fw-regular, 400)', margin: '0 0 12px' }}>Thank you!</h3>
        <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.5, margin: 0 }}>
          We'll be in touch about your free trial.
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
            {formBody}
          </div>
        </div>
        {/* Full-bleed illustration below the form (no side padding) */}
        <img
          src={t.asset('free-trial-mobile.svg')}
          alt="Register for your free trial"
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
        {/* Illustration — normally shows in full at its natural ratio. If the form
            needs more height than the image provides, the row grows and the image
            covers the taller area, cropping from the LEFT (objectPosition: right)
            so the megaphone/form-facing side is always kept. */}
        <div style={{ position: 'relative', flex: '0 1 832px', minWidth: 0, overflow: 'hidden' }}>
          {/* Visual layer: fills the column, crops from the left when the column
              is taller than the image's natural ratio. */}
          <img
            src={t.asset('freetrial-left.svg')}
            alt="Register for your free trial"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right' }}
          />
          {/* Height floor: an aspect-ratio spacer keeps the column at least the
              image's natural height (832×555). The form can push it taller. */}
          <div aria-hidden="true" style={{ width: '100%', aspectRatio: '832 / 555' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 32px 0', width: '60%', textAlign: 'left' }}>
            {SectionHeading
              ? <SectionHeading level="md" align="left">{headingText}</SectionHeading>
              : <h2 style={{ ...FB.h(32), fontWeight: 'var(--fw-regular, 400)', margin: 0 }}>{headingText}</h2>
            }
          </div>
        </div>
        {/* Form panel — fills the remaining width. Its content is in normal flow, so
            when it's taller than the image it drives the row height (and the image
            crops from the left, above) instead of scrolling/overflowing. */}
        <div style={{
          flex: '1 1 0', minWidth: '35%', background: '#F9FDFF',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
          padding: '48px 40px',
        }}>
          {formBody}
        </div>
      </div>
      {modal}
    </section>
  );
}

function ProgramsSection({ DS, isMobile }) {
  const { SectionHeading, LocationCard } = DS;
  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      {SectionHeading
        ? <SectionHeading level={ isMobile ? 'lg' : 'md' }>Our Active Programs</SectionHeading>
        : <h2 style={FB.h(32)}>Our Active Programs</h2>
      }
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        {LOCATIONS.map((loc) =>
          LocationCard
            ? <LocationCard key={loc.city} city={loc.city} programs={loc.programs} status={loc.status} lessons={loc.lessons} leagues={loc.leagues} />
            : (
              <div key={loc.city} style={FB.card}>
                <strong>{loc.city}</strong>
                <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ea-slate, #47636B)' }}>
                  {loc.programs} programs · {loc.lessons} lessons · {loc.leagues} leagues
                </p>
              </div>
            )
        )}
      </div>
    </section>
  );
}

function SpotlightSection({ DS, isMobile, isTablet, t }) {
  const { SectionHeading, Button } = DS;
  // Mobile: 2 columns → text spans both, then a 2×2 grid of four image tiles.
  const cols = isMobile ? 'repeat(2, 1fr)' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)';
  return (
    <section style={{ maxWidth: SECTION_MAX, margin: `${sectionGap(isMobile)}px auto 0`, padding: sectionPadX(isMobile) }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? 12 : 20, alignItems: 'start' }}>
        <div style={{ gridColumn: isMobile ? '1 / -1' : undefined }}>
          {SectionHeading
            ? <SectionHeading level={ isMobile ? 'lg' : 'md' }>Small Group Coaching</SectionHeading>
            : <h2 style={FB.h(32)}>Small Group Coaching</h2>
          }
          <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: 16, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, marginTop: 16 }}>
            Small group coaching that meets every player where they are. Our sessions build skills, confidence, and a love of the game.
          </p>
          <div style={{ marginTop: 24 }}>
            {Button
              ? <Button variant="primary">Learn More</Button>
              : <button style={FB.btn('primary')}>Learn More</button>
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
            ? <SectionHeading level={ isMobile ? 'lg' : 'md' }>Want to be a part of the community?</SectionHeading>
            : <h2 style={FB.h(32)}>Want to be a part of the community?</h2>
          }
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            From first-timers to future champions, Elevation Athletics badminton is built around fun, inclusive play for every family.
          </p>
          <p style={{ ...bodyStyle, marginTop: 12 }}>
            Join a welcoming community of players, parents, and coaches who make every session something to look forward to.
          </p>
        </div>
      </div>

      {/* Bottom: two promo cards with solid-colour image areas */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginTop: isMobile ? 32 : 24 }}>
        {[
          { bg: 'var(--ea-sky, #46AFE3)',  img: t.images.communityLeft,  focus: communityLeftFocus,  title: 'Community Partnerships',   cta: 'Learn More' },
          { bg: 'var(--ea-peach, #FFBB91)', img: t.images.communityRight, focus: communityRightFocus, title: 'Become a Community Leader', cta: 'Apply Today' },
        ].map(({ bg, img, focus, title, cta }) => (
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
                Help bring inclusive, low-cost badminton to your township. We'll set you up with courts, coaching, and leagues.
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    if (email) { setSubmitted(true); }
  };

  // Decorative badminton scene behind the form (different art for mobile vs desktop).
  const decor = t.asset(isMobile ? 'badminton-mobile-news.svg' : 'badminton-newsletter.svg');

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
            ? <SectionHeading level={ isMobile ? 'lg' : 'lg' } align="center">Join Our Newsletter!</SectionHeading>
            : <h2 style={{ ...FB.h(isMobile ? 28 : 44), textAlign: 'center' }}>Join Our Newsletter!</h2>
          }
          <p style={{ fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)', fontSize: isMobile ? 14 : 20, color: 'var(--ea-ink, #1E526E)', lineHeight: 1.6, marginTop: 12 }}>
            Stay updated on upcoming lessons and leagues for badminton in your area.
          </p>
          {submitted ? (
            <p style={{ marginTop: 20, color: 'var(--ea-success, #2FA36B)', fontWeight: 600 }}>Thanks for subscribing!</p>
          ) : (
            // Input + Subscribe joined into one pill (container clips the square button corners).
            <div style={{
              display: 'flex', marginTop: isMobile ? 16 : 24,
              border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', background: '#fff',
            }}>
              <input
                type="email" placeholder="Your Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                style={{ flex: 1, minWidth: 0, padding: '12px 16px', border: 'none', outline: 'none', fontFamily: 'var(--font-body, sans-serif)', fontSize: isMobile ? 14 : 16, background: 'transparent' }}
              />
              {Button
                ? <Button variant="primary" onClick={handleSubmit} style={{ borderRadius: 0 }}>Subscribe</Button>
                : <button style={{ ...FB.btn('primary'), borderRadius: 0 }} onClick={handleSubmit}>Subscribe</button>
              }
            </div>
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
      <HeroSection      DS={DS} isMobile={isMobile} />
      <HeroImageSection         isMobile={isMobile} t={t} />
      <FreeTrialSection DS={DS} isMobile={isMobile} t={t} />
      <ProgramsSection  DS={DS} isMobile={isMobile} />
      <SpotlightSection DS={DS} isMobile={isMobile} isTablet={isTablet} t={t} />
      <CommunitySection DS={DS} isMobile={isMobile} t={t} />
      <NewsletterSection DS={DS} isMobile={isMobile} t={t} />
    </Layout>
  );
}
