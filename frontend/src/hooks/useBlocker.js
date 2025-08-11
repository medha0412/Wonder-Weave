// hooks/useBlocker.js
import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(blocker, when = true) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      blocker(() => push(...args));
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, blocker, when]);
}
