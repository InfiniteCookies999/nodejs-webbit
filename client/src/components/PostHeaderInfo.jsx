import getTimeAgo from "../utils/getTimeAgo";

export default function PostHeaderInfo({ subName,
                                         subCommunityPicture,
                                         timeStamp
                                        }) {
  const imgPath = subCommunityPicture ?
                  `/static/uploads/subwebbit/community_pictures/${subCommunityPicture}` :
                  '/static/default_sub_picture.jpg';
  return (
    <div>
      <img src={imgPath}
           className="rounded-circle"
           style={{width:"2rem", height:"2rem"}}></img>
      <a href="#/" className="pl-2 link link-sub smaller-heading">w/{subName}</a>
      <span className="pl-3 time-ago smaller-heading">{getTimeAgo(timeStamp)}</span>
    </div>
  );
}