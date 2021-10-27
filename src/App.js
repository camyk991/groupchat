import React from 'react';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {collection, orderBy, limit} from 'firebase/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIrvHT5zZmVnVLm6gxmq_6GupDNzBY43o",
  authDomain: "groupchat-74da5.firebaseapp.com",
  projectId: "groupchat-74da5",
  storageBucket: "groupchat-74da5.appspot.com",
  messagingSenderId: "987776055598",
  appId: "1:987776055598:web:19447a9db938a0b55322bf",
  measurementId: "G-4YZKWJ6X7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
       
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);

  }

  return(
    <button onClick={signInWithGoogle}>Sign in with google</button>

  )
}

function SignOut() {
  return (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom() {

  const messagesRef = collection(db, 'messages');
  const query = messagesRef.orderBy('createdAd').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'})

  return(
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} />)}
      </div>
    </>
  )
}

function ChatMessage(props) {
  const {test, uid} = props.message;

  return <p></p>
}

export default App;
