import { useContext } from 'react';
import './NavBar.css';
import { UserContext } from '../contexts/UserContext';
import { PopupContext, PopupType } from '../contexts/PopupContext';

export default function NavBar() {

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  let userImgPath = "/static/default_user_picture.jpg";
  if (userContext && userContext.profileURI) {
    // TODO: Load user profile
  }

  return (
    <nav id="site-navbar">
      {userContext ?
        <a id="user-btn">
        <img src={userImgPath}
             className="rounded-circle"
             style={{width:"2.2rem", height:"2.2rem"}}></img>
        </a> :
        <a id="login-button" onClick={(e) => {
          popupContext.setPopup(currentPopup =>
            ({ ...currentPopup, stateType: PopupType.LOGIN }));
        }}>
          <span>Log In</span>
        </a>
      }
    </nav>
  );
}