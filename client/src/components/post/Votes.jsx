import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { PopupContext, PopupType } from '../../contexts/PopupContext';
import styles from './Votes.module.css';

export default function Votes({ likes, dislikes,
                                isLiked, isDisliked,
                                likeURI, dislikeURI }) {
  
  const [votes, setVotes] = useState({
    total: likes - dislikes,
    isLiked,
    isDisliked
  });

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  const upvoteStyle = {color: votes.isLiked ? "green" : ""};
  
  return (<>
    <a href="#/"
       className={`bx link ${styles.linkUpvote} ` + (votes.isLiked ? "bxs-upvote" : "bx-upvote")}
       style={upvoteStyle}
       onClick={() => {
        if (!userContext.isLoggedIn) {
          popupContext.setPopup(currentPopup =>
            ({ ...currentPopup, stateType: PopupType.SIGNUP }));
          return;
        }

        let newTotal = votes.total;
        if (votes.isDisliked) newTotal += 2;
        else if (votes.isLiked) newTotal -= 1;
        else newTotal += 1;
        setVotes({
          total: newTotal,
          isLiked: !votes.isLiked,
          isDisliked: false
        });

        fetch(likeURI, { method: 'POST' });
       }}
       />
    <span className="pr-1 pl-1">{votes.total}</span>
    <a href="#/"
       className={`bx link ${styles.linkDownvote} ` + (votes.isDisliked ? "bxs-downvote" : "bx-downvote") }
       onClick={() => {
        if (!userContext.isLoggedIn) {
          popupContext.setPopup(currentPopup =>
            ({ ...currentPopup, stateType: PopupType.SIGNUP }));
          return;
        }

        let newTotal = votes.total;
        if (votes.isLiked) newTotal -= 2;
        else if (votes.isDisliked) newTotal += 1;
        else newTotal -= 1;
        setVotes({
          total: newTotal,
          isDisliked: !votes.isDisliked,
          isLiked: false
        });

        fetch(dislikeURI, { method: 'POST' });
       }}
       />
  </>);
}