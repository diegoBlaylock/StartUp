import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import React from 'react';
import { LoginPage } from './pages/login';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>} />
    </Routes>
  </BrowserRouter>
}
