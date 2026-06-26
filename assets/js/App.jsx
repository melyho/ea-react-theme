/**
 * BadmintonApp.jsx — Elevation Athletics Badminton Website
 * ─────────────────────────────────────────────────────────
 * A fully self-contained React page component for embedding
 * in a WordPress theme.
 *
 * WORDPRESS SETUP
 * ───────────────
 * 1. Copy the `ea-ds/` folder from the downloaded zip into your theme.
 *
 * 2. Enqueue CSS tokens + bundle in functions.php:
 *      $ds = get_template_directory_uri() . '/ea-ds';
 *      wp_enqueue_style('ea-fonts',      "$ds/tokens/fonts.css");
 *      wp_enqueue_style('ea-colors',     "$ds/tokens/colors.css");
 *      wp_enqueue_style('ea-typography', "$ds/tokens/typography.css");
 *      wp_enqueue_style('ea-spacing',    "$ds/tokens/spacing.css");
 *      wp_enqueue_style('ea-base',       "$ds/tokens/base.css");
 *      wp_enqueue_style('ea-fig-tokens', "$ds/components/fig-tokens.css");
 *      wp_enqueue_style('ea-styles',     "$ds/styles.css");
 *      wp_enqueue_script('ea-ds', "$ds/_ds_bundle.js", [], null, true);
 *
 * 3. Compile this file and enqueue:
 *      wp_enqueue_script('badminton-app',
 *        get_template_directory_uri() . '/dist/badminton-app.js',
 *        ['ea-ds'], null, true);
 *
 *    For ES module / webpack build, replace `module.exports` at the
 *    bottom with:  export default BadmintonApp;
 *
 * 4. Add mount point in your page template:
 *      <div id="ea-badminton-app"
 *           data-logo-base="<?= get_template_directory_uri() ?>/ea-ds/assets/logos/">
 *      </div>
 *
 * 5. Mount (add to your entrypoint.js or wp_add_inline_script):
 *      const el = document.getElementById('ea-badminton-app');
 *      if (el) ReactDOM.createRoot(el).render(
 *        React.createElement(BadmintonApp, { logoBase: el.dataset.logoBase })
 *      );
 */

// React is expected as a global (loaded by WordPress via wp_enqueue_script('react',...))
// For module bundler: import React, { useState, useEffect } from 'react';
const { useState, useEffect } = React;

// ─── EA Design System ────────────────────────────────────────────────────────
// Loaded separately via WP enqueue — exposed as a window global.
// Polls briefly on mount in case the bundle loads slightly after React.
function useDSComponents() {
  const [ds, setDs] = useState(
    () => window.ElevationAthleticsDesignSystem_58666d || null
  );
  useEffect(() => {
    if (ds) return;
    const t = setInterval(() => {
      const found = window.ElevationAthleticsDesignSystem_58666d;
      if (found) { setDs(found); clearInterval(t); }
    }, 80);
    return () => clearInterval(t);
  }, [ds]);
  return ds || {};
}

// ─── Responsive hook ─────────────────────────────────────────────────────────
function useViewport() {
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handle = () => setW(window.innerWidth);
    window.addEventListener('resize', handle, { passive: true });
    return () => window.removeEventListener('resize', handle);
  }, []);
  return { isMobile: w < 768, isTablet: w < 1024, width: w };
}

// ─── Colour placeholder (replaces images until assets are ready) ─────────────
function Placeholder({ color, ratio = '16/9', radius = 12, extraStyle = {} }) {
  return (
    <div style={{
      background: color,
      aspectRatio: ratio,
      width: '100%',
      borderRadius: radius,
      ...extraStyle,
    }} />
  );
}

// ─── Minimal fallback styles (used only when DS bundle hasn't loaded yet) ─────
const FB = {
  btn: (v) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: 8,
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity .15s',
    border: v === 'secondary' ? '2px solid #6FD9FF' : 'none',
    background: v === 'secondary' ? '#fff' : '#0092DB',
    color: v === 'secondary' ? '#0092DB' : '#fff',
  }),
  h: (size) => ({
    fontFamily: 'var(--font-display, "BBH Bogle", sans-serif)',
    textTransform: 'uppercase',
    fontSize: size,
    lineHeight: 1,
    letterSpacing: '0.02em',
    color: 'var(--ea-navy, #10414F)',
    margin: 0,
  }),
  card: {
    background: '#fff',
    border: '1px solid #E5E5E5',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 10px rgba(16,65,79,.08)',
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    color: 'var(--ea-navy, #10414F)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NavSection
// ═══════════════════════════════════════════════════════════════════════════════
function NavSection({ logoBase, isMobile, DS }) {
  const { NavBar } = DS;
  if (NavBar) {
    return (
      <NavBar
        base={logoBase}
        logoVariant="badmintonRow"
        logoHeight={isMobile ? 40 : 52}
        secondaryLabel="Connect with Us"
        ctaLabel="Book Your Free Trial"
        links={[
          { label: 'Lessons & Leagues', caret: true },
          { label: 'Programs', caret: true },
          { label: 'About' },
        ]}
      />
    );
  }
  // Fallback nav
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #E5E5E5',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <strong style={{ fontFamily: 'var(--font-body, sans-serif)', color: '#10414F', fontSize: 18 }}>
        Elevation Athletics · Badminton
      </strong>
      {!isMobile && (
        <button style={FB.btn('primary')}>Book Your Free Trial</button>
      )}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HeroSection
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection({ isMobile, DS }) {
  const { SectionHeading, Button } = DS;
  return (
    <section style={{
      textAlign: 'center',
      padding: isMobile ? '40px 20px 28px' : '60px 24px 36px',
      maxWidth: 720,
      margin: '0 auto',
    }}>
      {SectionHeading
        ? (
          <SectionHeading level={isMobile ? 'md' : 'lg'} align="center" as="h1">
            Badminton Starts Here
          </SectionHeading>
        )
        : <h1 style={FB.h(isMobile ? 36 : 56)}>Badminton Starts Here</h1>
      }

      <p style={{
        fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
        fontSize: isMobile ? 16 : 18,
        color: 'var(--ea-ink, #1E526E)',
        lineHeight: 1.6,
        margin: '16px auto 0',
        maxWidth: 520,
      }}>
        We offer badminton programs for children of all ages and skill levels.
        With experienced coaches, small group sessions, and a focus on fun and
        improvement.
      </p>

      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        marginTop: isMobile ? 24 : 28,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
      }}>
        {Button ? (
          <>
            <Button variant="primary" size={isMobile ? 'md' : 'lg'}>
              Book Your Free Trial
            </Button>
            <Button variant="secondary" size={isMobile ? 'md' : 'lg'}>
              Find Lessons &amp; Leagues
            </Button>
          </>
        ) : (
          <>
            <button style={FB.btn('primary')}>Book Your Free Trial</button>
            <button style={FB.btn('secondary')}>Find Lessons &amp; Leagues</button>
          </>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HeroImageSection — colour placeholder; swap src for real photo
// ═══════════════════════════════════════════════════════════════════════════════
function HeroImageSection({ isMobile }) {
  return (
    <div style={{
      maxWidth: 1184,
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 32px',
    }}>
      <Placeholder
        color="var(--ea-peach, #F5CAAE)"
        ratio="21/9"
        radius={isMobile ? 8 : 16}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ProgramsSection
// ═══════════════════════════════════════════════════════════════════════════════
function ProgramsSection({ isMobile, DS }) {
  const { SectionHeading, LocationCard } = DS;

  const locations = [
    { city: 'Richmond Hill', programs: 10, status: 'open',    lessons: 2, leagues: 8 },
    { city: 'Vaughan',        programs: 10, status: 'open',    lessons: 2, leagues: 8 },
    { city: 'Markham',        programs: 6,  status: 'limited', lessons: 1, leagues: 5 },
    { city: 'Aurora',         programs: 4,  status: 'open',    lessons: 2, leagues: 2 },
  ];

  return (
    <section style={{
      maxWidth: 1184,
      margin: '56px auto 0',
      padding: isMobile ? '0 16px' : '0 32px',
    }}>
      {SectionHeading
        ? <SectionHeading level="md">Our Active Programs</SectionHeading>
        : <h2 style={FB.h(32)}>Our Active Programs</h2>
      }

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 16,
        marginTop: 24,
      }}>
        {locations.map((loc) =>
          LocationCard
            ? (
              <LocationCard
                key={loc.city}
                city={loc.city}
                programs={loc.programs}
                status={loc.status}
                lessons={loc.lessons}
                leagues={loc.leagues}
              />
            )
            : (
              <div key={loc.city} style={FB.card}>
                <strong>{loc.city}</strong>
                <br />
                {loc.programs} Programs · {loc.lessons} Lessons · {loc.leagues} Leagues
              </div>
            )
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SpotlightSection
// ═══════════════════════════════════════════════════════════════════════════════
function SpotlightSection({ isMobile, isTablet, DS }) {
  const { SectionHeading, Button } = DS;
  const cols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)';

  return (
    <section style={{
      maxWidth: 1184,
      margin: '80px auto 0',
      padding: isMobile ? '0 16px' : '0 32px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: cols,
        gap: 20,
        alignItems: 'start',
      }}>
        {/* Text + CTA */}
        <div>
          {SectionHeading
            ? <SectionHeading level="md">Spotlight Section</SectionHeading>
            : <h2 style={FB.h(32)}>Spotlight Section</h2>
          }
          <p style={{
            fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
            fontSize: 16,
            color: 'var(--ea-ink, #1E526E)',
            lineHeight: 1.6,
            marginTop: 16,
          }}>
            Small group coaching that meets every player where they are. Our
            sessions build skills, confidence, and a love of the game.
          </p>
          <div style={{ marginTop: 24 }}>
            {Button
              ? <Button variant="primary">Call To Action</Button>
              : <button style={FB.btn('primary')}>Call To Action</button>
            }
          </div>
        </div>

        {/* Row 1 placeholders */}
        <Placeholder color="var(--ea-sky, #6FD9FF)" ratio="1/1" />
        <Placeholder color="var(--ea-peach, #F5CAAE)" ratio="1/1" />

        {/* Row 2 — hidden on mobile */}
        {!isMobile && (
          <>
            <Placeholder color="var(--ea-mist, #D6EDF5)" ratio="1/1" />
            <Placeholder color="var(--ea-sky, #6FD9FF)" ratio="1/1" />
            <Placeholder color="var(--ea-mist, #D6EDF5)" ratio="1/1" />
          </>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CommunitySection
// ═══════════════════════════════════════════════════════════════════════════════
function CommunitySection({ isMobile, DS }) {
  const { SectionHeading, Button } = DS;
  return (
    <section style={{
      maxWidth: 1184,
      margin: '80px auto 0',
      padding: isMobile ? '0 16px' : '0 32px',
    }}>
      <div style={{
        background: 'var(--ea-sky, #6FD9FF)',
        padding: isMobile ? '28px 24px' : '40px 48px',
        borderRadius: 12,
      }}>
        {SectionHeading
          ? <SectionHeading level="md">Want to be a part of the community?</SectionHeading>
          : <h2 style={FB.h(isMobile ? 28 : 32)}>Want to be a part of the community?</h2>
        }
        <p style={{
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          fontSize: 16,
          color: 'var(--ea-navy, #10414F)',
          lineHeight: 1.6,
          marginTop: 14,
          maxWidth: 620,
        }}>
          From first-timers to future champions, Elevation Athletics badminton
          is built around fun, inclusive play for every family.
        </p>
        <div style={{ marginTop: 24 }}>
          {Button
            ? <Button variant="primary">Get Started Today</Button>
            : <button style={FB.btn('primary')}>Get Started Today</button>
          }
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NewsletterSection
// ═══════════════════════════════════════════════════════════════════════════════
function NewsletterSection({ isMobile, DS }) {
  const { NewsletterForm, SectionHeading, Button } = DS;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    if (email) {
      console.log('[BadmintonApp] Newsletter subscribe:', email);
      setSubmitted(true);
    }
  };

  return (
    <section style={{
      marginTop: 80,
      padding: isMobile ? '48px 20px' : '64px 24px',
      background: '#fff',
    }}>
      {NewsletterForm ? (
        <NewsletterForm
          blurb="Stay updated on upcoming lessons and leagues for badminton in your area."
          onSubmit={handleSubmit}
        />
      ) : (
        <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          {SectionHeading
            ? <SectionHeading level="md" align="center">Join Our Newsletter!</SectionHeading>
            : <h2 style={FB.h(36)}>Join Our Newsletter!</h2>
          }
          <p style={{
            fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
            fontSize: 16,
            color: 'var(--ea-ink, #1E526E)',
            lineHeight: 1.6,
            marginTop: 12,
          }}>
            Stay updated on upcoming lessons and leagues for badminton in your area.
          </p>
          {submitted ? (
            <p style={{
              marginTop: 24,
              fontFamily: 'var(--font-body, sans-serif)',
              color: '#0092DB',
              fontWeight: 600,
            }}>
              Thanks for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 24,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: 8,
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
              {Button
                ? <Button variant="primary" type="submit">Subscribe</Button>
                : <button type="submit" style={FB.btn('primary')}>Subscribe</button>
              }
            </form>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ isMobile }) {
  return (
    <footer style={{
      textAlign: 'center',
      padding: isMobile ? '32px 20px' : '48px 24px',
      marginTop: 80,
      borderTop: '1px solid #E5E5E5',
      fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
      fontSize: 14,
      color: 'var(--ea-ink, #1E526E)',
    }}>
      © {new Date().getFullYear()} Elevation Athletics. All rights reserved.
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BadmintonApp — root component
// Props:
//   logoBase {string} — path prefix for logo files, e.g. '/wp-content/themes/your-theme/ea-ds/assets/logos/'
// ═══════════════════════════════════════════════════════════════════════════════
function BadmintonApp({ logoBase: logoProp }) {
  const { isMobile, isTablet } = useViewport();
  const DS = useDSComponents();
  const logoBase = logoProp || 'assets/logos/';

  return (
    <div style={{
      background: '#fff',
      minHeight: '100vh',
      fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    }}>
      <NavSection      DS={DS} logoBase={logoBase} isMobile={isMobile} />
      <HeroSection     DS={DS} isMobile={isMobile} />
      <HeroImageSection        isMobile={isMobile} />
      <ProgramsSection DS={DS} isMobile={isMobile} />
      <SpotlightSection DS={DS} isMobile={isMobile} isTablet={isTablet} />
      <CommunitySection DS={DS} isMobile={isMobile} />
      <NewsletterSection DS={DS} isMobile={isMobile} />
      <Footer isMobile={isMobile} />
    </div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────
// DC preview uses CommonJS. For webpack / ES modules, replace with:
//   export default BadmintonApp;
module.exports = { BadmintonApp, default: BadmintonApp };
