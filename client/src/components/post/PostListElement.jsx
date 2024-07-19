import styles from "./PostListElement.module.css";
import PostHeaderInfo from "./PostHeaderInfo";
import PostFooterInfo from "./PostFooterInfo";

export default function PostListElement({ post, lastRef }) {
  let body = post.body;
  if (body.length > 500) {
    body = body.substr(0, 500);
    body += "...";
  }

  return (
    <div className={styles.postElement} ref={lastRef} onClick={() => {
      window.location.href = `/w/${post.SubWebbit.name}/comments/${post.id}`;
    }}>
      <div>
        <PostHeaderInfo
          sub={post.SubWebbit}
          timeStamp={post.createdAt}
        />
        <h2><b>{post.title}</b></h2>
        <p>{body}</p>
        <PostFooterInfo post={post} />
      </div>

    </div>
  );
}