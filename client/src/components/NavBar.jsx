import { useContext } from 'react';
import styles from './NavBar.module.css';
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
    <nav id={styles.siteNavbar}>
      <div className={styles.rightNavElement}>
        {showCreatePostBtn &&
          <button id={styles.postCreateBtn} className='mr-4' onClick={() => {
            if (!userContext) return;

            if (!userContext.isLoggedIn) {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.SIGNUP }));
            } else {
              const subname = window.location.pathname.split('/')[2];
              window.location.href = `/w/${subname}/submit`;
            }
          }}>+ Create</button>
        }
        {userContext ?
          userContext.isLoggedIn ?
          <>
          <img src={userImgPath}
              id={styles.userProfile}
              className="rounded-circle"
              onClick={() => {
                const dropDown = document.getElementById(styles.dropDown);
                dropDown.hidden = !dropDown.hidden;
              }}
              >
            </img>
            <div id={styles.dropDown} hidden={true}>
              <a href={`/u/${userContext.username}`} className={`link ${styles.dropDownSection}`}>
                View Profile
              </a>
              <a href="/settings" className={`link ${styles.dropDownSection}`}>
                Settings
              </a>
              <a className={`link ${styles.dropDownSection}`} onClick={() => {
                fetch('/api/auth/logout', {
                  method: 'POST',
                  body: {}
                })
                .then(() => {
                  window.location.reload();
                })
                .catch(error => console.log(error));
              }}>
                Logout
              </a>
            </div>
          </>
          :
            <a id={styles.loginBtn} className={styles.rightNavElement} onClick={(e) => {
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