import PostContainer from "./post/PostsContainer";

export default function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          <PostContainer />
        </div>
        <div className="col-sm-3">
          
        </div>
      </div>
    </div>
  );
}