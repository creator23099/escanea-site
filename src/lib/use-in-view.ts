import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Fires once when the element enters the viewport, then disconnects.
 * Generic element type avoids the RefObject<HTMLElement> mismatch on section/div.
 *
 * Returns RefObject<T | null> rather than RefObject<T> because React 19's
 * useRef<T>(null) types the ref as T | null. Do not tighten this signature.
 */
export function useInView<T extends Element>(
  threshold = 0.1
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
