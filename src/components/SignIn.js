import {getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export default function SignIn() {

    const auth = getAuth();

    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
  
    }
  
    return(
      <button onClick={signInWithGoogle}>Sign in with google</button>
  
    )
  }