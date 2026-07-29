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
  return [
    {
      q: 'What badminton programs does Elevation Athletics offer?',
      defaultOpen: true,
      a: 'We offer badminton lessons, leagues, camps, and seasonal programs for youth players. Available programs vary by city and season, so check the active programs section for the most up-to-date options.',
    },
    {
      q: 'Do players need their own badminton racquet?',
      defaultOpen: true,
      a: 'Players are encouraged to bring their own racquet if they have one. If your child is new and does not have equipment yet, contact us before the program starts and we can let you know what is available.',
    },
    { q: 'What should players bring to each session?', a: 'Players should bring indoor court shoes, athletic clothing, a water bottle, and a badminton racquet if they have one.' },
    { q: 'How long is each program?', a: 'Most programs run for multiple weekly sessions, and the exact number of sessions, dates, and times are listed on the registration card.' },
    { q: 'Where do the programs take place?', a: 'Program locations vary by city. Each registration card lists the school, community centre, or facility where that program runs.' },
    { q: 'How long does a league season run?', a: 'Season length varies by location. Each town’s registration page lists the exact number of weeks, dates, and times.' },
    { q: 'Can my child join after the program has already started?', a: 'Sometimes, yes. If registration is still open and spots are available, late registration may be possible. If enrollment is closed, contact info@elevationathletics.ca to ask about options.' },
    { q: 'What happens if a session is cancelled?', a: 'If a session is cancelled due to facility closures, weather, or another issue, we will communicate updates by email and provide details about the next steps.' },
    { q: 'Are there make-up classes if my child misses a session?', a: 'We generally cannot guarantee make-up classes for missed sessions, but you can contact us if there are special circumstances.' },
    { q: 'What age groups are available?', a: 'Age groups vary by program. Each registration card lists the eligible age range, such as junior programs, youth programs, or advanced junior programs.' },
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
          <SectionHeading level={isMobile ? 'md' : 'lg'} as="h1" align="center">
            Frequently Asked Questions
          </SectionHeading>
        ) : (
          <h1 style={{ ...FB.h(isMobile ? 36 : 56), textAlign: 'center' }}>Frequently Asked Questions</h1>
        )}

        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: isMobile ? 18 : 20,
            marginBottom: isMobile ? 4 : 2,
            pointerEvents: 'none',
          }}
        >
          <img
            src={t.images.faqQuestionSquid || t.asset('faq-question-squid.svg')}
            alt=""
            style={{
              display: 'block',
              width: isMobile ? 150 : 210,
              maxWidth: '46vw',
              height: 'auto',
            }}
          />
        </div>

        <div
          style={{
            marginTop: isMobile ? 14 : 18,
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
