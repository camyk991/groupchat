import React, {useEffect, useState, useRef} from 'react';
import './App.css';

import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";

import {useAuthState} from 'react-firebase-hooks/auth';

import SignIn from './components/SignIn';
import SignOut from './components/SignOut'; 
import ChatRoom from './components/ChatRoom';


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
initializeApp(firebaseConfig);

const auth = getAuth();

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
       {user ? <SignOut /> : null}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
export default App;
