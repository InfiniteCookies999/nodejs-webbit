import { useCallback, useContext } from 'react';
import './PopupBase.css';
import { PopupContext, PopupType } from '../../contexts/PopupContext';

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
    <div id="popup" onClick={(e) => {
      const popup = document.getElementById('popup');
      if (e.target === popup) {
        if (onBackgroundClicked) {
          onBackgroundClicked(e);
        } else {
          closeCallback();
        }
      }
    }}>
      <div id="popup-container" style={style}>
        <div id="popup-close-button" onClick={onCloseButton ? onCloseButton : closeCallback}>
              X
            </div>
        <div className='center-padding' style={{height: "100%"}}>
          {content}
        </div>
      </div>
    </div>
  );
}