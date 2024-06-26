import AgreementTerms from './AgreementTerms';
import PopupNextButton from './PopupNextButton';
import PopupBase from './PopupBase';
import { PopupContext, PopupType } from '../../contexts/PopupContext';
import { useContext } from 'react';
import commonStyles from './Popup.module.css';

function handleTextChange() {
  const nextBtn = document.getElementById('next-btn');
  const usernameHasText = document.getElementById('login-username-or-email').value !== "";
  const passwordHasText = document.getElementById('login-password').value !== "";
  nextBtn.disabled = !usernameHasText || !passwordHasText;
}

export default function OpenLoginPopup() {

  const popupContext = useContext(PopupContext);

  const form = (
    <form onSubmit={(e) => {
      e.preventDefault();
      const nextBtn = document.getElementById('next-btn');
      nextBtn.disabled = true;

      const usernameOrEmail = document.getElementById('login-username-or-email').value;
      const password = document.getElementById('login-password').value;
      if (usernameOrEmail === "" || password === "") return;

      const usernameOrEmailError = document.getElementById("username-or-email-error-text");

      if (!usernameOrEmail.includes("@")) {
        if (usernameOrEmail.length > 20) {
          usernameOrEmailError.innerHTML = "username too long";
          return;
        } else if (usernameOrEmail.length < 3) {
          usernameOrEmailError.innerHTML = "username too short";
          return;
        }
      }

      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: usernameOrEmail,
          password
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response.status === "invalid credentials") {
          nextBtn.disabled = false;
          const invalidCredsError = document.getElementById("invalid-creds-error-text");
          invalidCredsError.innerHTML = "invalid credentials";
        } else {
          // User session should be active now, reloading the page.
          window.location.reload();
        }
      })
      .catch(error => {
        console.log(error);
        nextBtn.disabled = false;
      });
    }}>
      <h2>Log In</h2>
      <AgreementTerms />
      <input id="login-username-or-email"
          placeholder="Email or username*"
          className="form-control"
          onChange={handleTextChange}
      ></input>
      <span id="username-or-email-error-text" className={commonStyles.errorText}></span>
      <br />
      <input id="login-password"
          placeholder="Password*"
          className="form-control"
          type="password"
          onChange={handleTextChange}
      ></input>
      <span id="password-error-text" className={commonStyles.errorText}></span>
      <br />
      <span>New to Webbit?
        <span id="login-link" className="pl-1" style={{color: "#5a8dfa"}}
            onClick={() => {
            popupContext.setPopup(currentPopup =>
              ({ ...currentPopup, stateType: PopupType.SIGNUP }));
            }}>
          Sign Up
        </span>
      </span>
      <br />
      <span id="invalid-creds-error-text" className={commonStyles.errorText}></span>

      <PopupNextButton text={"Log In"} disabled={true} />
    </form>
  );

  return <PopupBase content={form} />;
}
