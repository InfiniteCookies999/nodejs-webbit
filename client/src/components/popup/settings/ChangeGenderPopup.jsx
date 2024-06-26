import { useContext } from "react";
import PopupBase from "../PopupBase";
import PopupNextButton from "../PopupNextButton";
import styles from './Settings.module.css';
import { UserContext } from "../../../contexts/UserContext";
import { PopupContext, PopupType } from "../../../contexts/PopupContext";

function onSelectionClicked(e) {
  let section = e.target;
  if (e.target.tagName.toLowerCase() !== "div") {
    section = e.target.parentElement;
  }
  for (const section of document.getElementsByClassName(styles.genderSection)) {
    section.childNodes[1].hidden = true;
  }

  const checkMark = section.childNodes[1];
  checkMark.hidden = false;
}

export default function ChangeGenderPopup() {

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);
  const gender = userContext.gender;
  
  return <PopupBase content={
    <form onSubmit={(e) => {
      e.preventDefault();

      let gender = "";
      for (const section of document.getElementsByClassName(styles.genderSection)) {
        if (!section.childNodes[1].hidden) {
          gender = section.getAttribute("value");
          break;
        }
      }

      const nextBtn = document.getElementById('next-btn');
      nextBtn.disabled = true;

      fetch('/api/user/gender', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender
        })
      })
      .then(() => {
        userContext.setUser((user) => ({...user, gender}));
        popupContext.setPopup(currentPopup =>
          ({ ...currentPopup, stateType: PopupType.NONE }));
      })
      .catch(error => {
        console.log(error);
        nextBtn.disabled = false;
      });

      
    }}>
      <h3>Gender</h3>
      <div className={styles.genderSection} value="Woman" onClick={onSelectionClicked}>
        <span>Woman</span>
        <span className="bx bx-check" hidden={gender !== "Woman"}></span>
      </div>
      <div className={styles.genderSection} value="Man" onClick={onSelectionClicked}>
        <span>Man</span>
        <span className="bx bx-check" hidden={gender !== "Man"}></span>
      </div>
      <div className={styles.genderSection} value="Non-Binary" onClick={onSelectionClicked}>
        <span>Non binary</span>
        <span className="bx bx-check" hidden={gender !== "Non-Binary"}></span>
      </div>
      <div className={styles.genderSection} value="Not-Say" onClick={onSelectionClicked}>
        <span>Prefer not to say</span>
        <span className="bx bx-check" hidden={gender !== "Not-Say"}></span>
      </div>
      <PopupNextButton text={"Save"} />
    </form>
  }
  width={"26rem"} height={"24rem"}
  />;
}