/**
 * src/pages/RepDevelopmentTeamsPage.jsx
 *
 * Editable basketball rep development teams template. It intentionally mirrors
 * the rep tryouts page structure while using its own Customizer section for
 * copy, images, form shortcode, maps, and accent colour.
 */
import { useEffect, useState } from 'react';
import { Layout, useDSComponents, useViewport, getThemeData, ActionButton, sectionLinkAttrs, FB } from '../lib/shared.jsx';

const NAVY = '#10414F';
const DEFAULT_ACCENT = '#0A98D6';
const BUTTON_BLUE = '#159BD3';

function pick(value, fallback) {
  return value === undefined || value === null || value === '' ? fallback : value;
}

function linkFromUrl(url, fallback = '') {
  const href = pick(url, fallback);
  if (!href) return null;
  if (href.startsWith('#')) return { url: href };
  return { url: href };
}

function decodeHtmlEntities(value) {
  if (typeof document === 'undefined') return value;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function FormEmbed() {
  const template = typeof document !== 'undefined'
    ? document.getElementById('ea-rep-development-form-template')
    : null;
  const html = template ? template.innerHTML.trim() : '';

  if (!html) {
    return (
      <div style={{
        border: '1px dashed var(--border-card, #D7E2E7)',
        borderRadius: 8,
        padding: 24,
        color: 'var(--ea-ink, #1E526E)',
        background: '#fff',
      }}>
        Paste your WPForms shortcode into the EA Rep Development Teams Customizer section.
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ea-rep-development-form-embed .wpforms-submit,
        .ea-rep-development-form-embed button[type="submit"],
        .ea-rep-development-form-embed input[type="submit"] {
          background: ${BUTTON_BLUE} !important;
          border-color: ${BUTTON_BLUE} !important;
          color: #fff !important;
          border-radius: 8px !important;
          font-family: var(--font-body, "Inclusive Sans", sans-serif) !important;
          font-weight: 700 !important;
          text-transform: none !important;
        }
      `}</style>
      <div className="ea-rep-development-form-embed" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

function SectionHeading({ children, isMobile, style = {} }) {
  return (
    <h2 style={{
      ...FB.h(isMobile ? 32 : 42),
      marginBottom: isMobile ? 14 : 18,
      ...style,
    }}>
      {children}
    </h2>
  );
}

function SecondaryButton({ link, children, accent = NAVY }) {
  const attrs = sectionLinkAttrs(link);
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    padding: '10px 18px',
    borderRadius: 8,
    border: `2px solid ${accent}`,
    background: '#fff',
    color: accent,
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.1,
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return attrs
    ? <a {...attrs} style={style}>{children}</a>
    : <button type="button" style={style}>{children}</button>;
}

function MapEmbed({ title, src, isMobile }) {
  if (!src) return null;
  const rawSrc = String(src).trim();
  const attrMatch = rawSrc.match(/src=["']([^"']+)["']/i);
  const trimmedSrc = decodeHtmlEntities(attrMatch ? attrMatch[1] : rawSrc);
  const isEmbed = /google\.[^/]+\/maps\/embed|[?&]output=embed/i.test(trimmedSrc);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{
        margin: 0,
        fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
        color: NAVY,
        fontSize: isMobile ? 16 : 18,
        fontWeight: 700,
      }}>
        {title}
      </h3>
      {isEmbed ? (
        <iframe
          title={title}
          src={trimmedSrc}
          width="100%"
          height={isMobile ? 220 : 260}
          style={{ border: 0, borderRadius: 8, display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div style={{
          minHeight: isMobile ? 180 : 220,
          border: '1px solid var(--border-card, #E5E5E5)',
          borderRadius: 8,
          background: '#F7FBFD',
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 12,
          color: 'var(--ea-ink, #1E526E)',
        }}>
          <p style={{ margin: 0, maxWidth: 360 }}>
            This Google Maps link opens in a new tab. To show an embedded map here, paste the Google Maps embed URL.
          </p>
          <a
            href={trimmedSrc}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 40,
              padding: '10px 18px',
              borderRadius: 8,
              background: BUTTON_BLUE,
              color: '#fff',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}

function PhotoCarousel({ page, isMobile, accent }) {
  const urls = [1, 2, 3, 4]
    .map((num) => page[`photo${num}`])
    .filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (urls.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % urls.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [urls.length]);

  if (!urls.length) {
    return (
      <div style={{
        aspectRatio: '1 / 1',
        width: '100%',
        background: '#DDF6FF',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, transparent calc(50% - 2px), ${accent} calc(50% - 2px), ${accent} calc(50% + 2px), transparent calc(50% + 2px))`,
          opacity: 0.75,
        }} />
      </div>
    );
  }

  return (
    <div style={{
      aspectRatio: '1 / 1',
      width: '100%',
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: isMobile ? 'none' : '0 18px 34px rgba(0,0,0,.18)',
    }}>
      {urls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={`EA Rep Development ${index + 1}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: active === index ? 1 : 0,
            transform: active === index ? 'scale(1)' : 'scale(1.025)',
            transition: 'opacity .7s ease, transform 1.2s ease',
          }}
        />
      ))}
      {urls.length > 1 && (
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 14,
          display: 'flex',
          justifyContent: 'center',
          gap: 7,
        }}>
          {urls.map((url, index) => (
            <span
              key={`${url}-dot`}
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                borderRadius: '999px',
                background: active === index ? '#fff' : 'rgba(255,255,255,.5)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RepDevelopmentTeamsPage() {
  const DS = useDSComponents();
  const { isMobile, isTablet } = useViewport();
  const t = getThemeData();
  const page = t.repDevelopment || {};
  const accent = pick(page.accentColor, DEFAULT_ACCENT);
  const primaryLink = linkFromUrl(page.primaryButtonUrl, '#rep-development-registration');
  const waiverLink = linkFromUrl(page.waiverButtonUrl, '');
  const container = {
    maxWidth: 1060,
    margin: '0 auto',
    paddingLeft: isMobile ? 20 : 40,
    paddingRight: isMobile ? 20 : 40,
  };
  const bodyStyle = {
    margin: 0,
    fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    color: 'var(--ea-ink, #1E526E)',
    fontSize: isMobile ? 15 : 16,
    lineHeight: 1.55,
    whiteSpace: 'pre-line',
  };
  const whiteText = {
    ...bodyStyle,
    color: 'rgba(255,255,255,.9)',
  };
  const registerButton = {
    background: BUTTON_BLUE,
    color: '#fff',
    borderColor: BUTTON_BLUE,
    outline: 'none',
    boxShadow: 'none',
  };

  return (
    <Layout>
      <main style={{ background: '#fff' }}>
        <div style={{ background: accent }}>
          <section id="rep-development-hero" style={{
            ...container,
            paddingTop: isMobile ? 42 : 70,
            paddingBottom: isMobile ? 24 : 38,
            textAlign: 'center',
          }}>
            <h1 style={{ ...FB.h(isMobile ? 44 : 66), color: '#fff', textAlign: 'center' }}>
              {pick(page.heading, 'Newmarket Rep Development Teams')}
            </h1>
            <p style={{
              ...whiteText,
              maxWidth: 760,
              margin: isMobile ? '12px auto 20px' : '14px auto 24px',
              fontSize: isMobile ? 16 : 19,
              fontWeight: 700,
            }}>
              {pick(page.subheading, 'Structured team training for athletes preparing for the next level of competitive basketball.')}
            </p>
            <ActionButton DS={DS} link={primaryLink} variant="primary" style={registerButton}>
              {pick(page.primaryButtonLabel, 'Register Interest')}
            </ActionButton>
          </section>

          <section style={{
            ...container,
            paddingTop: isMobile ? 8 : 18,
            paddingBottom: isMobile ? 42 : 70,
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, .9fr) minmax(320px, .7fr)',
            gap: isMobile ? 26 : 54,
            alignItems: 'center',
          }}>
            <div>
              <SectionHeading isMobile={isMobile} style={{ color: '#fff' }}>
                {pick(page.aboutHeading, 'Development-Focused Team Training')}
              </SectionHeading>
              <p style={{ ...whiteText, maxWidth: 560 }}>
                {pick(page.aboutBody, 'EA Rep Development Teams give motivated athletes a structured environment to build skills, habits, confidence, and team concepts before stepping into higher levels of competition.\n\nPlayers train with experienced coaches, learn the standards expected in competitive basketball, and develop alongside athletes who are serious about improving.\n\nThis pathway is built for athletes who want more than recreational programming, but may still be preparing for full rep team competition.')}
              </p>
            </div>
            <PhotoCarousel page={page} isMobile={isMobile} accent={accent} />
          </section>
        </div>

        <section id="rep-development-registration" style={{
          ...container,
          paddingTop: isMobile ? 26 : 38,
          paddingBottom: isMobile ? 34 : 52,
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'minmax(260px, 0.55fr) minmax(0, 1.45fr)',
          gap: isMobile ? 24 : 34,
          alignItems: 'start',
        }}>
          <div>
            <SectionHeading isMobile={isMobile}>
              {pick(page.registrationHeading, 'Tryout Registration')}
            </SectionHeading>
            <p style={bodyStyle}>
              {pick(page.registrationBody, 'Register for the first Newmarket Rep Development Teams tryout. Complete the form and our team will follow up with next steps, team details, and any updates families need before attending.\n\nDevelopment team placement may depend on athlete age, experience, availability, and roster needs.')}
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {waiverLink && (
                <SecondaryButton link={waiverLink} accent={NAVY}>
                  {pick(page.waiverButtonLabel, 'Download Waiver')}
                </SecondaryButton>
              )}
            </div>
          </div>
          <div style={{
            background: '#F7FBFD',
            border: '1px solid var(--border-card, #E5E5E5)',
            borderRadius: 8,
            padding: isMobile ? 18 : 24,
          }}>
            <FormEmbed />
          </div>
        </section>

        <section id="rep-development-tryout" style={{
          ...container,
          paddingTop: isMobile ? 10 : 18,
          paddingBottom: isMobile ? 40 : 58,
        }}>
          <SectionHeading isMobile={isMobile}>
            {pick(page.tryoutHeading, 'Newmarket Rep Development Teams Tryout')}
          </SectionHeading>
          <p style={{ ...bodyStyle, maxWidth: 740, marginBottom: 18 }}>
            {pick(page.tryoutBody, 'The first tryout will take place at TUC in Newmarket. Please register through the form on this page before attending.')}
          </p>
          <div style={{
            overflowX: 'auto',
            border: '1px solid var(--border-card, #E5E5E5)',
            borderRadius: 8,
            background: '#fff',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 680,
              fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
              color: 'var(--ea-ink, #1E526E)',
            }}>
              <thead>
                <tr>
                  {['Date', 'Time', 'Team', 'Location'].map((head) => (
                    <th key={head} style={{
                      textAlign: 'left',
                      padding: '13px 14px',
                      background: '#F7FBFD',
                      color: NAVY,
                      fontWeight: 700,
                      borderBottom: '1px solid var(--border-card, #E5E5E5)',
                    }}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    pick(page.tryoutDate, 'September 25, 2026'),
                    pick(page.tryoutTime, '6:00-8:00 PM'),
                    pick(page.tryoutTeam, 'Newmarket Rep Development Teams'),
                    pick(page.tryoutLocation, 'TUC in Newmarket'),
                  ].map((cell, index) => (
                    <td key={index} style={{
                      padding: '14px',
                      fontWeight: index === 0 || index === 3 ? 700 : 500,
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={{
          ...container,
          paddingTop: 0,
          paddingBottom: isMobile ? 54 : 76,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 24 : 28,
        }}>
          <MapEmbed
            title={pick(page.map1Heading, 'Primary Training Location')}
            src={pick(page.map1Embed, '')}
            isMobile={isMobile}
          />
          <MapEmbed
            title={pick(page.map2Heading, 'Secondary Training Location')}
            src={pick(page.map2Embed, '')}
            isMobile={isMobile}
          />
        </section>
      </main>
    </Layout>
  );
}
