import "./PopupNextButton.css";

export default function PopupNextButton({ text, disabled }) {
  return (
    <div className="bottom-container center-padding">
      <button id="next-btn" className="form-control shadow-none" disabled={disabled}>
        {text}
      </button>
    </div>
  );
}