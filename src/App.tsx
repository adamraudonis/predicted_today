// import React from 'react';
// import './App.css';
// import SignUpForm from './components/SignUpForm';
// import PredictionPromptForm from './components/PredictionPromptForm';
// import PredictionsList from './components/PredictionsList';
// import Header from './components/Header';

// function App() {
//   return (
//     <div className="App">
//       <Header />
//       <SignUpForm />
//       <PredictionPromptForm />
//       <PredictionsList />
//     </div>
//   );
// }

// export default App;

import './index.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Home from './components/Home';
import NewPrediction from './components/NewPrediction';
import AddPrediction from './components/AddPrediction';

// import About from './components/About';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, session, ...rest }: any) => {
  // redirect to home page if user is not authenticated
  if (!session) {
    return <Navigate to="/" />;
  }
  return element;
};

export default function App() {
  const [session, setSession] = useState<any | null>(null);
  const [isDone, setIsDone] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // This doesn't seem to work anymore
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('inside got session');
      setSession(session);

      // if (session) {
      //   const { data }: any = await supabase
      //     .from('admins')
      //     .select()
      //     .eq('id', session.user.id);
      //   setIsAdmin(data.length > 0);
      // } else {
      //   setIsAdmin(false);
      // }

      setIsDone(true);
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('inside auth state change');
      if (session) {
        console.log('inside session');
        // NOTE: This currently hangs
        // const { user } = session || {};
        // const { email, user_metadata, id } = user || {};
        // const { name } = user_metadata || {};
        // const updates = {
        //   created_at: new Date(),
        //   email: email,
        //   name: name,
        //   user_id: id,
        // };
        // await supabase.from('profiles').upsert(updates);
        console.log('inside session 2');
      } else {
        console.log('no session');
      }
      console.log('set is done true');
      // setIsDone(true);
      setSession(session);
    });
  }, []);

  if (!isDone) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* TODO: Actually use private route */}
        {/* <Route
          path="/new_prediction"
          element={
            <PrivateRoute
              session={session}
              element={<Controls session={session} />}
            />
          }
        /> */}
        <Route
          path="/new_prediction"
          element={<NewPrediction session={session} />}
        />
        <Route
          path="/add_prediction"
          element={<AddPrediction session={session} />}
        />
      </Routes>
    );
  }
}
