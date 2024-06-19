import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostContainer from "../post/PostsContainer";
import './User.css';
import UsersComments from "./UsersComments";

const Tabs = Object.freeze({
  POSTS: 0,
  Comments: 1
});

export default function User() {
  
  const { username } = useParams();

  const [user, setUser] = useState(undefined);
  const [tab, setTab] = useState(Tabs.POSTS);

  useEffect(() => {
    if (!username) return;

    const controller = new AbortController();

    fetch(`/api/user/${username}`, { signal: controller.signal })
      .then(response => response.json())
      .then(user => setUser(user))
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ username ]);
  
  const profilePicture = user && user.profileFile ? `/static/uploads/users/profile_pictures/${user.profileFile}` :
      '/static/default_user_picture.jpg';

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          {user ?
            <>
              <br />
              <div id="profile-row">
                <img src={profilePicture} style={{width:"10rem", height:"12rem"}} />
                <div id="username-container">  
                  <span id='username-heading'>{user.username}</span>
                  <span id="username-heading-sm">{"u/" + user.username}</span>
                </div>
              </div>
              <br />
              <button id="posts-tab-btn" className="tab-btn" style={{backgroundColor:"#aaa"}} onClick={(e) => {
                setTab(Tabs.POSTS);
                document.getElementById('posts-tab-btn').style.backgroundColor = '#aaa';
                document.getElementById('comments-tab-btn').style.backgroundColor = '#ddd';
              }}>Posts</button>
              <button id="comments-tab-btn" className="tab-btn" style={{backgroundColor:"#ddd"}} onClick={() => {
                setTab(Tabs.COMMENTS);
                document.getElementById('posts-tab-btn').style.backgroundColor = '#ddd';
                document.getElementById('comments-tab-btn').style.backgroundColor = '#aaa';
              }}>Comments</button>
              {tab === Tabs.POSTS ?
                <PostContainer userId={user.id} /> : <UsersComments user={user} />
              }
            </>
            :
            <span>Loading...</span>}
        </div>
        <div className="col-sm-3">
          
        </div>
      </div>
    </div>
  );
}