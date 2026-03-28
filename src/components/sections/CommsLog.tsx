import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Separator } from "@/components/ui/separator";
import { useShipConfig } from "@/components/ShipConfigContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Transmission data ─── */

interface Transmission {
  id: number;
  timestamp: string;
  sender: "GROUND" | "VESSEL" | "SYSTEM";
  callsign: string;
  message: string;
  delay?: string;
  glitch?: boolean;
}

const transmissions: Transmission[] = [
  {
    id: 1,
    timestamp: "2026-03-24T06:12:04Z",
    sender: "GROUND",
    callsign: "CAPCOM",
    message: "Astrax-7, Houston. Uplink confirmed. You are GO for trans-Mars injection on schedule.",
    delay: "4.2 min",
  },
  {
    id: 2,
    timestamp: "2026-03-24T06:16:31Z",
    sender: "VESSEL",
    callsign: "ASTRAX-7",
    message: "Copy Houston. Nav lock acquired. All boards green. Crew is restrained and ready.",
    delay: "4.2 min",
  },
  {
    id: 3,
    timestamp: "2026-03-24T06:16:33Z",
    sender: "SYSTEM",
    callsign: "NAV.CORE",
    message: "PULSAR FIX ACQUIRED — 3 SOURCE TRIANGULATION — DRIFT: 0.00041 KM — CONFIDENCE: 99.94%",
  },
  {
    id: 4,
    timestamp: "2026-03-24T06:20:58Z",
    sender: "GROUND",
    callsign: "CAPCOM",
    message: "Astrax-7, we see good telemetry. Ion array is nominal. You are GO for burn at T+00:42:00.",
    delay: "4.3 min",
  },
  {
    id: 5,
    timestamp: "2026-03-24T06:25:14Z",
    sender: "VESSEL",
    callsign: "ASTRAX-7",
    message: "Roger, GO for burn. Setting countdown. It's a beautiful view from up here, Houston.",
    delay: "4.3 min",
  },
  {
    id: 6,
    timestamp: "2026-03-24T06:25:16Z",
    sender: "SYSTEM",
    callsign: "PROP.SYS",
    message: "ION ARRAY PRE-HEAT SEQUENCE INITIATED — EST. READY: T+00:38:00 — CHAMBER TEMP NOMINAL",
  },
  {
    id: 7,
    timestamp: "2026-03-24T06:41:02Z",
    sender: "GROUND",
    callsign: "CAPCOM",
    message: "Astrax-7, T minus sixty seconds. Final go/no-go: Flight — go. EECOM — go. GNC — go. Surgeon — go.",
    delay: "4.3 min",
  },
  {
    id: 8,
    timestamp: "2026-03-24T06:42:00Z",
    sender: "SYSTEM",
    callsign: "PROP.SYS",
    message: "BURN INITIATED — THRUST: 5.4 kN — DELTA-V ACCRUING — ALL CHAMBERS FIRING",
    glitch: true,
  },
  {
    id: 9,
    timestamp: "2026-03-24T06:42:03Z",
    sender: "VESSEL",
    callsign: "ASTRAX-7",
    message: "Burn confirmed. We feel it. Smooth and steady. See you on the other side, Houston.",
    delay: "4.3 min",
  },
  {
    id: 10,
    timestamp: "2026-03-24T06:42:05Z",
    sender: "SYSTEM",
    callsign: "COMMS.NET",
    message: "SIGNAL HANDOFF TO DEEP SPACE RELAY L4-07 — NEXT WINDOW: 14 MIN — BUFFERING ENABLED",
    glitch: true,
  },
];

/* ─── Typewriter component ─── */

function TypewriterText({ text, active, speed = 18, glitch, onComplete }: {
  text: string;
  active: boolean;
  speed?: number;
  glitch?: boolean;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const hasStarted = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Only start once — never re-trigger on subsequent renders
    if (!active || hasStarted.current) return;
    hasStarted.current = true;

    let i = 0;
    setDisplayed("");
    setDone(false);

    intervalRef.current = setInterval(() => {
      i++;
      if (i > text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDone(true);
        onComplete?.();
        return;
      }

      // Occasional glitch: skip ahead or repeat a char
      if (glitch && Math.random() < 0.03 && i < text.length - 2) {
        setDisplayed(text.slice(0, i) + "█" + text.slice(i, i + 1));
        setTimeout(() => setDisplayed(text.slice(0, i + 1)), 60);
        i++;
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active && !hasStarted.current) return null;

  // If done, render full text statically (no re-animation on re-render)
  if (done) return <span>{text}</span>;

  return (
    <span>
      {displayed}
      <span className="inline-block w-[5px] animate-pulse text-amber">█</span>
    </span>
  );
}

/* ─── Audio waveform indicator ─── */

function ActivityIndicator({ active, color }: { active: boolean; color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const dotEls = Array.from(ref.current.children);

    if (active) {
      gsap.to(dotEls, {
        opacity: 0.9,
        scale: 1.4,
        duration: 0.6,
        stagger: { each: 0.3, repeat: -1, yoyo: true },
        ease: "sine.inOut",
      });
    } else {
      dotEls.forEach((el) => gsap.killTweensOf(el));
      gsap.to(dotEls, { opacity: 0.15, scale: 1, duration: 0.3, ease: "power2.out", overwrite: true });
    }

    return () => { dotEls.forEach((el) => gsap.killTweensOf(el)); };
  }, [active]);

  return (
    <div ref={ref} className="flex items-center gap-[3px] shrink-0">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            height: 3,
            backgroundColor: color,
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Single transmission row ─── */

function TransmissionRow({ tx, active, onComplete }: {
  tx: Transmission;
  active: boolean;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasRevealed = useRef(false);
  const [typing, setTyping] = useState(false);

  // Fade in the row when it becomes active
  useEffect(() => {
    if (!active || !ref.current || hasRevealed.current) return;
    hasRevealed.current = true;
    setTyping(true);
    gsap.fromTo(ref.current,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [active]);

  const isSystem = tx.sender === "SYSTEM";
  const isVessel = tx.sender === "VESSEL";

  const senderColor = isSystem
    ? "text-foreground/20"
    : isVessel
      ? "text-teal"
      : "text-amber";

  const messageColor = isSystem
    ? "text-foreground/25"
    : "text-foreground/50";

  const borderColor = isSystem
    ? "border-border/10"
    : isVessel
      ? "border-teal/10"
      : "border-amber/10";

  const waveColor = isSystem
    ? "oklch(0.5 0.01 250)"
    : isVessel
      ? "var(--color-teal)"
      : "var(--color-amber)";

  const handleComplete = () => {
    setTyping(false);
    onComplete();
  };

  return (
    <div ref={ref} className={`invisible relative border-l-2 ${borderColor} py-2 pl-4`}>
      {/* Static noise overlay for glitched messages */}
      {tx.glitch && active && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
            animation: "static-shift 0.1s steps(3) infinite",
          }}
        />
      )}

      {/* Header: timestamp + callsign + waveform + delay */}
      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[9px]">
        <span className="text-foreground/15">
          {tx.timestamp.split("T")[1]?.replace("Z", "")}
        </span>
        <span className={`tracking-[0.2em] uppercase ${senderColor}`}>
          {tx.callsign}
        </span>
        <ActivityIndicator active={typing} color={waveColor} />
        {tx.delay && (
          <span className="text-foreground/12">
            Δ {tx.delay}
          </span>
        )}
        {tx.glitch && (
          <span
            className="tracking-[0.15em] text-amber/30 uppercase"
            style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
          >
            [SIGNAL NOISE]
          </span>
        )}
      </div>

      {/* Message body */}
      <div className={`font-mono text-[11px] leading-relaxed ${messageColor} ${isSystem ? "tracking-[0.08em] text-[10px] uppercase" : ""}`}>
        <TypewriterText
          text={tx.message}
          active={active}
          speed={isSystem ? 12 : 22}
          glitch={tx.glitch}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}

/* ─── Signal strength indicator ─── */

function SignalIndicator() {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barsRef.current) return;

    const bars = barsRef.current.children;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    // Bars flicker between strengths
    tl.to(bars, {
      opacity: "random(0.2, 0.9)",
      duration: 0.1,
      stagger: { each: 0.05, repeat: 5 },
      ease: "none",
    });
    // Settle to strong signal
    tl.to(bars, {
      opacity: (i: number) => 0.3 + i * 0.15,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={barsRef} className="flex items-end gap-[2px]">
      {[6, 9, 12, 15, 18].map((h, i) => (
        <div
          key={i}
          className="w-[3px] bg-teal"
          style={{
            height: `${h}px`,
            opacity: 0.3 + i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main section ─── */

const classifiedTransmission: Transmission = {
  id: 99,
  timestamp: "2026-03-24T06:42:12Z",
  sender: "SYSTEM",
  callsign: "██████",
  message: "CLASSIFIED PAYLOAD DETECTED — CONFIGURATION NUC-STE-WPN FLAGGED — CONTACT ASTRAX COMMAND // AUTH LEVEL: OMEGA — THIS CHANNEL WILL BE PURGED IN 60s",
  glitch: true,
};

export default function CommsLog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const started = useRef(false);
  const { config } = useShipConfig();

  // Derived: is the secret config active?
  const isClassified = config.engine === "nuclear" && config.hull === "stealth" && config.payload === "weapons";
  const logFinished = activeIndex >= transmissions.length - 1;
  const showClassified = isClassified && logFinished;

  // Scroll trigger to kick off the first message
  useEffect(() => {
    if (!logRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: logRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (!started.current) {
          started.current = true;
          setActiveIndex(0);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  // Build the full message list (regular + maybe classified)
  const allTransmissions = useMemo(() => {
    if (showClassified) return [...transmissions, classifiedTransmission];
    return transmissions;
  }, [showClassified]);

  // When classified appears, advance activeIndex so it starts typing
  useEffect(() => {
    if (showClassified && activeIndex === transmissions.length - 1) {
      setActiveIndex(transmissions.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showClassified]);

  // When a message completes, advance to the next after a short pause
  const handleMessageComplete = useRef((index: number) => {
    setTimeout(() => {
      setActiveIndex((prev) => (prev === index ? index + 1 : prev));
    }, 300);
  }).current;

  useGSAP(
    () => {
      gsap.from(".comms-tag", {
        autoAlpha: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".comms-tag", start: "top 85%" },
      });

      gsap.from(".comms-heading span", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".comms-heading", start: "top 80%" },
      });

      gsap.from(".comms-body", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".comms-body", start: "top 85%" },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} data-section="commslog" className="relative w-full overflow-hidden bg-background">
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
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="comms-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
            // Comms.Log — Trans-Mars Channel
          </div>

          <h2 className="comms-heading mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="invisible block">Mission</span>
            <span className="invisible block text-amber">Transmissions</span>
          </h2>

          <div className="comms-body invisible flex items-center gap-4">
            <p className="max-w-lg font-mono text-xs leading-relaxed text-foreground/40 sm:text-sm">
              Live feed from the Astrax-7 trans-Mars injection window.
              Signal delay increases as the vessel departs Earth orbit.
            </p>
            <SignalIndicator />
          </div>

          <Separator className="my-8 bg-border/30" />

          {/* Transmission log */}
          <div ref={logRef} className="space-y-3">
            {allTransmissions.map((tx, i) => (
              <TransmissionRow
                key={tx.id}
                tx={tx}
                active={i <= activeIndex}
                onComplete={() => handleMessageComplete(i)}
              />
            ))}
          </div>

          <Separator className="my-8 bg-border/30" />

          {/* Bottom status */}
          <div className="flex flex-wrap items-center gap-8 font-mono text-[10px] text-foreground/25">
            <div>
              CHANNEL <span className="text-teal/60">DSN-14 // GOLDSTONE</span>
            </div>
            <div>
              SIGNAL.DELAY <span className="text-amber/60">4.3 MIN (INCREASING)</span>
            </div>
            <div>
              BUFFER <span className="text-teal/60">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
