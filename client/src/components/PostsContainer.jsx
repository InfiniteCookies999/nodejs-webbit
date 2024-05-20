import { useEffect, useState, useRef } from "react";
import PostListElement from "./PostListElement";

export default function PostContainer() {

  const lastPostRef = useRef();

  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/posts/${pageNumber}`, { signal: controller.signal })
      .then(response => response.json())
      .then(posts => {
        console.log("NUMBER OF POSTS LEFT: ", posts.rows.length);
        if (posts.rows.length === 0) return;

        setPosts((currentPosts) =>
          currentPosts.concat(posts.rows));
      })
      .catch((error) => {
        console.log(error);
      });

      return () => {
        controller.abort();
      }
  }, [ pageNumber ]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setPageNumber((n) => n + 1);
    });
    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }
  }, [ posts ]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          <div className="App">
            {(posts.length <= 0) ? <span>Loading...</span>
              : posts.map((post, i, {length}) => {
                const isLast = i+1 === length;
                return <PostListElement key={post.id} post={post} lastRef={isLast ? lastPostRef : undefined} />;
              })
              }
          </div>
        </div>
        <div className="col-sm-3">
          
        </div>
      </div>
    </div>
  );
}