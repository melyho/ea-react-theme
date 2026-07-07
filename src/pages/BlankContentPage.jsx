/**
 * src/pages/BlankContentPage.jsx — WordPress-authored content wrapped in the
 * shared React Layout, used by template-blank-content.php.
 */
import { Layout } from '../lib/shared.jsx';

function getBlankContent() {
  if (typeof document === 'undefined') return { title: '', html: '' };
  const root = document.getElementById('ea-react-root');
  const template = document.getElementById('ea-blank-content-template');
  return {
    title: root ? root.dataset.title || '' : '',
    html: template ? template.innerHTML : '',
  };
}

export default function BlankContentPage() {
  const { title, html } = getBlankContent();

  return (
    <Layout>
      <main id="ea-blank-content" className="ea-blank-content">
        <article className="ea-blank-content__article">
          {title && (
            <header className="ea-blank-content__header">
              <h1 className="ea-blank-content__title">{title}</h1>
            </header>
          )}
          <div className="ea-blank-content__body" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
    </Layout>
  );
}
