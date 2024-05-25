export default function PostFooterInfo() {
  return (
    <div>
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
  );
}