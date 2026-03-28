import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TRAIL_COUNT = 6;

function CursorTrail({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || dotsRef.current.length === 0) return;

    // Lead dot uses quickTo for smooth chasing
    const leadX = gsap.quickTo(dotsRef.current[0], "x", { duration: 0.15, ease: "power2.out" });
    const leadY = gsap.quickTo(dotsRef.current[0], "y", { duration: 0.15, ease: "power2.out" });

    // Trailing dots chase the one ahead with increasing lag
    const trailXs: gsap.QuickToFunc[] = [];
    const trailYs: gsap.QuickToFunc[] = [];
    for (let i = 1; i < TRAIL_COUNT; i++) {
      trailXs.push(gsap.quickTo(dotsRef.current[i], "x", { duration: 0.2 + i * 0.08, ease: "power2.out" }));
      trailYs.push(gsap.quickTo(dotsRef.current[i], "y", { duration: 0.2 + i * 0.08, ease: "power2.out" }));
    }

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      leadX(x);
      leadY(y);

      // Each trailing dot follows the lead position with its own lag
      for (let i = 0; i < trailXs.length; i++) {
        trailXs[i](x);
        trailYs[i](y);
      }
    };

    const onEnter = () => {
      dotsRef.current.forEach((dot) => gsap.to(dot, { autoAlpha: 1, duration: 0.3 }));
    };

    const onLeave = () => {
      dotsRef.current.forEach((dot) => gsap.to(dot, { autoAlpha: 0, duration: 0.3 }));
    };

    container.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseenter", onEnter, { passive: true });
    container.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden lg:block" aria-hidden="true">
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) dotsRef.current[i] = el; }}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: Math.max(3, 6 - i),
            height: Math.max(3, 6 - i),
            backgroundColor: "var(--color-amber)",
            opacity: 0,
            boxShadow: i === 0
              ? "0 0 6px var(--color-amber), 0 0 12px var(--color-amber)"
              : `0 0 ${4 - i}px var(--color-amber)`,
            filter: i > 0 ? `blur(${i * 0.3}px)` : undefined,
          }}
        />
      ))}
    </div>
  );
}

// Distant background stars (small, faint, fast twinkle)
const farStars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1 + 0.3,
  delay: Math.random() * 6,
  duration: Math.random() * 4 + 3,
  opacity: Math.random() * 0.25 + 0.05,
}));

// Near foreground stars (bigger, brighter, slow drift)
const nearStars = Array.from({ length: 15 }, (_, i) => ({
  id: i + 100,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1.5,
  delay: Math.random() * 4,
  duration: Math.random() * 5 + 4,
  opacity: Math.random() * 0.4 + 0.2,
  driftX: (Math.random() - 0.5) * 40,
  driftY: (Math.random() - 0.5) * 20,
  driftDuration: 30 + Math.random() * 40,
}));

function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Stars fade in like eyes adjusting to darkness
    gsap.fromTo(containerRef.current, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: 2.0,
      ease: "power1.inOut",
      delay: 0.3,
    });

    // Near stars drift slowly
    if (nearRef.current) {
      const dots = nearRef.current.children;
      nearStars.forEach((s, i) => {
        if (!dots[i]) return;
        gsap.to(dots[i], {
          x: s.driftX,
          y: s.driftY,
          duration: s.driftDuration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ visibility: "hidden", contain: "layout paint" }}>
      {/* Far stars — small, faint */}
      {farStars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* Near stars — bigger, brighter, slow drift */}
      <div ref={nearRef}>
        {nearStars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GridOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(ref.current, { autoAlpha: 0 }, {
      autoAlpha: 0.04,
      duration: 1.5,
      ease: "power1.in",
      delay: 1.0,
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

function ScanLine() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(ref.current, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: 0.5,
      delay: 2.0,
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-30 overflow-hidden" style={{ visibility: "hidden" }}>
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-amber), transparent)",
          opacity: 0.15,
          animation: "scanline 8s linear infinite",
        }}
      />
    </div>
  );
}

const bodyData = [
  { id: "sol", name: "SOL", type: "G2V MAIN SEQUENCE", distance: "0 AU", temp: "5,778 K", mass: "1.0 M☉" },
  { id: "terra", name: "TERRA", type: "TERRESTRIAL", distance: "1.0 AU", temp: "288 K", mass: "5.97×10²⁴ kg" },
  { id: "mars", name: "MARS", type: "TERRESTRIAL", distance: "1.52 AU", temp: "210 K", mass: "6.42×10²³ kg" },
  { id: "jupiter", name: "JUPITER", type: "GAS GIANT", distance: "5.2 AU", temp: "165 K", mass: "1.90×10²⁷ kg" },
];

function OrbitalDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredBody, setHoveredBody] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<SVGEllipseElement>(".orbit-path").forEach((el, i) => {
        const length = el.getTotalLength?.() || (2 * Math.PI * Math.max(
          parseFloat(el.getAttribute("rx") || "0"),
          parseFloat(el.getAttribute("ry") || "0")
        ));
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 2 + i * 0.4,
          ease: "power2.inOut",
          delay: 1.5 + i * 0.25,
        });
      });

      gsap.utils.toArray<SVGCircleElement>(".orbit-body").forEach((el, i) => {
        gsap.from(el, {
          scale: 0,
          autoAlpha: 0,
          duration: 0.5,
          ease: "back.out(2)",
          delay: 3.0 + i * 0.3,
          transformOrigin: "center center",
        });
      });

      gsap.utils.toArray<SVGCircleElement>(".orbit-body-moving").forEach((el, i) => {
        const path = document.querySelector(`.orbit-path-${i}`) as SVGEllipseElement;
        if (!path) return;
        const duration = 12 + i * 6;
        gsap.to({ t: 0 }, {
          t: 1,
          duration,
          repeat: -1,
          ease: "none",
          onUpdate: function () {
            const progress = this.targets()[0].t;
            const angle = progress * Math.PI * 2;
            const rx = parseFloat(path.getAttribute("rx") || "0");
            const ry = parseFloat(path.getAttribute("ry") || "0");
            const cx = parseFloat(path.getAttribute("cx") || "0");
            const cy = parseFloat(path.getAttribute("cy") || "0");
            el.setAttribute("cx", String(cx + Math.cos(angle) * rx));
            el.setAttribute("cy", String(cy + Math.sin(angle) * ry));
          },
        });
      });

      gsap.from(".orbit-label", {
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 3.5,
        ease: "power2.out",
      });

      gsap.from(".crosshair", {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.05,
        delay: 1.2,
        ease: "power2.out",
        transformOrigin: "center center",
      });

      gsap.from(".crosshair-v", {
        scaleY: 0,
        duration: 0.6,
        stagger: 0.05,
        delay: 1.2,
        ease: "power2.out",
        transformOrigin: "center center",
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 800"
      className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[65vw] max-w-[750px] opacity-90"
      fill="none"
    >
      <defs>
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="radar-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0" />
          <stop offset="70%" stopColor="var(--color-amber)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Center ambient glow */}
      <circle cx="400" cy="400" r="60" fill="url(#center-glow)" />

      {/* Radar sweep */}
      <g style={{ transformOrigin: "400px 400px", animation: "radar-sweep 10s linear infinite", willChange: "transform" }}>
        <line x1="400" y1="400" x2="400" y2="30" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.12" />
        <path d="M 400,400 L 380,50 A 370,370 0 0,1 400,30 Z" fill="url(#radar-fade)" />
      </g>

      {/* Crosshairs at center */}
      <line className="crosshair" x1="340" y1="400" x2="460" y2="400" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.25" />
      <line className="crosshair-v" x1="400" y1="340" x2="400" y2="460" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.25" />

      {/* Range rings (dashed) */}
      <circle cx="400" cy="400" r="50" stroke="var(--color-amber)" strokeWidth="0.3" strokeDasharray="3 6" opacity="0.1" />
      <circle cx="400" cy="400" r="150" stroke="var(--color-amber)" strokeWidth="0.3" strokeDasharray="3 6" opacity="0.07" />

      {/* Orbit paths */}
      <ellipse className="orbit-path orbit-path-0" cx="400" cy="400" rx="100" ry="100" stroke="var(--color-amber)" strokeWidth="0.8" opacity="0.25" />
      <ellipse className="orbit-path orbit-path-1" cx="400" cy="400" rx="180" ry="160" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.2" transform="rotate(-15 400 400)" />
      <ellipse className="orbit-path orbit-path-2" cx="400" cy="400" rx="280" ry="230" stroke="var(--color-teal)" strokeWidth="0.6" opacity="0.18" transform="rotate(8 400 400)" />
      <ellipse className="orbit-path orbit-path-3" cx="400" cy="400" rx="370" ry="320" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.12" transform="rotate(-5 400 400)" />

      {/* Center body (star/sun) with glow */}
      <circle cx="400" cy="400" r="20" fill="var(--color-amber)" opacity="0.06" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
      <circle className="orbit-body" cx="400" cy="400" r="6" fill="var(--color-amber)" opacity="0.9" />
      <circle cx="400" cy="400" r="12" fill="none" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />

      {/* Moving orbital bodies */}
      <circle className="orbit-body-moving" cx="500" cy="400" r="3.5" fill="var(--color-teal)" opacity="0.9" data-orbit="0" />
      <circle className="orbit-body-moving" cx="580" cy="400" r="2.5" fill="var(--color-amber)" opacity="0.7" data-orbit="1" />
      <circle className="orbit-body-moving" cx="680" cy="400" r="4" fill="var(--color-amber)" opacity="0.8" data-orbit="2" />

      {/* Labels */}
      <text className="orbit-label invisible" x="416" y="396" fill="var(--color-amber)" fontSize="8" fontFamily="var(--font-mono)" opacity="0.5">SOL</text>

      {/* Distance markers */}
      <text className="orbit-label invisible" x="490" y="310" fill="var(--color-amber)" fontSize="7" fontFamily="var(--font-mono)" opacity="0.3">1.0 AU</text>
      <text className="orbit-label invisible" x="570" y="260" fill="var(--color-teal)" fontSize="7" fontFamily="var(--font-mono)" opacity="0.3">1.52 AU</text>
      <text className="orbit-label invisible" x="660" y="200" fill="var(--color-amber)" fontSize="7" fontFamily="var(--font-mono)" opacity="0.3">5.2 AU</text>

      {/* Angle markers - extended crosshairs */}
      <line className="crosshair" x1="395" y1="300" x2="405" y2="300" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.15" />
      <line className="crosshair" x1="395" y1="500" x2="405" y2="500" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.15" />
      <line className="crosshair-v" x1="300" y1="395" x2="300" y2="405" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.15" />
      <line className="crosshair-v" x1="500" y1="395" x2="500" y2="405" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.15" />

      {/* Bearing labels */}
      <text className="orbit-label invisible" x="400" y="72" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.2">000°</text>
      <text className="orbit-label invisible" x="728" y="404" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.2">090°</text>
      <text className="orbit-label invisible" x="400" y="736" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.2">180°</text>

      {/* Interactive hitboxes — hover orbit paths (fat invisible strokes) and center body */}
      <circle cx="400" cy="400" r="25" fill="transparent" className="cursor-pointer" onMouseEnter={() => setHoveredBody("sol")} onMouseLeave={() => setHoveredBody(null)} />
      <ellipse cx="400" cy="400" rx="100" ry="100" fill="none" stroke="transparent" strokeWidth="20" className="cursor-pointer" onMouseEnter={() => setHoveredBody("terra")} onMouseLeave={() => setHoveredBody(null)} />
      <ellipse cx="400" cy="400" rx="180" ry="160" fill="none" stroke="transparent" strokeWidth="20" className="cursor-pointer" transform="rotate(-15 400 400)" onMouseEnter={() => setHoveredBody("mars")} onMouseLeave={() => setHoveredBody(null)} />
      <ellipse cx="400" cy="400" rx="370" ry="320" fill="none" stroke="transparent" strokeWidth="25" className="cursor-pointer" transform="rotate(-5 400 400)" onMouseEnter={() => setHoveredBody("jupiter")} onMouseLeave={() => setHoveredBody(null)} />

      {/* Hover pulse — highlights the full orbit ring */}
      {hoveredBody === "sol" && <circle cx="400" cy="400" r="18" fill="none" stroke="var(--color-amber)" strokeWidth="1" opacity="0.5" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />}
      {hoveredBody === "terra" && <ellipse cx="400" cy="400" rx="100" ry="100" fill="none" stroke="var(--color-amber)" strokeWidth="1" opacity="0.3" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />}
      {hoveredBody === "mars" && <ellipse cx="400" cy="400" rx="180" ry="160" fill="none" stroke="var(--color-amber)" strokeWidth="1" opacity="0.3" transform="rotate(-15 400 400)" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />}
      {hoveredBody === "jupiter" && <ellipse cx="400" cy="400" rx="370" ry="320" fill="none" stroke="var(--color-amber)" strokeWidth="1" opacity="0.2" transform="rotate(-5 400 400)" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />}

      {/* Tooltip for hovered body */}
      {hoveredBody && (() => {
        const body = bodyData.find(b => b.id === hoveredBody);
        if (!body) return null;
        const positions: Record<string, { x: number; y: number }> = {
          sol: { x: 400, y: 350 },
          terra: { x: 520, y: 320 },
          mars: { x: 600, y: 270 },
          jupiter: { x: 700, y: 150 },
        };
        const pos = positions[hoveredBody] ?? { x: 400, y: 400 };
        return (
          <g>
            <rect x={pos.x - 70} y={pos.y - 30} width="140" height="56" rx="2" fill="oklch(0.08 0.005 250 / 0.95)" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.9" />
            <text x={pos.x} y={pos.y - 15} fill="var(--color-amber)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.9">{body.name}</text>
            <text x={pos.x} y={pos.y - 4} fill="var(--color-foreground)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.4">{body.type}</text>
            <text x={pos.x} y={pos.y + 8} fill="var(--color-teal)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">{body.distance} // {body.temp}</text>
            <text x={pos.x} y={pos.y + 19} fill="var(--color-foreground)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.3">{body.mass}</text>
          </g>
        );
      })()}
    </svg>
  );
}

function TelemetryReadout() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".readout-line", {
        autoAlpha: 0,
        x: -10,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        delay: 3.2,
      });

      gsap.to(".cursor-blink", {
        autoAlpha: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute bottom-8 right-8 hidden font-mono text-[10px] leading-relaxed lg:block">
      <div className="readout-line invisible mb-3 text-[9px] tracking-[0.2em] text-foreground/20 uppercase">
        Telemetry Feed
      </div>
      <div className="readout-line invisible flex items-center gap-2 text-amber">
        <span className="inline-block size-1.5 rounded-full bg-teal" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
        SYS.STATUS <span className="text-teal">NOMINAL</span>
      </div>
      <div className="readout-line invisible text-amber/50">TELEMETRY.FEED <span className="text-amber/70">ACTIVE</span></div>
      <div className="readout-line invisible text-amber/50">NAV.COMPUTER <span className="text-teal/70">LOCKED</span></div>
      <div className="readout-line invisible text-amber/50">SIGNAL.LATENCY <span className="text-amber/70">14.2ms</span></div>
      <div className="readout-line invisible text-amber/50">ORBIT.PHASE <span className="text-teal/70">HELIOCENTRIC</span></div>
      <div className="readout-line invisible text-amber/30">
        <span className="cursor-blink">_</span>
      </div>
    </div>
  );
}

function CoordinateDisplay() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".coord-line", {
        autoAlpha: 0,
        y: 5,
        duration: 0.3,
        stagger: 0.06,
        ease: "power2.out",
        delay: 3.6,
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute bottom-8 left-8 hidden font-mono text-[10px] text-foreground/20 lg:block">
      <div className="coord-line invisible">RA 14h 29m 42.9s</div>
      <div className="coord-line invisible">DEC −62° 40′ 46″</div>
      <div className="coord-line invisible text-amber/30">EPOCH J2026.0</div>
    </div>
  );
}

const navLinks = [
  { label: "Missions", section: "missions" },
  { label: "Vehicles", section: "configurator" },
  { label: "Technology", section: "technology" },
  { label: "Careers", section: "careers" },
];

function scrollToSection(section: string) {
  document.querySelector(`[data-section="${section}"]`)?.scrollIntoView({ behavior: "smooth" });
}

function ClickRippleLayer({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const ripplesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const ripplesEl = ripplesRef.current;
    if (!container || !ripplesEl) return;

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple ring
      const ring = document.createElement("div");
      ring.style.cssText = `
        position: absolute; left: ${x}px; top: ${y}px;
        width: 0; height: 0; border-radius: 50%;
        border: 1px solid var(--color-amber);
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      ripplesEl.appendChild(ring);

      // Create center flash
      const flash = document.createElement("div");
      flash.style.cssText = `
        position: absolute; left: ${x}px; top: ${y}px;
        width: 4px; height: 4px; border-radius: 50%;
        background: var(--color-amber);
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      ripplesEl.appendChild(flash);

      // Animate ring expanding
      gsap.to(ring, {
        width: 120,
        height: 120,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => ring.remove(),
      });

      // Animate center flash
      gsap.to(flash, {
        scale: 3,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => flash.remove(),
      });
    };

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [containerRef]);

  return (
    <div ref={ripplesRef} className="pointer-events-none absolute inset-0 z-[6] hidden overflow-hidden lg:block" aria-hidden="true" />
  );
}

export default function Hero({ ready = false }: { ready?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [navVisible, setNavVisible] = useState(true);
  const [ambientNoise, setAmbientNoise] = useState(false);

  // Toggle ambient noise class on body
  useEffect(() => {
    document.body.classList.toggle("ambient-noise", ambientNoise);
    return () => { document.body.classList.remove("ambient-noise"); };
  }, [ambientNoise]);
  const lastScrollY = useRef(0);

  // Track which section is in view + hide/show nav on scroll direction
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      // Active section tracking
      const sections = document.querySelectorAll<HTMLElement>("section[data-section]");
      let current = "";
      sections.forEach((el) => {
        const top = el.offsetTop - window.innerHeight * 0.4;
        if (y >= top) {
          current = el.getAttribute("data-section") || "";
        }
      });
      setActiveSection(current);

      // Nav hide/show — always visible at top, hide on scroll down, show on scroll up
      if (y < 100) {
        setNavVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setNavVisible(false);
      } else if (y < lastScrollY.current - 5) {
        setNavVisible(true);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (!ready) return;

      const tl = gsap.timeline({ delay: 0.1 });

      // Nav slides in first — the interface is waking up
      tl.from(".hero-nav", {
        y: -20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .from(
          ".hero-tag",
          { autoAlpha: 0, x: -20, duration: 0.5, ease: "power2.out" },
          0.6
        )
        .from(
          ".hero-heading span",
          {
            y: 80,
            autoAlpha: 0,
            duration: 1.0,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.8
        )
        .from(
          ".hero-body",
          { y: 30, autoAlpha: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .from(
          ".hero-cta",
          { y: 15, autoAlpha: 0, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        )
        // Scroll hint appears last
        .from(
          ".scroll-hint",
          { autoAlpha: 0, y: 10, duration: 0.6, ease: "power2.out" },
          "-=0.1"
        );
    },
    { scope: containerRef, dependencies: [ready] }
  );

  return (
    <section
      ref={containerRef}
      data-section="hero"
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      {ready && (
        <>
          <StarField />
          <GridOverlay />
          <ScanLine />
          <OrbitalDiagram />
          <TelemetryReadout />
          <CoordinateDisplay />
          <CursorTrail containerRef={containerRef} />
          <ClickRippleLayer containerRef={containerRef} />
        </>
      )}

      {/* Ambient corner vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, transparent 40%, var(--background) 80%)",
        }}
      />

      {/* Nav — fixed, follows scroll */}
      <nav
        className="hero-nav fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-border/50 px-8 py-4 backdrop-blur-md transition-transform duration-300 lg:px-12"
        aria-hidden={!navVisible}
        style={{
          backgroundColor: "oklch(0.06 0.005 250 / 0.7)",
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          visibility: "hidden",
          opacity: 0,
        }}
      >
        <div className="font-mono text-xs font-bold tracking-[0.4em] text-amber uppercase">
          ASTRAX
        </div>
        {/* Desktop links */}
        <div className="hidden items-center gap-8 font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase sm:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.section;
            return (
              <button
                key={link.section}
                onClick={() => scrollToSection(link.section)}
                className={`relative pb-1 transition-colors hover:text-amber focus-visible:text-amber focus-visible:outline-1 focus-visible:outline-amber ${isActive ? "text-amber" : ""}`}
              >
                {link.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      backgroundColor: "var(--color-amber)",
                      boxShadow: "0 0 4px var(--color-amber)",
                      opacity: 0.7,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setAmbientNoise(!ambientNoise)}
          className="hidden items-center gap-3 font-mono text-[10px] text-foreground/40 transition-colors hover:text-amber sm:flex"
        >
          <span className={`inline-block size-1.5 rounded-full ${ambientNoise ? "bg-amber animate-pulse" : "bg-teal animate-pulse"}`} />
          <span className="tracking-[0.15em] uppercase">
            Audio: {ambientNoise ? "ON" : "OFF"}
          </span>
        </button>
        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-[5px] sm:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <div className="h-[1.5px] w-5 bg-foreground/50" />
          <div className="h-[1.5px] w-5 bg-foreground/50" />
          <div className="h-[1.5px] w-3.5 bg-foreground/50" />
        </button>
      </nav>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-64 border-l border-border/20 bg-background px-8 py-6">
            {/* Close button */}
            <button
              className="mb-8 font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase transition-colors hover:text-amber"
              onClick={() => setMenuOpen(false)}
            >
              ✕ Close
            </button>
            {/* Links */}
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => scrollToSection(link.section), 100);
                  }}
                  className="text-left font-mono text-sm tracking-[0.2em] text-foreground/40 uppercase transition-colors hover:text-amber"
                >
                  {link.label}
                </button>
              ))}
            </div>
            {/* Telemetry status */}
            <div className="mt-12 flex items-center gap-3 font-mono text-[10px] text-foreground/30">
              <span className="inline-block size-1.5 rounded-full bg-teal animate-pulse" />
              <span className="tracking-[0.15em] uppercase">Live Telemetry</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="px-8 lg:px-12 xl:px-20">
          <div className="hero-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
            // Mission Control — Active
          </div>
          <h1 className="hero-heading max-w-2xl text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-foreground">
            <span className="block invisible">Charting</span>
            <span className="block invisible text-amber">the unknown</span>
          </h1>
          <p className="hero-body invisible mt-6 max-w-sm font-mono text-xs leading-relaxed text-foreground/40 sm:text-sm">
            Deep space navigation systems for the next era of human exploration.
            Real-time orbital mechanics. Autonomous trajectory planning.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a
              href="#"
              className="hero-cta invisible inline-flex items-center gap-2 bg-amber px-5 py-2.5 font-mono text-[10px] font-medium tracking-[0.2em] text-background uppercase transition-all hover:bg-amber/90"
              style={{ boxShadow: "0 0 20px oklch(0.82 0.16 75 / 0.2)" }}
            >
              Access Mission Data
            </a>
            <a
              href="#"
              className="hero-cta invisible inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-foreground/60 uppercase transition-all hover:border-amber/40 hover:text-amber"
            >
              View Trajectories
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint invisible absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[8px] tracking-[0.3em] text-foreground/20 uppercase">Scroll</span>
        <div className="relative h-8 w-[1px] overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full w-full bg-amber/40"
            style={{ animation: "scroll-pulse 2s ease-in-out infinite" }}
          />
        </div>
      </div>

    </section>
  );
}
