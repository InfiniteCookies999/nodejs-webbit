import "./PostListElement.css";

export default function PostListElement({ post, lastRef }) {
  let body = post.body;
  if (body.length > 500) {
    body = body.substr(0, 500);
    body += "...";
  }
  return (
    <div className="post rounded" ref={lastRef}>
      <div>
        <h2><b>{post.title}</b></h2>
        <p>{body}</p>
        <span className="footing rounded">
          <a href="#/" className="bx bx-upvote link link-upvote pr-1" />
          <span className="pr-1">0</span>
          <a href="#/" className="bx bx-downvote link link-downvote" />
        </span>
        <a href="#/" className="footing rounded link link-comment">
          <i className="bx bx-comment pr-1"></i>
          <span>0</span>
        </a>
      </div>
    </div>
  );
}