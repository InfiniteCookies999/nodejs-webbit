import { useCallback, useContext } from 'react';
import { PopupContext, PopupType } from '../../contexts/PopupContext';
import styles from './PopupBase.module.css';
import commonStyles from './Popup.module.css';

export default function PopupBase({ onBackgroundClicked, onCloseButton, content, width, height }) {
  const style = {};
  if (width) {
    style.width = width;
  }
  if (height) {
    style.height = height;
  }

  const popupContext = useContext(PopupContext);

  const closeCallback = useCallback(() => {
    popupContext.setPopup(currentPopup =>
      ({ ...currentPopup, stateType: PopupType.NONE }));
  });
  
  return (
    <div id={styles.popup} onClick={(e) => {
      const popup = document.getElementById(styles.popup);
      if (e.target === popup) {
        if (onBackgroundClicked) {
          onBackgroundClicked(e);
        } else {
          closeCallback();
        }
      }
    }}>
      <div id={styles.popupContainer} style={style}>
        <div id={styles.popupCloseButton} onClick={onCloseButton ? onCloseButton : closeCallback}>
              X
            </div>
        <div className={commonStyles.centerPadding} style={{height: "100%"}}>
          {content}
        </div>
      </div>
    </div>
  );
}