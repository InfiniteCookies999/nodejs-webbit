import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"
import PostHeaderInfo from "./PostHeaderInfo";
import "./Post.css";
import PostFooterInfo from "./PostFooterInfo";

export default function Post() {

  const lastCommentRef = useRef();

  const { id, subname } = useParams();

  const [post, setPost] = useState(undefined);

  const [comments, setComments] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [noComments, setNoComments] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();

    fetch(`/api/post/${id}`, { signal: controller.signal })
      .then(response => response.json())
      .then(post => setPost(post))
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ id ]);

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();

    fetch(`/api/comments?postId=${id}&pageNumber=${pageNumber}`, { signal: controller.signal })
      .then(response => response.json())
      .then(comments => {
        if (comments.rows.length === 0) {
          setNoComments(true);
          return;
        }

        setComments((currentComments) =>
          currentComments.concat(comments.rows));
      })
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ id, pageNumber ]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setPageNumber((n) => n + 1);
    });
    if (lastCommentRef.current) {
      observer.observe(lastCommentRef.current);
    }
  }, [ comments ]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          {!post ? <h1>Loading...</h1> :
            <div>
              <PostHeaderInfo user={post.User} subNameForPost={subname} timeStamp={post.createdAt} />
              <h4><b>{post.title}</b></h4>
              <p className="post-body">{post.body}</p>
              <PostFooterInfo />
              <br />
              <div className="comment-form">
                <div id="comment-form-textarea"
                     type="text"
                     role="textbox"
                     placeholder="Add a comment"
                     className="input edit-box form-control shadow-none"
                     contentEditable={true}
                     onInput={(e) => {
                       const area = e.target;
                       if (area.innerHTML.trim() === '<br>') {
                        area.innerHTML = "";
                       }
                     }}
                     onClick={(e) => {
                       document.getElementById('comment-submit-btn').style.display = 'block';
                       document.getElementById('comment-cancel-btn').style.display = 'block';
                     }}
                     >
                </div>
                <button id="comment-submit-btn" className="form-control shadow-none">Comment</button>
                <button id="comment-cancel-btn"
                      className="form-control shadow-none"
                      onClick={() => {
                        document.getElementById('comment-submit-btn').style.display = 'none';
                        document.getElementById('comment-cancel-btn').style.display = 'none';
                      }}>
                        Cancel
                      </button>
              </div>
              <br/>
              <div>
                {comments.length <= 0 ? noComments ? <span>No Comments</span> : <span>Loading...</span>
                  : comments.map((comment, i, {length}) => {
                    const isLast = i+1 === length;

                    return (
                      <div id={comment.id} style={{"padding-top":"0.5rem"}} ref={isLast ? lastCommentRef : undefined}>
                        <PostHeaderInfo user={comment.User} timeStamp={comment.createdAt} />
                        <p className="comment-indent comment-body">{comment.content}</p>
                        <a href="#/" className="bx bx-upvote link link-upvote comment-indent" />
                        <span className="pr-1 pl-1 comment-indent comment-likes">{comment.likes}</span>
                        <a href="#/" className="bx bx-downvote link link-downvote comment-indent" />
                        <a href="#/" className="comment-indent link" style={{display:"inline-block"}}>
                          <i  className="bx bx-comment pl-2"></i>
                          <span className="pl-1">Reply</span>
                        </a>
                      </div>
                    );
                  })
                }
              </div>

            </div>
          }
        </div>
        <div className="col-sm-3">
          
        </div>
      </div>
    </div>
  );
}