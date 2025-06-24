import { useEffect, useRef } from "react";

export function useFooterGlow(): React.RefObject<HTMLElement | null> {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const glow = document.getElementById("glow");

    if (!footer || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,195,255,0.15), transparent 70%)`;
    };

    const handleMouseLeave = () => {
      glow.style.background = `radial-gradient(circle at center, rgba(0,195,255,0.15), transparent 70%)`;
    };

    footer.addEventListener("mousemove", handleMouseMove);
    footer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      footer.removeEventListener("mousemove", handleMouseMove);
      footer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return footerRef;
}