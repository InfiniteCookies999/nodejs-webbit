import { useState } from "react";
import './SignupPopup.css';
import '../index.css'

const Transition = Object.freeze({
  EMAIL: 0,
  USERNAME_AND_PASS: 1
});

function handleEmailContinue(setEmail, setTransition) {
  const email = document.getElementById('signup-email').value;
  if (email === "") return;
  if (!email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )) {
    document.getElementById('email-error-text').innerText = "invalid email!";
    return;
  }

  fetch(`/api/auth/emailexists/${email}`)
    .then(response => response.json())
    .then(json => {
      if (json.exists) {
        document.getElementById('email-error-text').innerText = "email taken!";
      } else {
        const continueBtn = document.getElementById('continue-btn');
        continueBtn.disabled = true;
        setEmail(email);
        setTransition(Transition.USERNAME_AND_PASS);
      }
    })
    .catch(error => console.log(error));
}

function handleUsernamePassContinue(email, setTransition) {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  if (username === "" || password === "") return;

  let isValid = true;
  if (!username.match(/^[a-zA-Z0-9]{3,20}$/)) {
    document.getElementById('username-error-text').innerText = "invalid username!";
    isValid = false;
  }
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[_=+!@#$%^&*.])[a-zA-Z0-9_=+!@#$%^&*.]{8,100}$/)) {
    document.getElementById('password-error-text').innerText = "invalid password!";
    isValid = false;
  }
  if (!isValid) return;
  
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
    if (response.status === "email taken") {
      document.getElementById('email-error-text').innerText = "email taken!";
      setTransition(Transition.EMAIL);
    } else if (response.status === "username taken") {
      document.getElementById('username-error-text').innerText = "username taken!";
    } else {
      setTransition(Transition.GENDER);
    }
  })
  .catch(error => console.log(error));
}

function handleGenderSelection(clickedBtn) {
  fetch('/api/auth/gender', {
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
  const continueBtn = document.getElementById('continue-btn');
  if (transition === Transition.EMAIL) {
    const emailText = document.getElementById('signup-email').value !== "";
    continueBtn.disabled = !emailText;
  } else if (transition === Transition.USERNAME_AND_PASS) {
    const usernameHasText = document.getElementById('signup-username').value !== "";
    const passwordHasText = document.getElementById('signup-password').value !== "";
    continueBtn.disabled = !usernameHasText || !passwordHasText;
  }
}

export default function SignupPopup() {
  
  const [transition, setTransition] = useState(Transition.EMAIL);
  const [email, setEmail] = useState("");

  return (
    <div id="signup-popup" style={{display:"none"}}
         onClick={(e) => {
          const signup = document.getElementById('signup-popup');
          if (e.target === signup && transition == Transition.EMAIL) {
            setTransition(Transition.EMAIL);
            signup.style.display = "none";
          }
         }}
      >
      <form className="form-container" onSubmit={(e) => {
        e.preventDefault();

        if (transition === Transition.EMAIL) {
          handleEmailContinue(setEmail, setTransition);
        } else if (transition === Transition.USERNAME_AND_PASS) {
          handleUsernamePassContinue(email, setTransition);
        }
      }}>
        <div className="popup-close-button"
             onClick={(e) => {
              setTransition(Transition.EMAIL);
              document.getElementById('signup-popup').style.display = "none";
             }}>
              X
            </div>
        <div className="popup-center-content">
          
          {transition === Transition.EMAIL &&
          <>
            <h2>Sign Up</h2>
            <p className="agree-to-text">By continuing you agree to not break any rules. Have fun!</p>
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
                <a href="#/" className="link pl-1" style={{color: "#5a8dfa"}}>
                  Log In
                </a>
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
                   onChange={(e) => {
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
                   onChange={(e) => {
                    document.getElementById('password-error-text').innerText = "";
                    handleTextChange(transition)
                   }}
              ></input>
            <span id="password-error-text" className="error-text"></span>
          </>
          }
          {transition == Transition.GENDER &&
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
          
          <div id="bottom-container">
            <button id="continue-btn"
                    className="form-control shadow-none"
                    disabled={true}
                    style={{display: transition === Transition.GENDER ? "none" : "block"  }}
                    >
                    Continue
            </button>
          </div>


        </div>
      </form>
    </div>
  );
}