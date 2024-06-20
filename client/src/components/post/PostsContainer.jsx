import { useEffect, useState, useRef } from "react";
import PostListElement from "./PostListElement";

export default function PostContainer({ userId, subname }) {

  const lastPostRef = useRef();

  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    let URL = `/api/posts/${pageNumber}`;
    if (userId) {
      URL += "?userId=" + userId;
    }
    if (subname) {
      URL += "?subname=" + subname;
    }

    fetch(URL, { signal: controller.signal })
      .then(response => response.json())
      .then(posts => {
        if (posts.rows.length === 0) return;

        setPosts((currentPosts) =>
          currentPosts.concat(posts.rows));
      })
      .catch(error => console.log(error));

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
    <div>
      {(posts.length <= 0) ? <span>Loading...</span>
        : posts.map((post, i, {length}) => {
          const isLast = i+1 === length;
          return <PostListElement key={post.id} post={post} lastRef={isLast ? lastPostRef : undefined} />;
        })
        }
    </div>
  );
}