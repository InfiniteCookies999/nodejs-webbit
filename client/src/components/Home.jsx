import PageLayout from "./PageLayout";
import PostContainer from "./post/PostsContainer";

export default function Home() {
  return <PageLayout middle={<PostContainer />} />;
}