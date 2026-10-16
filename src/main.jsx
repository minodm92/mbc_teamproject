import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { resetHomeScrollLocks } from './components/home/homeScrollControls';
import { withInstantScroll } from './common/utils/scrollPosition';
import './styled/reset.css';
import './styled/variables.css';
import './styled/fonts.css';
import './index.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
const resetInitialScroll = () => {
  resetHomeScrollLocks();
  withInstantScroll(() => window.scrollTo({ top: 0, left: 0 }));
};
resetInitialScroll();
document.documentElement.classList.toggle('is-home-page', window.location.pathname === '/');

createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>,
);
