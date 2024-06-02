import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import PostContainer from './components/post/PostsContainer';
import Post from './components/post/Post';
import CommentThread from './components/post/CommentThread';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={indexRouter} />
  </React.StrictMode>,
)
