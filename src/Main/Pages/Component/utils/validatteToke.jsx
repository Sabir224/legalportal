import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

class AuthValidator {
  constructor() {
    this.cookies = null;
    this.removeCookie = null;
    this.navigate = null;
  }

  initialize(cookies, removeCookie, navigate) {
    this.cookies = cookies;
    this.removeCookie = removeCookie;
    this.navigate = navigate;
  }

  validateToken() {
    const token = this.cookies?.token;

    if (!token) {
      // Delay a bit to ensure token is loaded (in case of refresh)
      setTimeout(() => {
        const retryToken = this.cookies?.token;
        if (!retryToken) {
          console.log("No token found after retry");
          this.removeCookie("token");
          this.navigate("/");
        } else {
          this.validateToken(); // try again
        }
      }, 3000);
      return false;
    }

    try {
      const decodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      const isExpired = decodedToken.exp < currentTime;
      const hasRequiredFields =
        decodedToken._id && decodedToken.email && decodedToken.Role;

      if (isExpired || !hasRequiredFields) {
        console.log("Token expired or missing fields");
        this.removeCookie("token");
        this.navigate("/");
        return false;
      }

      console.log("Token is valid");
      return true;
    } catch (error) {
      console.error("Token decoding failed:", error);
      this.removeCookie("token");
      this.navigate("/");
      return false;
    }
  }
}

export const authValidator = new AuthValidator();

export const useAuthValidator = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    authValidator.initialize(cookies, removeCookie, navigate);

    const interval = setInterval(() => {
      const result = authValidator.validateToken();
      if (result !== null) {
        setTokenChecked(true);
        clearInterval(interval);
      }
    }, 500); // check every 500ms until token is available

    return () => clearInterval(interval);
  }, [cookies, removeCookie, navigate]);

  return { validator: authValidator, tokenChecked };
};
