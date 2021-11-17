import {collection, orderBy, limit, onSnapshot, getFirestore, addDoc, serverTimestamp, query, startAfter } from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import React, {useState, useEffect, useRef} from 'react';
import {getAuth } from "firebase/auth";
import ChatMessage from './ChatMessage';


export default function ChatRoom() {

    const LOAD_MORE_NUM = 10;
    const NUMBER_OF_MESSAGES = 25;

    const db = getFirestore();
    const auth = getAuth();
    const storage = getStorage();

    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [all, setIfAll] = useState(false);
    const [limitValue, setLimitValue] = useState(NUMBER_OF_MESSAGES);

    const [blockAutoScroll, setBlockAutoScroll] = useState(false);
    const [media, setMedia] = useState([]);

    const goDown = useRef()
    const newMessages = useRef();

    let counter = 0;


    useEffect(() => {
        let q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(limitValue));

        const unsub = onSnapshot(q, (doc) => {
          doc.docs.length + 1 > limitValue ? setIfAll(false) : setIfAll(true);
          setMessages(doc.docs.reverse().map(d => ({...d.data(), id: d.id})));
        });

        return unsub;
    }, [limitValue])

    
    useEffect(() => {
      counter = 0;

      if (!blockAutoScroll)
        goDown.current.scrollIntoView({behavior: 'smooth'});
      else
        newMessages.current.scrollIntoView();

      setBlockAutoScroll(false);
    }, [messages])

      

    const sendMedia = async() => {

      const extension = media[0].name.split('.').pop();
      const storageRef = ref(storage, uuidv4() + '.' + extension) ;
    
      const snapshot = await uploadBytes(storageRef, media[0]);
      const url = await getDownloadURL(snapshot.ref);

      return url;
    }


    const sendMessage = async(e) => {
      e.preventDefault();
      const {uid, photoURL} = auth.currentUser;
      let mediaText

      if (media.length)
        mediaText = await sendMedia();
      else 
        mediaText = '';

      await addDoc(collection(db, "messages"), {
        "text": formValue,
        "createdAt": serverTimestamp(),
        "media": mediaText,
        uid,
        photoURL,
      });


      setMedia([]);
      setFormValue('');
    
      goDown.current.scrollIntoView({behavior: 'smooth'});
      console.log('Finished!')
    }

    const loadMessages = () => {
      // newMessages.current.scrollIntoView({behavior: 'smooth'})
      setBlockAutoScroll(true);
      setLimitValue(limitValue + LOAD_MORE_NUM);
    }

    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
  
    return (
      <>
        <main>
            <button className={all ? 'no-more' : 'more'} onClick={loadMessages}>load</button>
            {/* <section className={`loader-wrapper ${loader ? 'show' : 'hide'}`}>
              <span className="loader loader-quart"></span>
            </section> */}
            
              {messages && messages.map((el) => {
                ++counter;
                
                return (
                  <div key={el.id}>
                  {counter === LOAD_MORE_NUM ? <div className="anchor" ref={newMessages}></div> : null}
                  <ChatMessage
                    text={el.text}
                    uid={el.uid} 
                    photoURL={el.photoURL}
                    media={el.media}
                  />
                  </div>
                ) 
              }
              )}
  
          <div ref={goDown}></div>
        </main>
  
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <label className="attach-button" htmlFor="file">📷</label>
          <input id="file" type="file" accept="image/*" onChange={(e) => {
            setMedia(e.target.files);
          }}/>
          
          <button type="submit" disabled={ !formValue && !media[0]}>SEND</button>
        </form>
      </>
    )
  
   
  }