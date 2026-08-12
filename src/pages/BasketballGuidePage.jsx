/**
 * src/pages/BasketballGuidePage.jsx
 *
 * Editable basketball guide template. Copy, imagery, and button destinations
 * come from the WordPress Customizer.
 */
import { Layout, useDSComponents, useViewport, getThemeData, ActionButton, FB } from '../lib/shared.jsx';

const DEFAULT_BOXES = [
  {
    key: 'guideBox1',
    heading: 'EA Training Programs',
    subheading: 'Beginner Friendly · Ages 5 - 15',
    body: 'Our training programs are built for players who want to develop fundamentals, confidence, and game understanding in a supportive environment.',
    button: 'Learn More',
    color: '#EAF9FF',
  },
  {
    key: 'guideBox2',
    heading: 'EA Development House League',
    subheading: 'Beginner to Intermediate · Ages 9 - 12',
    body: 'A development-first league for players who want structured games, coaching support, and a fun path to improve week by week.',
    button: 'Learn More',
    color: '#D8F3FF',
  },
  {
    key: 'guideBox3',
    heading: 'EA Rep Development',
    subheading: 'Competitive Preparation · Ages 10 - 15',
    body: 'For motivated players looking for a higher level of training, skill development, and preparation for more competitive basketball.',
    button: 'Learn More',
    color: '#BDEEFF',
  },
  {
    key: 'guideBox4',
    heading: 'EA Rep Teams',
    subheading: 'Advanced Team Play · Ages 12 - 17',
    body: 'Competitive team opportunities for athletes who are ready for advanced training, stronger competition, and a team-first environment.',
    button: 'Learn More',
    color: '#A7E8FF',
  },
  {
    key: 'guideBox5',
    heading: 'Camps',
    subheading: 'Seasonal Training · Ages vary',
    body: 'Seasonal camps give players focused time to build skills, stay active, and enjoy the game during school breaks.',
    button: 'Learn More',
    color: '#157F9F',
  },
  {
    key: 'guideBox6',
    heading: '1-on-1 Training',
    subheading: 'Private Coaching · Custom ages',
    body: 'Individual and small-group training for athletes who want focused coaching, extra reps, and a personalized development plan.',
    button: 'Learn More',
    color: '#FFB17D',
  },
];

function text(t, key, fallback) {
  const value = t.texts && t.texts[key];
  return value === undefined || value === null || value === '' ? fallback : value;
}

function GuideMedia({ image, color, alt, isMobile }) {
  const mediaHeight = isMobile ? 220 : 410;
  const style = {
    width: '100%',
    height: mediaHeight,
    display: 'block',
    overflow: 'hidden',
  };

  if (image) {
    return (
      <div style={style}>
        <img
          src={image}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  }

  return <div aria-hidden="true" style={{ ...style, background: color }} />;
}

function GuideCard({ item, index, isMobile, DS, t }) {
  const heading = text(t, `${item.key}Heading`, item.heading);
  const subheading = text(t, `${item.key}Subheading`, item.subheading);
  const body = text(t, `${item.key}Text`, item.body);
  const button = text(t, `${item.key}Button`, item.button);
  const image = t.images && t.images[item.key];
  const link = t.links && t.links[item.key];
  const flip = index % 2 === 1;
  const panelAlign = flip ? 'flex-end' : 'flex-start';
  const panel = (
    <div style={{
      background: 'transparent',
      padding: isMobile ? '28px 24px' : '52px 60px',
      minHeight: isMobile ? 260 : 410,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: panelAlign,
      textAlign: flip ? 'right' : 'left',
    }}>
      <h2 style={{ ...FB.h(isMobile ? 34 : 46), marginBottom: 6 }}>{heading}</h2>
      {subheading && (
        <p style={{
          margin: '0 0 26px',
          fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
          fontSize: isMobile ? 14 : 15,
          fontWeight: 'var(--fw-bold, 700)',
          color: 'var(--ea-navy, #10414F)',
        }}>
          {subheading}
        </p>
      )}
      <p style={{
        margin: '0 0 18px',
        maxWidth: 420,
        fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
        fontSize: isMobile ? 15 : 16,
        lineHeight: 1.45,
        color: 'var(--ea-ink, #1E526E)',
        whiteSpace: 'pre-line',
      }}>{body}</p>
      <ActionButton DS={DS} link={link} variant="primary" size="sm" style={{ padding: '10px 20px', fontSize: 14 }}>
        {button}
      </ActionButton>
    </div>
  );
  const media = (
    <GuideMedia
      image={image}
      color={item.color}
      alt={heading}
      isMobile={isMobile}
    />
  );
  const blocks = isMobile ? [panel, media] : (flip ? [media, panel] : [panel, media]);

  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      background: 'transparent',
      gap: 0,
      overflow: 'hidden',
    }}>
      {blocks.map((block, i) => <div key={i}>{block}</div>)}
    </article>
  );
}

export default function BasketballGuidePage() {
  const DS = useDSComponents();
  const { isMobile, isTablet } = useViewport();
  const t = getThemeData();
  const introBoxes = DEFAULT_BOXES.slice(0, 4);
  const trainingBoxes = DEFAULT_BOXES.slice(4);
  const backdrop = t.images.basketballGuideBackdrop || '';

  return (
    <Layout>
      <main style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        {backdrop ? (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("${backdrop}")`,
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'center top',
              backgroundSize: '100% auto',
              opacity: 1,
              pointerEvents: 'none',
            }}
          />
        ) : null}
        <section style={{
          position: 'relative',
          maxWidth: 1184,
          margin: '0 auto',
          padding: isMobile ? '36px 20px 28px' : '58px 40px 42px',
          textAlign: 'center',
        }}>
          <h1 style={{ ...FB.h(isMobile ? 42 : 58), textAlign: 'center' }}>
            {text(t, 'basketballGuideHeading', 'Basketball for Every Player')}
          </h1>
          <p style={{
            margin: isMobile ? '12px auto 0' : '14px auto 0',
            maxWidth: 700,
            fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
            color: 'var(--ea-ink, #1E526E)',
            fontSize: isMobile ? 16 : 18,
            lineHeight: 1.45,
          }}>
            {text(t, 'basketballGuideSubheading', 'Whether your child is picking up a basketball for the first time, looking for more opportunities to play, or preparing for competitive basketball, Elevation Athletics offers a program to support their development.')}
          </p>
        </section>

        <section style={{
          position: 'relative',
          maxWidth: 1184,
          margin: '0 auto',
          padding: isMobile ? '0 20px 42px' : '0 40px 58px',
          display: 'grid',
          gap: isMobile ? 18 : 36,
        }}>
          {introBoxes.map((item, index) => (
            <GuideCard key={item.key} item={item} index={index} isMobile={isMobile} DS={DS} t={t} />
          ))}
        </section>

        <section style={{
          position: 'relative',
          maxWidth: 1184,
          margin: '0 auto',
          padding: isMobile ? '0 20px 58px' : '0 40px 76px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 28 }}>
            <h2 style={{ ...FB.h(isMobile ? 36 : 48), textAlign: 'center' }}>
              {text(t, 'basketballGuideTrainingHeading', 'More Ways to Train')}
            </h2>
            <p style={{
              margin: '10px auto 0',
              maxWidth: 680,
              fontFamily: 'var(--font-body, "Inclusive Sans", sans-serif)',
              color: 'var(--ea-ink, #1E526E)',
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.45,
            }}>
              {text(t, 'basketballGuideTrainingSubheading', 'Explore seasonal camps and focused training options designed to give athletes more time on the court.')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: isMobile ? 18 : 24,
          }}>
            {trainingBoxes.map((item, index) => (
              <GuideCard
                key={item.key}
                item={item}
                index={index + 4}
                isMobile={isMobile || isTablet}
                DS={DS}
                t={t}
              />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
