import React from 'react';
import './App.css';
import Chat from './components/Chat/Chat';

const App: React.FC = () => {
  const height = `${window.innerHeight - 56 - 25}px`;
  return (
    <div className='App' style={{ height }}>
      <Chat />
    </div>
  );
};

export default App;
