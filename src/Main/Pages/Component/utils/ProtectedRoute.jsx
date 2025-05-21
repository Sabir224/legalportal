// import { useCookies } from "react-cookie";
// import { useAuthValidator } from "./validatteToke";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element }) => {
//   const authValidator = useAuthValidator();
//   const [cookies] = useCookies(["token"]);

//   // Validate token on initial render and when token changes
//   const isAuthenticated = authValidator.validateToken();

//   return isAuthenticated ? element : <Navigate to="/" replace />;
// };
