import React, { useContext, useEffect, useState } from 'react'
import PostContainer from './components/post/PostsContainer';
import Post from './components/post/Post';
import CommentThread from './components/post/CommentThread';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar';
import Popup from './components/popup/Popup';
import { UserContext } from './contexts/UserContext';
import { PopupContext } from './contexts/PopupContext';

export default function App() {

  const indexRouter = createBrowserRouter([
    {
      path: '/',
      element: <PostContainer />
    },
    {
      path: '/w/:subname/comments/:id',
      element: <Post />
    },
    {
      path: '/u/:user/comments/:commentId',
      element: <CommentThread />
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
          setUser(session.user);
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