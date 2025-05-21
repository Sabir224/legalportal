import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAuth } from "./validatteToke";

export const useGlobalTokenCheck = () => {
  const { validateToken } = useAuth();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    let timeoutId;
    const debounceDelay = 1000;

    const handleInteraction = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        validateToken();
      }, debounceDelay);
    };

    const events = ["click", "keydown", "touchstart"];
    events.forEach((event) =>
      document.addEventListener(event, handleInteraction)
    );

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) =>
        document.removeEventListener(event, handleInteraction)
      );
    };
  }, [cookies.token, validateToken]);
};
