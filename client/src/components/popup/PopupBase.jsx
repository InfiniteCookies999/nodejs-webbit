import './PopupBase.css';

export default function PopupBase({ onBackgroundClicked, onCloseButton, content }) {
  return (
    <div id="popup" onClick={(e) => {
      const popup = document.getElementById('popup');
      if (e.target === popup) {
        onBackgroundClicked(e);
      }
    }}>
      <div id="popup-container">
        <div id="popup-close-button" onClick={onCloseButton}>
              X
            </div>
        <div className='center-padding' style={{height: "100%"}}>
          {content}
        </div>
      </div>
    </div>
  );
}