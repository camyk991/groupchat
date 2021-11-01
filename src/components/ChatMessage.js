import {getAuth} from "firebase/auth";

export default function ChatMessage({text, uid, photoURL}) {
    
    const auth = getAuth();

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL ? photoURL : 'https://graphicshop.net/public/img/no-user.png'} />
        <p>{text}</p>
      </div>
    )
  }