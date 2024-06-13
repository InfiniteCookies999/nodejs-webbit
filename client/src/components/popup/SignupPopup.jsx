import { useContext, useState } from "react";
import './SignupPopup.css';
import AgreementTerms from './AgreementTerms';
import PopupNextButton from "./PopupNextButton";
import PopupBase from './PopupBase';
import { PopupContext, PopupType } from "../../contexts/PopupContext";

export const Transition = Object.freeze({
  EMAIL: 0,
  USERNAME_AND_PASS: 1,
  GENDER: 2
});

function handleEmailContinue(setEmail, setTransition) {
  const nextBtn = document.getElementById('next-btn');
  const email = document.getElementById('signup-email').value;
  if (email === "") return;
  if (!email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )) {
    document.getElementById('email-error-text').innerText = "invalid email!";
    nextBtn.disabled = false;
    return;
  }

  fetch(`/api/auth/emailexists/${email}`)
    .then(response => response.json())
    .then(json => {
      nextBtn.disabled = false;
      if (json.exists) {
        document.getElementById('email-error-text').innerText = "email taken!";
      } else {
        setEmail(email);
        setTransition(Transition.USERNAME_AND_PASS);
      }
    })
    .catch(error => console.log(error));
}

function handleUsernamePassContinue(email, setTransition) {
  const nextBtn = document.getElementById('next-btn');
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  if (username === "" || password === "") {
    nextBtn.disabled = false;
    return;
  }

  let isValid = true;
  if (!username.match(/^[a-zA-Z0-9]{3,20}$/)) {
    document.getElementById('username-error-text').innerText = "invalid username!";
    isValid = false;
  }
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[_=+!@#$%^&*.])[a-zA-Z0-9_=+!@#$%^&*.]{8,100}$/)) {
    document.getElementById('password-error-text').innerText = "invalid password!";
    isValid = false;
  }
  if (!isValid) {
    nextBtn.disabled = false;
    return;
  }

  fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      username,
      password
    })
  })
  .then(response => response.json())
  .then(response => {
    nextBtn.disabled = false;
    if (response.status === "email taken") {
      // Just reload the page because it is going to fail. This really should not happen
      // unless the user tried opening two signups in which case the first one can just
      // be closed.
      window.location.reload();
    } else if (response.status === "username taken") {
      document.getElementById('username-error-text').innerText = "username taken!";
    } else {
      setTransition(Transition.GENDER);
    }
  })
  .catch(error => {
    console.log(error)
    nextBtn.disabled = false;
  });
}

function handleGenderSelection(clickedBtn) {
  fetch('/api/user/gender', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gender: clickedBtn.value
    })
  })
  .then(_ => {
    window.location.reload();
  })
  .catch(error => console.log(error));
}

function handleTextChange(transition) {
  const nextBtn = document.getElementById('next-btn');
  if (transition === Transition.EMAIL) {
    const emailText = document.getElementById('signup-email').value !== "";
    nextBtn.disabled = !emailText;
  } else if (transition === Transition.USERNAME_AND_PASS) {
    const usernameHasText = document.getElementById('signup-username').value !== "";
    const passwordHasText = document.getElementById('signup-password').value !== "";
    nextBtn.disabled = !usernameHasText || !passwordHasText;
  }
}

export default function SignupPopup() {
  
  const [email, setEmail] = useState("");
  const popupContext = useContext(PopupContext);
  const [transition, setTransition] = useState(Transition.EMAIL);

  const form = (
    <form onSubmit={(e) => {
      e.preventDefault();
      const nextBtn = document.getElementById("next-btn");
      if (nextBtn) {
        nextBtn.disabled = true;
      }

      if (transition === Transition.EMAIL) {
        handleEmailContinue(setEmail, setTransition);
      } else if (transition === Transition.USERNAME_AND_PASS) {
        handleUsernamePassContinue(email, setTransition);
      }
    }}>
      {transition === Transition.EMAIL &&
      <>
        <h2>Sign Up</h2>
        <AgreementTerms />
        <input id="signup-email"
              placeholder="Email*"
              className="form-control"
              onChange={(e) => {
                document.getElementById('email-error-text').innerText = "";
                handleTextChange(transition)
                }} />
        <span id="email-error-text" className="error-text"></span>
        <div style={{marginTop:"1.4rem"}}>
          <span>Already a webbitor?
            <span id="login-link" className="pl-1" style={{color: "#5a8dfa"}}
               onClick={() => {
                popupContext.setPopup(currentPopup =>
                  ({ ...currentPopup, stateType: PopupType.LOGIN }));
               }}>
              Log In
            </span>
          </span>
        </div>
      </>
      }
      {transition === Transition.USERNAME_AND_PASS &&
      <>
        <h2>Create your username and password</h2>
        <p>Your username is what you will go by here. You cannot change your username later.</p>
        <input id="signup-username"
              placeholder="Username*"
              className="form-control"
              onChange={() => {
                document.getElementById('username-error-text').innerText = ""; 
                handleTextChange(transition)
              }}
          ></input>
        <span id="username-error-text" className="error-text"></span>
        <br />
        <input id="signup-password"
                placeholder="Password*"
                type="password"
                className="form-control"
                onChange={() => {
                document.getElementById('password-error-text').innerText = "";
                handleTextChange(transition)
                }}
          ></input>
        <span id="password-error-text" className="error-text"></span>
      </>
      }
      {transition === Transition.GENDER &&
      <>
        <h2>About you</h2>
        <p>Tell us about yourself to help get started</p>
        <div style={{textAlign:"center"}}>
          <span style={{color:"rgb(151, 151, 151)"}}>How do you identify?</span>
        </div>
        <button className="form-control shadow-none mt-2 gender-btn" value="Woman"
          onClick={(e) => handleGenderSelection(e.target)}>Woman</button>
        <button className="form-control shadow-none mt-2 gender-btn" value="Man"
          onClick={(e) => handleGenderSelection(e.target)}>Man</button>
        <button className="form-control shadow-none mt-2 gender-btn" value="Non-Binary"
          onClick={(e) => handleGenderSelection(e.target)}>Non-Binary</button>
        <button className="form-control shadow-none mt-2 gender-btn" value="Not-Say"
          onClick={(e) => handleGenderSelection(e.target)}>Prefer not to say</button>
      </>
      }

      {transition !== Transition &&
        <PopupNextButton text={"Continue"} disabled={true} />
      }
    </form>
  );

  return <PopupBase
    content={form}
    onCloseButton={() => {
      setTransition(Transition.EMAIL);
      popupContext.setPopup(currentPopup =>
        ({ ...currentPopup, stateType: PopupType.NONE }));
    }}
    onBackgroundClicked={() => {
      if (transition !== Transition.EMAIL) return;
      setTransition(Transition.EMAIL);
      popupContext.setPopup(currentPopup =>
        ({ ...currentPopup, stateType: PopupType.NONE }));
    }}
    />
}
