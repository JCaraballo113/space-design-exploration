import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Separator } from "@/components/ui/separator";


gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── SVG Astronaut ─── */

function Astronaut({
  id,
  flip = false,
  color = "amber",
}: {
  id: string;
  flip?: boolean;
  color?: "amber" | "teal";
}) {
  const accent = `var(--color-${color})`;
  const tx = flip ? "scale(-1, 1)" : "";

  return (
    <g className={`astronaut-${id}`} transform={tx}>
      {/* Backpack */}
      <rect
        x="-14"
        y="-28"
        width="8"
        height="20"
        rx="2"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Backpack detail lines */}
      <line x1="-13" y1="-22" x2="-7" y2="-22" stroke={accent} strokeWidth="0.3" opacity="0.25" />
      <line x1="-13" y1="-16" x2="-7" y2="-16" stroke={accent} strokeWidth="0.3" opacity="0.25" />

      {/* Body / suit */}
      <rect
        x="-6"
        y="-28"
        width="16"
        height="22"
        rx="4"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Suit chest plate */}
      <rect
        x="-2"
        y="-24"
        width="8"
        height="10"
        rx="2"
        fill="none"
        stroke={accent}
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Status light */}
      <circle cx="2" cy="-19" r="1.2" fill={accent} opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Helmet */}
      <ellipse
        cx="2"
        cy="-38"
        rx="11"
        ry="12"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Visor */}
      <ellipse
        cx="4"
        cy="-38"
        rx="7"
        ry="8"
        fill={accent}
        opacity="0.12"
        stroke={accent}
        strokeWidth="0.5"
      />
      {/* Visor reflection */}
      <ellipse cx="6" cy="-41" rx="2.5" ry="3" fill="white" opacity="0.08" />
      {/* Face :D — SVG */}
      {/* Eyes */}
      <circle cx="1" cy="-40" r="1.2" fill={accent} opacity="0.7" />
      <circle cx="7" cy="-40" r="1.2" fill={accent} opacity="0.7" />
      {/* Big grin — open mouth arc */}
      <path
        d="M 0,-36 Q 4,-31 8,-36"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Antenna */}
      <line x1="2" y1="-50" x2="2" y2="-56" stroke="var(--foreground)" strokeWidth="0.5" opacity="0.4" />
      <circle cx="2" cy="-57" r="1.5" fill={accent} opacity="0.5" />

      {/* Left arm — shoulder at (-6,-26), arm hangs down-left */}
      <g className={`arm-left-${id}`} transform="translate(-6, -26)">
        <line
          x1="0"
          y1="0"
          x2="-12"
          y2="12"
          stroke="var(--foreground)"
          strokeWidth="1"
          opacity="0.5"
          strokeLinecap="round"
        />
        <circle cx="-12" cy="12" r="2.5" fill="none" stroke="var(--foreground)" strokeWidth="0.7" opacity="0.4" />
      </g>

      {/* Right arm — shoulder at (10,-26), two segments: upper arm + forearm */}
      <g className={`arm-right-${id}`} transform="translate(10, -26)">
        {/* Upper arm: shoulder (0,0) to elbow */}
        <line
          className={`upper-arm-${id}`}
          x1="0"
          y1="0"
          x2="8"
          y2="10"
          stroke="var(--foreground)"
          strokeWidth="1"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Forearm: elbow to hand */}
        <line
          className={`forearm-${id}`}
          x1="8"
          y1="10"
          x2="12"
          y2="12"
          stroke="var(--foreground)"
          strokeWidth="1"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Glove */}
        <circle className={`hand-${id}`} cx="12" cy="12" r="2.5" fill="none" stroke="var(--foreground)" strokeWidth="0.7" opacity="0.4" />
      </g>

      {/* Left leg — hip at (0,-6) */}
      <g className={`leg-left-${id}`} transform="translate(0, -6)">
        <line
          x1="0"
          y1="0"
          x2="-5"
          y2="18"
          stroke="var(--foreground)"
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        <rect x="-8" y="16" width="7" height="4" rx="1.5" fill="none" stroke="var(--foreground)" strokeWidth="0.7" opacity="0.4" />
      </g>

      {/* Right leg — hip at (4,-6) */}
      <g className={`leg-right-${id}`} transform="translate(4, -6)">
        <line
          x1="0"
          y1="0"
          x2="5"
          y2="18"
          stroke="var(--foreground)"
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        <rect x="1" y="16" width="7" height="4" rx="1.5" fill="none" stroke="var(--foreground)" strokeWidth="0.7" opacity="0.4" />
      </g>
    </g>
  );
}

/* ─── Moon scene ─── */

function MoonScene() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const trigger = svgRef.current;

      // Draw moon surface
      gsap.from(".moon-surface", {
        strokeDashoffset: 2000,
        strokeDasharray: 2000,
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: { trigger, start: "top 80%" },
      });

      gsap.from(".crater", {
        scale: 0,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger, start: "top 75%" },
        delay: 1,
      });

      /*
       * Choreography: astronauts float down from above and land one by one.
       *   a1 drifts down first → lands at x=350
       *   a2 drifts down second → lands at center x=500, then waves
       *   a3 drifts down last → lands at x=680
       *
       * Each floats with slight rotation, lands with a squash-stretch bounce,
       * then settles into a gentle idle hover.
       */

      const st = { scrollTrigger: { trigger, start: "top 75%", once: true } };

      // Helper: build a single timeline per astronaut — no competing tweens
      const ids = ["a1", "a2", "a3"];
      const floatDown = (num: number, delay: number) => {
        const pos = `.astro-pos-${num}`;
        const bounce = `.astro-bounce-${num}`;
        const aid = ids[num - 1];

        const fallDur = 6;
        const hoverAmp = gsap.utils.random(3, 8);
        const hoverSpeed = gsap.utils.random(2.0, 3.0);
        const swayAmp = gsap.utils.random(12, 20);
        const wobble = gsap.utils.random(4, 9);
        const limbDrift = gsap.utils.random(1.8, 2.5);

        const tl = gsap.timeline({
          scrollTrigger: { trigger, start: "top 75%", once: true },
          delay,
        });

        // Phase 1: Fade in + float down + sway
        tl.from(pos, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 0);
        tl.from(pos, { y: -120, duration: fallDur, ease: "sine.out" }, 0);

        // Sway during descent (finite, stops before landing)
        const swayDir = gsap.utils.random([-1, 1]);
        const swayCycles = Math.floor(fallDur / 2);
        tl.to(bounce, {
          x: swayDir * swayAmp,
          rotation: swayDir * wobble,
          duration: 1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: swayCycles * 2 - 1,
        }, 0);

        // Phase 2: Settle upright (overlap with end of descent)
        tl.to(bounce, {
          x: 0,
          rotation: 0,
          duration: 2,
          ease: "power2.out",
          overwrite: true,
        }, fallDur - 2);

        // Landing dust
        tl.from(`.landing-dust-${num}`, {
          autoAlpha: 0, scale: 0, duration: 0.3, ease: "power2.out",
        }, fallDur - 0.2);
        tl.to(`.landing-dust-${num}`, {
          y: -10, autoAlpha: 0, scale: 1.5, duration: 1.2, ease: "power1.out",
        }, fallDur + 0.1);

        // Phase 3: Idle hover (starts after landing, loops forever)
        tl.to(bounce, {
          y: -hoverAmp,
          duration: hoverSpeed,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }, fallDur + 0.5);

        // Limb drift (independent loops, safe because they target different elements)
        const laX = gsap.utils.random(-16, -8), laY = gsap.utils.random(6, 16);
        const limbCfg = { duration: limbDrift, repeat: -1, yoyo: true, ease: "sine.inOut" as const };
        tl.to(`.arm-left-${aid} line`, { attr: { x2: laX, y2: laY }, ...limbCfg }, 0);
        tl.to(`.arm-left-${aid} circle`, { attr: { cx: laX, cy: laY }, ...limbCfg }, 0);

        const driftDur = limbDrift * 1.1;
        const driftCfg = { duration: driftDur, repeat: -1, yoyo: true, ease: "sine.inOut" as const };
        tl.to(`.upper-arm-${aid}`, { attr: { x2: 10, y2: 4 }, ...driftCfg }, 0);
        tl.to(`.forearm-${aid}`, { attr: { x1: 10, y1: 4, x2: 14, y2: 6 }, ...driftCfg }, 0);
        tl.to(`.hand-${aid}`, { attr: { cx: 14, cy: 6 }, ...driftCfg }, 0);

        const llX = gsap.utils.random(-8, -2), llY = gsap.utils.random(14, 20);
        const legCfg = { duration: limbDrift * 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" as const };
        tl.to(`.leg-left-${aid} line`, { attr: { x2: llX, y2: llY }, ...legCfg }, 0.3);
        tl.to(`.leg-left-${aid} rect`, { attr: { x: llX - 3, y: llY - 2 }, ...legCfg }, 0.3);

        const rlX = gsap.utils.random(2, 8), rlY = gsap.utils.random(14, 20);
        tl.to(`.leg-right-${aid} line`, { attr: { x2: rlX, y2: rlY }, ...legCfg }, 0.5);
        tl.to(`.leg-right-${aid} rect`, { attr: { x: rlX - 3, y: rlY - 2 }, ...legCfg }, 0.5);
      };

      // Stagger — tighter gaps so all three appear quickly
      const d1 = gsap.utils.random(0.1, 0.4);
      const d2 = d1 + gsap.utils.random(0.8, 1.5);
      const d3 = d2 + gsap.utils.random(0.8, 1.5);
      floatDown(1, d1);
      floatDown(2, d2);
      floatDown(3, d3);

      // ── a2 wave ──
      const waveDelay = d2 + 7;
      const upperArm = ".upper-arm-a2";
      const forearm = ".forearm-a2";
      const hand = ".hand-a2";

      // Wave sequence as a single timeline — each phase chains from the previous.
      // overwrite:"auto" on the first tweens kills the zero-g drift seamlessly.
      const waveTl = gsap.timeline({ ...st, delay: waveDelay });

      // Phase 1 — Raise: upper arm leads, forearm/hand follow 0.15s later
      waveTl.to(upperArm, { attr: { x2: 14, y2: -6 }, duration: 1, ease: "power2.inOut", overwrite: "auto" }, 0);
      waveTl.to(forearm, { attr: { x1: 14, y1: -6, x2: 14, y2: -16 }, duration: 1, ease: "power2.inOut", overwrite: "auto" }, 0.15);
      waveTl.to(hand, { attr: { cx: 14, cy: -16 }, duration: 1, ease: "power2.inOut", overwrite: "auto" }, 0.15);

      // Phase 2 — Bridge: swing from raise endpoint (14) to right extreme (22)
      // ">" = starts right after the previous tween ends (forearm/hand at 1.15s)
      waveTl.to(forearm, { attr: { x2: 22, y2: -16 }, duration: 0.25, ease: "sine.in" }, ">");
      waveTl.to(hand, { attr: { cx: 22, cy: -16 }, duration: 0.25, ease: "sine.in" }, "<");

      // Phase 3 — Oscillate: each gsap.to reads current value (22) as start, swings to 6, yoyos
      waveTl.to(forearm, { attr: { x2: 6, y2: -16 }, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" }, ">");
      waveTl.to(hand, { attr: { cx: 6, cy: -16 }, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" }, "<");

      // Speech bubble pops in shortly after wave starts
      gsap.from(".speech-bubble", {
        autoAlpha: 0, scale: 0, transformOrigin: "left bottom",
        duration: 0.6, ease: "back.out(1.5)",
        ...st, delay: waveDelay + 1.5,
      });

      // Flag — appears early
      gsap.from(".flag-group", {
        scaleY: 0,
        autoAlpha: 0,
        duration: 0.6,
        ease: "back.out(2)",
        transformOrigin: "bottom center",
        ...st,
        delay: 0.5,
      });

      // Wave starts after the pole has sprung up (pole: delay 0.5 + dur 0.6)
      const flagReady = 1.3;

      // Ramp up the displacement filter from 0 → 3.5
      gsap.to(".flag-displace", {
        attr: { scale: 3.5 },
        duration: 1.5,
        ease: "power2.inOut",
        ...st,
        delay: flagReady,
      });

      // Gentle sway — complements the wave filter for a subtle billow
      gsap.to(".flag-fabric", {
        skewX: 3,
        scaleX: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        ...st,
        delay: flagReady,
      });

      // Stars — fade in then twinkle
      gsap.from(".scene-star", {
        autoAlpha: 0,
        duration: 0.4,
        stagger: { amount: 1.5, from: "random" },
        ease: "power2.out",
        scrollTrigger: { trigger, start: "top 80%" },
      });
      gsap.to(".scene-star", {
        autoAlpha: 0.08,
        duration: 1.5,
        stagger: { amount: 3, from: "random", repeat: -1, yoyo: true },
        ease: "sine.inOut",
        scrollTrigger: { trigger, start: "top 80%" },
        delay: 2,
      });

      // Shooting stars — animate SVG line endpoints directly (x1/y1/x2/y2)
      // so we avoid CSS transform issues on SVG elements.
      const shootStar = (sel: string, startDelay: number) => {
        const sx = gsap.utils.random(80, 350);
        const sy = gsap.utils.random(130, 220);
        const dx = gsap.utils.random(0.15, 0.25); // slope ratio — shallow angle
        const tailLen = gsap.utils.random(50, 80); // streak tail length

        const tl = gsap.timeline({ ...st, delay: startDelay });

        // Start: collapsed point, hidden
        tl.set(sel, { attr: { x1: sx, y1: sy, x2: sx, y2: sy }, autoAlpha: 0 });

        // Phase 1: appear + grow tail (head races ahead, tail follows)
        tl.to(sel, {
          attr: { x1: sx + 200, y1: sy + 200 * dx, x2: sx + 200 + tailLen, y2: sy + (200 + tailLen) * dx },
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.in",
        });

        // Phase 2: streak across + fade out
        tl.to(sel, {
          attr: { x1: sx + 550, y1: sy + 550 * dx, x2: sx + 550 + tailLen, y2: sy + (550 + tailLen) * dx },
          autoAlpha: 0,
          duration: 0.9,
          ease: "power1.out",
        });
      };

      shootStar(".shooting-star-1", d1 + gsap.utils.random(1.5, 3));
      shootStar(".shooting-star-2", d2 + gsap.utils.random(2, 4));
      shootStar(".shooting-star-3", d1 + gsap.utils.random(4, 6));
      shootStar(".shooting-star-4", d3 + gsap.utils.random(1, 3));
      shootStar(".shooting-star-5", d2 + gsap.utils.random(5, 7));

      // ── Jetpack boosts — a1 and a3 randomly fire thrusters after landing ──
      // Boosts animate the *pos* group (parent) so they layer on top of the
      // idle bob that runs on the *bounce* group (child). No conflicts.
      // Uses ScrollTrigger-delayed tween to start the timer when visible.
      const jetBoost = (num: 1 | 3, staggerDelay: number) => {
        const boost = `.astro-boost-${num}`;
        const thruster = `.thruster-a${num}`;

        const fireOnce = () => {
          const boostHeight = gsap.utils.random(6, 12);
          const riseDur = gsap.utils.random(1.5, 2.5);

          const tl = gsap.timeline({ onComplete: scheduleNext });

          // Gentle thruster fade-in
          tl.to(thruster, { autoAlpha: 1, duration: 0.3, ease: "power1.in" }, 0);

          // Flame flicker throughout the boost
          tl.to(`${thruster} ellipse`, {
            scaleY: gsap.utils.random(0.6, 1.4),
            duration: 0.08,
            repeat: Math.floor((riseDur + 0.5) / 0.08),
            yoyo: true,
            ease: "none",
          }, 0);

          // Floaty rise on isolated boost group — nothing else touches this
          tl.to(boost, {
            y: -boostHeight,
            duration: riseDur,
            ease: "power1.out",
          }, 0);

          // Thruster fades out mid-rise — momentum carries the rest
          tl.to(thruster, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, riseDur * 0.6);

          // Long gentle drift back to y:0 — no other tween on this group
          tl.to(boost, {
            y: 0,
            duration: riseDur * 5,
            ease: "sine.out",
          }, riseDur + 1);
        };

        const scheduleNext = () => {
          gsap.delayedCall(gsap.utils.random(4, 10), fireOnce);
        };

        // Kick off after landing — tied to ScrollTrigger so timing is correct.
        // staggerDelay + 12 (max fall) + random 2-5 = first boost
        gsap.to({}, {
          duration: 0.01,
          ...st,
          delay: staggerDelay + 12 + gsap.utils.random(2, 5),
          onComplete: fireOnce,
        });
      };

      jetBoost(1, d1);
      jetBoost(3, d3);
    },
    { scope: svgRef }
  );

  const stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * 900 + 50,
    y: Math.random() * 200 + 110,
    r: Math.random() * 1.2 + 0.3,
  }));

  return (
    <svg
      ref={svgRef}
      viewBox="0 100 1000 340"
      className="w-full"
      fill="none"
    >
      {/* Wave filter for flag — feTurbulence generates shifting noise,
          feDisplacementMap ripples the flag fabric through it */}
      <defs>
        <filter id="flag-wave" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.12"
            numOctaves="3"
            seed="2"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.04 0.12;0.06 0.12;0.04 0.12"
              dur="4s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            className="flag-displace"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* Stars */}
      {stars.map((s, i) => (
        <circle
          key={i}
          className="scene-star invisible"
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="white"
          opacity={0.15 + Math.random() * 0.25}
        />
      ))}

      {/* Shooting stars — rendered before moon surface so they pass behind it */}
      <line className="shooting-star-1 invisible" x1="0" y1="0" x2="0" y2="0" stroke="var(--color-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line className="shooting-star-2 invisible" x1="0" y1="0" x2="0" y2="0" stroke="var(--color-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line className="shooting-star-3 invisible" x1="0" y1="0" x2="0" y2="0" stroke="var(--color-amber)" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <line className="shooting-star-4 invisible" x1="0" y1="0" x2="0" y2="0" stroke="var(--color-amber)" strokeWidth="1.0" strokeLinecap="round" opacity="0.6" />
      <line className="shooting-star-5 invisible" x1="0" y1="0" x2="0" y2="0" stroke="var(--color-amber)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

      {/* Opaque moon ground — sits above shooting stars to occlude them */}
      <path
        d="M 0,360 Q 80,350 150,358 Q 220,366 300,355 Q 400,340 500,352 Q 600,364 700,350 Q 800,336 900,348 Q 950,354 1000,350 L 1000,440 L 0,440 Z"
        fill="var(--background)"
      />

      {/* Earth in sky */}
      <circle cx="820" cy="140" r="30" fill="var(--color-teal)" opacity="0.04" />
      <circle cx="820" cy="140" r="30" fill="none" stroke="var(--color-teal)" strokeWidth="0.8" opacity="0.25" />
      {/* Continents */}
      <ellipse cx="812" cy="133" rx="16" ry="9" fill="none" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0.15" />
      <ellipse cx="828" cy="147" rx="10" ry="6" fill="none" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.12" />
      <ellipse cx="808" cy="150" rx="6" ry="4" fill="none" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.1" />
      {/* Atmospheric glow */}
      <circle cx="820" cy="140" r="34" fill="none" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.08" />

      {/* Moon surface */}
      <path
        className="moon-surface"
        d="M 0,360 Q 80,350 150,358 Q 220,366 300,355 Q 400,340 500,352 Q 600,364 700,350 Q 800,336 900,348 Q 950,354 1000,350 L 1000,440 L 0,440 Z"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Surface fill */}
      <path
        d="M 0,360 Q 80,350 150,358 Q 220,366 300,355 Q 400,340 500,352 Q 600,364 700,350 Q 800,336 900,348 Q 950,354 1000,350 L 1000,440 L 0,440 Z"
        fill="var(--color-amber)"
        opacity="0.03"
      />

      {/* Craters */}
      <ellipse className="crater invisible" cx="180" cy="385" rx="30" ry="8" fill="none" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.15" />
      <ellipse className="crater invisible" cx="500" cy="380" rx="40" ry="10" fill="none" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.12" />
      <ellipse className="crater invisible" cx="750" cy="375" rx="25" ry="6" fill="none" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.1" />
      <ellipse className="crater invisible" cx="350" cy="395" rx="15" ry="4" fill="none" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.08" />
      <ellipse className="crater invisible" cx="880" cy="382" rx="20" ry="5" fill="none" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.1" />

      {/* Flag — pole base at surface level */}
      <g className="flag-group invisible" transform="translate(420, 300)">
        <line x1="0" y1="0" x2="0" y2="50" stroke="var(--foreground)" strokeWidth="1" opacity="0.4" />
        <g className="flag-fabric" style={{ transformOrigin: "0px 0px" }} filter="url(#flag-wave)">
          <rect x="1" y="0" width="32" height="20" rx="1" fill="var(--color-amber)" opacity="0.12" stroke="var(--color-amber)" strokeWidth="0.5" />
          <text x="17" y="13" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.5">AX</text>
        </g>
      </g>

      {/* Landing dust puffs — one per astronaut landing position */}
      <g className="landing-dust-1 invisible" opacity="0.08">
        <circle cx="350" cy="350" r="6" fill="var(--color-amber)" />
        <circle cx="340" cy="347" r="4" fill="var(--color-amber)" />
        <circle cx="360" cy="348" r="3" fill="var(--color-amber)" />
      </g>
      <g className="landing-dust-2 invisible" opacity="0.08">
        <circle cx="500" cy="340" r="7" fill="var(--color-amber)" />
        <circle cx="490" cy="337" r="4" fill="var(--color-amber)" />
        <circle cx="512" cy="338" r="3" fill="var(--color-amber)" />
      </g>
      <g className="landing-dust-3 invisible" opacity="0.08">
        <circle cx="680" cy="342" r="6" fill="var(--color-amber)" />
        <circle cx="670" cy="339" r="4" fill="var(--color-amber)" />
        <circle cx="690" cy="340" r="3" fill="var(--color-amber)" />
      </g>

      {/* Astronauts — float down from above, render back to front */}

      {/* Astronaut 3 — rightmost, lands last */}
      <g className="astro-pos-3 invisible" transform="translate(680, 342)">
        <g className="astro-boost-3">
          <g className="astro-bounce-3">
            <Astronaut id="a3" color="teal" />
            {/* Jetpack thruster flames — hidden until boost fires */}
            <g className="thruster-a3 invisible" opacity="0">
              <ellipse cx="-10" cy="-6" rx="2" ry="5" fill="var(--color-amber)" opacity="0.7" />
              <ellipse cx="-10" cy="-4" rx="1.2" ry="3" fill="white" opacity="0.5" />
            </g>
          </g>
        </g>
      </g>

      {/* Astronaut 2 — center, waves + speech bubble attached */}
      <g className="astro-pos-2 invisible" transform="translate(500, 340)">
        <g className="astro-bounce-2">
          <Astronaut id="a2" color="amber" />
          {/* Speech bubble — inside bounce group so it floats with the astronaut */}
          <g className="speech-bubble invisible">
            <rect x="16" y="-74" width="95" height="26" rx="8" fill="var(--color-amber)" opacity="0.08" />
            <rect x="16" y="-74" width="95" height="26" rx="8" fill="none" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.4" />
            <path d="M 28,-48 L 22,-40 L 36,-48" fill="var(--color-amber)" opacity="0.08" stroke="none" />
            <line x1="22" y1="-40" x2="28" y2="-48" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.4" />
            <line x1="22" y1="-40" x2="36" y2="-48" stroke="var(--color-amber)" strokeWidth="0.7" opacity="0.4" />
            <text x="63" y="-57" fill="var(--color-amber)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.9" fontWeight="bold">
              Come join us!
            </text>
          </g>
        </g>
      </g>

      {/* Astronaut 1 — leftmost, lands first */}
      <g className="astro-pos-1 invisible" transform="translate(350, 350)">
        <g className="astro-boost-1">
          <g className="astro-bounce-1">
            <Astronaut id="a1" color="teal" />
            {/* Jetpack thruster flames — hidden until boost fires */}
            <g className="thruster-a1 invisible" opacity="0">
              <ellipse cx="-10" cy="-6" rx="2" ry="5" fill="var(--color-amber)" opacity="0.7" />
              <ellipse cx="-10" cy="-4" rx="1.2" ry="3" fill="white" opacity="0.5" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ─── Job listings ─── */

const roles = [
  { title: "Flight Dynamics Engineer", team: "NAV.CORE", location: "REMOTE / HOUSTON", type: "FULL-TIME" },
  { title: "Propulsion Systems Lead", team: "PROP.SYS", location: "HAWTHORNE", type: "FULL-TIME" },
  { title: "Deep-Space Comms Architect", team: "COMMS.NET", location: "REMOTE", type: "FULL-TIME" },
  { title: "Mission Operations Analyst", team: "OPS.CTR", location: "HOUSTON", type: "CONTRACT" },
];

function RoleList() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".role-row", {
        y: 20,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="mt-4 space-y-0">
      {roles.map((role) => (
        <div
          key={role.title}
          className="role-row invisible flex flex-col gap-2 border-b border-border/15 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-sm font-medium text-foreground/80">{role.title}</div>
            <div className="mt-0.5 flex items-center gap-3 font-mono text-[9px] text-foreground/30">
              <span className="text-amber/60">{role.team}</span>
              <span>{role.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.15em] text-foreground/25 uppercase">
              {role.type}
            </span>
            <span className="inline-flex items-center border border-amber/20 px-3 py-1 font-mono text-[9px] tracking-[0.15em] text-amber/70 uppercase transition-colors hover:border-amber/40 hover:text-amber">
              Apply →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main section ─── */

export default function Careers() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".careers-tag", {
        autoAlpha: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".careers-tag", start: "top 85%" },
      });

      gsap.from(".careers-heading span", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".careers-heading", start: "top 80%" },
      });

      gsap.from(".careers-body", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".careers-body", start: "top 85%" },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} data-section="careers" className="relative w-full overflow-hidden bg-background">
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
          <div className="careers-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
            // Crew Manifest — Open Positions
          </div>

          <h2 className="careers-heading mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="block invisible">Join the</span>
            <span className="block invisible text-amber">Mission</span>
          </h2>

          <p className="careers-body invisible max-w-lg font-mono text-xs leading-relaxed text-foreground/40 sm:text-sm">
            We're assembling the crew for humanity's next chapter.
            Engineers, scientists, and dreamers — your mission awaits.
          </p>

          <Separator className="my-8 bg-border/30" />
        </div>
      </div>

      {/* Moon scene — full bleed, no padding */}
      <MoonScene />

      <div className="relative z-10 px-8 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <Separator className="my-8 bg-border/30" />

          {/* Open roles */}
          <div className="mb-3 font-mono text-[9px] tracking-[0.2em] text-foreground/25 uppercase">
            Open Positions — {roles.length} Active
          </div>
          <RoleList />

          <div className="mt-8 font-mono text-[10px] text-foreground/20">
            Don't see your role? <span className="text-amber/50 transition-colors hover:text-amber">general@astrax.space</span>
          </div>
        </div>
      </div>
    </section>
  );
}
