/**
 * src/pages/FAQ.jsx — Frequently Asked Questions page.
 * Rendered when the mount div has data-page="faq" (any WP Page with slug "faq").
 *
 * Collapsible cards that mirror the DS `FaqItem` styling (via design-system
 * tokens) but add a smooth open/close height + fade animation on top of the
 * rotating chevron — which the DS component doesn't do (it just mounts/unmounts).
 *
 * Content is editable in the Customizer under Appearance → Customize → EA FAQ
 * (each row: question, answer, "open by default"). Answers may contain basic
 * HTML (e.g. links) and are rendered as such. The DEV_FALLBACK below is only
 * used when the WordPress data isn't present (e.g. running Vite outside WP).
 */
import { useState } from 'react';
import { Layout, useDSComponents, useViewport, getThemeData, FB } from '../lib/shared.jsx';

// ─── Content ──────────────────────────────────────────────────────────────────
// Each item is { q, a, defaultOpen } where `a` is an HTML string. In production
// these come from the Customizer (t.faqs); the fallback is dev-only.
function faqItems(t) {
  // t.faqs is defined (an array) whenever WordPress data is present — even if the
  // admin cleared every row, in which case we honour that and render nothing.
  if (Array.isArray(t.faqs)) {
    return t.faqs.map((f) => ({ q: f.q, a: f.a, defaultOpen: !!f.open }));
  }

  // Dev-only fallback (no window.eaReactData, e.g. `npm run dev` outside WP).
  const leagueHub = `${t.siteUrl || ''}/locations/`;
  return [
    {
      q: 'How do i join a weekly league?',
      defaultOpen: true,
      a: `We have leagues across Canada! To find one near you, go to our <a href="${leagueHub}">league hub</a> and find your town or a nearby area. From there, check if any programs are currently open and register directly through the link on your town’s page.`,
    },
    {
      q: 'What are EA weekly pickleball leagues?',
      defaultOpen: true,
      a: 'The EA Weekly Pickleball Leagues are development doubles leagues. You don’t need a registered partner—each week, you’ll be assigned to play with three other league members, earning individual points. EA Coaches tally points and rank players in the league standings, and you’ll play against a different set of players each week.',
    },
    { q: 'Do I need a partner to sign up?', a: 'No. Register on your own and we’ll pair you with other players each week, so you always have a game.' },
    { q: 'What skill level are the leagues for?', a: 'Our development leagues welcome all levels, from first-time players to experienced ones. Coaches help balance matchups so everyone gets competitive, fun games.' },
    { q: 'What equipment do I need?', a: 'Just bring court shoes and comfortable clothing. Paddles and balls are provided at most locations — check your town’s page for specifics.' },
    { q: 'How long does a league season run?', a: 'Season length varies by location. Each town’s registration page lists the exact number of weeks, dates, and times.' },
    { q: 'Can I get a refund if I can’t attend?', a: 'Refund windows are listed on each program’s registration page. Reach out to your local EA Coach if you have questions about a specific league.' },
  ];
}

// ─── One collapsible FAQ card ────────────────────────────────────────────────
// Styling matches the DS `FaqItem` (same tokens); adds an animated panel.
function FaqItem({ item, index, isMobile }) {
  const [open, setOpen] = useState(!!item.defaultOpen);
  const [hover, setHover] = useState(false);
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-btn-${index}`;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--ea-white, #fff)',
        border: '1px solid var(--border-card, #E5E5E5)',
        borderRadius: 'var(--radius-faq, 8px)',
        boxShadow: hover
          ? 'var(--shadow-card-hover, 0 2px 8px rgba(16,65,79,.01))'
          : 'var(--shadow-faq, 0 1px 3px rgba(16,65,79,.0015))',
        padding: isMobile ? '18px 20px' : '20px 28px',
        transition: 'box-shadow .2s ease',
      }}
    >
      <button
        id={btnId}
        className="ea-faq-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          // Explicit reset (not `all: unset`, so the stylesheet below can own the
          // outline: no ring on mouse click, a keyboard-only ring via :focus-visible).
          appearance: 'none',
          background: 'none',
          border: 'none',
          margin: 0,
          padding: 0,
          font: 'inherit',
          color: 'inherit',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          width: '100%',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
            fontWeight: 'var(--fw-bold, 700)',
            fontSize: isMobile ? 17 : 20,
            color: 'var(--ea-navy, #10414F)',
            letterSpacing: 'var(--ls-body, -0.02em)',
            lineHeight: 'var(--lh-tight, 1.15)',
          }}
        >
          {item.q}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ea-navy, #10414F)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            flex: 'none',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform .28s ease',
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Animated panel: grid-rows 0fr→1fr smoothly reveals any content height. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows .28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              paddingTop: 14,
              fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
              fontSize: isMobile ? 16 : 18,
              lineHeight: 'var(--lh-body, 1.5)',
              letterSpacing: 'var(--ls-body, -0.02em)',
              color: 'var(--ea-ink, #1E526E)',
              opacity: open ? 1 : 0,
              transition: 'opacity .28s ease',
            }}
            // Answer is an HTML string (Customizer copy, sanitized server-side
            // with wp_kses_post), so it may include links / basic formatting.
            dangerouslySetInnerHTML={{ __html: item.a }}
          />
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const DS = useDSComponents();
  const { isMobile } = useViewport();
  const t = getThemeData();
  const { SectionHeading } = DS;
  const items = faqItems(t);

  return (
    <Layout>
      <section
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: isMobile ? '40px 20px' : '64px 24px',
        }}
      >
        {/* No focus ring on mouse click; keyboard users still get a branded one. */}
        <style>{`
          .ea-faq-toggle { outline: none; }
          .ea-faq-toggle:focus-visible {
            outline: 2px solid var(--ea-link, #007ABA);
            outline-offset: 4px;
            border-radius: 4px;
          }
        `}</style>

        {SectionHeading ? (
          <SectionHeading level={isMobile ? 'md' : 'lg'} as="h1">
            Frequently Asked Questions
          </SectionHeading>
        ) : (
          <h1 style={FB.h(isMobile ? 36 : 56)}>Frequently Asked Questions</h1>
        )}

        <div
          style={{
            marginTop: isMobile ? 24 : 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4, 16px)',
          }}
        >
          {items.map((item, i) => (
            <FaqItem key={i} item={item} index={i} isMobile={isMobile} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
