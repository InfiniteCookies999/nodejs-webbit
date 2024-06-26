import PageLayout from '../PageLayout';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostContainer from "../post/PostsContainer";
import styles from './User.module.css';
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

  let cakeDayStr = "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (user) {
    const cakeDayDate = new Date(user.createdAt);
    cakeDayStr += months[cakeDayDate.getMonth()];
    cakeDayStr += " " + cakeDayDate.getDay();
    cakeDayStr += " " + cakeDayDate.getFullYear();
  }

  return (
    <PageLayout middle={
      user ?
          <>
            <br />
            <div id={styles.profileRow}>
              <img src={profilePicture} style={{width:"10rem", height:"12rem"}} />
              <div id={styles.usernameContainer}>  
                <span id={styles.usernameHeading}>{user.username}</span>
                <span id={styles.usernameHeadingSm}>{"u/" + user.username}</span>
              </div>
            </div>
            <br />
            <button id="posts-tab-btn" className={styles.tabBtn} style={{backgroundColor:"#aaa"}} onClick={(e) => {
              setTab(Tabs.POSTS);
              document.getElementById('posts-tab-btn').style.backgroundColor = '#aaa';
              document.getElementById('comments-tab-btn').style.backgroundColor = '#ddd';
            }}>Posts</button>
            <button id="comments-tab-btn" className={styles.tabBtn} style={{backgroundColor:"#ddd"}} onClick={() => {
              setTab(Tabs.COMMENTS);
              document.getElementById('posts-tab-btn').style.backgroundColor = '#ddd';
              document.getElementById('comments-tab-btn').style.backgroundColor = '#aaa';
            }}>Comments</button>
            {tab === Tabs.POSTS ?
              <PostContainer userId={user.id} /> : <UsersComments user={user} />
            }
          </>
          :
          <span>Loading...</span>
    }
    right={
      <>
        <br />
        <div id={styles.userInfo}>
          <div className="row">
            <div className="col-sm-4">
              <span className={styles.userInfoValues}>{user ? user.postKarma : 0}</span>
              <br />
              <span className={styles.userInfoDesc}>Post Karma</span>
            </div>
            <div className="col-sm-4">
              <span className={styles.userInfoValues}>{user ? user.commentKarma : 0}</span>
              <br />
              <span className={styles.userInfoDesc}>Comment Karma</span>
            </div>
            <div className="col-sm-4">
              <span className={styles.userInfoValues}>{cakeDayStr}</span>
              <br />
              <span className={styles.userInfoDesc}>Cake day</span>
            </div>
          </div>
        </div>
      </>
    }
    />
  );
}