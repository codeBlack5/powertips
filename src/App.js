import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes,useLocation } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Blog from './components/pages/Blog';
import Login from './components/pages/Login';
import { initGA, logPageView } from "./ga";
import Register from "./components/pages/Register";
import AppWrapper from "./AppWrapper";
import Favorites from "./components/pages/Favorites";
import History from "./components/pages/History";

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    initGA();
  }, []);
  return (
    <BrowserRouter>
    <AppWrapper>
    <PageTracker />
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='/blogs' element={<Blog/>}/>
          <Route path='/login' element ={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path="/favorites" element={<Favorites/>}/>
          <Route path="/history" element={<History/>}/>
        </Route>
      </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
