import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { createContext, useState } from 'react';

import { LoginPage } from './pages/login';
import { DiscoverPage } from './pages/discover';
import { CreateUserPage } from './pages/create-user';
import { NotFoundPage } from './pages/not-found';
import { ViewRoomPage } from './pages/view-room';
import { ViewProfilePage } from './pages/view-profile';
import { CreateRoomPage } from './pages/create-room';

import './app.css'
import { Authenticator } from './pages/shared/validate-token';
import { Header, HeaderActionType } from './pages/frame/header';
import { Footer } from './pages/frame/footer';


export const FrameContext = createContext();
export const UserContext = createContext();


export default function App() {
  const [frame, setFrame] = useState({
    header: HeaderActionType.NONE,
    footer: true,
    headerClassName: {},
    footerClassName: {}
  });

  const [user, setUser] = useState(null);

  function updateFrame(headType, footVisible=true, headerClassName="", footerClassName="") {
    if(headType !== frame.header || footVisible !== frame.footer || headerClassName !== frame.headerClassName || footerClassName.length !== frame.footerClassName) 
      setFrame(()=>({
        header: headType,
        footer: footVisible,
        headerClassName: headerClassName,
        footerClassName: footerClassName
      }));
  }

  return (
    <div id="body">
      <BrowserRouter>
        <UserContext.Provider value={{user: user, setUser: setUser}}>
          <Header className={frame.headerClassName} headerType={frame.header} />
            <FrameContext.Provider value={updateFrame}>
                <Routes>
                  <Route path='/' exact element={<Navigate to="/login" />} />
                  <Route path='/login' exact element={<LoginPage />} />
                  <Route path='/discover' exact element={<Authenticator child={<DiscoverPage />}/>}/>
                  <Route path='/create/user' exact element={<CreateUserPage />}/>
                  <Route path='/create/room' exact element={<Authenticator child={<CreateRoomPage />}/>}/>
                  <Route path='/my/profile' exact element={<Authenticator child={<ViewProfilePage />}/>}/>
                  <Route path='/room' element={<Authenticator child={<ViewRoomPage />}/>}/>
                  <Route path='*' element={<NotFoundPage/>}/> 
                </Routes>
            </FrameContext.Provider>
          <Footer className={frame.footerClassName} visible={frame.footer} />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}
