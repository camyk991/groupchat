import {getAuth} from "firebase/auth";

export default function SignOut() {

    const auth = getAuth();
    return (
      <button onClick={() => auth.signOut()}>Sign out</button>
    )
  }