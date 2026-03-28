import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Crew data ─── */

const crew = [
  {
    name: "Cmdr. Elena Vasquez",
    rank: "MISSION COMMANDER",
    mission: "ASTRAX-4 // MARS ORBIT",
    quote: "The nav system locked our trajectory within 0.2km of predicted. Twelve months in deep space and not a single manual correction. That's not luck — that's engineering.",
    years: "14 yr service",
  },
  {
    name: "Dr. Kenji Okafor",
    rank: "CHIEF SCIENCE OFFICER",
    mission: "ASTRAX-6 // ASTEROID SURVEY",
    quote: "We ran continuous spectrograph sweeps for 200 days. The ion array never faltered. I've worked with four agencies — Astrax builds the only hardware I'd trust past Jupiter.",
    years: "9 yr service",
  },
  {
    name: "Lt. Sarah Chen",
    rank: "COMMS SPECIALIST",
    mission: "ASTRAX-3 // VENUS FLYBY",
    quote: "Signal handoff at solar conjunction used to mean 14 days of silence. The relay network gave us continuous contact. My crew could call home on Christmas. That matters.",
    years: "7 yr service",
  },
  {
    name: "Eng. Marcus Webb",
    rank: "PROPULSION ENGINEER",
    mission: "ASTRAX-5 // EUROPA PROBE",
    quote: "I rebuilt the chamber seals at 3 AU with a socket wrench and the maintenance manual. Everything is designed to be serviced in zero-g, in gloves, in the dark. That's respect for the crew.",
    years: "11 yr service",
  },
  {
    name: "Dr. Amara Diallo",
    rank: "FLIGHT SURGEON",
    mission: "ASTRAX-7 // MARS TRANSIT",
    quote: "The radiation shielding data changed my mind about long-duration missions. Crew exposure was 40% below projections. For the first time, I believe we can get to Mars and back healthy.",
    years: "6 yr service",
  },
];

/* ─── Crew card ─── */

function CrewCard({ member, index }: { member: typeof crew[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      autoAlpha: 0,
      x: 40,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "left 90%", horizontal: true },
      delay: index * 0.1,
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="invisible w-80 shrink-0 border border-border/15 bg-card/30 sm:w-96"
    >
      {/* Top accent */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-amber), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="p-6">
        {/* Rank + mission */}
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.2em] text-amber/60 uppercase">
            {member.rank}
          </span>
          <span className="font-mono text-[8px] text-foreground/15">
            {member.years}
          </span>
        </div>

        {/* Quote */}
        <blockquote className="mb-4 font-mono text-[11px] leading-relaxed text-foreground/45">
          &ldquo;{member.quote}&rdquo;
        </blockquote>

        {/* Name + mission */}
        <div className="border-t border-border/10 pt-3">
          <div className="font-mono text-xs font-bold text-foreground/70">
            {member.name}
          </div>
          <div className="mt-0.5 font-mono text-[9px] tracking-[0.15em] text-teal/50">
            {member.mission}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main section ─── */

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".crew-tag", {
      autoAlpha: 0,
      x: -20,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: { trigger: ".crew-tag", start: "top 85%" },
    });

    gsap.from(".crew-heading span", {
      y: 60,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".crew-heading", start: "top 80%" },
    });
  }, { scope: containerRef });

  // Desktop drag-to-scroll with momentum
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;

    const onDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
      velocity = 0;
      lastX = e.clientX;
      lastTime = Date.now();
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      el.scrollLeft = scrollLeft - dx;

      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) {
        velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastTime = now;
      }
    };

    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = "";
      el.style.userSelect = "";

      // Apply momentum
      if (Math.abs(velocity) > 0.1) {
        gsap.to(el, {
          scrollLeft: el.scrollLeft - velocity * 500,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <section ref={containerRef} data-section="testimonials" className="relative w-full overflow-hidden bg-background">
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

      <div className="relative z-10 py-16">
        <div className="px-8 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="crew-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
              // Crew.Log — Field Reports
            </div>

            <h2 className="crew-heading mb-8 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
              <span className="invisible block">From the</span>
              <span className="invisible block text-amber">Crew</span>
            </h2>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={scrollRef}
          className="flex cursor-grab gap-4 overflow-x-auto px-8 pb-4 lg:px-12 xl:px-20"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Left spacer for max-w-5xl alignment */}
          <div className="hidden shrink-0 xl:block" style={{ width: "calc((100vw - 64rem) / 2 - 2.5rem)" }} />
          {crew.map((member, i) => (
            <CrewCard key={member.name} member={member} index={i} />
          ))}
          {/* Right padding */}
          <div className="w-8 shrink-0 lg:w-12 xl:w-20" />
        </div>

        {/* Scroll hint */}
        <div className="mt-4 px-8 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3 font-mono text-[9px] text-foreground/15">
              <div className="h-px w-8 bg-amber/20" />
              <span className="tracking-[0.2em] uppercase">Scroll for more</span>
              <span className="text-amber/30">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
