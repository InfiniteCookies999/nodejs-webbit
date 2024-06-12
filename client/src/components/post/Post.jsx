import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom"
import "./Post.css";
import "../../index.css";
import Comment from "./Comment";
import PostTop from "./PostTop";
import fetchReplies from "../../utils/fetchReplies";
import { UserContext } from "../../contexts/UserContext";
import { PopupContext, PopupType } from "../../contexts/PopupContext";

export default function Post() {

  const lastCommentRef = useRef();

  const { id } = useParams();

  const [post, setPost] = useState(undefined);

  const [comments, setComments] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [noComments, setNoComments] = useState(false);

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

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
  
  if (post !== undefined) {
    console.log(post);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          {post === undefined ? <h1>Loading...</h1> :
            <div>
              <PostTop post={post} />
              <br />

              {userContext !== undefined ? 
              post.mayComment &&
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
                <button id="comment-submit-btn"
                        className="form-control shadow-none"
                        onClick={() => {

                          const textArea = document.getElementById('comment-form-textarea');
                          const content = textArea.innerText;
                          if (content === "") return;

                          document.getElementById('comment-submit-btn').style.display = 'none';
                          document.getElementById('comment-cancel-btn').style.display = 'none';
                          
                          textArea.innerHTML = "";
                          
                          fetch('/api/comment', {
                            method: 'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              postId: id,
                              content
                            })
                          })
                          .then(response => {
                            if (response.status === 200) {
                              return response.json();
                            } else {
                              // redirect home page since most likely the post was deleted.
                              window.location.href = "/";
                            }
                          })
                          .then(comment => {
                            setComments((currentComments) => {
                              const newComments = [ ...currentComments ];
                              newComments.unshift(comment);
                              return newComments;
                            });
                          })
                          .catch(error => console.log(error));
                        }}>
                    Comment
                </button>
                <button id="comment-cancel-btn"
                      className="form-control shadow-none"
                      onClick={() => {
                        document.getElementById('comment-submit-btn').style.display = 'none';
                        document.getElementById('comment-cancel-btn').style.display = 'none';
                      }}>
                        Cancel
                </button>
              </div>
              : <button id="add-a-comment-nologin"
                        className="form-control rounded shadow-none"
                        onClick={() => {
                          popupContext.setPopup(currentPopup =>
                            ({ ...currentPopup, stateType: PopupType.SIGNUP }));
                        }}>
                  + Add a comment
                </button>
              }
              <br/>
              <div>
                {comments.length <= 0 ?
                  (noComments ? <span>No Comments</span> : <span>Loading...</span>)
                  : comments.map(comment =>
                      <Comment key={comment.id} comment={comment} addExtraPadding={false} />)
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