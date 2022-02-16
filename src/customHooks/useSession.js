import { useState } from 'react';

export default function useSession() {
  const getSession = () => {
    const sessionDataString = localStorage.getItem('user_session_data');
    const userSession = JSON.parse(sessionDataString);
    return userSession ? userSession : null;
  };

  const [session, setSession] = useState(getSession());

  const saveSession = sessionUserData => {
    localStorage.setItem('user_session_data', JSON.stringify(sessionUserData));
    setSession(sessionUserData);
  };

  return {
    setSession: saveSession,
    session
  }
}