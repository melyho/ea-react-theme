/**
 * Standalone Elevation Athletics directory page.
 *
 * This template intentionally does not use Layout, so it renders without the
 * public sport-site nav and footer. WordPress still provides wp_head/wp_footer
 * through template-directory-home.php so the React bundle and theme tokens load.
 */
import { getThemeData, useViewport, FB } from '../lib/shared.jsx';

const PROGRAM_CARDS = [
  { index: 1, label: 'Basketball', fallbackUrl: 'https://elevationathletics.ca/home/' },
  { index: 2, label: 'Pickleball', fallbackUrl: 'https://eapickleball.com/' },
  { index: 3, label: 'Badminton', fallbackUrl: 'https://eabadminton.com/' },
  { index: 4, label: 'Annual Membership', fallbackUrl: 'https://elevationathletics.ca/annual-membership/' },
];

const TEAM_CARDS = [
  { index: 5, label: 'Become a Coach', fallbackUrl: 'https://elevationathletics.ca/join-our-team/' },
  { index: 6, label: 'Become a Community Leader', fallbackUrl: 'https://elevationathletics.ca/become-a-community-leader/' },
];

function text(t, key, fallback) {
  const value = t.texts?.[key];
  return value === undefined || value === null || value === '' ? fallback : value;
}

function externalAttrs(url) {
  if (!url) return {};
  return /^https?:\/\//i.test(url)
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: url };
}

function iconStyle(size) {
  return {
    width: size,
    height: size,
    display: 'block',
  };
}

function SocialLinks({ instagram, facebook, t, size = 24 }) {
  if (!instagram && !facebook) return null;
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      marginTop: 10,
    }}>
      {instagram && (
        <a {...externalAttrs(instagram)} aria-label="Instagram" style={{ display: 'inline-flex' }}>
          <img src={t.asset('instagram.svg')} alt="" style={iconStyle(size)} />
        </a>
      )}
      {facebook && (
        <a {...externalAttrs(facebook)} aria-label="Facebook" style={{ display: 'inline-flex' }}>
          <img src={t.asset('facebook.svg')} alt="" style={iconStyle(size)} />
        </a>
      )}
    </div>
  );
}

function DirectoryCard({ card, t, isMobile, kind = 'program' }) {
  const image = t.images?.[`directoryCard${card.index}`] || '';
  const label = text(t, `directoryCard${card.index}Label`, card.label);
  const url = t.directoryLinks?.[`card${card.index}Url`] || card.fallbackUrl;
  const showSocials = kind === 'program' && card.index >= 1 && card.index <= 3;
  const instagram = showSocials ? (t.directoryLinks?.[`card${card.index}Instagram`] || t.social?.instagram || '') : '';
  const facebook = showSocials ? (t.directoryLinks?.[`card${card.index}Facebook`] || t.social?.facebook || '') : '';
  const radius = 8;
  const cardHeight = isMobile ? 126 : 216;

  const media = (
    <div style={{
      position: 'relative',
      height: cardHeight,
      borderRadius: radius,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #8DD8F3, #77CFF0)',
    }}>
      {image ? (
        <img
          src={image}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : null}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: isMobile ? 12 : 18,
        background: image ? 'linear-gradient(180deg, transparent 48%, rgba(16,65,79,.38))' : 'transparent',
      }}>
        <span style={{
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          fontSize: isMobile ? 14 : 16,
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.1,
          textShadow: image ? '0 1px 8px rgba(0,0,0,.22)' : 'none',
        }}>
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <article>
      {url ? (
        <a {...externalAttrs(url)} style={{ display: 'block', textDecoration: 'none' }}>
          {media}
        </a>
      ) : media}
      <SocialLinks instagram={instagram} facebook={facebook} t={t} size={isMobile ? 22 : 26} />
    </article>
  );
}

function SectionIntro({ heading, subheading, isMobile, compact = false }) {
  return (
    <header style={{ textAlign: 'center', marginBottom: compact ? (isMobile ? 16 : 22) : (isMobile ? 18 : 28) }}>
      <h2 style={{
        ...FB.h(isMobile ? 24 : 34),
        textAlign: 'center',
        textTransform: heading === 'Elevation Athletics' ? 'uppercase' : 'none',
      }}>
        {heading}
      </h2>
      {subheading && (
        <p style={{
          margin: isMobile ? '8px auto 0' : '10px auto 0',
          maxWidth: compact ? 580 : 700,
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          fontSize: isMobile ? 13 : 18,
          lineHeight: 1.35,
          color: 'var(--ea-ink, #1E526E)',
          whiteSpace: 'pre-line',
        }}>
          {subheading}
        </p>
      )}
    </header>
  );
}

export default function DirectoryHomePage() {
  const t = getThemeData();
  const { isMobile } = useViewport();
  const programsHeading = text(t, 'directoryProgramsHeading', 'Our Programs');
  const programsSubheading = text(t, 'directoryProgramsSubheading', 'Serving 5,000+ players with 200+ sports programs across Canada.');
  const joinHeading = text(t, 'directoryJoinHeading', 'Join our Team');
  const joinSubheading = text(t, 'directoryJoinSubheading', 'We are looking for coaches and members of our internal teams. We also work directly with townships and municipalities to bring sports programming to a community near you.');

  return (
    <main style={{
      minHeight: '100vh',
      background: '#fff',
      color: 'var(--ea-navy, #10414F)',
      fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
    }}>
      <div style={{
        width: 'min(100% - 32px, 980px)',
        margin: '0 auto',
        padding: isMobile ? '56px 0 76px' : '96px 0 120px',
      }}>
        <section style={{ textAlign: 'center' }}>
          <h1 style={{ ...FB.h(isMobile ? 30 : 62), textAlign: 'center' }}>
            {text(t, 'directoryHeading', 'Elevation Athletics')}
          </h1>
          <p style={{
            margin: isMobile ? '12px auto 0' : '16px auto 0',
            maxWidth: 680,
            fontSize: isMobile ? 13 : 20,
            lineHeight: 1.35,
            color: 'var(--ea-ink, #1E526E)',
            whiteSpace: 'pre-line',
          }}>
            {text(t, 'directorySubheading', 'Inclusive, high-quality sport programming helping athletes grow with confidence across Canada.')}
          </p>
        </section>

        <section style={{
          position: 'relative',
          marginTop: isMobile ? 48 : 64,
          marginLeft: 'calc(50% - 50vw)',
          width: '100vw',
          backgroundImage: `url(${t.asset('directory-programs-water.png')})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}>
          <div style={{
            width: 'min(100% - 32px, 980px)',
            margin: '0 auto',
            padding: isMobile ? '54px 0 62px' : '68px 0 82px',
            position: 'relative',
            zIndex: 1,
          }}>
            <SectionIntro heading={programsHeading} subheading={programsSubheading} isMobile={isMobile} compact />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: isMobile ? '22px 10px' : '32px 44px',
              alignItems: 'start',
            }}>
              {PROGRAM_CARDS.map((card) => (
                <DirectoryCard key={card.index} card={card} t={t} isMobile={isMobile} kind="program" />
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: isMobile ? 64 : 108 }}>
          <SectionIntro heading={joinHeading} subheading={joinSubheading} isMobile={isMobile} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: TEAM_CARDS.length === 1
              ? (isMobile ? 'minmax(0, 150px)' : 'minmax(0, 420px)')
              : 'repeat(2, minmax(0, 1fr))',
            justifyContent: 'center',
            gap: isMobile ? 10 : 18,
            maxWidth: isMobile ? 'none' : 820,
            margin: '0 auto',
          }}>
            {TEAM_CARDS.map((card) => (
              <DirectoryCard key={card.index} card={card} t={t} isMobile={isMobile} kind="team" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
