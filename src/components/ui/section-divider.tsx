import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Animated section divider that draws from center outward on scroll.
 * Replaces the static border-t between sections.
 */
export function SectionDivider({ color = "amber" }: { color?: "amber" | "teal" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const line = lineRef.current;
    const glow = glowRef.current;
    if (!line || !glow) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        once: true,
      },
    });

    // Line draws from center outward
    tl.fromTo(line,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power2.inOut" }
    );

    // Glow pulse at the center, then fades
    tl.fromTo(glow,
      { autoAlpha: 0, scaleX: 0.3 },
      { autoAlpha: 1, scaleX: 1, duration: 0.3, ease: "power2.out" },
      0.1
    );
    tl.to(glow, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 0.5);
  }, { scope: containerRef });

  const colorVar = color === "teal" ? "var(--color-teal)" : "var(--color-amber)";

  return (
    <div ref={containerRef} className="relative my-8 h-px w-full">
      {/* Base line */}
      <div
        ref={lineRef}
        className="absolute inset-0 origin-center"
        style={{
          transform: "scaleX(0)",
          background: `linear-gradient(90deg, transparent, oklch(0.2 0.01 250), oklch(0.2 0.01 250), transparent)`,
        }}
      />
      {/* Center glow flash */}
      <div
        ref={glowRef}
        className="absolute inset-0 origin-center"
        style={{
          opacity: 0,
          background: `linear-gradient(90deg, transparent 20%, ${colorVar} 50%, transparent 80%)`,
          boxShadow: `0 0 10px ${colorVar}`,
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
