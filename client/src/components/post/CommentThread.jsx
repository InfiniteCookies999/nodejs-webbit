import PageLayout from '../PageLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostTop from './PostTop';
import styles from './CommentThread.module.css';
import Comment from './Comment';
import useComments from '../hooks/useComments';

export default function CommentThread() {

  const { commentId } = useParams();

  const [post, setPost] = useState(undefined);
  const [comment, setComment] = useState(undefined);
  const [postId, setPostId] = useState(undefined);

  const [comments, setComments, noMoreComments] = useComments(pageNumber =>
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
    <PageLayout 
      middle={
        !post ? <h1>Loading...</h1> :
          <div>
            <PostTop post={post} />
            <br />
            <div style={{display:'flex'}}>
              <a href='#/' className={`${styles.fullDicussionLink} link`}>Single comment thread</a>
              <div style={{flex:1, padding:'0 0.8rem 0 0.8rem'}}>
                <div className={styles.fullDiscussionLine}></div>
              </div>
              <a href={linkToPost} className={`${styles.fullDicussionLink} link`}>See full discussion</a>
            </div>
            {!comment || (comments.length === 0 && !noMoreComments) ? <h1>Loading...</h1> :
              <Comment key={comment.id}
                        comment={comment}
                        setComments={setComments}
                        addExtraPadding={false}
                        repliesList={comments} />
            }
          </div>
      }
    />
  );
}