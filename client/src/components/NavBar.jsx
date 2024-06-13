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

  return (
    <nav id="site-navbar">
      {userContext ?
        userContext.isLoggedIn ?
        <a className="right-nav-element">
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
        <a className="rounded-circle right-nav-element"
          style={{width:"2.2rem", height:"2.2rem", backgroundColor:"gray"}}></a>
      }
    </nav>
  );
}