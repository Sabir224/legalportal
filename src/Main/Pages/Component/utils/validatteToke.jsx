import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

class AuthService {
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

  async validateToken() {
    try {
      const token = this.cookies?.token;

      if (!token) {
        console.log("No token found");
        this.redirectToLogin();
        return false;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check token expiration
      if (decodedToken.exp < currentTime) {
        console.log("Token expired");
        this.redirectToLogin();
        return false;
      }

      // Check required fields
      if (!decodedToken._id || !decodedToken.email || !decodedToken.Role) {
        console.log("Token missing required fields");
        this.redirectToLogin();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      this.redirectToLogin();
      return false;
    }
  }

  redirectToLogin() {
    this.removeCookie("token");
    this.navigate("/", {
      state: { from: window.location.pathname },
      replace: true,
    });
  }

  getTokenData() {
    try {
      const token = this.cookies?.token;
      if (!token) return null;
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
}

export const authService = new AuthService();

export const useAuth = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    authService.initialize(cookies, removeCookie, navigate);
  }, [cookies, removeCookie, navigate]);

  return {
    validateToken: authService.validateToken.bind(authService),
    getTokenData: authService.getTokenData.bind(authService),
    isAuthenticated: !!cookies.token,
  };
};
