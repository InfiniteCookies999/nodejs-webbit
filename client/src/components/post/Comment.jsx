import PostHeaderInfo from "./PostHeaderInfo";
import Votes from "./Votes";

export default function Comment({ comment, addExtraPadding }) {
  const replies = comment.replies;

  const style = { paddingTop: "0.5rem" };
  if (addExtraPadding) {
    style.paddingLeft = "1rem";
  }
  
  const moreReplies = comment.remainingReplies !== undefined && comment.remainingReplies > 0;

  return (
    <div id={comment.id} style={style} ref={comment.lastRef}>
      <PostHeaderInfo user={comment.User} timeStamp={comment.createdAt} />
      <div className="comment-indent">
        <p className="comment-body">{comment.content}</p>
        <Votes likes={comment.likes} dislikes={comment.dislikes}
               isLiked={comment.isLiked} isDisliked={comment.isDisliked}
               likeURI={`/api/comment/like/${comment.id}`}
               dislikeURI={`/api/comment/dislike/${comment.id}`} />
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