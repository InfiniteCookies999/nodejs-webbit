import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import styles from './Settings.module.css';
import PageLayout from "./PageLayout";
import { PopupContext, PopupType } from "../contexts/PopupContext";

export default function Settings() {

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  if (!userContext) {
    return;
  }

  if (!userContext.isLoggedIn) {
    window.location.href = "/";
    return;
  }

  let gender = "";
  switch (userContext.gender) {
  case "Not-Say":
    gender = "Prefer not to say";
    break;
  case "Non-Binary":
    gender = "Non binary";
    break;
  default:
    gender = userContext.gender;
    break;
  }

  const content = (
    <div className="container">
      <br />
      <h1>Settings</h1>
      <div className={styles.setting} onClick={() => {
        popupContext.setPopup(currentPopup =>
          ({ ...currentPopup, stateType: PopupType.CHANGE_EMAIL }));
      }}>
        <span>Email address</span> 
        <div>
          <span>{userContext.email}</span>
          <label className="bx bx-chevron-right"></label>
        </div>
      </div>
      <div className={styles.setting} onClick={() => {
        popupContext.setPopup(currentPopup =>
          ({ ...currentPopup, stateType: PopupType.CHANGE_PASSWORD }));
      }}>
        <span>Password</span>
        <div>
          <label className="bx bx-chevron-right"></label>
        </div>
      </div>
      <div className={styles.setting} onClick={() => {
        popupContext.setPopup(currentPopup =>
          ({ ...currentPopup, stateType: PopupType.CHANGE_GENDER }));
      }}>
        <span>Gender</span>
        <div>
          <span>{gender}</span>
          <label className="bx bx-chevron-right"></label>
        </div>
      </div>
    </div>
  );

  return <PageLayout middle={content} />
}