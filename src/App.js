// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AnalogClock from './components/AnalogClock';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userName) => {
    setUser({ name: userName });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={user ? <AnalogClock onLogout={handleLogout} userName={user.name} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
