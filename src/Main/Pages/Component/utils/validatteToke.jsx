import { useEffect } from "react";
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
    const token = this.cookies.token;
    // console.log("Raw token from cookies:", token);

    if (!token) {
      console.log("No token found");
      this.removeCookie("token");
      this.navigate("/");
      return false;
    }

    try {
      const decodedToken = jwtDecode(token);
      //   console.log("Decoded token:", decodedToken);

      const currentTime = Date.now() / 1000;
      const isExpired = decodedToken.exp < currentTime;
      const hasRequiredFields =
        decodedToken._id && decodedToken.email && decodedToken.Role;

      //   console.log(
      //     `Validation - Expired: ${isExpired}, Fields: ${hasRequiredFields}`
      //   );

      if (isExpired || !hasRequiredFields) {
        // console.log("Token invalid - redirecting");
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

  useEffect(() => {
    authValidator.initialize(cookies, removeCookie, navigate);
  }, [cookies, removeCookie, navigate]);

  return authValidator;
};
