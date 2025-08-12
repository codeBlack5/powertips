// src/AppWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Spinner from './components/Spinner';

function AppWrapper({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800); // spinner time (adjust if needed)
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Spinner />}
      {children}
    </>
  );
}

export default AppWrapper;
