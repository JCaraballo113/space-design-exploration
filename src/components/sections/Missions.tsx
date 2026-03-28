import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { Separator } from "@/components/ui/separator";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

function TrajectoryPath() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const path = svgRef.current?.querySelector(".trajectory-line") as SVGPathElement;
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 75%",
        },
      });

      // Spacecraft dot follows the path in legs — accelerates out of
      // each waypoint, decelerates arriving at the next, with random
      // dwell times at intermediate stops.
      const rawPath = MotionPathPlugin.getRawPath(".trajectory-line");
      MotionPathPlugin.cacheRawPathMeasurements(rawPath);

      const dots = svgRef.current?.querySelectorAll(".spacecraft-dot");
      const progress = { value: 0 };

      const updateDotPosition = () => {
        const pos = MotionPathPlugin.getPositionOnPath(rawPath, progress.value);
        dots?.forEach((dot) => {
          gsap.set(dot, { attr: { cx: pos.x, cy: pos.y } });
        });
      };

      // Find exact progress values where waypoints sit on the path
      // by scanning the curve and finding closest match to each waypoint's x
      const waypointXs = [50, 300, 550, 800, 950];
      const stops = waypointXs.map((wx) => {
        let best = 0;
        let bestDist = Infinity;
        for (let p = 0; p <= 1; p += 0.001) {
          const pos = MotionPathPlugin.getPositionOnPath(rawPath, p);
          const dist = Math.abs(pos.x - wx);
          if (dist < bestDist) {
            bestDist = dist;
            best = p;
          }
        }
        return best;
      });

      const rocketTl = gsap.timeline({
        scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
        delay: 0.3,
      });

      stops.forEach((end, i) => {
        if (i === 0) return;
        const legDur = (end - stops[i - 1]) * 35;

        // Random dwell at intermediate waypoints (not leaving Earth)
        if (i > 1) {
          rocketTl.to({}, { duration: gsap.utils.random(0.3, 1.0) });
        }

        // Split each leg: slow build-up (60% of time), then gentle coast-to-stop (40%)
        const midPoint = stops[i - 1] + (end - stops[i - 1]) * 0.55;

        // Thrust phase — slow start, gradually builds speed
        rocketTl.to(progress, {
          value: midPoint,
          duration: legDur * 0.6,
          ease: "power2.in",
          onUpdate: updateDotPosition,
        });

        // Coast & decelerate — carries momentum, eases gently into stop
        rocketTl.to(progress, {
          value: end,
          duration: legDur * 0.4,
          ease: "power1.out",
          onUpdate: updateDotPosition,
        });
      });

      gsap.from(".waypoint", {
        scale: 0,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.3,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 70%",
        },
        delay: 0.5,
      });

      gsap.from(".waypoint-label", {
        autoAlpha: 0,
        y: 8,
        duration: 0.5,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 70%",
        },
        delay: 0.8,
      });

      // Pulse waypoint rings after they appear
      gsap.to(".waypoint-ring", {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        stagger: 0.4,
        repeat: -1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 70%",
        },
        delay: 2,
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 200"
      className="w-full max-w-4xl"
      fill="none"
    >
      <defs>
        <radialGradient id="craft-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-teal)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-teal)" stopOpacity="0" />
        </radialGradient>
        <filter id="trajectory-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={i}
          x1={i * 100}
          y1="0"
          x2={i * 100}
          y2="200"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-border/30"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 50}
          x2="1000"
          y2={i * 50}
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-border/30"
        />
      ))}

      {/* Distance scale */}
      <text x="50" y="196" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" opacity="0.25">0 AU</text>
      <text x="500" y="196" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.25">0.76 AU</text>
      <text x="950" y="196" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="end" opacity="0.25">1.52 AU</text>

      {/* Glow version of trajectory (behind) */}
      <path
        d="M 50,160 C 150,160 200,140 300,100 S 450,30 550,50 S 700,120 800,80 S 900,20 950,40"
        stroke="var(--color-amber)"
        strokeWidth="4"
        opacity="0.15"
        filter="url(#trajectory-glow)"
      />

      {/* Trajectory curve */}
      <path
        className="trajectory-line"
        d="M 50,160 C 150,160 200,140 300,100 S 450,30 550,50 S 700,120 800,80 S 900,20 950,40"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Spacecraft dot */}
      <circle className="spacecraft-dot" cx="50" cy="160" r="8" fill="url(#craft-glow)" />
      <circle className="spacecraft-dot" cx="50" cy="160" r="3" fill="var(--color-teal)" opacity="0.9" />

      {/* Waypoints with pulsing rings */}
      <g className="waypoint invisible" transform="translate(50, 160)">
        <circle className="waypoint-ring" r="10" fill="none" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.4" />
        <circle r="5" fill="var(--color-teal)" opacity="0.9" />
      </g>
      <g className="waypoint invisible" transform="translate(300, 100)">
        <circle className="waypoint-ring" r="8" fill="none" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />
        <circle r="4" fill="var(--color-amber)" opacity="0.8" />
      </g>
      <g className="waypoint invisible" transform="translate(550, 50)">
        <circle className="waypoint-ring" r="8" fill="none" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" />
        <circle r="4" fill="var(--color-amber)" opacity="0.8" />
      </g>
      <g className="waypoint invisible" transform="translate(800, 80)">
        <circle className="waypoint-ring" r="8" fill="none" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.3" />
        <circle r="4" fill="var(--color-teal)" opacity="0.8" />
      </g>
      <g className="waypoint invisible" transform="translate(950, 40)">
        <circle className="waypoint-ring" r="10" fill="none" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.4" />
        <circle r="5" fill="var(--color-amber)" opacity="0.9" />
      </g>

      {/* Labels */}
      <text className="waypoint-label invisible" x="50" y="185" fill="var(--color-teal)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">EARTH</text>
      <text className="waypoint-label invisible" x="300" y="125" fill="var(--color-amber)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.5">BURN 01</text>
      <text className="waypoint-label invisible" x="550" y="75" fill="var(--color-amber)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.5">COAST</text>
      <text className="waypoint-label invisible" x="800" y="105" fill="var(--color-teal)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.5">CAPTURE</text>
      <text className="waypoint-label invisible" x="950" y="65" fill="var(--color-amber)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">MARS</text>
    </svg>
  );
}

function MissionLog() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".log-entry", {
        autoAlpha: 0,
        x: -10,
        duration: 0.3,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  const entries = [
    { time: "T+00:00:00", event: "LAUNCH.COMMIT", status: "CONFIRMED", color: "teal" },
    { time: "T+00:08:42", event: "MECO.STAGE_1", status: "NOMINAL", color: "teal" },
    { time: "T+00:12:15", event: "FAIRING.SEP", status: "COMPLETE", color: "amber" },
    { time: "T+00:45:00", event: "TLI.BURN", status: "INITIATED", color: "amber" },
    { time: "T+01:12:33", event: "EARTH.SOI_EXIT", status: "CONFIRMED", color: "teal" },
    { time: "T+14d:06h", event: "MID.COURSE_COR", status: "SCHEDULED", color: "amber" },
  ];

  return (
    <div ref={ref} className="mt-8 rounded-sm border border-border/30 bg-card/30 p-4 font-mono text-[10px]">
      <div className="mb-3 flex items-center gap-2 text-[9px] tracking-[0.2em] text-foreground/30 uppercase">
        <span className="inline-block size-1.5 rounded-full bg-teal" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
        Mission Log — ARIA-XII
      </div>
      <div className="space-y-1.5">
        {entries.map((e) => (
          <div key={e.time} className="log-entry invisible flex items-center gap-3">
            <span className="w-20 text-foreground/25">{e.time}</span>
            <span className="text-foreground/50">{e.event}</span>
            <span className={e.color === "teal" ? "ml-auto text-teal/70" : "ml-auto text-amber/70"}>
              {e.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasDecimal = target % 1 !== 0;

  useEffect(() => {
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      onUpdate: () => {
        // Show whole numbers while counting, snap to exact target at the end
        if (hasDecimal && obj.val >= target - 0.5) {
          setDisplay(obj.val.toFixed(1));
        } else {
          setDisplay(String(Math.round(obj.val)));
        }
      },
    });
    return () => { tween.kill(); };
  }, [target, hasDecimal]);

  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{display}{suffix}</span>;
}

const stats = [
  { value: 47, suffix: "", label: "Missions", sub: "COMPLETED" },
  { value: 2.4, suffix: "B", label: "Kilometers", sub: "TRAVELED" },
  { value: 99.7, suffix: "%", label: "Success", sub: "RATE" },
  { value: 340, suffix: "", label: "Days", sub: "TRANSIT TIME" },
];

export default function Missions() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".section-tag", {
        autoAlpha: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".section-tag", start: "top 85%" },
      });

      gsap.from(".mission-heading span", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mission-heading", start: "top 80%" },
      });

      gsap.from(".mission-body", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".mission-body", start: "top 85%" },
      });

      gsap.from(".stat-block", {
        y: 30,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} data-section="missions" className="relative w-full overflow-hidden bg-background">
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

      <div className="relative z-10 px-8 py-24 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="section-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
            // Trajectory Analysis — ARIA-XII
          </div>

          <h2 className="mission-heading mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="block invisible">Earth–Mars</span>
            <span className="block invisible text-amber">Transfer Window</span>
          </h2>

          <p className="mission-body invisible max-w-lg font-mono text-xs leading-relaxed text-foreground/40 sm:text-sm">
            Optimal Hohmann transfer computed for the 2026 launch window.
            Gravity-assist trajectory reduces transit delta-v by 18%.
          </p>

          <Separator className="my-12 bg-border/30" />

          {/* Trajectory visualization */}
          <TrajectoryPath />

          {/* Mission Log */}
          <MissionLog />

          <Separator className="my-12 bg-border/30" />

          {/* Stats grid */}
          <div className="stats-grid grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-block invisible border-l border-amber/20 pl-4">
                <div className="font-mono text-2xl font-bold text-amber sm:text-3xl" style={{ textShadow: "0 0 20px oklch(0.82 0.16 75 / 0.3)" }}>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-sm font-medium text-foreground/70">
                  {stat.label}
                </div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-foreground/30 uppercase">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
