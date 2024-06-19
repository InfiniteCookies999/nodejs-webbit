import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import "./Post.css";
import "../../index.css";
import Comment from "./Comment";
import PostTop from "./PostTop";
import { UserContext } from "../../contexts/UserContext";
import { PopupContext, PopupType } from "../../contexts/PopupContext";
import ReplyBox from "./ReplyBox";
import useComments from "../hooks/useComments";

export default function Post() {

  const { postId } = useParams();
  
  const [searchParams] = useSearchParams();

  const [post, setPost] = useState(undefined);

  const userContext = useContext(UserContext);
  const popupContext = useContext(PopupContext);

  const scrollStateRef = useRef(false);

  useEffect(() => {
    if (!postId) return;
    
    const controller = new AbortController();

    fetch(`/api/post/${postId}`, { signal: controller.signal })
      .then(response => response.json())
      .then(post => setPost(post))
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ postId ]);

  const [comments, setComments, noMoreComments] = useComments(
    pageNumber => `/api/comments?postId=${postId}&pageNumber=${pageNumber}`,
    postId);

  // scroll to the first comment if viewReplies is set to true.
  useEffect(() => {
    const commentContainer = document.getElementById("comment-container");
    if (scrollStateRef.current !== false) return;
    if (searchParams.get("viewReplies") !== "true") return;
    if (!commentContainer) return; // comment container not loaded yet.
    if (commentContainer.children.length <= 0) return; // no comments to scroll to.

    scrollStateRef.current = true;
    commentContainer.children[0].scrollIntoView();
  
  }, [ comments ]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          {post === undefined ? <h1>Loading...</h1> :
            <div>
              <PostTop post={post} subNameForPost={post.SubWebbit.name} />
              <br />

              {userContext.isLoggedIn ? 
              post.mayComment &&
              <ReplyBox setComments={setComments} />
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
              <div id="comment-container">
                {comments.length <= 0 ?
                  (noMoreComments ? <span>No Comments</span> : <span>Loading...</span>)
                  : comments.map(comment =>
                      <Comment key={comment.id}
                               comment={comment}
                               postId={postId}
                               addExtraPadding={false}
                               setComments={setComments} />)
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