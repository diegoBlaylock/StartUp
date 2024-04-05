import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import React from 'react';
import { LoginPage } from './pages/login';
import { DiscoverPage } from './pages/discover';
import { CreateUserPage } from './pages/create-user';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/login' exact element={<LoginPage/>} />
      <Route path='/discover' exact element={<DiscoverPage/>}/>
      <Route path='/create/user' exact element={<CreateUserPage/>}/>
      <Route path='/create/room' exact element={<CreateRoomPage/>}/>
      <Route path='/my/profile' exact element={<ViewProfilePage/>}/>
      <Route path='/view/room' element={<ViewRoomPage/>}/>
      <Route path='*' element={<NotFoundPage/>}/> 
    </Routes>
  </BrowserRouter>
}
