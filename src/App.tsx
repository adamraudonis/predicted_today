import React from 'react';
import './App.css';
import SignUpForm from './SignUpForm';
import PredictionForm from './PredictionForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SignUpForm />
        <PredictionForm />
      </header>
    </div>
  );
}

export default App;
