import styles from "./PopupNextButton.module.css";
import commonStyles from './Popup.module.css';

export default function PopupNextButton({ text, disabled }) {
  return (
    <div className={`${commonStyles.bottomContainer} ${commonStyles.centerPadding}`}>
      <button id="next-btn" className={`form-control shadow-none ${styles.nextBtn}`} disabled={disabled}>
        {text}
      </button>
    </div>
  );
}