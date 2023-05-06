import React from 'react';
import './App.css';
import Chat from './components/Chat/Chat';
import LoginPage from './components/Auth/Login';
import { useAuth0 } from '@auth0/auth0-react';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className='App'>{isAuthenticated ? <Chat /> : <LoginPage />}</div>
  );
};

export default App;
