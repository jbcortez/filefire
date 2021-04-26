import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';

import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <DBProvider>
        <App />
      </DBProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
