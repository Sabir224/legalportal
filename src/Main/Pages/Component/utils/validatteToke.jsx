import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
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

  // redirectToLogin() {
  //   this.removeCookie("token");
  //   this.navigate("/", {
  //     state: { from: window.location.pathname },
  //     replace: true,
  //   });
  // }



  redirectToLogin() {
    // Show only once
    if (this._logoutPopupShown || (Swal.isVisible && Swal.isVisible())) return;
    this._logoutPopupShown = true;

    const totalMs = 30 * 1000; // 30 seconds
    let intervalId;
    let loggedOut = false;

    const doLogout = () => {
      if (loggedOut) return;
      loggedOut = true;
      try { Swal.close(); } catch { }
      this.removeCookie("token");
      this.navigate("/", {
        state: { from: window.location.pathname },
        replace: true,
      });
    };

    // Auto-logout even if dialog is closed
    const logoutTimeout = setTimeout(doLogout, totalMs);

    Swal.fire({
      title: "Session ending",
      html: `You will be logged out in <b>${Math.ceil(totalMs / 1000)}</b> seconds.`,
      timer: totalMs,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: "Logout now",   // ✅ new option
      showCancelButton: true,
      cancelButtonText: "OK",            // ✅ simple OK
      reverseButtons: true,              // puts OK to the right (nice UX)
      didOpen: () => {
        const b = Swal.getHtmlContainer().querySelector("b");
        intervalId = setInterval(() => {
          const left = Swal.getTimerLeft?.();
          if (left != null && b) b.textContent = String(Math.ceil(left / 1000));
        }, 250);
      },
      willClose: () => {
        if (intervalId) clearInterval(intervalId);
        // (don't clear logoutTimeout; needed for auto-logout after OK)
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Logout now
        clearTimeout(logoutTimeout);
        doLogout();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        // Timer finished -> auto logout
        doLogout();
      }
      // If user clicked OK, we just wait for logoutTimeout to fire at 30s.
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
