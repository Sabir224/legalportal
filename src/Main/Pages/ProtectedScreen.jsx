import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decodeAndValidateToken } from "./Component/utils/utlis";

const ProtectedScreen = ({ token, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const { isValid } = decodeAndValidateToken(token);
    if (!isValid) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) return null;

  const { isValid } = decodeAndValidateToken(token);
  if (!isValid) return null;

  return children;
};

export default ProtectedScreen;
