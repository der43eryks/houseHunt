import { useEffect } from "react";

const AuthPage = () => {
  useEffect(() => {
    window.location.href = "http://localhost:3001/login";
  }, []);
  return null;
};

export default AuthPage;
