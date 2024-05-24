import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import PostHeaderInfo from "./PostHeaderInfo";

export default function Post() {
  const { id, subname } = useParams();

  const [ post, setPost ] = useState(undefined);

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();

    fetch(`/api/post/comments/${id}`, { signal: controller.signal })
      .then(response => response.json())
      .then(post => setPost(post))
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ id ]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          <div>
            {!post ? <h1>Loading...</h1> :
              <div>
                <PostHeaderInfo subName={subname} timeStamp={post.createdAt} />
                <b>{post.title}</b>
                <p>{post.body}</p>
              </div>
            }
          </div>
        </div>
        <div className="col-sm-3">
          
        </div>
      </div>
    </div>
  );
}