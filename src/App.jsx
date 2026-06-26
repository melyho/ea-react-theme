/**
 * src/App.jsx — kept for backwards-compatibility only.
 *
 * The app is now multi-page. Entry point is src/main.jsx, which renders a page
 * component (src/pages/*) based on the WordPress page slug. The former single-page
 * "BadmintonApp" now lives in src/pages/HomePage.jsx, and shared pieces (layout,
 * nav, footer, hooks, image helpers) live in src/lib/shared.jsx.
 */
export { default } from './pages/HomePage.jsx';
