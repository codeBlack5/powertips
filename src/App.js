import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Blog from './components/pages/Blog';
import Login from './components/pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='/blogs' element={<Blog/>}/>
          <Route path='/login' element ={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
