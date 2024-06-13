import PostHeaderInfo from "./PostHeaderInfo";
import PostFooterInfo from "./PostFooterInfo";
import './PostTop.css';

export default function PostTop({ post, subNameForPost }) {
  return (
    <>
      <PostHeaderInfo user={post.User}
                      subNameForPost={subNameForPost}
                      timeStamp={post.createdAt} />
      <h4><b>{post.title}</b></h4>
      <p className="post-body">{post.body}</p>
      {post.PostMedia.map(media => 
        <>
          <div id="image-container">
            <div id="background-blur"></div>
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