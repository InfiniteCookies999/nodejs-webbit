import PopupBase from "../PopupBase";
import PopupNextButton from "../PopupNextButton";
import { emailPattern } from '../../../utils/validationPatterns';
import './Settings.css';
import { PopupContext, PopupType } from "../../../contexts/PopupContext";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

function onTextChange(e) {
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = emailInput.value === "" || passwordInput === "";
  if (e.target === emailInput) {
    document.getElementById('email-error').innerHTML = "";
  } else {
    document.getElementById('password-error').innerHTML = "";
  }
}

export default function ChangeEmailPopup() {

  const popupContext = useContext(PopupContext);
  const userContext = useContext(UserContext);

  return <PopupBase content={
    <form onSubmit={(e) => {
      e.preventDefault();

      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
      const nextBtn = document.getElementById('next-btn');
      nextBtn.disabled = true;

      if (!email.match(emailPattern)) {
        document.getElementById('email-error').innerHTML = "Invalid email";
        nextBtn.disabled = false;
        return;
      }

      fetch('/api/auth/email', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      .then(response => response.json())
      .then(response => {
        nextBtn.disabled = false;
        if (response.status === "wrong password") {
          document.getElementById('password-error').innerHTML = "Wrong password";
        } else if (response.status === "email taken") {
          document.getElementById('email-error').innerHTML = "Email taken";
        } else {
          userContext.email = email;
          popupContext.setPopup(currentPopup =>
            ({ ...currentPopup, stateType: PopupType.NONE }));
        }
      })
      .catch(error => {
        console.log(error);
        nextBtn.disabled = false;
      });


    }}>
      <input id="password-input" placeholder="Password*" type="password" className="form-control" autoComplete="new-password"
        onChange={onTextChange} />
      <label id="password-error" className="error-label"></label>
      <br />
      <input id="email-input" placeholder="New email*" className="form-control"
        onChange={onTextChange} />
      <label id="email-error" className="error-label"></label>

      <PopupNextButton text={"Save"} disabled={true} />
    </form>
  }
  width={"26rem"} height={"18rem"}
  />;
}