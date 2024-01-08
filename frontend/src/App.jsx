import AuthPage from './components/pages/Auth';  // Updated import path
import BookingsPage from './components/pages/Booking';  // Updated import path
import EventsPage from './components/pages/Events';  // Updated import path
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './components/Context/auth-context';
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';



const App = () => {
  const [authState, setAuthState] = useState({
    token: null,
    userId: null
  });

  const login = (token, userId) => {
    setAuthState({
      token: token,
      userId: userId
    });
  };

  const logout = () => {
    setAuthState({
      token: null,
      userId: null
    });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token: authState.token,
          userId: authState.userId,
          login: login,
          logout: logout
        }}
      >
       <MainNavigation />
        <main className="main-content">
          <Routes>
            <Route
              path="/auth"
              element={authState.token ? <Navigate replace to="/events" /> : <AuthPage />}
            />
            <Route
              path="/events"
              element={ <EventsPage /> }
            />
            <Route
              path="/bookings"
              element={authState.token ? <BookingsPage /> : <Navigate replace to="/auth" />}
            />
            <Route
              path="/"
              element={<Navigate to={authState.token ? "/events" : "/auth"} />}
            />
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
