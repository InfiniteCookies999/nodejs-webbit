import PopupBase from "../PopupBase";
import { passwordPattern } from '../../../utils/validationPatterns';
import PopupNextButton from "../PopupNextButton";

function onTextChange(e) {
  const currentPasswordInput = document.getElementById('current-password-input');
  const newPasswordInput = document.getElementById('new-password-input');
  const newPasswordMatcherInput = document.getElementById('new-password-matcher-input');
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = currentPasswordInput.value === "" ||
    newPasswordInput.value === "" ||
    newPasswordMatcherInput.value === "";
  if (e.target === currentPasswordInput) {
    document.getElementById('current-password-error').innerHTML = "";
  }
  if (e.target === newPasswordInput) {
    document.getElementById('new-password-error').innerHTML = "";
  }
  if (e.target === newPasswordMatcherInput) {
    document.getElementById('new-password-matcher-error').innerHTML = "";
  }
}

export default function ChangePasswordPopup() {
  
  return <PopupBase content={
    <form onSubmit={(e) => {
      e.preventDefault();

      const currentPassword = document.getElementById('current-password-input').value;
      const newPassword = document.getElementById('new-password-input').value;
      const newPasswordMatcher = document.getElementById('new-password-matcher-input').value;
      const nextBtn = document.getElementById('next-btn');
      nextBtn.disabled = true;

      console.log("currentPassword: ", currentPassword);
      console.log("newPassword: ", newPassword);
      console.log("newPasswordMatcher: ", newPasswordMatcher);

      let isValid = true;
      if (!newPassword.match(passwordPattern)) {
        document.getElementById('new-password-error').innerHTML = "Invalid password";
        isValid = false; 
      }
      if (newPassword !== newPasswordMatcher) {
        document.getElementById('new-password-matcher-error').innerHTML = "New passwords must match";
        isValid = false;
      }
      if (!isValid) {
        nextBtn.disabled = false;
        return;
      }

      
      fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })
      .then(response => response.json())
      .then(response => {
        nextBtn.disabled = false;
        if (response.status === "wrong password") {
          document.getElementById('current-password-error').innerHTML = "Wrong password";
        } else {
          // The server logged the user out.
          window.location.href = "";
        }
      })
      .catch(error => {
        console.log(error);
        nextBtn.disabled = false;
      });


    }}>
      <input id="current-password-input" placeholder="Current password*" type="password" className="form-control" autoComplete="new-password"
        onChange={onTextChange} />
      <label id="current-password-error" className="error-label"></label>
      <br />
      <input id="new-password-input" placeholder="New Password*" type="password" className="form-control"
        onChange={onTextChange} />
      <label id="new-password-error" className="error-label"></label>
      <br />
      <input id="new-password-matcher-input" placeholder="New Password*" type="password" className="form-control"
        onChange={onTextChange} />
      <label id="new-password-matcher-error" className="error-label"></label>

      <PopupNextButton text={"Save"} disabled={true} />
    </form>
  }
  width={"26rem"} height={"22rem"}
  />;
}