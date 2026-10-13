import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Blog from './components/pages/Blog';
import Login from './components/pages/Login';
import Register from "./components/pages/Register";
import AppWrapper from "./AppWrapper";
import { AuthProvider } from "./context/AuthContext";
import Favorites from "./components/pages/Favorites";
import History from "./components/pages/History";
import Profile from "./components/pages/Profile";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <AppWrapper>
        <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='/news' element={<Blog/>}/>
          <Route path='/news/:id' element={<Blog/>}/>
          <Route path='/login' element ={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path="/favorites" element={<Favorites/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Route>
        </Routes>
      </AppWrapper>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
