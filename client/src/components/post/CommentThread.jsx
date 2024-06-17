import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostTop from './PostTop';
import './CommentThread.css';
import Comment from './Comment';
import useComments from '../hooks/useComments';

export default function CommentThread() {

  const { commentId } = useParams();

  const [post, setPost] = useState(undefined);
  const [comment, setComment] = useState(undefined);
  const [postId, setPostId] = useState(undefined);

  const [comments, setComments] = useComments(pageNumber =>
    `/api/comment/replies/page?commentId=${commentId}&pageNumber=${pageNumber}&useLargePages=true`,
    postId);

  useEffect(() => {
    if (!commentId) return;

    const controller = new AbortController();

    fetch(`/api/comment/${commentId}`, { signal: controller.signal })
      .then(response => response.json())
      .then(comment => {

        fetch(`/api/post/${comment.PostId}`, { signal: controller.signal })
          .then(response => response.json())
          .then(post => setPost(post))
          .catch(error => console.log(error));

        comment.replies = [];
        setComment(comment);
        setPostId(comment.PostId);

      })
      .catch(error => console.log(error));

  }, [ commentId ]);

  const linkToPost = !post || !comment ? '' : `/w/${comment.SubWebbit.name}/comments/${post.id}`;

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
              <div style={{display:'flex'}}>
                <a href='#/' className='full-dicussion-link link'>Single comment thread</a>
                <div style={{flex:1, padding:'0 0.8rem 0 0.8rem'}}>
                  <div className='full-discussion-line'></div>
                </div>
                <a href={linkToPost} className='full-dicussion-link link'>See full discussion</a>
              </div>
              {!comment || comments.length === 0 ? <h1>Loading...</h1> :
                <Comment key={comment.id}
                         comment={comment}
                         setComments={setComments}
                         addExtraPadding={false}
                         repliesList={comments} />
              }
            </div>
            }
        </div>
        <div className="col-sm-3">

        </div>
      </div>
    </div>
  );
}