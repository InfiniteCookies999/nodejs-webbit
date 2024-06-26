import { useContext } from "react";
import { PopupContext, PopupType } from "../../contexts/PopupContext";
import PopupBase from "./PopupBase";
import styles from './CreateCommunityPopup.module.css';
import commonStyles from './Popup.module.css';

function changeType(e) {
  for (const child of document.getElementById('type-selection').children) {
    child.classList.remove(styles.subTypeSelected);
    child.querySelector("input").checked = false;
  }
  const tag = e.target.tagName.toLowerCase();
  let subSection = e.target;
  if (tag !== "div") {
    subSection = e.target.parentElement;
  }
  subSection.classList.add(styles.subTypeSelected);
  subSection.querySelector("input").checked = true;
}

export default function CreateCommunityPopup() {

  const popupContext = useContext(PopupContext);

  const content = (
    <form onSubmit={(e) => {
      e.preventDefault();

      const createBtn = document.getElementById('create-btn');
      createBtn.disabled = true;

      const name = document.getElementById('name-input').value;
      const adultRated = document.getElementById('mature-content-switch').checked;
      let type = "";
      for (const child of document.getElementById('type-selection').children) {
        const input = child.querySelector("input");
        if (input.checked) {
          type = input.value;
        } 
      }
      if (!name.match(/^[0-9a-zA-Z]+$/)) {
        const errorLabel = document.getElementById('error-label');
        errorLabel.innerHTML = "Invalid name. May only contain letters or numbers";
        errorLabel.style.display = "block";
        createBtn.disabled = false;
        return;
      }
      if (name.length < 3) {
        const errorLabel = document.getElementById('error-label');
        errorLabel.innerHTML = "Name too short";
        errorLabel.style.display = "block";
        createBtn.disabled = false;
        return;
      }

      fetch('/api/subwebbit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          adultRated
        })
      })
      .then(response => response.json())
      .then(response => {
        createBtn.disabled = false;
        if (response.status === "name taken") {
          const errorLabel = document.getElementById('error-label');
          errorLabel.innerHTML = "Name taken";
          errorLabel.style.display = "block";
        } else {
          window.location.href = '/w/' + name;
        }
      })
      .catch(error => {
        console.log(error)
        createBtn.disabled = false;
      });
    }}>
      <h3>Create a community</h3>
      <p className={styles.explainations}>You can create a community which you can build and grow into something special. Let's get started!</p>
      <br />
      <input id="name-input" 
          placeholder="Name*"
          className="form-control"
          maxLength={40}
          onChange={() => {
            const input = document.getElementById('name-input');
            const createBtn = document.getElementById('create-btn');
            createBtn.disabled = input.value === "";
            document.getElementById('error-label').style.display = "none";
          }
        }
      ></input>
      <p className={styles.explainations}>Choose carefully, you cannot change afterwards</p>
      <span id="error-label" style={{display:"none", color:"red", position:"absolute"}}></span>
      <br />
      <h6>Type</h6>
      <div id="type-selection">
        <div className={`${styles.subTypeSection} ${styles.subTypeSelected}`} onClick={changeType}>
          <span>Public</span>
          <p>Anyone can view, post, or comment in the community</p>
          <input type="radio" value="public" defaultChecked={true} />
        </div>
        <div className={styles.subTypeSection} onClick={changeType}>
          <span>Restricted</span>
          <p>Anyone can view but only approved members can contribute</p>
          <input type="radio" value="restricted" />
        </div>
        <div className={styles.subTypeSection} onClick={changeType}>
          <span>Private</span>
          <p>Only approved members can view or contribute</p>
          <input type="radio" value="private" />
        </div>
      </div>
      <hr style={{margin:0, backgroundColor:"gray"}} className="mt-2 mb-2" />
      <div className={styles.subTypeSection} onClick={(e) => {
        const matureSwitch = document.getElementById("mature-content-switch");
        if (e.target === matureSwitch) return;
        
        matureSwitch.checked = !matureSwitch.checked;
      }} >
        <span>Mature (18+)</span>
        <p>Must be over 18 to view or contribute</p>
        <input id="mature-content-switch" type="checkbox" role="switch" />
      </div>

      <div id={styles.optionBtns} className={`${commonStyles.bottomContainer} ${commonStyles.centerPadding}`}>
        <button onClick={() =>{
          popupContext.setPopup(currentPopup =>
            ({ ...currentPopup, stateType: PopupType.NONE }));
        }}>Cancel</button>
        <button id="create-btn" className="ml-3" disabled={true}>Create your community</button>
      </div>
    </form>
  );
  
  return <PopupBase
    content={content}
    onCloseButton={() => {
      popupContext.setPopup(currentPopup =>
        ({ ...currentPopup, stateType: PopupType.NONE }));
    }}
    onBackgroundClicked={() => {
      popupContext.setPopup(currentPopup =>
        ({ ...currentPopup, stateType: PopupType.NONE }));
    }}
    />
}