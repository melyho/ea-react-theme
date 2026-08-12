/**
 * src/pages/BasketballRepTryoutsPage.jsx
 *
 * Editable basketball rep tryouts template. Copy and photos come from the
 * Customizer; the signup form is rendered by WordPress from a WPForms shortcode.
 */
import { useEffect, useState } from 'react';
import { Layout, useDSComponents, useViewport, getThemeData, ActionButton, sectionLinkAttrs, FB } from '../lib/shared.jsx';

const DEFAULT_SCHEDULE = `August 17 | 6:30-7:30 PM | U10 | Ross Family Complex (Mt. Albert)
August 17 | 7:30-8:30 PM | U12 | Ross Family Complex (Mt. Albert)
August 17 | 8:30-10:00 PM | U15/U16 | Ross Family Complex (Mt. Albert)
August 23 | 6:00-7:00 PM | U10 | Aurora Family Leisure Complex
August 23 | 7:00-8:30 PM | U12 | Aurora Family Leisure Complex
August 23 | 8:30-10:00 PM | U15/U16 | Aurora Family Leisure Complex
August 24 | 6:30-7:30 PM | U11 | Ross Family Complex (Mt. Albert)
August 24 | 7:30-8:30 PM | U13 | Ross Family Complex (Mt. Albert)
August 24 | 8:30-10:00 PM | U17/U19 | Ross Family Complex (Mt. Albert)
August 29 | 5:30-6:30 PM | U11 | Aurora Family Leisure Complex
August 29 | 6:30-8:00 PM | U14 | Aurora Family Leisure Complex
August 29 | 8:00-9:30 PM | U17/U19 | Aurora Family Leisure Complex
September 2 | 6:00-7:30 PM | U13 | Aurora Family Leisure Complex
September 2 | 7:30-9:00 PM | U14 | Aurora Family Leisure Complex`;

const DEFAULT_WAIVER_URL = 'https://elevationathletics.ca/wp-content/uploads/2025/08/Waiver_EA-Basketball-REP.pdf';
const NAVY = '#10414F';
const ORANGE = '#FF8A5B';

function text(t, key, fallback) {
  const value = t.texts && t.texts[key];
  return value === undefined || value === null || value === '' ? fallback : value;
}

function linkWithFallback(link, fallback) {
  if (link && (link.url || link.section || link.hidden)) return link;
  return fallback;
}

function parseSchedule(value) {
  return String(value || DEFAULT_SCHEDULE)
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [date = '', time = '', division = '', location = ''] = row.split('|').map((part) => part.trim());
      return { date, time, division, location };
    });
}

function decodeHtmlEntities(value) {
  if (typeof document === 'undefined') return value;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function FormEmbed() {
  const template = typeof document !== 'undefined'
    ? document.getElementById('ea-rep-tryouts-form-template')
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
        Paste your WPForms shortcode into Customize → EA Text → Basketball Rep — WPForms shortcode.
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ea-rep-form-embed .wpforms-submit,
        .ea-rep-form-embed button[type="submit"],
        .ea-rep-form-embed input[type="submit"] {
          background: ${ORANGE} !important;
          border-color: ${ORANGE} !important;
          color: #fff !important;
          border-radius: 8px !important;
          font-family: var(--font-body, "Inclusive Sans", sans-serif) !important;
          font-weight: 700 !important;
          text-transform: none !important;
        }
      `}</style>
      <div className="ea-rep-form-embed" dangerouslySetInnerHTML={{ __html: html }} />
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

function RepSecondaryButton({ link, children }) {
  if (link && link.hidden) return null;
  const attrs = sectionLinkAttrs(link);
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    padding: '10px 18px',
    borderRadius: 8,
    border: `2px solid ${NAVY}`,
    background: '#fff',
    color: NAVY,
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
        color: 'var(--ea-navy, #10414F)',
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
              background: NAVY,
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

function AboutCarousel({ t, isMobile }) {
  const urls = [1, 2, 3, 4]
    .map((num) => t.images && t.images[`repTryoutsPhoto${num}`])
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
        background: '#BDEEFF',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, transparent calc(50% - 1px), rgba(16,65,79,.35) calc(50% - 1px), rgba(16,65,79,.35) calc(50% + 1px), transparent calc(50% + 1px))',
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
          alt={`EA Rep Basketball ${index + 1}`}
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

export default function BasketballRepTryoutsPage() {
  const DS = useDSComponents();
  const { isMobile, isTablet } = useViewport();
  const t = getThemeData();
  const schedule = parseSchedule(text(t, 'basketballRepScheduleRows', DEFAULT_SCHEDULE));
  const heroLink = linkWithFallback(t.links.repTryoutsHero, { section: 'rep-tryouts' });
  const scheduleLink = linkWithFallback(t.links.repTryoutsSchedule, { section: 'rep-schedule' });
  const waiverLink = linkWithFallback(t.links.repTryoutsWaiver, { url: DEFAULT_WAIVER_URL });
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
    background: ORANGE,
    color: '#fff',
    borderColor: ORANGE,
    outline: 'none',
    boxShadow: 'none',
  };

  return (
    <Layout>
      <main style={{ background: '#fff' }}>
        <div style={{ background: NAVY }}>
          <section id="hero" style={{
            ...container,
            paddingTop: isMobile ? 42 : 70,
            paddingBottom: isMobile ? 24 : 38,
            textAlign: 'center',
          }}>
            <h1 style={{ ...FB.h(isMobile ? 44 : 66), color: '#fff', textAlign: 'center' }}>
              {text(t, 'basketballRepHeading', 'EA Rep Basketball')}
            </h1>
            <p style={{
              ...whiteText,
              maxWidth: 720,
              margin: isMobile ? '12px auto 20px' : '14px auto 24px',
              fontSize: isMobile ? 16 : 19,
              fontWeight: 700,
            }}>
              {text(t, 'basketballRepSubheading', 'High-performance teams for committed athletes in Grades 4-12.')}
            </p>
            <ActionButton DS={DS} link={heroLink} variant="primary" style={registerButton}>
              {text(t, 'basketballRepHeroButton', 'Register Now')}
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
                {text(t, 'basketballRepAboutHeading', 'Our Competitive Pathway for Committed Athletes')}
              </SectionHeading>
              <p style={{ ...whiteText, maxWidth: 560 }}>
                {text(t, 'basketballRepAboutBody', 'Our teams compete in leagues, tournaments, and showcases such as OBL, North Pole Hoops, CYBL, Coalition Basketball League, York Basketball League, and select AAU events in the U.S., giving athletes exposure to elite competition and development pathways.\n\nMany EA athletes go on to compete at the college and university level across Ontario, equipped with the skills and mindset to succeed beyond youth basketball.\n\nEA Rep teams are led by experienced, high-level coaches who prioritize both performance and personal growth. Our coaches are committed to building confident athletes, strong teammates, and leaders on and off the court.')}
              </p>
            </div>
            <AboutCarousel t={t} isMobile={isMobile} />
          </section>
        </div>

        <section id="rep-tryouts" style={{
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
              {text(t, 'basketballRepTryoutsHeading', 'Tryouts & Registration')}
            </SectionHeading>
            <p style={bodyStyle}>
              {text(t, 'basketballRepTryoutsBody', 'Tryouts are free of charge, but registration is required.\n\nAll tryout updates and changes will be communicated via email.\n\nA waiver must be completed prior to attending all EA Rep Team tryouts. Please bring a completed copy of the waiver to tryout, or email it to liam@elevationathletics.ca.')}
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <RepSecondaryButton link={scheduleLink}>
                {text(t, 'basketballRepScheduleButton', 'See Schedule')}
              </RepSecondaryButton>
              <RepSecondaryButton link={waiverLink}>
                {text(t, 'basketballRepWaiverButton', 'Download Waiver')}
              </RepSecondaryButton>
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

        <section id="rep-schedule" style={{
          ...container,
          paddingTop: isMobile ? 18 : 26,
          paddingBottom: isMobile ? 40 : 58,
        }}>
          <SectionHeading isMobile={isMobile}>
            {text(t, 'basketballRepScheduleHeading', 'Fall 2026 Schedule')}
          </SectionHeading>
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
                  {['Date', 'Time', 'Division', 'Location'].map((head) => (
                    <th key={head} style={{
                      textAlign: 'left',
                      padding: '13px 14px',
                      background: '#F7FBFD',
                      color: 'var(--ea-navy, #10414F)',
                      fontWeight: 700,
                      borderBottom: '1px solid var(--border-card, #E5E5E5)',
                    }}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, index) => (
                  <tr key={`${row.date}-${row.time}-${row.division}-${index}`}>
                    {[row.date, row.time, row.division, row.location].map((cell, cellIndex) => (
                      <td key={cellIndex} style={{
                        padding: '14px',
                        borderBottom: index === schedule.length - 1 ? 'none' : '1px solid #EEF3F6',
                        fontWeight: cellIndex === 0 || cellIndex === 3 ? 700 : 500,
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
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
            title={text(t, 'basketballRepMap1Heading', 'Ross Family Complex')}
            src={text(t, 'basketballRepMap1Embed', '')}
            isMobile={isMobile}
          />
          <MapEmbed
            title={text(t, 'basketballRepMap2Heading', 'Aurora Family Leisure Complex')}
            src={text(t, 'basketballRepMap2Embed', '')}
            isMobile={isMobile}
          />
        </section>
      </main>
    </Layout>
  );
}
