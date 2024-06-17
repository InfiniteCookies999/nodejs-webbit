import { useEffect, useRef, useState } from "react";
import fetchReplies from "../../utils/fetchReplies";

export default function useComments(urlCallback, postId) {
  
  const lastCommentRef = useRef();

  const [comments, setComments] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [noMoreComments, setNoMoreComments] = useState(false);

  useEffect(() => {
    if (!postId) return;
    
    const controller = new AbortController();

    fetch(urlCallback(pageNumber), { signal: controller.signal })
      .then(response => response.json())
      .then(comments => {
        if (comments.rows.length === 0) {
          setNoMoreComments(true);
          return;
        }

        (async () => {
          await fetchReplies(comments, controller);
          if (controller.signal.aborted) return;

          setComments((currentComments) => {
            let newComments = [ ...currentComments ];
            if (newComments.length > 0) {
              newComments.at(-1).lastRef = undefined;
            }
            
            newComments = newComments.concat(comments.rows);
            newComments.at(-1).lastRef = lastCommentRef;
            return [ ...new Set(newComments) ];
          });
        })();
      })
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ postId, pageNumber ]);

  useEffect(() => {
    
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setPageNumber((n) => n + 1);
    });

    if (lastCommentRef.current) {
      observer.observe(lastCommentRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [ comments ]);

  return [comments, setComments, noMoreComments];
}