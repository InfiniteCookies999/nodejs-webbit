import getTimeAgo from "../utils/getTimeAgo";

export default function PostHeaderInfo({ sub,
                                         user,
                                         subNameForPost,
                                         timeStamp
                                        }) {
  const imgPath = sub ? (
      sub.communityFile ? `/static/uploads/subwebbit/community_pictures/${sub.communityFile}` :
      '/static/default_sub_picture.jpg'
    ) : "/static/default_user_picture.jpg";

  const nameBlockStyle = {
    display:"inline-block"
  };
  if (subNameForPost) {
    nameBlockStyle.transform = "translate(0, 0.8rem)"
  }
  
  return (
    <div>
      <img src={imgPath}
           className="rounded-circle"
           style={{width:"2rem", height:"2rem"}}></img>
      <div style={nameBlockStyle}>
        <a href="#/" className="pl-2 link link-sub smaller-heading">
          {sub ? 'w/'+sub.name : subNameForPost ? 'w/'+subNameForPost : 'u/'+user.username}
        </a>
        {subNameForPost &&
          <a href="#/" className="pl-2 link smaller-heading post-username">{user.username}</a>}
      </div>
      
      <span className="pl-3 time-ago smaller-heading">{getTimeAgo(timeStamp)}</span>
    </div>
  );
}