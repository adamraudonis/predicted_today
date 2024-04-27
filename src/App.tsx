import React from 'react';
import './App.css';
import SignUpForm from './SignUpForm';
import PredictionForm from './PredictionForm';
import PredictionsList from './PredictionsList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SignUpForm />
        <PredictionForm />
        <PredictionsList />
      </header>
    </div>
  );
}

export default App;
