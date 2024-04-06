import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';

import { LoginPage } from './pages/login';
import { DiscoverPage } from './pages/discover';
import { CreateUserPage } from './pages/create-user';
import { NotFoundPage } from './pages/not-found';
import { ViewRoomPage } from './pages/view-room';
import { ViewProfilePage } from './pages/view-profile';
import { CreateRoomPage } from './pages/create-room';


export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Navigate to="/login" />} />
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
