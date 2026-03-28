import { useRef, useEffect, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Separator } from "@/components/ui/separator";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Mini SVG icons per system ─── */

const NavIcon = forwardRef<SVGSVGElement>(function NavIcon(_, ref) {
  return (
    <svg ref={ref} viewBox="0 0 60 60" fill="none" className="size-14 opacity-70" role="img" aria-label="Navigation system">
      <circle className="nav-ring-outer" cx="30" cy="30" r="22" stroke="var(--color-amber)" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4" />
      <circle className="nav-ring-inner" cx="30" cy="30" r="12" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />
      <circle className="nav-center" cx="30" cy="30" r="2" fill="var(--color-amber)" opacity="0.8" />
      <line x1="30" y1="6" x2="30" y2="14" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.5" />
      <line x1="30" y1="46" x2="30" y2="54" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.5" />
      <line x1="6" y1="30" x2="14" y2="30" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.5" />
      <line x1="46" y1="30" x2="54" y2="30" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.5" />
      {/* Pulsar signal lines */}
      <line className="nav-pulsar" x1="42" y1="12" x2="36" y2="20" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.3" />
      <line className="nav-pulsar" x1="12" y1="18" x2="22" y2="24" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.3" />
      <line className="nav-pulsar" x1="18" y1="48" x2="24" y2="38" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.3" />
      <circle className="nav-pulsar-dot" cx="42" cy="12" r="1.5" fill="var(--color-amber)" opacity="0.5" />
      <circle className="nav-pulsar-dot" cx="12" cy="18" r="1.5" fill="var(--color-amber)" opacity="0.5" />
      <circle className="nav-pulsar-dot" cx="18" cy="48" r="1.5" fill="var(--color-amber)" opacity="0.5" />
    </svg>
  );
});

const PropIcon = forwardRef<SVGSVGElement>(function PropIcon(_, ref) {
  return (
    <svg ref={ref} viewBox="0 0 60 60" fill="none" className="size-14 opacity-70" role="img" aria-label="Propulsion system">
      {/* Thruster nozzle */}
      <path d="M 22,15 L 38,15 L 42,45 L 18,45 Z" stroke="var(--color-teal)" strokeWidth="0.6" opacity="0.4" />
      <path d="M 18,45 Q 30,58 42,45" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.3" />
      {/* Exhaust plume lines */}
      <line className="prop-plume" x1="24" y1="46" x2="22" y2="56" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0.25" />
      <line className="prop-plume" x1="30" y1="48" x2="30" y2="58" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.35" />
      <line className="prop-plume" x1="36" y1="46" x2="38" y2="56" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0.25" />
      {/* Chamber lines */}
      <line x1="25" y1="20" x2="25" y2="40" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />
      <line x1="30" y1="18" x2="30" y2="42" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />
      <line x1="35" y1="20" x2="35" y2="40" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />
      {/* Power indicator */}
      <circle className="prop-power-ring" cx="30" cy="10" r="3" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.5" />
      <circle className="prop-power-dot" cx="30" cy="10" r="1" fill="var(--color-teal)" opacity="0.7" />
    </svg>
  );
});

const CommsIcon = forwardRef<SVGSVGElement>(function CommsIcon(_, ref) {
  return (
    <svg ref={ref} viewBox="0 0 60 60" fill="none" className="size-14 opacity-70" role="img" aria-label="Communications system">
      {/* Dish */}
      <path d="M 15,35 Q 30,10 45,35" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.4" />
      <line x1="30" y1="22" x2="30" y2="50" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />
      <line x1="22" y1="50" x2="38" y2="50" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />
      {/* Signal waves */}
      <path className="comms-wave" d="M 32,18 Q 40,12 44,8" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.3" fill="none" />
      <path className="comms-wave" d="M 34,22 Q 42,16 48,10" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.2" fill="none" />
      <path className="comms-wave" d="M 36,26 Q 44,20 52,12" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.15" fill="none" />
      {/* Feed point */}
      <circle className="comms-feed" cx="30" cy="22" r="2" fill="var(--color-amber)" opacity="0.7" />
    </svg>
  );
});

const systemIcons = { nav: NavIcon, prop: PropIcon, comms: CommsIcon };

/* ─── Hover animations per icon type ─── */

function useIconHover(iconRef: React.RefObject<SVGSVGElement | null>, cardRef: React.RefObject<HTMLDivElement | null>, id: string) {
  useEffect(() => {
    const card = cardRef.current;
    const svg = iconRef.current;
    if (!card || !svg) return;

    let tl: gsap.core.Timeline;

    const onEnter = () => {
      tl?.kill();
      tl = gsap.timeline({ defaults: { overwrite: true } });

      if (id === "nav") {
        // Spin outer ring, pulse inner ring, flash pulsars
        tl.to(svg.querySelectorAll(".nav-ring-outer"), { rotation: 360, duration: 3, ease: "none", repeat: -1, transformOrigin: "50% 50%" }, 0);
        tl.to(svg.querySelectorAll(".nav-ring-inner"), { rotation: -180, duration: 4, ease: "none", repeat: -1, transformOrigin: "50% 50%" }, 0);
        tl.to(svg.querySelectorAll(".nav-center"), { scale: 1.8, opacity: 1, duration: 0.6, ease: "power1.out", transformOrigin: "50% 50%", yoyo: true, repeat: -1 }, 0);
        tl.to(svg.querySelectorAll(".nav-pulsar-dot"), { opacity: 1, scale: 2, duration: 0.4, stagger: 0.15, ease: "power2.out", transformOrigin: "50% 50%", yoyo: true, repeat: -1, repeatDelay: 0.8 }, 0);
      }

      if (id === "prop") {
        // Extend plume lines, flicker them, pulse power indicator
        tl.to(svg.querySelectorAll(".prop-plume"), { opacity: 0.9, scaleY: 1.5, duration: 0.3, ease: "power2.out", transformOrigin: "50% 0%" }, 0);
        tl.to(svg.querySelectorAll(".prop-plume"), { opacity: 0.4, scaleY: 0.8, duration: 0.1, ease: "none", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }, 0.3);
        tl.to(svg.querySelectorAll(".prop-power-ring"), { scale: 1.6, opacity: 0.8, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" }, 0);
        tl.to(svg.querySelectorAll(".prop-power-dot"), { opacity: 1, scale: 1.5, duration: 0.5, ease: "power1.out", yoyo: true, repeat: -1, transformOrigin: "50% 50%" }, 0);
      }

      if (id === "comms") {
        // Stagger-pulse signal waves outward, pulse feed point
        svg.querySelectorAll<SVGPathElement>(".comms-wave").forEach((wave, i) => {
          const len = wave.getTotalLength();
          gsap.set(wave, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(wave, { strokeDashoffset: 0, opacity: 0.7, duration: 0.5, ease: "power1.out" }, i * 0.2);
          tl.to(wave, { opacity: 0.1, duration: 0.4, ease: "power1.in" }, 0.5 + i * 0.2);
        });
        // Loop the wave cycle
        tl.repeat(-1).repeatDelay(0.3);
        tl.to(svg.querySelectorAll(".comms-feed"), { scale: 1.5, opacity: 1, duration: 0.3, ease: "power1.out", yoyo: true, repeat: -1, transformOrigin: "50% 50%" }, 0);
      }
    };

    const onLeave = () => {
      tl?.kill();
      // Reset all animated properties
      gsap.to(svg.querySelectorAll("[class]"), { clearProps: "all", duration: 0.3, overwrite: true });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      tl?.kill();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [iconRef, cardRef, id]);
}

/* ─── System data ─── */

const systems = [
  {
    id: "nav" as const,
    label: "NAV.CORE",
    name: "Autonomous Navigation",
    desc: "Deep-space positioning without ground relay. Pulsar-based triangulation achieves sub-kilometer accuracy at 5+ AU from Sol.",
    specs: [
      { key: "ACCURACY", val: "0.4 km" },
      { key: "RANGE", val: "50+ AU" },
      { key: "LATENCY", val: "0 ms" },
    ],
    color: "amber" as const,
    power: 12,
    status: "ACTIVE",
  },
  {
    id: "prop" as const,
    label: "PROP.SYS",
    name: "Ion Drive Array",
    desc: "Clustered Hall-effect thrusters delivering continuous low-thrust acceleration. Solar-electric power with nuclear backup beyond 3 AU.",
    specs: [
      { key: "THRUST", val: "5.4 N" },
      { key: "ISP", val: "3,100 s" },
      { key: "DELTA-V", val: "12 km/s" },
    ],
    color: "teal" as const,
    power: 64,
    status: "NOMINAL",
  },
  {
    id: "comms" as const,
    label: "COMMS.NET",
    name: "Laser Relay Network",
    desc: "Optical downlink via relay constellation at Earth-Sun L4/L5. Eliminates blackout windows during solar conjunction.",
    specs: [
      { key: "BANDWIDTH", val: "2.4 Gbps" },
      { key: "UPTIME", val: "99.97%" },
      { key: "NODES", val: "14" },
    ],
    color: "amber" as const,
    power: 24,
    status: "LINKED",
  },
];

/* ─── Animated power bar ─── */

function PowerBar({ percent, color, delay }: { percent: number; color: string; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const tween = gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: barRef.current, start: "top 85%", once: true },
        delay,
      }
    );
    return () => { tween.kill(); };
  }, [percent, delay]);

  return (
    <div className="h-1 w-full bg-border/20">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{
          width: `${percent}%`,
          transform: "scaleX(0)",
          backgroundColor: `var(--color-${color})`,
          boxShadow: `0 0 8px var(--color-${color})`,
          opacity: 0.7,
          willChange: "transform",
        }}
      />
    </div>
  );
}

/* ─── System card ─── */

function SystemCard({ system, index }: { system: typeof systems[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const Icon = systemIcons[system.id];

  useIconHover(iconRef, ref, system.id);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
        delay: index * 0.15,
      });

      gsap.from(ref.current?.querySelectorAll(`.spec-row`) || [], {
        x: -15,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
        delay: 0.3 + index * 0.15,
      });
    },
    { scope: ref }
  );

  const isTeal = system.color === "teal";
  const accentColor = isTeal ? "var(--color-teal)" : "var(--color-amber)";
  const labelColor = isTeal ? "text-teal" : "text-amber";
  const dotColor = isTeal ? "bg-teal" : "bg-amber";

  return (
    <div
      ref={ref}
      className="invisible relative overflow-hidden border border-border/15 bg-card/30"
    >
      {/* Glowing top accent */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          boxShadow: `0 0 12px ${accentColor}`,
          opacity: 0.5,
        }}
      />

      <div className="p-5">
        {/* Header: icon + label */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`inline-block size-1.5 rounded-full ${dotColor}`}
                style={{ animation: "glow-pulse 3s ease-in-out infinite", animationDelay: `${index * 0.5}s` }}
              />
              <span className={`font-mono text-[9px] tracking-[0.25em] ${labelColor} uppercase`}>
                {system.label}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-tight text-foreground">
              {system.name}
            </h3>
          </div>
          <Icon ref={iconRef} />
        </div>

        <p className="mb-4 font-mono text-[11px] leading-relaxed text-foreground/35">
          {system.desc}
        </p>

        {/* Power allocation */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between font-mono text-[9px] text-foreground/25">
            <span>POWER.ALLOC</span>
            <span className={labelColor}>{system.power}%</span>
          </div>
          <PowerBar percent={system.power} color={system.color} delay={0.5 + index * 0.2} />
        </div>

        {/* Specs */}
        <div className="space-y-1.5 border-t border-border/15 pt-3">
          {system.specs.map((s) => (
            <div
              key={s.key}
              className="spec-row invisible flex items-center justify-between font-mono text-[10px]"
            >
              <span className="text-foreground/30">{s.key}</span>
              <span className={labelColor}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Status badge */}
        <div className="mt-4 flex items-center justify-between border-t border-border/10 pt-3">
          <span className="font-mono text-[9px] text-foreground/20">STATUS</span>
          <span
            className={`font-mono text-[9px] tracking-[0.15em] ${labelColor}`}
            style={{ textShadow: `0 0 8px ${accentColor}` }}
          >
            {system.status}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Spacecraft blueprint ─── */

function SpacecraftBlueprint() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      // Draw hull
      gsap.utils.toArray<SVGElement>(".bp-line").forEach((el, i) => {
        const length = (el as SVGGeometryElement).getTotalLength?.() || 100;
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 1 + i * 0.15,
          ease: "power2.inOut",
          scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
          delay: i * 0.08,
        });
      });

      gsap.from(".bp-node", {
        scale: 0,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(2)",
        scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
        delay: 1,
      });

      gsap.from(".bp-label", {
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
        delay: 1.3,
      });

      // Animate data flow dots
      gsap.to(".flow-dot", {
        x: 340,
        duration: 3,
        repeat: -1,
        ease: "none",
        stagger: { each: 0.8, repeat: -1 },
        scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
        delay: 1.8,
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 220"
      className="mx-auto mt-12 w-full max-w-4xl"
      fill="none"
    >
      <defs>
        <radialGradient id="bp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Center line (spine) */}
      <line className="bp-line" x1="80" y1="110" x2="720" y2="110" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.2" />

      {/* Hull outline — forward section */}
      <path className="bp-line" d="M 120,110 L 80,90 L 80,130 Z" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />
      {/* Command module */}
      <rect className="bp-line" x="120" y="85" width="80" height="50" rx="2" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.25" />
      {/* Crew section */}
      <rect className="bp-line" x="210" y="80" width="120" height="60" rx="2" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.2" />
      {/* Cargo bay */}
      <rect className="bp-line" x="340" y="75" width="140" height="70" rx="2" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.2" />
      {/* Engine section */}
      <rect className="bp-line" x="490" y="80" width="100" height="60" rx="2" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.25" />
      {/* Nozzle */}
      <path className="bp-line" d="M 590,85 L 640,70 L 640,150 L 590,135 Z" stroke="var(--color-teal)" strokeWidth="0.6" opacity="0.3" />
      {/* Exhaust cone */}
      <path className="bp-line" d="M 640,70 L 680,55 M 640,150 L 680,165" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0.2" />

      {/* Solar arrays (top & bottom) */}
      <line className="bp-line" x1="300" y1="80" x2="300" y2="30" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.25" />
      <rect className="bp-line" x="260" y="15" width="80" height="18" rx="1" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.2" />
      <line className="bp-line" x1="300" y1="140" x2="300" y2="190" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.25" />
      <rect className="bp-line" x="260" y="187" width="80" height="18" rx="1" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.2" />

      {/* Comms dish */}
      <line className="bp-line" x1="160" y1="85" x2="160" y2="45" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.25" />
      <path className="bp-line" d="M 145,45 Q 160,30 175,45" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />

      {/* Radiator fins */}
      <line className="bp-line" x1="520" y1="80" x2="510" y2="40" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />
      <line className="bp-line" x1="540" y1="80" x2="550" y2="40" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />
      <line className="bp-line" x1="520" y1="140" x2="510" y2="180" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />
      <line className="bp-line" x1="540" y1="140" x2="550" y2="180" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.2" />

      {/* Internal data bus line */}
      <line className="bp-line" x1="140" y1="110" x2="580" y2="110" stroke="var(--color-teal)" strokeWidth="0.8" opacity="0.15" />

      {/* Data flow dots */}
      <circle className="flow-dot" cx="140" cy="110" r="1.5" fill="var(--color-teal)" opacity="0.7" />
      <circle className="flow-dot" cx="140" cy="110" r="1.5" fill="var(--color-teal)" opacity="0.5" />
      <circle className="flow-dot" cx="140" cy="110" r="1.5" fill="var(--color-teal)" opacity="0.3" />

      {/* Module nodes */}
      <circle className="bp-node invisible" cx="160" cy="110" r="4" fill="var(--color-amber)" opacity="0.7" />
      <circle className="bp-node invisible" cx="160" cy="110" r="8" fill="none" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.2" />

      <circle className="bp-node invisible" cx="270" cy="110" r="4" fill="var(--color-amber)" opacity="0.6" />
      <circle className="bp-node invisible" cx="410" cy="110" r="4" fill="var(--color-teal)" opacity="0.6" />
      <circle className="bp-node invisible" cx="540" cy="110" r="4" fill="var(--color-teal)" opacity="0.7" />
      <circle className="bp-node invisible" cx="540" cy="110" r="8" fill="none" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0.2" />

      {/* Ambient glow on engine */}
      <ellipse cx="640" cy="110" rx="30" ry="40" fill="url(#bp-glow)" />

      {/* Labels */}
      <text className="bp-label invisible" x="160" y="135" fill="var(--color-amber)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.45">CMD</text>
      <text className="bp-label invisible" x="270" y="135" fill="var(--color-amber)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.45">HAB</text>
      <text className="bp-label invisible" x="410" y="135" fill="var(--color-teal)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.45">CARGO</text>
      <text className="bp-label invisible" x="540" y="135" fill="var(--color-teal)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.45">ENG</text>
      <text className="bp-label invisible" x="160" y="55" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.3">COMMS</text>
      <text className="bp-label invisible" x="300" y="12" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.3">SOLAR.P</text>
      <text className="bp-label invisible" x="530" y="36" fill="var(--color-teal)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.3">RAD</text>
      <text className="bp-label invisible" x="665" y="115" fill="var(--color-teal)" fontSize="7" fontFamily="var(--font-mono)" opacity="0.35">NOZZLE</text>

      {/* Dimension lines */}
      <line className="bp-line" x1="80" y1="200" x2="640" y2="200" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.15" />
      <line className="bp-line" x1="80" y1="196" x2="80" y2="204" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.15" />
      <line className="bp-line" x1="640" y1="196" x2="640" y2="204" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.15" />
      <text className="bp-label invisible" x="360" y="213" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.2">82.4 m</text>
    </svg>
  );
}

/* ─── Main section ─── */

export default function Technology() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".tech-tag", {
        autoAlpha: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".tech-tag", start: "top 85%" },
      });

      gsap.from(".tech-heading span", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tech-heading", start: "top 80%" },
      });

      gsap.from(".tech-body", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".tech-body", start: "top 85%" },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} data-section="technology" className="relative w-full overflow-hidden bg-background">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
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

      <div className="relative z-10 px-8 py-16 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="tech-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
            // Systems Architecture — Rev 4.2
          </div>

          <h2 className="tech-heading mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="block invisible">Spacecraft</span>
            <span className="block invisible text-amber">Systems</span>
          </h2>

          <p className="tech-body invisible max-w-lg font-mono text-xs leading-relaxed text-foreground/40 sm:text-sm">
            Every subsystem engineered for autonomous deep-space operation.
            Zero dependency on Earth-based control beyond initial mission parameters.
          </p>

          <Separator className="my-8 bg-border/30" />

          {/* System cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {systems.map((system, i) => (
              <SystemCard key={system.id} system={system} index={i} />
            ))}
          </div>

          {/* Spacecraft blueprint */}
          <SpacecraftBlueprint />

          <Separator className="my-12 bg-border/30" />

          {/* Bottom readout */}
          <div className="flex flex-wrap items-center gap-8 font-mono text-[10px] text-foreground/25">
            <div>
              FIRMWARE <span className="text-teal/60">v4.2.1-stable</span>
            </div>
            <div>
              LAST.DIAGNOSTIC <span className="text-amber/60">2026-03-24T18:42:00Z</span>
            </div>
            <div>
              ALL.SYSTEMS <span className="text-teal/60">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
