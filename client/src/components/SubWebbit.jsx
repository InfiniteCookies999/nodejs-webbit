import PageLayout from "./PageLayout";
import { useParams } from "react-router-dom";
import PostContainer from "./post/PostsContainer";
import './SubWebbit.css';
import { useEffect, useState } from "react";

export default function SubWebbit() {

  const { subname } = useParams();
  const [sub, setSub] = useState(undefined);

  useEffect(() => {
    if (!subname) return;

    const controller = new AbortController();

    fetch(`/api/subwebbit/${subname}`, { signal: controller.signal })
      .then(response => response.json())
      .then(sub => setSub(sub))
      .catch(error => console.log(error));

    return () => {
      controller.abort();
    }
  }, [ subname ]);

  let subCommunityFileLink = "";
  if (sub) {
    subCommunityFileLink = sub.communityFile ? `/static/uploads/subwebbit/community_pictures/${sub.communityFile}` :
        '/static/default_sub_picture.jpg'
  }

  return (
    <PageLayout middle={
      <>
        <br />
        {!sub ? <h1>Loading...</h1> :
          <>
            <div id="sub-header">
              <img src={subCommunityFileLink} className="rounded-circle" id="sub-image" />
              <span>{"w/"+subname}</span>
            </div>
            <PostContainer subname={subname} />
          </>
        }
      </>
    } />
  );
}