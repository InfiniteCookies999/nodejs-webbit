import { useContext } from "react";
import PostHeaderInfo from "./PostHeaderInfo";
import ReplyBox from "./ReplyBox";
import Votes from "./Votes";
import { UserContext } from "../../contexts/UserContext";
import { PopupContext, PopupType } from "../../contexts/PopupContext";
import styles from './Comment.module.css';

export default function Comment({ comment, addExtraPadding, setComments, repliesList, replyJumpsToThread }) {
  let replies = comment.replies;
  if (repliesList) {
    replies = replies.concat(repliesList);
  }

  const style = { paddingTop: "0.5rem" };
  if (addExtraPadding) {
    style.paddingLeft = "1rem";
  }
  
  const moreReplies = comment.remainingReplies !== undefined && comment.remainingReplies > 0;

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  return (
    <div id={"comment-" + comment.id} style={style} ref={comment.lastRef}>
      <PostHeaderInfo user={comment.User} timeStamp={comment.createdAt} />
      <div className={styles.commentIndent}>
        <p className={styles.commentBody}>{comment.content}</p>
        <Votes likes={comment.likes} dislikes={comment.dislikes}
               isLiked={comment.isLiked} isDisliked={comment.isDisliked}
               likeURI={`/api/comment/like/${comment.id}`}
               dislikeURI={`/api/comment/dislike/${comment.id}`} />
        <a href="#/" className="link" style={{display:"inline-block"}}
          onClick={() => {
            if (userContext.isLoggedIn) {
              if (replyJumpsToThread) {
                window.location.href = `/u/${comment.User.username}/comments/${comment.id}`;
              } else {
                document.getElementById('reply-box-' + comment.id).style.display = "block";
              }
            } else {
              popupContext.setPopup(currentPopup =>
                ({ ...currentPopup, stateType: PopupType.SIGNUP }));
            }
          }}>
          <i className="bx bx-comment pl-2"></i>
          <span className="pl-1">Reply</span>
        </a>
        {!replyJumpsToThread && <ReplyBox comment={comment} setComments={setComments} />}
        <div>
          {replies && replies.map(reply => 
              <Comment key={reply.id}
                       comment={reply}
                       addExtraPadding={true}
                       setComments={setComments} />)}
        </div>
        {moreReplies &&
          <div>
            <a href={`/u/${comment.User.username}/comments/${comment.id}`}
              className={`link ${styles.linkMoreComments}`} >
                + {comment.remainingReplies} more { comment.remainingReplies > 1 ? "replies" : "reply" } 
            </a>
          </div>
        }
      </div>
    </div>
  );
}