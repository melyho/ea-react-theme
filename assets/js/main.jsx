import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const rootElement = document.getElementById('ea-react-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
