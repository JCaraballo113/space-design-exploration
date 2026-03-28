import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Counter data ─── */

const counters = [
  { value: 47, label: "MISSIONS COMPLETED", suffix: "" },
  { value: 2.4, label: "BILLION KM TRAVELED", suffix: "B", decimals: 1 },
  { value: 186, label: "CREW DEPLOYED", suffix: "" },
  { value: 99.7, label: "SYSTEMS UPTIME", suffix: "%", decimals: 1 },
];

/* ─── Animated counter ─── */

function Counter({ value, suffix, decimals = 0, active }: {
  value: number;
  suffix: string;
  decimals?: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!active) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 2.0,
      ease: "power2.out",
      onUpdate: () => {
        setDisplay(decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toString());
      },
    });

    return () => { tween.kill(); };
  }, [active, value, decimals]);

  return (
    <span>
      {display}
      {suffix && <span className="text-amber/70">{suffix}</span>}
    </span>
  );
}

/* ─── Main section ─── */

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => setActive(true),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-background py-12">
      {/* Subtle top/bottom lines */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, oklch(0.2 0.01 250), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, oklch(0.2 0.01 250), transparent)" }} />

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-8 sm:grid-cols-4 lg:px-12 xl:px-20">
        {counters.map((c) => (
          <div key={c.label} className="text-center">
            <div
              className="font-mono text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-foreground/80"
              style={{
                textShadow: active ? "0 0 20px oklch(0.82 0.16 75 / 0.15)" : "none",
                transition: "text-shadow 1s ease-out",
              }}
            >
              <Counter
                value={c.value}
                suffix={c.suffix}
                decimals={c.decimals}
                active={active}
              />
            </div>
            <div className="mt-1 font-mono text-[8px] tracking-[0.25em] text-foreground/25 uppercase sm:text-[9px]">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
