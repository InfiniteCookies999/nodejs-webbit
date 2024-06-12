import Votes from './Votes';

export default function PostFooterInfo({ post }) {
  return (
    <div>
      <span className="footing rounded">
        <Votes likes={post.likes} dislikes={post.dislikes}
               isLiked={post.isLiked} isDisliked={post.isDisliked}
               likeURI={`/api/post/like/${post.id}`}
               dislikeURI={`/api/post/dislike/${post.id}`}
        />
      </span>
      <a href={`/w/${post.SubWebbit.name}/comments/${post.id}?viewReplies=true`}
         className="footing rounded link link-comment">
        <i className="bx bx-comment pr-1"></i>
        <span>{post.numComments}</span>
      </a>
    </div>
  );
}