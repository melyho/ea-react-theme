import { getThemeData, useViewport, useDSComponents, Layout, MediaSlot, ActionButton, FB } from '../lib/shared.jsx';

const FALLBACK_CAMPS = [
  {
    key: 'campCard1',
    label: 'Basketball',
    heading: 'Newmarket Basketball Camp',
    ageRange: 'Ages 7-12',
    text: 'Skill-building, team games, and active play during school breaks.',
    button: 'Learn More',
    link: null,
    image: '',
    color: '#B9ECFF',
  },
  {
    key: 'campCard2',
    label: 'Badminton',
    heading: 'Newmarket Badminton Camp',
    ageRange: 'Ages 8-14',
    text: 'Introductory badminton, rallies, footwork, and court confidence.',
    button: 'Learn More',
    link: null,
    image: '',
    color: '#A7E5F7',
  },
  {
    key: 'campCard3',
    label: 'Multi-Sports',
    heading: 'Uxbridge Multi-Sports Camp',
    ageRange: 'Ages 6-12',
    text: 'A mix of sports, movement games, teamwork, and active play.',
    button: 'Learn More',
    link: null,
    image: '',
    color: '#CBF2FF',
  },
  {
    key: 'campCard4',
    label: 'Racquet Sports',
    heading: 'Aurora Racquet Sports Camp',
    ageRange: 'Ages 7-13',
    text: 'Racquet skills, movement games, and beginner-friendly court play.',
    button: 'Learn More',
    link: null,
    image: '',
    color: '#AEEBFF',
  },
];

function getText(t, key, fallback) {
  const value = t.camps?.[key] ?? t.texts?.[key];
  return value === undefined || value === null || value === '' ? fallback : value;
}

function getCampCards(t) {
  const configured = Array.isArray(t.camps?.cards) ? t.camps.cards : [];
  const cards = configured.filter((card) => card?.enabled !== false && card?.heading);
  if (cards.length) return cards;

  return FALLBACK_CAMPS.map((camp) => ({
    ...camp,
    label: t.texts?.[`${camp.key}Eyebrow`] || camp.label,
    heading: t.texts?.[`${camp.key}Heading`] || camp.heading,
    text: t.texts?.[`${camp.key}Text`] || camp.text,
    button: t.texts?.[`${camp.key}Button`] || camp.button,
    image: t.images?.[camp.key] || '',
    link: t.links?.[camp.key] || null,
  }));
}

function CampsHeader({ t, isMobile }) {
  return (
    <header style={{
      maxWidth: 760,
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <h1 style={{ ...FB.h(isMobile ? 44 : 76), textAlign: 'center' }}>
        {getText(t, 'heading', 'Youth Camps')}
      </h1>
      <p style={{
        margin: isMobile ? '12px 0 0' : '16px 0 0',
        fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
        fontSize: isMobile ? 17 : 22,
        lineHeight: 1.35,
        color: 'var(--ea-ink, #1E526E)',
        whiteSpace: 'pre-line',
      }}>
        {getText(t, 'subheading', 'Seasonal basketball, badminton, racquet sport, and multi-sport camps for active kids.')}
      </p>
      {getText(t, 'intro', '') && (
        <p style={{
          margin: isMobile ? '10px 0 0' : '14px 0 0',
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          fontSize: isMobile ? 14 : 17,
          lineHeight: 1.55,
          color: 'var(--ea-ink, #1E526E)',
          whiteSpace: 'pre-line',
        }}>
          {getText(t, 'intro', '')}
        </p>
      )}
    </header>
  );
}

function CampCard({ camp, DS, isMobile, index }) {
  const link = camp.link || (camp.url ? { url: camp.url } : null);
  const linkUrl = link?.url || '';
  const image = (
    <MediaSlot
      url={camp.image}
      color={camp.color || ['#B9ECFF', '#A7E5F7', '#CBF2FF', '#AEEBFF'][index % 4]}
      ratio="16/10"
      alt={camp.heading}
    />
  );

  return (
    <article style={{
      ...FB.card,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: isMobile ? 0 : 390,
    }}>
      {linkUrl ? (
        <a href={linkUrl} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
          {image}
        </a>
      ) : image}
      <div style={{
        padding: isMobile ? 18 : 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1,
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {camp.label && (
            <span style={{
              display: 'inline-flex',
              padding: '5px 9px',
              borderRadius: 6,
              background: '#EAF7FD',
              color: '#0B5F78',
              fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
              fontSize: 13,
              fontWeight: 900,
            }}>
              {camp.label}
            </span>
          )}
          {camp.ageRange && (
            <span style={{
              display: 'inline-flex',
              padding: '5px 9px',
              borderRadius: 6,
              background: '#FFF2D0',
              color: '#7A5A00',
              fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
              fontSize: 13,
              fontWeight: 900,
            }}>
              {camp.ageRange}
            </span>
          )}
        </div>
        <h2 style={{ ...FB.h(isMobile ? 30 : 36) }}>
          {camp.heading}
        </h2>
        <p style={{
          margin: 0,
          color: 'var(--ea-ink, #1E526E)',
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          fontSize: isMobile ? 15 : 17,
          lineHeight: 1.45,
        }}>
          {camp.text}
        </p>
        <ActionButton DS={DS} link={link} size="sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
          {camp.button || 'Learn More'}
        </ActionButton>
      </div>
    </article>
  );
}

function ContactPrompt({ t, DS, isMobile }) {
  const heading = getText(t, 'contactHeading', 'Not sure which camp is right?');
  const body = getText(t, 'contactText', 'Contact us and we’ll help you choose the best fit for your child.');
  const button = getText(t, 'contactButton', 'Contact Us');
  const url = getText(t, 'contactLink', 'mailto:info@elevationathletics.ca');

  return (
    <section style={{
      marginTop: isMobile ? 26 : 38,
      padding: isMobile ? 20 : 28,
      borderRadius: 8,
      background: '#F4FBFE',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 16 : 24,
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <h2 style={{ ...FB.h(isMobile ? 28 : 36) }}>{heading}</h2>
        <p style={{
          margin: '8px 0 0',
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          color: 'var(--ea-ink, #1E526E)',
          fontSize: isMobile ? 15 : 17,
          lineHeight: 1.45,
        }}>
          {body}
        </p>
      </div>
      <ActionButton DS={DS} link={{ url }} size="sm" variant="secondary">
        {button}
      </ActionButton>
    </section>
  );
}

export default function CampsPage() {
  const t = getThemeData();
  const DS = useDSComponents();
  const { isMobile } = useViewport();
  const camps = getCampCards(t);

  return (
    <Layout>
      <main style={{
        width: 'min(100% - 32px, 1180px)',
        margin: '0 auto',
        padding: isMobile ? '40px 0 64px' : '64px 0 96px',
      }}>
        <CampsHeader t={t} isMobile={isMobile} />
        <section style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: isMobile ? 18 : 24,
          marginTop: isMobile ? 30 : 44,
        }}>
          {camps.map((camp, index) => (
            <CampCard key={camp.key || `${camp.heading}-${index}`} camp={camp} DS={DS} isMobile={isMobile} index={index} />
          ))}
        </section>
        <ContactPrompt t={t} DS={DS} isMobile={isMobile} />
      </main>
    </Layout>
  );
}
