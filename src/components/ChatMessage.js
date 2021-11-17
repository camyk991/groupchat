import {getAuth} from "firebase/auth";

export default function ChatMessage({text, uid, photoURL, media}) {
    
  const auth = getAuth();

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      {media ? <img className="media-image" src={media}></img> : null}
     
      <div className="message-text">
        <img className="avatar" src={photoURL ? photoURL : 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-23.jpg'} />
        <p>{text}</p>
      </div>

    </div>
  )
}


