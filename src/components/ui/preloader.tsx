import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const word = wordRef.current;
    const scan = scanRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    if (!container || !word || !scan || !topHalf || !bottomHalf) return;

    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setRemoved(true);
        onComplete();
      },
    });

    // Phase 1: Wordmark fades in letter by letter
    const letters = word.querySelectorAll(".preloader-letter");
    tl.set(letters, { autoAlpha: 0, y: 8 });
    tl.to(letters, {
      autoAlpha: 1,
      y: 0,
      duration: 0.06,
      stagger: 0.08,
      ease: "power2.out",
    }, 0.3);

    // Phase 2: Scan line sweeps across the wordmark, then vanishes
    tl.fromTo(scan,
      { left: "-10%", autoAlpha: 0 },
      { left: "110%", autoAlpha: 1, duration: 0.8, ease: "power2.inOut" },
      1.0
    );
    tl.to(scan, { autoAlpha: 0, duration: 0.15 });

    // Phase 3: Subtitle fades in
    tl.from(".preloader-sub", {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.out",
    }, 1.3);

    // Phase 4: Hold for a beat
    tl.to({}, { duration: 0.6 });

    // Phase 5: Everything fades and the halves split apart
    tl.to([word, ".preloader-sub"], {
      autoAlpha: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
    });

    tl.to(topHalf, {
      yPercent: -100,
      duration: 0.7,
      ease: "power3.inOut",
    }, "-=0.1");

    tl.to(bottomHalf, {
      yPercent: 100,
      duration: 0.7,
      ease: "power3.inOut",
    }, "<");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]">
      {/* Top half */}
      <div
        ref={topHalfRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-background"
      />
      {/* Bottom half */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-background"
      />

      {/* Centered content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {/* Wordmark with scan line */}
        <div className="relative">
          <div
            ref={wordRef}
            className="font-mono text-2xl font-bold tracking-[0.6em] text-amber uppercase sm:text-3xl"
          >
            {"ASTRAX".split("").map((ch, i) => (
              <span key={i} className="preloader-letter inline-block" style={{ opacity: 0 }}>
                {ch}
              </span>
            ))}
          </div>

          {/* Scan line */}
          <div
            ref={scanRef}
            className="pointer-events-none absolute top-0 h-full w-[2px]"
            style={{
              opacity: 0,
              background: "var(--color-amber)",
              boxShadow: "0 0 8px var(--color-amber), 0 0 20px var(--color-amber)",
            }}
          />
        </div>

        {/* Subtitle */}
        <div
          className="preloader-sub mt-3 font-mono text-[9px] tracking-[0.4em] text-foreground/20 uppercase"
          style={{ opacity: 0 }}
        >
          Deep Space Systems
        </div>
      </div>

      {/* Split line in the middle */}
      <div className="absolute inset-x-0 top-1/2 z-20 h-px bg-border/20" />
    </div>
  );
}
