import '@fontsource/lato/300';
import '@fontsource/lato/400';
import '@fontsource/lato/700';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

import './sw';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/shopping-list/">
    <App />
  </BrowserRouter>
);
