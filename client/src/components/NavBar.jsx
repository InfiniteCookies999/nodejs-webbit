import { useContext } from 'react';
import './NavBar.css';
import { UserContext } from '../contexts/UserContext';
import { PopupContext, PopupType } from '../contexts/PopupContext';

export default function NavBar() {

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  let userImgPath = "/static/default_user_picture.jpg";
  if (userContext && userContext.profileFile) {
    userImgPath = `/static/uploads/users/profile_pictures/${userContext.profileFile}`;
  }

  const showCreatePostBtn = window.location.pathname.startsWith("/w/");

  return (
    <nav id="site-navbar">
      <div className='right-nav-element'>
        {showCreatePostBtn &&
          <button id="post-create-btn" className='mr-4' onClick={() => {
            if (!userContext) return;

            if (!userContext.isLoggedIn) {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.SIGNUP }));
            } else {
              const subname = window.location.pathname.split('/')[2];
              console.log("subname: ", subname);
              window.location.href = `/w/${subname}/submit`;
            }
          }}>+ Create</button>
        }
        {userContext ?
          userContext.isLoggedIn ?
          <a>
            <img src={userImgPath}
                className="rounded-circle"
                style={{width:"2.2rem", height:"2.2rem"}}></img>
          </a> :
            <a id="login-button" className='right-nav-element' onClick={(e) => {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.LOGIN }));
            }}>
              <span>Log In</span>
            </a>
          // No context loaded.
          :
          <a className="rounded-circle"
            style={{width:"2.2rem", height:"2.2rem", backgroundColor:"gray"}}></a>         
        }
      </div>
    </nav>
  );
}