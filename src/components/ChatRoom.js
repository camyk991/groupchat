import {collection, orderBy, limit, onSnapshot, getFirestore, addDoc, serverTimestamp, query, startAfter } from 'firebase/firestore';
import React, {useState, useEffect, useRef} from 'react';
import {getAuth } from "firebase/auth";
import ChatMessage from './ChatMessage';


export default function ChatRoom() {

    const LOAD_MORE_NUM = 5;

    const db = getFirestore();
    const auth = getAuth();

    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [all, setIfAll] = useState(false);
    const [limitValue, setLimitValue] = useState(25);
    let limitVal = 5;


    const goDown = useRef()
  
    useEffect(() => {
        let q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(limitValue));

        const unsub = onSnapshot(q, (doc) => {
          doc.docs.length + 1 > limitVal ? setIfAll(false) : setIfAll(true);
          setMessages(doc.docs.reverse().map(d => ({...d.data(), id: d.id})));
        });

        return unsub;
    }, [limitValue])

    
    useEffect(() => {
      // goDown.current.scrollIntoView({behavior: 'smooth'});
      
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

            <button className={all ? 'no-more' : 'more'} onClick={() => setLimitValue(limitValue + 5)}>load</button>
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