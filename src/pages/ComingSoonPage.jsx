/**
 * src/pages/ComingSoonPage.jsx
 *
 * Lightweight holding page for pages that are not ready yet. Copy is editable
 * through the WordPress Customizer; the mascot is bundled with the theme.
 */
import { Layout, FB, getThemeData, useDSComponents, useViewport } from '../lib/shared.jsx';

function copy(t, key, fallback) {
  const value = t.texts && t.texts[key];
  return value === undefined || value === null || value === '' ? fallback : value;
}

export default function ComingSoonPage() {
  const DS = useDSComponents();
  const { isMobile } = useViewport();
  const t = getThemeData();
  const Heading = DS.SectionHeading;

  const heading = copy(t, 'comingSoonHeading', 'Coming Soon');
  const subheading = copy(t, 'comingSoonSubheading', 'This page is currently under construction.');

  return (
    <Layout>
      <main
        style={{
          minHeight: isMobile ? '420px' : '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '56px 20px 72px' : '80px 24px 96px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <section
          aria-labelledby="coming-soon-heading"
          style={{
            width: '100%',
            maxWidth: 620,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {Heading ? (
            <Heading level={isMobile ? 'lg' : 'xl'} align="center" as="h1" id="coming-soon-heading">
              {heading}
            </Heading>
          ) : (
            <h1 id="coming-soon-heading" style={{ ...FB.h(isMobile ? 42 : 64), textAlign: 'center' }}>
              {heading}
            </h1>
          )}

          <p
            style={{
              margin: '8px auto 0',
              maxWidth: 460,
              fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.45,
              color: 'var(--ea-ink, #1E526E)',
            }}
          >
            {subheading}
          </p>

          <img
            src={t.asset('under-construction-mascot.svg')}
            alt=""
            aria-hidden="true"
            style={{
              display: 'block',
              width: isMobile ? 150 : 190,
              maxWidth: '55vw',
              height: 'auto',
              marginTop: isMobile ? 28 : 34,
            }}
          />
        </section>
      </main>
    </Layout>
  );
}
