import { useState, useCallback, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/sections/Hero";
import Missions from "@/components/sections/Missions";
import Configurator from "@/components/sections/Configurator";
import Technology from "@/components/sections/Technology";
import CommsLog from "@/components/sections/CommsLog";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import Careers from "@/components/sections/Careers";
import { Preloader } from "@/components/ui/preloader";
import { SectionDivider } from "@/components/ui/section-divider";
import { ShipConfigProvider } from "@/components/ShipConfigContext";

gsap.registerPlugin(ScrollTrigger);

const sectionIds = [
  { id: "hero", label: "HERO" },
  { id: "missions", label: "MISSIONS" },
  { id: "configurator", label: "CONFIG" },
  { id: "technology", label: "TECH" },
  { id: "commslog", label: "COMMS" },
  { id: "careers", label: "CAREERS" },
];

function ScrollProgress({ visible }: { visible: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [waypoints, setWaypoints] = useState<{ id: string; label: string; pct: number }[]>([]);
  const [hoveredWp, setHoveredWp] = useState<string | null>(null);

  // Calculate waypoint positions
  useEffect(() => {
    if (!visible) return;

    const compute = () => {
      const docHeight = document.documentElement.scrollHeight;
      const sections = document.querySelectorAll("section[data-section]");
      const wps: { id: string; label: string; pct: number }[] = [];

      sections.forEach((el) => {
        const id = el.getAttribute("data-section") || "";
        const match = sectionIds.find((s) => s.id === id);
        if (match) {
          const top = (el as HTMLElement).offsetTop;
          wps.push({ id, label: match.label, pct: (top / docHeight) * 100 });
        }
      });

      setWaypoints(wps);
    };

    // Compute after layout settles
    const timer = setTimeout(compute, 500);
    window.addEventListener("resize", compute);
    return () => { clearTimeout(timer); window.removeEventListener("resize", compute); };
  }, [visible]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || !visible) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      gsap.set(bar, { scaleY: progress });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [visible]);

  // Fade in the track once the page is ready
  useEffect(() => {
    if (!trackRef.current || !visible) return;
    gsap.fromTo(trackRef.current, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: 1.0,
      delay: 2.0,
      ease: "power2.out",
    });
  }, [visible]);

  return (
    <div
      ref={trackRef}
      className="fixed right-0 top-0 z-50 hidden h-full w-[3px] lg:block"
      style={{ opacity: 0 }}
    >
      {/* Track background */}
      <div className="absolute inset-0 bg-border/10" />
      {/* Progress bar */}
      <div
        ref={barRef}
        className="absolute inset-x-0 top-0 h-full origin-top"
        style={{
          transform: "scaleY(0)",
          background: "linear-gradient(180deg, var(--color-amber), var(--color-teal))",
          opacity: 0.5,
        }}
      />

      {/* Section waypoint ticks */}
      {waypoints.map((wp) => (
        <div
          key={wp.id}
          className="group absolute right-0"
          style={{ top: `${wp.pct}%` }}
          onMouseEnter={() => setHoveredWp(wp.id)}
          onMouseLeave={() => setHoveredWp(null)}
        >
          {/* Tick mark */}
          <div
            className="h-px transition-all duration-200"
            style={{
              width: hoveredWp === wp.id ? 12 : 7,
              backgroundColor: "var(--color-amber)",
              opacity: hoveredWp === wp.id ? 0.7 : 0.3,
            }}
          />
          {/* Label tooltip */}
          {hoveredWp === wp.id && (
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 whitespace-nowrap border border-amber/20 bg-background px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-amber/60"
              style={{ boxShadow: "0 0 8px oklch(0.82 0.16 75 / 0.1)" }}
            >
              {wp.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 hidden border border-amber/20 bg-background/80 p-2.5 backdrop-blur-sm transition-all duration-300 hover:border-amber/50 hover:bg-amber/5 lg:block"
      aria-label="Back to top"
      style={{ boxShadow: "0 0 10px oklch(0.82 0.16 75 / 0.1)" }}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="var(--color-amber)" strokeWidth="1.5" opacity="0.6">
        <path d="M8 12V4M4 7l4-3 4 3" />
      </svg>
    </button>
  );
}

function MissionPatch() {
  const orbitRef = useRef<SVGEllipseElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!orbitRef.current) return;
    // Set initial rotation, then create paused infinite spin
    gsap.set(orbitRef.current, { rotation: -30, svgOrigin: "80 80" });
    tweenRef.current = gsap.to(orbitRef.current, {
      rotation: "+=360",
      duration: 8,
      ease: "none",
      repeat: -1,
      paused: true,
      svgOrigin: "80 80",
    });
    return () => { tweenRef.current?.kill(); };
  }, []);

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      className="group w-28 cursor-pointer"
      onMouseEnter={() => tweenRef.current?.play()}
      onMouseLeave={() => tweenRef.current?.pause()}
    >
      {/* Outer ring */}
      <circle cx="80" cy="80" r="74" stroke="var(--color-amber)" strokeWidth="0.6" opacity="0.5" className="transition-opacity duration-500 group-hover:opacity-70" />
      <circle cx="80" cy="80" r="70" stroke="var(--color-amber)" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.35" className="transition-opacity duration-500 group-hover:opacity-50" />

      {/* Inner ring */}
      <circle cx="80" cy="80" r="45" stroke="var(--color-teal)" strokeWidth="0.5" opacity="0.4" className="transition-opacity duration-500 group-hover:opacity-60" />

      {/* Star/compass at center */}
      <line x1="80" y1="55" x2="80" y2="30" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.6" />
      <line x1="80" y1="105" x2="80" y2="130" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.6" />
      <line x1="55" y1="80" x2="30" y2="80" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.6" />
      <line x1="105" y1="80" x2="130" y2="80" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.6" />

      {/* Diagonal ticks */}
      <line x1="62" y1="62" x2="50" y2="50" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.35" />
      <line x1="98" y1="62" x2="110" y2="50" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.35" />
      <line x1="62" y1="98" x2="50" y2="110" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.35" />
      <line x1="98" y1="98" x2="110" y2="110" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.35" />

      {/* Center dot — pulses on hover */}
      <circle cx="80" cy="80" r="3" fill="var(--color-amber)" opacity="0.8" className="origin-center transition-transform duration-500 group-hover:scale-150" style={{ transformOrigin: "80px 80px" }} />
      <circle cx="80" cy="80" r="8" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.35" className="origin-center transition-all duration-500 group-hover:opacity-60 group-hover:scale-125" style={{ transformOrigin: "80px 80px" }} />

      {/* Orbital arc — rotates on hover, keeps position */}
      <ellipse ref={orbitRef} cx="80" cy="80" rx="55" ry="25" stroke="var(--color-teal)" strokeWidth="0.5" className="opacity-30 transition-opacity duration-500 group-hover:opacity-50" />

      {/* Small body on orbit */}
      <circle cx="128" cy="68" r="1.5" fill="var(--color-teal)" opacity="0.7" className="transition-opacity duration-500 group-hover:opacity-100" />

      {/* Text around ring */}
      <text x="80" y="18" fill="var(--color-amber)" fontSize="5" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="0.15em" opacity="0.55" className="transition-opacity duration-500 group-hover:opacity-80">
        ASTRAX DEEP SPACE SYSTEMS
      </text>
      <text x="80" y="150" fill="var(--color-amber)" fontSize="4.5" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="0.12em" opacity="0.4" className="transition-opacity duration-500 group-hover:opacity-60">
        AD ASTRA PER ASPERA
      </text>
    </svg>
  );
}

// Respect reduced motion preference globally for GSAP
if (typeof window !== "undefined") {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mql.matches) {
    gsap.defaults({ duration: 0 });
    gsap.globalTimeline.timeScale(100); // effectively instant
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const handlePreloaderComplete = useCallback(() => setReady(true), []);

  // Subtle parallax: section content floats up slightly as you scroll through
  useEffect(() => {
    if (!ready) return;

    const sections = document.querySelectorAll<HTMLElement>("section[data-section]");
    const tweens: gsap.core.Tween[] = [];

    sections.forEach((section) => {
      // Target the first z-10 content wrapper inside the section
      const content = section.querySelector<HTMLElement>(".relative.z-10");
      if (!content) return;

      tweens.push(
        gsap.fromTo(content,
          { y: 20 },
          {
            y: -10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      );
    });

    return () => { tweens.forEach((t) => t.kill()); };
  }, [ready]);

  return (
    <ShipConfigProvider>
    <div className="bg-background">
      <ScrollProgress visible={ready} />
      <BackToTop />
      <Preloader onComplete={handlePreloaderComplete} />
      <Hero ready={ready} />
      <SectionDivider color="amber" />
      <Missions />
      <Stats />
      <SectionDivider color="teal" />
      <Configurator />
      <SectionDivider color="amber" />
      <Technology />
      <SectionDivider color="teal" />
      <CommsLog />
      <SectionDivider color="amber" />
      <Testimonials />
      <SectionDivider color="teal" />
      <Careers />
      <SectionDivider color="teal" />

      {/* Footer */}
      <footer className="bg-background px-8 py-16 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-5xl">
          {/* Mission patch + sign-off */}
          <div className="flex flex-col items-center gap-8">
            {/* SVG Mission Patch */}
            <MissionPatch />

            {/* Transmission ends */}
            <div className="text-center">
              <div className="mb-2 font-mono text-[9px] tracking-[0.4em] text-foreground/30 uppercase">
                — End of Transmission —
              </div>
              <div className="font-mono text-[8px] tracking-[0.2em] text-foreground/20">
                RA 14h 29m 42.9s // DEC −62° 40′ 46″ // EPOCH J2026.0
              </div>
            </div>
          </div>

          {/* Links + copyright */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="font-mono text-[10px] tracking-[0.3em] text-foreground/30 uppercase">
              Astrax
            </div>
            <div className="flex items-center gap-6 font-mono text-[10px] text-foreground/15">
              <a href="#" className="transition-colors hover:text-amber/50">Careers</a>
              <a href="#" className="transition-colors hover:text-amber/50">Updates</a>
              <a href="#" className="transition-colors hover:text-amber/50">Privacy</a>
            </div>
            <div className="font-mono text-[10px] text-foreground/15">&copy; 2026</div>
          </div>
        </div>
      </footer>
    </div>
    </ShipConfigProvider>
  );
}
