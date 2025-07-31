import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAuth } from './validatteToke';
import { useLocation } from 'react-router-dom';
import { isPublicRoute } from './utlis';

export const useGlobalTokenCheck = () => {
  const { validateToken } = useAuth();
  const [cookies] = useCookies(['token']);

  const location = useLocation();

  useEffect(() => {
    let timeoutId;
    const debounceDelay = 2000;

    // Skip logout validation for specific route
    const pathname = location.pathname;

    if (isPublicRoute(pathname)) return;

    const handleInteraction = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        validateToken();
      }, debounceDelay);
    };

    const events = ['click', 'keydown', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, handleInteraction));

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => document.removeEventListener(event, handleInteraction));
    };
  }, [location.pathname, cookies.token, validateToken]);
};
