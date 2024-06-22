import { useContext } from 'react';
import { PopupContext, PopupType } from '../contexts/PopupContext';
import './PageLayout.css';
import { UserContext } from '../contexts/UserContext';

export default function PageLayout({ middle, right }) {

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  return (
    <div className="row">
      <div className="col-sm-3">
        <br />
        <div className='side-links ml-3' onClick={() =>{
          window.location.href = "/";
        }}>
          <span className="bx bx-home"></span>
          <span className="pl-1">Home</span>
        </div>
        <hr style={{margin:0}} className='mt-4' />
        <div id="communities" className='ml-3'>
          <div className="section-name">Communities</div>
          <div id="create-community-btn" className='side-links' onClick={() => {
            if (!userContext) return;
            if (!userContext.isLoggedIn) {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.SIGNUP }));
            } else {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.CREATE_COMMUNITY }));
            }
          }}>+ Create a community</div>
        </div>

      </div>
      <div className="col-sm-6">
        {middle}
      </div>
      <div className="col-sm-3">
        {right}
      </div>
    </div>
  )
}