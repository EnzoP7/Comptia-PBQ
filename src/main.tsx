import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initLanguage } from './i18n/language';

initLanguage().finally(() => createRoot(document.getElementById('root')!).render(<App />));
