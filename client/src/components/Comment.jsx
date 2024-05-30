import PostHeaderInfo from "./PostHeaderInfo";

export default function Comment({ comment, indentCount }) {
  const replies = comment.replies;
  
  const style = { paddingTop: "0.5rem" };
  if (indentCount !== 0) {
    style.paddingLeft = "1rem";
  }
  
  const moreReplies = comment.remainingReplies !== undefined && comment.remainingReplies > 0;

  return (
    <div id={comment.id} style={style} ref={comment.lastRef}>
      <PostHeaderInfo user={comment.User} timeStamp={comment.createdAt} />
      <div className="comment-indent">
        <p className="comment-body">{comment.content}</p>
        <a href="#/" className="bx bx-upvote link link-upvote" />
        <span className="pr-1 pl-1 comment-likes">{comment.likes}</span>
        <a href="#/" className="bx bx-downvote link link-downvote" />
        <a href="#/" className="link" style={{display:"inline-block"}}>
          <i className="bx bx-comment pl-2"></i>
          <span className="pl-1">Reply</span>
        </a>
        <div>
          {replies && replies.map(reply => 
            <Comment key={reply.id} comment={reply} indentCount={indentCount+1} />)}
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