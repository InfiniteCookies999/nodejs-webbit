import React, { useContext, useEffect, useState } from 'react';
import Post from './components/post/Post';
import CommentThread from './components/post/CommentThread';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar';
import Popup from './components/popup/Popup';
import { UserContext } from './contexts/UserContext';
import { PopupContext } from './contexts/PopupContext';
import NewPost from './components/post/NewPost';
import User from './components/user/User';
import Home from './components/Home';
import SubWebbit from './components/SubWebbit';

export default function App() {

  const indexRouter = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/w/:subname/comments/:postId',
      element: <Post />
    },
    {
      path: '/u/:user/comments/:commentId',
      element: <CommentThread />
    },
    {
      path: '/w/:subname/submit',
      element: <NewPost />
    },
    {
      path: '/u/:username',
      element: <User />
    },
    {
      path: '/w/:subname',
      element: <SubWebbit />
    }
  ]);

  const popupContext = useContext(PopupContext);
  const [popup, setPopup] = useState({ ...popupContext });

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(response => response.json())
      .then(session => {
        if (session.loggedIn) {
          setUser({ isLoggedIn: true, ...session.user });
        } else {
          setUser({ isLoggedIn: false });
        }
      });
  }, []);
 
  return (
    <UserContext.Provider value={user}>
      <PopupContext.Provider value={{ ...popup, setPopup }}>
        <NavBar />
        <Popup />
        <hr style={{margin:0}} />
        <RouterProvider router={indexRouter} />
      </PopupContext.Provider>
    </UserContext.Provider>
  );
}