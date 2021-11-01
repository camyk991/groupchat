import React, {useEffect, useState} from 'react';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {collection, orderBy, limit, doc, onSnapshot, getFirestore } from 'firebase/firestore';

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
const db = getFirestore();

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

const [messages, setMessages] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, "messages"), (doc) => {
      setMessages(doc.docs.map(d => ({...d.data(), id: d.id})));
    });
  }, [])


  console.log(messages);

  return (
    <div>
      {messages && messages.map((el) => 
        <ChatMessage text={el.text} id={el.id} />
      )}
    </div>
  )

 
}

function ChatMessage({text, id}) {
  

  return (
    <p>{text}</p>
  )
}

export default App;
