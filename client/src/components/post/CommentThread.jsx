import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import PostTop from './PostTop';
import './CommentThread.css';
import fetchReplies from '../../utils/fetchReplies'
import Comment from './Comment';

async function loadRepliesPage(commentId, pageNumber, setNoReplies, abortController) {
  const response =
    await fetch(`/api/comment/replies/page?commentId=${commentId}&pageNumber=${pageNumber}&useLargePages=true`);
  const replyComments = await response.json();
  if (replyComments.rows.length === 0) {
    setNoReplies(true);
    return;
  }

  await fetchReplies(replyComments, abortController);
  
  return replyComments.rows;
}

export default function CommentThread() {
  const { commentId } = useParams();

  const lastCommentRef = useRef();

  const [post, setPost] = useState(undefined);
  const [comment, setComment] = useState(undefined);
  const [pageNumber, setPageNumber] = useState(0);
  const [noReplies, setNoReplies] = useState(false);

  useEffect(() => {
    if (!commentId) return;

    const controller = new AbortController();

    if (!comment) {
      fetch(`/api/comment/${commentId}`, { signal: controller.signal })
      .then(response => response.json())
      .then(comment => {
        
        fetch(`/api/post/${comment.PostId}`, { signal: controller.signal })
          .then(response => response.json())
          .then(post => setPost(post))
          .catch(error => console.log(error));

        (async () => {
          const commentReplies =
            await loadRepliesPage(commentId, pageNumber, setNoReplies, controller);
          comment.replies = commentReplies;
          comment.replies.at(-1).lastRef = lastCommentRef;
          setComment(comment);
        })();
      })
      .catch(error => console.log(error));
    } else {
      (async () => {
        const commentReplies =
          await loadRepliesPage(commentId, pageNumber, setNoReplies, controller);
        if (commentReplies) {
          setComment((currentComment) => {
            const newComment = { ...currentComment };
            newComment.replies.at(-1).lastRef = undefined;
            newComment.replies = currentComment.replies.concat(commentReplies);
            newComment.replies.at(-1).lastRef = lastCommentRef;
            return newComment;
          });
        }
      })();
    }

    return () => {
      controller.abort();
    }
  }, [ commentId, pageNumber ]);


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
  }, [ comment ]);

  const loading = !comment || !post;

  const linkToPost = loading ? '' : `/w/${comment.SubWebbit.name}/comments/${post.id}`;

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          {loading ? <h1>Loading...</h1> :
            <div>
              <PostTop post={post} />
              <br />
              <div style={{display:'flex'}}>
                <a href='#/' className='full-dicussion-link link'>Single comment thread</a>
                <div style={{flex:1, padding:'0 0.8rem 0 0.8rem'}}>
                  <div className='full-discussion-line'></div>
                </div>
                <a href={linkToPost} className='full-dicussion-link link'>See full discussion</a>
              </div>
              {!comment ? <h1>Loading...</h1> :
                <Comment key={comment.id} comment={comment} indentCount={0} />
              }
            </div>
            }
        </div>
        <div className="col-sm-3">

        </div>
      </div>
    </div>
  )
}