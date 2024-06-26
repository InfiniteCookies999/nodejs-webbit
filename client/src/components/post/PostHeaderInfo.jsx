import getTimeAgo from "../../utils/getTimeAgo";
import styles from './PostHeaderInfo.module.css';

export default function PostHeaderInfo({ sub,
                                         user,
                                         subNameForPost,
                                         timeStamp
                                        }) {
  
  const imgPath = sub ? (
      sub.communityFile ? `/static/uploads/subwebbit/community_pictures/${sub.communityFile}` :
      '/static/default_sub_picture.jpg'
    ) : (
      user.profileFile ? `/static/uploads/users/profile_pictures/${user.profileFile}` :
      '/static/default_user_picture.jpg'
    );

  const subOrUserTag = sub ? `w/${sub.name}` : (subNameForPost ? `w/${subNameForPost}` : `u/${user.username}`);

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
        <a href={"/"+subOrUserTag} className={`pl-2 link ${styles.linkHighlight} ${styles.smallerHeading}`}>
          {subOrUserTag}
        </a>
        {subNameForPost &&
          <a href={`/u/${user.username}`} className={`pl-2 link ${styles.linkHighlight} ${styles.smallerHeading} ${styles.postUsername}`}>{user.username}</a>}
      </div>
      
      <span className={`pl-3 time-ago ${styles.smallerHeading}`}>{getTimeAgo(timeStamp)}</span>
    </div>
  );
}