import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import { SheAIProvider } from './context/SheAIContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <SheAIProvider>
        <App />
      </SheAIProvider>
    </UserProvider>
  </React.StrictMode>
);
