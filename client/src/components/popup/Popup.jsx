import { PopupContext, PopupType } from '../../contexts/PopupContext';
import { useContext } from "react";
import SignupPopup from './SignupPopup';
import LoginPopup from './LoginPopup';
import CreateCommunityPopup from './CreateCommunityPopup';

export default function Popup() {
  
  const popupContext = useContext(PopupContext);

  if (popupContext.stateType === PopupType.NONE) {
    return;
  } else if (popupContext.stateType === PopupType.SIGNUP) {
    return <SignupPopup />
  } else if (popupContext.stateType === PopupType.LOGIN) {
    return <LoginPopup />
  } else if (popupContext.stateType === PopupType.CREATE_COMMUNITY) {
    return <CreateCommunityPopup />
  }
}