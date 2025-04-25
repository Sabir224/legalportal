import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAuthValidator } from "./validatteToke";

export const useGlobalTokenCheck = () => {
  const authValidator = useAuthValidator();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    let timeoutId;
    const debounceDelay = 1000; // 1 second debounce

    const handleInteraction = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        authValidator.validateToken();
      }, debounceDelay);
    };

    const events = ["click", "keydown", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, handleInteraction);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [cookies.token]);
};
