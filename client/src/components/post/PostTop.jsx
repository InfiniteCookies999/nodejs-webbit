import PostHeaderInfo from "./PostHeaderInfo";
import PostFooterInfo from "./PostFooterInfo";

export default function PostTop({ post, subNameForPost }) {
  return (
    <>
      <PostHeaderInfo user={post.User} subNameForPost={subNameForPost} timeStamp={post.createdAt} />
      <h4><b>{post.title}</b></h4>
      <p className="post-body">{post.body}</p>
      <PostFooterInfo post={post} />
    </>
  );
}