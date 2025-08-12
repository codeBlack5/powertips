import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Upcoming from './components/pages/Upcoming';
import Results from './components/pages/Results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='/upcoming' element={<Upcoming/>}/>
          <Route path='/results' element ={<Results/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
