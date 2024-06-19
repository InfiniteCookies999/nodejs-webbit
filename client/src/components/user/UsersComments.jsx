import { useEffect, useState, useRef } from "react";
import Comment from '../post/Comment';

export default function UsersComments({ user }) {

  const lastCommentRef = useRef();

  const [comments, setComments] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    console.log("adding comments!");

    fetch(`/api/comments?userId=${user.id}&pageNumber=${pageNumber}`, { signal: controller.signal })
      .then(response => response.json())
      .then(comments => {
        if (comments.rows.length === 0) return;


        setComments((currentComments) => {
          let newComments = [ ...currentComments ];
          if (newComments.length > 0) {
            newComments.at(-1).lastRef = undefined;
          }
          
          newComments = newComments.concat(comments.rows);
          newComments.at(-1).lastRef = lastCommentRef;
          return [ ...new Set(newComments.map(c => ({ replies: [], ...c }))) ];
        });
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
    if (lastCommentRef.current) {
      observer.observe(lastCommentRef.current);
    }
  }, [ comments ]);

  return (
    <div>
      {!comments ? <span>Loading...</span> :
        comments.map(comment => (
          <div key={comment.id} style={{backgroundColor:"#f5f5f5", marginTop:"1rem"}} className="rounded">
            <Comment comment={comment} addExtraPadding={true} />
          </div>
        ))}
    </div>
  )
}