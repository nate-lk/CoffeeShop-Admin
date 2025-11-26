import { useEffect } from "react";

export default function useClickGuard(delay = 300) {
  useEffect(() => {
    let locked = false;

    const handler = (e) => {
      if (locked) {
        e.stopImmediatePropagation();
        e.preventDefault();
      } else {
        locked = true;
        setTimeout(() => { locked = false; }, delay);
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [delay]);
}
