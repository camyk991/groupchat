import {collection, orderBy, limit, onSnapshot, getFirestore, addDoc, serverTimestamp, query } from 'firebase/firestore';
import React, {useState, useEffect, useRef} from 'react';
import {getAuth } from "firebase/auth";
import ChatMessage from './ChatMessage';


export default function ChatRoom() {

    const db = getFirestore();
    const auth = getAuth();

    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
  
    const goDown = useRef()
  
  
    useEffect(() => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(25));
  
      const unsub = onSnapshot(q, (doc) => {
        console.log(doc.docs);
        setMessages(doc.docs.reverse().map(d => ({...d.data(), id: d.id})));
      });
      return unsub;
    }, [])
  
    useEffect(() => {
      goDown.current.scrollIntoView({behavior: 'smooth'});
    }, [messages])
  
  const sendMessage = async(e) => {
    e.preventDefault();
  
    const {uid, photoURL} = auth.currentUser;
  
    await addDoc(collection(db, "messages"), {
      "text": formValue,
      "createdAt": serverTimestamp(),
      uid,
      photoURL
    });
  
    setFormValue('');
  
    goDown.current.scrollIntoView({behavior: 'smooth'});
  }
  
    return (
      <>
        <main>
          {messages && messages.map((el) => 
            <ChatMessage text={el.text} key={el.id} uid={el.uid} photoURL={el.photoURL} />
          )}
  
          <div ref={goDown}></div>
        </main>
  
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <button type="submit" disabled={!formValue}>SEND</button>
        </form>
      </>
    )
  
   
  }