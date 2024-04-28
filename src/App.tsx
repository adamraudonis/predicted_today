import React, { useState, useEffect } from 'react';
import './App.css';
import SignUpForm from './SignUpForm';
import PredictionForm from './PredictionForm';
import PredictionsList from './PredictionsList';
import { supabase } from './supabaseClient';
import { User } from '@supabase/auth-js';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            Signed in as {user?.email}
            <button onClick={() => supabase.auth.signOut()}>Sign out</button>
          </div>
        ) : (
          <SignUpForm />
        )}
        <PredictionForm />
        <PredictionsList />
      </header>
    </div>
  );
}

export default App;
