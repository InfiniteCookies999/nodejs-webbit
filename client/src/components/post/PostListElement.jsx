import "./PostListElement.css";
import PostHeaderInfo from "./PostHeaderInfo";
import PostFooterInfo from "./PostFooterInfo";

export default function PostListElement({ post, lastRef }) {
  let body = post.body;
  if (body.length > 500) {
    body = body.substr(0, 500);
    body += "...";
  }

  const postLink = `/w/${post.SubWebbit.name}/comments/${post.id}`;
  return (
    <div className="post rounded" ref={lastRef}>
      <a href={postLink} className="link">
        <div>
          <PostHeaderInfo
            sub={post.SubWebbit}
            timeStamp={post.createdAt}
          />
          <h2><b>{post.title}</b></h2>
          <p>{body}</p>
          <PostFooterInfo />
        </div>
      </a>
    </div>
  );
}