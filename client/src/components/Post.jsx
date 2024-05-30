import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"
import "./Post.css";
import Comment from "./Comment";
import PostTop from "./PostTop";
import fetchReplies from "../utils/fetchReplies";

export default function Post() {

  const lastCommentRef = useRef();

  const { id } = useParams();

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

        (async () => {
          await fetchReplies(comments, controller);
          if (controller.signal.aborted) return;

          setComments((currentComments) => {
            let newComments = [ ...currentComments ];
            if (newComments.length > 0) {
              newComments.at(-1).lastRef = undefined;
            }
            
            newComments = newComments.concat(comments.rows);
            newComments.at(-1).lastRef = lastCommentRef;
            return newComments;
          });
        })();
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
              <PostTop post={post} />
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
                {comments.length <= 0 ?
                  (noComments ? <span>No Comments</span> : <span>Loading...</span>)
                  : comments.map(comment =>
                      <Comment comment={comment} indentCount={0} />)
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