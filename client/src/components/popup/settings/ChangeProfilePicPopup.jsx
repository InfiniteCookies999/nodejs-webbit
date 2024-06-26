import { useContext } from "react";
import PopupBase from "../PopupBase";
import PopupNextButton from "../PopupNextButton";
import { UserContext } from "../../../contexts/UserContext";
import styles from './Settings.module.css';
import { PopupContext, PopupType } from "../../../contexts/PopupContext";

function dragFinished() {
  document.getElementById('profile-image-upload').style['border-style'] = 'dashed';
}

function onUploadImage(file) {
  const input = document.getElementById('file-input-holder');

  if (!file.type.startsWith('image/')) {
    return;
  }

  const imageView = document.getElementsByClassName(styles.imageUploadImage)[0];

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageView.src = reader.result;
  };
}

export default function ChangeProfilePicPopup() {

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  const profilePicture = userContext && userContext.profileFile ? `/static/uploads/users/profile_pictures/${userContext.profileFile}` :
      '/static/default_user_picture.jpg';

  return <PopupBase content={
    <form onSubmit={(e) => {
      e.preventDefault();

      const files = document.getElementById('file-input-holder').files;
      if (files.length === 0) {
        popupContext.setPopup(currentPopup =>
          ({ ...currentPopup, stateType: PopupType.NONE }));
        return;
      }

      const nextBtn = document.getElementById('next-btn');
      nextBtn.disabled = true;

      const file = files[0];

      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/user/profilePicture', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(() => {
        nextBtn.disabled = false;
        // Reload the page to update viewing the image.
        window.location.reload();
      })
      .catch(error => {
        console.log(error)
        nextBtn.disabled = false;
      });

    }}>
      <div id='profile-image-upload' className={styles.imageUpload} onClick={() => {
        const input = document.getElementById('file-input-holder');
        input.onchange = () => {
          onUploadImage(input.files[0]);
        };
        input.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        document.getElementById('profile-image-upload').style['border-style'] = 'solid';
      }}
      onDragEnd={dragFinished}
      onDragLeave={dragFinished}
      onDrop={(e) => {
        document.getElementById('profile-image-upload').style['border-style'] = 'dashed';
        e.preventDefault();
        const files = e.dataTransfer.files;
        onUploadImage(files[0]);
        const input = document.getElementById('file-input-holder');
        input.files = files;
      }}
      >
        <img className={`${styles.imageUploadImage} rounded-circle`} src={profilePicture} />
        <input id="file-input-holder" type="file" name="file-holder" hidden={true}/>
      </div>
      <PopupNextButton text={"Save"} />
    </form>
    }
    width={"26rem"} height={"30rem"}/>;
}