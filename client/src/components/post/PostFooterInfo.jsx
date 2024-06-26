import Votes from './Votes';
import styles from './PostFooterInfo.module.css';

export default function PostFooterInfo({ post }) {
  return (
    <div>
      <span className={`${styles.footing} rounded`}>
        <Votes likes={post.likes} dislikes={post.dislikes}
               isLiked={post.isLiked} isDisliked={post.isDisliked}
               likeURI={`/api/post/like/${post.id}`}
               dislikeURI={`/api/post/dislike/${post.id}`}
        />
      </span>
      <a href={`/w/${post.SubWebbit.name}/comments/${post.id}?viewReplies=true`}
         className={`${styles.footing} rounded link ${styles.linkComment}`}>
        <i className="bx bx-comment pr-1"></i>
        <span>{post.numComments}</span>
      </a>
    </div>
  );
}