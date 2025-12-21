import {useEffect, useState} from "react";

export function useScrollThreshold(threshold = 40) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > threshold;

      setPassed(prev => (prev !== next ? next : prev));
    };

    window.addEventListener("scroll", onScroll, {passive: true});
    onScroll()
    
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return passed;
}
