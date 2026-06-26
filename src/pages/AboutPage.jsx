/**
 * src/pages/AboutPage.jsx — example second page.
 * Rendered when the mount div has data-page="about" (any WP Page with slug "about").
 *
 * Copy this file to make more pages: rename the component, change the content,
 * then register the slug in src/main.jsx and create a matching WP Page.
 */
import { Layout, useDSComponents, useViewport, getThemeData, FB, MediaSlot } from '../lib/shared.jsx';

export default function AboutPage() {
  const DS = useDSComponents();
  const { isMobile } = useViewport();
  const t = getThemeData();
  const { SectionHeading, Button } = DS;

  return (
    <Layout>
      <section style={{ maxWidth: 880, margin: '0 auto', padding: isMobile ? '40px 20px' : '64px 24px' }}>
        {SectionHeading
          ? <SectionHeading level={isMobile ? 'md' : 'lg'} as="h1">About Elevation Athletics</SectionHeading>
          : <h1 style={FB.h(isMobile ? 36 : 56)}>About Elevation Athletics</h1>
        }

        {/* Swap this image in Appearance → Customize → EA Images → "About page image" */}
        <div style={{ marginTop: 32 }}>
          <MediaSlot
            url={t.images.aboutHero}
            color="var(--ea-sky-soft, #D0F5FF)"
            ratio={isMobile ? '4/3' : '16/9'}
            radius={12}
            alt="Our coaching community"
          />
        </div>

        <div style={{ marginTop: 32 }}>
          {Button
            ? <Button variant="primary" size={isMobile ? 'md' : 'lg'}>Book Your Free Trial</Button>
            : <button style={FB.btn('primary')}>Book Your Free Trial</button>
          }
        </div>
      </section>
    </Layout>
  );
}
