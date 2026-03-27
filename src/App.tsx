// App.tsx
// Component gốc — chỉ việc gọi AppRouter là xong
// Mọi logic điều hướng nằm trong AppRouter

import React from 'react';
import AppRouter from './router/AppRouter';

const App = () => {
  return <AppRouter />;
};

export default App;