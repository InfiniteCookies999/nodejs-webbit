import React from 'react'
import ReactDOM from 'react-dom/client'
import PostContainer from './components/PostsContainer';
import Post from './components/Post';
import CommentThread from './components/CommentThread';
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

/*
<React.StrictMode>
    <RouterProvider router={indexRouter} />
  </React.StrictMode>,
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={indexRouter} />
)
