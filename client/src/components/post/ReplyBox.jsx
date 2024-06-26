import styles from './ReplyBox.module.css';

export default function ReplyBox({ comment, setComments }) {
  const qualifiedId = comment ? comment.id : 'post';
  
  const submitBtnId = 'comment-submit-btn-' + qualifiedId;
  const cancelBtnId = 'comment-cancel-btn-' + qualifiedId;

  const btnDisplayStyle = { display: comment ? 'block' : 'none' };

  const id = "reply-box-" + qualifiedId;

  return (
    <div id={id}
         className={styles.commentForm}
         style={{display: comment ? "none" : "block"}}>
      <div id={"comment-form-textarea-" + qualifiedId}
          type="text"
          role="textbox"
          placeholder="Add a comment"
          className={`input ${styles.commentFormTextarea}`}
          contentEditable={true}
          onInput={(e) => {
            const area = e.target;
            if (area.innerHTML.trim() === '<br>') {
              area.innerHTML = "";
            }
          }}
          onClick={() => {
            document.getElementById(submitBtnId).style.display = 'block';
            document.getElementById(cancelBtnId).style.display = 'block';
          }}
          >
      </div>
      <button id={submitBtnId}
              className={`form-control shadow-none ${styles.commentSubmitBtn}`}
              style={btnDisplayStyle}
              onClick={() => {

                const textArea = document.getElementById("comment-form-textarea-" + qualifiedId);
                const content = textArea.innerText;
                if (content === "") return;

                document.getElementById(id).style.display = 'none';

                textArea.innerHTML = "";
                
                // TODO: This should probably be changed if there are changes on the server
                // so that it either takes a replyId or a postId but not both.
                const payload = {
                  postId: comment.PostId,
                  content
                };
                if (comment) {
                  payload.replyId = comment.id;
                }

                fetch('/api/comment', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload)
                })
                .then(response => {
                  if (response.status === 200) {
                    return response.json();
                  } else {
                    // redirect home page since most likely the post was deleted.
                    window.location.href = "/";
                  }
                })
                .then(newComment => {
                  if (comment) {
                    comment.replies.unshift(newComment)
                    setComments((currentComments) =>
                      [ ...currentComments ]);
                  } else {
                    setComments((currentComments) => {
                      const newComments = [ ...currentComments ];
                      newComments.unshift(newComment);
                      return newComments;
                    });
                  }
                })
                .catch(error => console.log(error));
              }}>
          Comment
      </button>
      <button id={cancelBtnId}
            className={`form-control shadow-none ${styles.commentCancelBtn}`}
            style={btnDisplayStyle}
            onClick={() => {
              if (comment) {
                document.getElementById('reply-box-' + comment.id).style.display = 'none';
              } else {
                document.getElementById(submitBtnId).style.display = 'none';
                document.getElementById(cancelBtnId).style.display = 'none';
              }
            }}>
              Cancel
      </button>
    </div>
  );
}