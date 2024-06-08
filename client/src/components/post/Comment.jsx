import { useContext, useEffect, useState } from "react";
import PostHeaderInfo from "./PostHeaderInfo";
import { UserContext } from "../../contexts/UserContext";
import { PopupContext, PopupType } from "../../contexts/PopupContext";

export default function Comment({ comment, addExtraPadding }) {
  const replies = comment.replies;

  console.log("rendering?");

  useEffect(() => {
    console.log("comment prop changed?");
  }, [comment]);

  useEffect(() => {
    console.log("addExtraPadding prop changed?");
  }, [addExtraPadding]);
  
  const [votes, setVotes] = useState({
    total: comment.likes - comment.dislikes,
    isLiked: comment.usersThatLiked && comment.usersThatLiked.id,
    isDisliked: comment.usersThatDisliked && comment.usersThatDisliked.id
  });

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  const style = { paddingTop: "0.5rem" };
  if (addExtraPadding) {
    style.paddingLeft = "1rem";
  }
  
  const moreReplies = comment.remainingReplies !== undefined && comment.remainingReplies > 0;

  const upvoteStyle = {color: votes.isLiked ? "green" : ""};

  return (
    <div id={comment.id} style={style} ref={comment.lastRef}>
      <PostHeaderInfo user={comment.User} timeStamp={comment.createdAt} />
      <div className="comment-indent">
        <p className="comment-body">{comment.content}</p>
        <a href="#/"
           className={"bx link link-upvote " + (votes.isLiked ? "bxs-upvote" : "bx-upvote")}
           style={upvoteStyle}
           onClick={() => {
            if (!userContext) {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.SIGNUP }));
              return;
            }

            fetch(`/api/comment/like/${comment.id}`, {
              method: 'POST'
            })
            .then(response => {
              if (response.status == 200) {
                let newTotal = votes.total;
                if (votes.isDisliked) newTotal += 2;
                else if (votes.isLiked) newTotal -= 1;
                else newTotal += 1;
                setVotes({
                  total: newTotal,
                  isLiked: !votes.isLiked,
                  isDisliked: false
                });
              }
            });
        }} />
        <span className="pr-1 pl-1 comment-likes">{votes.total}</span>
        <a href="#/"
           className={"bx link link-downvote " + (votes.isDisliked ? "bxs-downvote" : "bx-downvote") }
           onClick={() => {
            if (!userContext) {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.SIGNUP }));
              return;
            }

            fetch(`/api/comment/dislike/${comment.id}`, {
              method: 'POST'
            })
            .then(response => {
              if (response.status == 200) {
                let newTotal = votes.total;
                if (votes.isLiked) newTotal -= 2;
                else if (votes.isDisliked) newTotal += 1;
                else newTotal -= 1;
                setVotes({
                  total: newTotal,
                  isDisliked: !votes.isDisliked,
                  isLiked: false
                });
              }
            });
           }}
           />
        <a href="#/" className="link" style={{display:"inline-block"}}>
          <i className="bx bx-comment pl-2"></i>
          <span className="pl-1">Reply</span>
        </a>
        <div>
          {replies && replies.map(reply => 
              <Comment key={reply.id} comment={reply} addExtraPadding={true} />)}
        </div>
        {moreReplies &&
          <div>
            <a href={`/u/${comment.User.username}/comments/${comment.id}`}
              className="link link-more-comments" >
                + {comment.remainingReplies} more { comment.remainingReplies > 1 ? "replies" : "reply" } 
            </a>
          </div>
        }
      </div>
    </div>
  );
}