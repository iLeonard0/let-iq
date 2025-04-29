import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectRoute({ children }) {
  const navigate = useNavigate();
  const {user} = useAuth()

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return children
}