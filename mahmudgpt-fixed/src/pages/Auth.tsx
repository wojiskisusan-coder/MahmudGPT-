// Auth page removed — app no longer requires login.
// This file kept to prevent broken imports; it redirects to home.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/"); }, [navigate]);
  return null;
};

export default Auth;
