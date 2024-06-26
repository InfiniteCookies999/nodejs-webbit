import { PopupContext, PopupType } from '../../contexts/PopupContext';
import { useContext } from "react";
import SignupPopup from './SignupPopup';
import LoginPopup from './LoginPopup';
import CreateCommunityPopup from './CreateCommunityPopup';
import ChangeEmailPopup from './settings/ChangeEmailPopup';
import ChangePasswordPopup from './settings/ChangePasswordPopup';
import ChangeGenderPopup from './settings/ChangeGenderPopup';
import ChangeProfilePicPopup from './settings/ChangeProfilePicPopup';

export default function Popup() {
  
  const popupContext = useContext(PopupContext);

  switch (popupContext.stateType) {
  case PopupType.NONE:
    return;
  case PopupType.SIGNUP:
    return <SignupPopup />;
  case PopupType.LOGIN:
    return <LoginPopup />;
  case PopupType.CREATE_COMMUNITY:
    return <CreateCommunityPopup />;
  case PopupType.CHANGE_EMAIL:
    return <ChangeEmailPopup />;
  case PopupType.CHANGE_PASSWORD:
    return <ChangePasswordPopup />;
  case PopupType.CHANGE_GENDER:
    return <ChangeGenderPopup />;
  case PopupType.CHANGE_PROFILE_PIC:
    return <ChangeProfilePicPopup />;
}
}