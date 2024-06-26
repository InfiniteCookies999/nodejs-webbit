import PostHeaderInfo from "./PostHeaderInfo";
import PostFooterInfo from "./PostFooterInfo";
import styles from './PostTop.module.css';

export default function PostTop({ post, subNameForPost }) {
  return (
    <>
      <PostHeaderInfo user={post.User}
                      subNameForPost={subNameForPost}
                      timeStamp={post.createdAt} />
      <h4><b>{post.title}</b></h4>
      <p className={styles.postBody}>{post.body}</p>
      {post.PostMedia.map(media => 
        <>
          <div id={styles.imageContainer}>
            <img src={`/static/uploads/posts/media/${media.file}`}
              style={{height:"100%", maxWidth:"calc(100% - 25px)"}}
            />
          </div>
          <br />
        </>
      )}
      <PostFooterInfo post={post} />
    </>
  );
}