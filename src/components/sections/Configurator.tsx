import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Separator } from "@/components/ui/separator";
import { useShipConfig } from "@/components/ShipConfigContext";


gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Configuration data ─── */

type EngineType = "ion" | "chemical" | "nuclear";
type HullType = "lightweight" | "reinforced" | "stealth";
type PayloadType = "science" | "cargo" | "weapons";

interface ShipConfig {
  engine: EngineType;
  hull: HullType;
  payload: PayloadType;
}

interface ShipStats {
  thrust: string;
  range: string;
  mass: string;
  crew: number;
}

const statsByConfig: Record<EngineType, Record<HullType, Record<PayloadType, ShipStats>>> = {
  ion: {
    lightweight: {
      science: { thrust: "5.4", range: "48.2", mass: "12,400", crew: 4 },
      cargo: { thrust: "4.1", range: "36.7", mass: "18,900", crew: 2 },
      weapons: { thrust: "4.8", range: "31.4", mass: "16,200", crew: 3 },
    },
    reinforced: {
      science: { thrust: "3.8", range: "34.6", mass: "22,100", crew: 6 },
      cargo: { thrust: "2.9", range: "26.3", mass: "28,500", crew: 4 },
      weapons: { thrust: "3.4", range: "22.8", mass: "25,800", crew: 5 },
    },
    stealth: {
      science: { thrust: "4.6", range: "41.5", mass: "15,700", crew: 3 },
      cargo: { thrust: "3.5", range: "30.1", mass: "21,300", crew: 2 },
      weapons: { thrust: "4.2", range: "27.9", mass: "19,600", crew: 2 },
    },
  },
  chemical: {
    lightweight: {
      science: { thrust: "24.0", range: "8.4", mass: "14,200", crew: 4 },
      cargo: { thrust: "18.6", range: "6.1", mass: "20,800", crew: 2 },
      weapons: { thrust: "21.0", range: "5.5", mass: "18,100", crew: 3 },
    },
    reinforced: {
      science: { thrust: "18.2", range: "6.2", mass: "24,600", crew: 6 },
      cargo: { thrust: "14.0", range: "4.7", mass: "31,200", crew: 4 },
      weapons: { thrust: "16.4", range: "4.1", mass: "28,400", crew: 5 },
    },
    stealth: {
      science: { thrust: "20.8", range: "7.1", mass: "17,500", crew: 3 },
      cargo: { thrust: "16.2", range: "5.3", mass: "23,100", crew: 2 },
      weapons: { thrust: "19.0", range: "4.8", mass: "21,400", crew: 2 },
    },
  },
  nuclear: {
    lightweight: {
      science: { thrust: "12.6", range: "92.0", mass: "18,800", crew: 4 },
      cargo: { thrust: "9.8", range: "68.4", mass: "25,400", crew: 2 },
      weapons: { thrust: "11.2", range: "61.0", mass: "22,700", crew: 3 },
    },
    reinforced: {
      science: { thrust: "9.4", range: "64.8", mass: "28,200", crew: 6 },
      cargo: { thrust: "7.2", range: "48.6", mass: "34,800", crew: 4 },
      weapons: { thrust: "8.6", range: "42.1", mass: "32,100", crew: 5 },
    },
    stealth: {
      science: { thrust: "11.0", range: "78.4", mass: "22,100", crew: 3 },
      cargo: { thrust: "8.6", range: "58.2", mass: "27,600", crew: 2 },
      weapons: { thrust: "10.0", range: "52.5", mass: "25,900", crew: 2 },
    },
  },
};

function getStats(config: ShipConfig): ShipStats {
  return statsByConfig[config.engine][config.hull][config.payload];
}

/* ─── SVG part definitions for each option ─── */

interface SvgPart {
  paths: Array<{ d: string; stroke: string; strokeWidth: string; opacity: string }>;
  lines: Array<{ x1: string; y1: string; x2: string; y2: string; stroke: string; strokeWidth: string; opacity: string }>;
  rects: Array<{ x: string; y: string; width: string; height: string; rx?: string; stroke: string; strokeWidth: string; opacity: string }>;
  circles: Array<{ cx: string; cy: string; r: string; fill?: string; stroke?: string; strokeWidth?: string; opacity: string }>;
  label: string;
  labelPos: { x: string; y: string };
}

const engineParts: Record<EngineType, SvgPart> = {
  ion: {
    paths: [
      { d: "M 590,88 L 630,75 L 630,145 L 590,132", stroke: "var(--color-teal)", strokeWidth: "0.5", opacity: "0.35" },
      { d: "M 630,75 L 660,68 M 630,145 L 660,152", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.2" },
    ],
    lines: [
      { x1: "640", y1: "85", x2: "670", y2: "85", stroke: "var(--color-teal)", strokeWidth: "0.3", opacity: "0.2" },
      { x1: "640", y1: "100", x2: "680", y2: "100", stroke: "var(--color-teal)", strokeWidth: "0.35", opacity: "0.25" },
      { x1: "640", y1: "110", x2: "690", y2: "110", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.3" },
      { x1: "640", y1: "120", x2: "680", y2: "120", stroke: "var(--color-teal)", strokeWidth: "0.35", opacity: "0.25" },
      { x1: "640", y1: "135", x2: "670", y2: "135", stroke: "var(--color-teal)", strokeWidth: "0.3", opacity: "0.2" },
    ],
    rects: [
      { x: "555", y: "90", width: "40", height: "40", stroke: "var(--color-teal)", strokeWidth: "0.5", opacity: "0.25" },
    ],
    circles: [
      { cx: "575", cy: "110", r: "8", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.3" },
      { cx: "575", cy: "110", r: "2", fill: "var(--color-teal)", opacity: "0.6" },
    ],
    label: "ION.DRIVE",
    labelPos: { x: "610", y: "165" },
  },
  chemical: {
    paths: [
      { d: "M 590,82 L 650,65 L 650,155 L 590,138", stroke: "var(--color-teal)", strokeWidth: "0.6", opacity: "0.35" },
      { d: "M 650,65 Q 670,110 650,155", stroke: "var(--color-teal)", strokeWidth: "0.5", opacity: "0.25" },
    ],
    lines: [
      { x1: "560", y1: "95", x2: "560", y2: "125", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.2" },
      { x1: "570", y1: "90", x2: "570", y2: "130", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.25" },
      { x1: "580", y1: "87", x2: "580", y2: "133", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.25" },
    ],
    rects: [
      { x: "540", y: "85", width: "55", height: "50", rx: "2", stroke: "var(--color-teal)", strokeWidth: "0.5", opacity: "0.3" },
    ],
    circles: [
      { cx: "650", cy: "110", r: "6", stroke: "var(--color-teal)", strokeWidth: "0.5", opacity: "0.4" },
      { cx: "650", cy: "110", r: "2.5", fill: "var(--color-teal)", opacity: "0.7" },
    ],
    label: "CHEM.THRUST",
    labelPos: { x: "610", y: "165" },
  },
  nuclear: {
    paths: [
      { d: "M 590,80 L 660,60 L 660,160 L 590,140", stroke: "var(--color-teal)", strokeWidth: "0.6", opacity: "0.35" },
      { d: "M 660,60 L 680,55 M 660,160 L 680,165", stroke: "var(--color-teal)", strokeWidth: "0.4", opacity: "0.2" },
    ],
    lines: [
      { x1: "660", y1: "90", x2: "695", y2: "90", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.2" },
      { x1: "660", y1: "110", x2: "710", y2: "110", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.35" },
      { x1: "660", y1: "130", x2: "695", y2: "130", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.2" },
    ],
    rects: [
      { x: "545", y: "82", width: "50", height: "56", rx: "2", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.25" },
      { x: "555", y: "92", width: "30", height: "36", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.2" },
    ],
    circles: [
      { cx: "570", cy: "110", r: "10", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.3" },
      { cx: "570", cy: "110", r: "4", fill: "var(--color-amber)", opacity: "0.5" },
      { cx: "570", cy: "110", r: "1.5", fill: "var(--color-amber)", opacity: "0.8" },
    ],
    label: "NUC.PULSE",
    labelPos: { x: "610", y: "165" },
  },
};

const hullParts: Record<HullType, SvgPart> = {
  lightweight: {
    paths: [
      { d: "M 200,92 L 530,88 L 530,132 L 200,128", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.25" },
    ],
    lines: [
      { x1: "280", y1: "88", x2: "280", y2: "20", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.2" },
      { x1: "280", y1: "132", x2: "280", y2: "200", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.2" },
    ],
    rects: [
      { x: "250", y: "8", width: "60", height: "14", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.2" },
      { x: "250", y: "198", width: "60", height: "14", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.2" },
    ],
    circles: [],
    label: "HULL.LITE",
    labelPos: { x: "365", y: "155" },
  },
  reinforced: {
    paths: [
      { d: "M 200,86 L 530,82 L 530,138 L 200,134", stroke: "var(--color-amber)", strokeWidth: "0.6", opacity: "0.3" },
      { d: "M 205,90 L 525,86 L 525,134 L 205,130", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.15" },
    ],
    lines: [
      { x1: "280", y1: "82", x2: "280", y2: "15", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.25" },
      { x1: "280", y1: "138", x2: "280", y2: "205", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.25" },
      { x1: "350", y1: "82", x2: "350", y2: "138", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.1" },
      { x1: "420", y1: "82", x2: "420", y2: "138", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.1" },
    ],
    rects: [
      { x: "245", y: "2", width: "70", height: "16", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.25" },
      { x: "245", y: "202", width: "70", height: "16", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.25" },
    ],
    circles: [],
    label: "HULL.ARMR",
    labelPos: { x: "365", y: "160" },
  },
  stealth: {
    paths: [
      { d: "M 200,95 L 530,90 L 540,110 L 530,130 L 200,125", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.2" },
    ],
    lines: [
      { x1: "260", y1: "93", x2: "260", y2: "40", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
      { x1: "300", y1: "91", x2: "300", y2: "40", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
      { x1: "260", y1: "127", x2: "260", y2: "180", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
      { x1: "300", y1: "129", x2: "300", y2: "180", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
    ],
    rects: [
      { x: "248", y: "30", width: "64", height: "12", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
      { x: "248", y: "178", width: "64", height: "12", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
    ],
    circles: [],
    label: "HULL.STLTH",
    labelPos: { x: "365", y: "152" },
  },
};

const payloadParts: Record<PayloadType, SvgPart> = {
  science: {
    paths: [
      { d: "M 140,95 L 125,80 L 125,140 L 140,125", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.3" },
    ],
    lines: [
      { x1: "160", y1: "95", x2: "160", y2: "50", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.25" },
    ],
    rects: [
      { x: "138", y: "90", width: "60", height: "40", rx: "2", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.25" },
      { x: "148", y: "97", width: "18", height: "26", rx: "1", stroke: "var(--color-teal)", strokeWidth: "0.3", opacity: "0.2" },
      { x: "172", y: "97", width: "18", height: "26", rx: "1", stroke: "var(--color-teal)", strokeWidth: "0.3", opacity: "0.2" },
    ],
    circles: [
      { cx: "160", cy: "50", r: "6", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.3" },
      { cx: "160", cy: "50", r: "2", fill: "var(--color-amber)", opacity: "0.5" },
    ],
    label: "SCI.LAB",
    labelPos: { x: "160", y: "150" },
  },
  cargo: {
    paths: [
      { d: "M 135,88 L 120,78 L 120,142 L 135,132", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.3" },
    ],
    lines: [
      { x1: "150", y1: "88", x2: "150", y2: "132", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.1" },
      { x1: "170", y1: "88", x2: "170", y2: "132", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.1" },
      { x1: "190", y1: "88", x2: "190", y2: "132", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.1" },
    ],
    rects: [
      { x: "133", y: "86", width: "70", height: "48", rx: "2", stroke: "var(--color-amber)", strokeWidth: "0.6", opacity: "0.3" },
      { x: "138", y: "91", width: "60", height: "38", rx: "1", stroke: "var(--color-amber)", strokeWidth: "0.3", opacity: "0.15" },
    ],
    circles: [],
    label: "CARGO.BAY",
    labelPos: { x: "165", y: "150" },
  },
  weapons: {
    paths: [
      { d: "M 140,92 L 118,75 L 118,145 L 140,128", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.3" },
    ],
    lines: [
      { x1: "155", y1: "92", x2: "135", y2: "60", stroke: "var(--color-amber)", strokeWidth: "0.35", opacity: "0.25" },
      { x1: "175", y1: "92", x2: "185", y2: "55", stroke: "var(--color-amber)", strokeWidth: "0.35", opacity: "0.25" },
      { x1: "155", y1: "128", x2: "135", y2: "160", stroke: "var(--color-amber)", strokeWidth: "0.35", opacity: "0.25" },
      { x1: "175", y1: "128", x2: "185", y2: "165", stroke: "var(--color-amber)", strokeWidth: "0.35", opacity: "0.25" },
    ],
    rects: [
      { x: "138", y: "88", width: "55", height: "44", rx: "2", stroke: "var(--color-amber)", strokeWidth: "0.5", opacity: "0.25" },
    ],
    circles: [
      { cx: "135", cy: "60", r: "3", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.3" },
      { cx: "185", cy: "55", r: "3", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.3" },
      { cx: "135", cy: "160", r: "3", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.3" },
      { cx: "185", cy: "165", r: "3", stroke: "var(--color-amber)", strokeWidth: "0.4", opacity: "0.3" },
      { cx: "165", cy: "110", r: "4", fill: "var(--color-amber)", opacity: "0.4" },
    ],
    label: "WPNS.ARY",
    labelPos: { x: "160", y: "150" },
  },
};

/* ─── SVG zone renderer ─── */

function SvgZone({
  groupRef,
  part,
  className,
}: {
  groupRef: React.RefObject<SVGGElement | null>;
  part: SvgPart;
  className: string;
}) {
  return (
    <g ref={groupRef} className={className}>
      {part.paths.map((p, i) => (
        <path key={`p${i}`} className="cfg-stroke" d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} opacity={p.opacity} fill="none" />
      ))}
      {part.lines.map((l, i) => (
        <line key={`l${i}`} className="cfg-stroke" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.stroke} strokeWidth={l.strokeWidth} opacity={l.opacity} />
      ))}
      {part.rects.map((r, i) => (
        <rect key={`r${i}`} className="cfg-stroke" x={r.x} y={r.y} width={r.width} height={r.height} rx={r.rx ?? "0"} stroke={r.stroke} strokeWidth={r.strokeWidth} opacity={r.opacity} fill="none" />
      ))}
      {part.circles.map((c, i) => (
        <circle key={`c${i}`} className={c.fill ? "cfg-fill" : "cfg-stroke"} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill ?? "none"} stroke={c.stroke ?? "none"} strokeWidth={c.strokeWidth ?? "0"} opacity={c.opacity} />
      ))}
      <text className="cfg-label" x={part.labelPos.x} y={part.labelPos.y} fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0">
        {part.label}
      </text>
    </g>
  );
}

/* ─── Segmented control ─── */

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  onHover,
}: {
  label: string;
  options: { id: T; name: string }[];
  value: T;
  onChange: (v: T) => void;
  onHover?: (id: T | null) => void;
}) {
  return (
    <div className="cfg-control invisible">
      <div className="mb-2 font-mono text-[9px] tracking-[0.25em] text-foreground/30 uppercase">
        {label}
      </div>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            onMouseEnter={() => opt.id !== value && onHover?.(opt.id)}
            onMouseLeave={() => onHover?.(null)}
            className={`flex-1 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] uppercase transition-all duration-200 ${
              value === opt.id
                ? "border-amber/40 bg-amber/10 text-amber"
                : "border-border/20 bg-transparent text-foreground/25 hover:border-border/40 hover:text-foreground/40"
            }`}
            style={
              value === opt.id
                ? { boxShadow: "0 0 12px oklch(0.82 0.16 75 / 0.15), inset 0 0 12px oklch(0.82 0.16 75 / 0.05)" }
                : undefined
            }
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Stat readout ─── */

function StatRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (!ref.current || prevValue.current === value) return;
    prevValue.current = value;

    const tl = gsap.timeline();
    tl.to(ref.current, { autoAlpha: 0, y: -6, duration: 0.15, ease: "power2.in" });
    tl.set(ref.current, { y: 6 });
    tl.to(ref.current, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" });
    return () => { tl.kill(); };
  }, [value]);

  return (
    <div className="stat-row invisible flex items-center justify-between font-mono text-[10px]">
      <span className="text-foreground/30">{label}</span>
      <span>
        <span ref={ref} className="text-teal">{value}</span>
        <span className="ml-1 text-foreground/20">{unit}</span>
      </span>
    </div>
  );
}

/* ─── Scanline flash effect ─── */

function useScanlineFlash(_containerRef: React.RefObject<HTMLDivElement | null>) {
  const lineRef = useRef<HTMLDivElement>(null);

  const flash = useCallback(() => {
    if (!lineRef.current) return;
    const tl = gsap.timeline();
    tl.set(lineRef.current, { autoAlpha: 0.6, top: "0%" });
    tl.to(lineRef.current, { top: "100%", duration: 0.4, ease: "power1.in" });
    tl.to(lineRef.current, { autoAlpha: 0, duration: 0.1 }, "-=0.1");
  }, []);

  const element = (
    <div
      ref={lineRef}
      className="pointer-events-none absolute left-0 z-20 h-px w-full"
      style={{
        opacity: 0,
        background: "linear-gradient(90deg, transparent, var(--color-amber), transparent)",
        boxShadow: "0 0 8px var(--color-amber), 0 0 20px var(--color-amber)",
      }}
    />
  );

  return { flash, element };
}

/* ─── Blueprint redraw animation ─── */

function useRedrawZone() {
  return useCallback(
    (groupEl: SVGGElement | null, onComplete?: () => void) => {
      if (!groupEl) {
        onComplete?.();
        return;
      }

      const strokes = groupEl.querySelectorAll<SVGGeometryElement>(".cfg-stroke");
      const fills = groupEl.querySelectorAll<SVGElement>(".cfg-fill");
      const labels = groupEl.querySelectorAll<SVGElement>(".cfg-label");

      // Erase — reverse stroke-dashoffset
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      // Phase 1: erase old strokes
      strokes.forEach((el) => {
        const length = el.getTotalLength?.() ?? 200;
        const current = parseFloat(el.style.strokeDashoffset || "0");
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: current });
        tl.to(el, { strokeDashoffset: length, duration: 0.25, ease: "power2.in" }, 0);
      });
      tl.to(fills, { autoAlpha: 0, duration: 0.15 }, 0);
      tl.to(labels, { autoAlpha: 0, duration: 0.15 }, 0);

      return tl;
    },
    []
  );
}

function useDrawZone() {
  return useCallback((groupEl: SVGGElement | null) => {
    if (!groupEl) return;

    const strokes = groupEl.querySelectorAll<SVGGeometryElement>(".cfg-stroke");
    const fills = groupEl.querySelectorAll<SVGElement>(".cfg-fill");
    const labels = groupEl.querySelectorAll<SVGElement>(".cfg-label");

    const tl = gsap.timeline();

    strokes.forEach((el, i) => {
      const length = el.getTotalLength?.() ?? 200;
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(el, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, i * 0.04);
    });

    tl.to(fills, { autoAlpha: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.2");
    tl.to(labels, { autoAlpha: 0.35, duration: 0.3, ease: "power2.out" }, "-=0.1");
  }, []);
}

/* ─── Zone hover hitbox definitions ─── */

type ZoneId = "payload" | "hull" | "engine";

const zoneHitboxes: Record<ZoneId, { x: number; y: number; width: number; height: number }> = {
  payload: { x: 110, y: 40, width: 100, height: 140 },
  hull: { x: 200, y: 0, width: 340, height: 220 },
  engine: { x: 530, y: 40, width: 180, height: 140 },
};

const zoneColors: Record<ZoneId, string> = {
  payload: "var(--color-amber)",
  hull: "var(--color-amber)",
  engine: "var(--color-teal)",
};

const zoneLabelMap: Record<ZoneId, Record<string, string>> = {
  payload: { science: "SCIENCE LAB", cargo: "CARGO BAY", weapons: "WEAPONS ARRAY" },
  hull: { lightweight: "LIGHTWEIGHT", reinforced: "REINFORCED", stealth: "STEALTH" },
  engine: { ion: "ION DRIVE", chemical: "CHEMICAL THRUST", nuclear: "NUCLEAR PULSE" },
};

const zoneTooltipPos: Record<ZoneId, { x: number; y: number }> = {
  payload: { x: 160, y: 58 },
  hull: { x: 370, y: 58 },
  engine: { x: 620, y: 58 },
};

/* ─── Zone hover tooltip ─── */

function ZoneTooltip({ zone, label }: { zone: ZoneId; label: string }) {
  const ref = useRef<SVGGElement>(null);
  const pos = zoneTooltipPos[zone];
  const color = zoneColors[zone];

  useEffect(() => {
    if (!ref.current) return;
    const tl = gsap.timeline();
    tl.fromTo(ref.current, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" });
    return () => { tl.kill(); };
  }, []);

  return (
    <g ref={ref} style={{ opacity: 0 }}>
      <rect
        x={pos.x - 40}
        y={pos.y - 14}
        width="80"
        height="16"
        rx="1"
        fill="oklch(0.08 0.005 250)"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.9"
      />
      <text
        x={pos.x}
        y={pos.y - 3}
        fill={color}
        fontSize="6"
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        opacity="0.9"
      >
        {label}
      </text>
    </g>
  );
}

/* ─── Zone hover glow animation ─── */

function useZoneHover(
  zoneRef: React.RefObject<SVGGElement | null>,
  isHovered: boolean,
  color: string,
) {
  useEffect(() => {
    const group = zoneRef.current;
    if (!group) return;

    const strokes = group.querySelectorAll<SVGElement>(".cfg-stroke");
    const fills = group.querySelectorAll<SVGElement>(".cfg-fill");

    if (isHovered) {
      gsap.to(strokes, {
        opacity: (_, target) => {
          const base = parseFloat(target.getAttribute("opacity") || "0.3");
          return Math.min(base + 0.25, 1);
        },
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(fills, {
        opacity: (_, target) => {
          const base = parseFloat(target.getAttribute("opacity") || "0.5");
          return Math.min(base + 0.3, 1);
        },
        scale: 1.15,
        transformOrigin: "50% 50%",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      // Reset to attribute values
      strokes.forEach((el) => {
        gsap.to(el, {
          opacity: parseFloat(el.getAttribute("opacity") || "0.3"),
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
      fills.forEach((el) => {
        gsap.to(el, {
          opacity: parseFloat(el.getAttribute("opacity") || "0.5"),
          scale: 1,
          transformOrigin: "50% 50%",
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
    }
  }, [isHovered, zoneRef, color]);
}

/* ─── Mission briefing download ─── */

function downloadBriefing(config: ShipConfig, stats: ShipStats) {
  const buildId = `${config.engine.slice(0, 3).toUpperCase()}-${config.hull.slice(0, 3).toUpperCase()}-${config.payload.slice(0, 3).toUpperCase()}`;
  const date = new Date().toISOString().split("T")[0];

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0a0a12";
  ctx.fillRect(0, 0, 600, 400);

  // Border
  ctx.strokeStyle = "rgba(210, 170, 60, 0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, 560, 360);

  // Inner border
  ctx.strokeStyle = "rgba(210, 170, 60, 0.1)";
  ctx.strokeRect(25, 25, 550, 350);

  // Header
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = "rgba(210, 170, 60, 0.5)";
  ctx.letterSpacing = "4px";
  ctx.fillText("ASTRAX DEEP SPACE SYSTEMS", 40, 52);

  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "rgba(230, 230, 230, 0.9)";
  ctx.fillText("MISSION BRIEFING", 40, 85);

  // Divider
  ctx.strokeStyle = "rgba(210, 170, 60, 0.2)";
  ctx.beginPath();
  ctx.moveTo(40, 100);
  ctx.lineTo(560, 100);
  ctx.stroke();

  // Build ID
  ctx.font = "12px monospace";
  ctx.fillStyle = "rgba(210, 170, 60, 0.7)";
  ctx.fillText(`BUILD.ID  ${buildId}`, 40, 130);
  ctx.fillStyle = "rgba(230, 230, 230, 0.3)";
  ctx.fillText(`DATE  ${date}`, 350, 130);

  // Config
  ctx.fillStyle = "rgba(230, 230, 230, 0.2)";
  ctx.fillText("CONFIGURATION", 40, 165);

  const configs = [
    ["ENGINE", config.engine.toUpperCase()],
    ["HULL", config.hull.toUpperCase()],
    ["PAYLOAD", config.payload.toUpperCase()],
  ];
  configs.forEach(([key, val], i) => {
    const y = 190 + i * 22;
    ctx.font = "11px monospace";
    ctx.fillStyle = "rgba(230, 230, 230, 0.3)";
    ctx.fillText(key, 40, y);
    ctx.fillStyle = "rgba(120, 200, 180, 0.7)";
    ctx.fillText(val, 200, y);
  });

  // Stats
  ctx.fillStyle = "rgba(230, 230, 230, 0.2)";
  ctx.font = "12px monospace";
  ctx.fillText("COMPUTED STATS", 40, 270);

  const statRows = [
    ["THRUST", `${stats.thrust} kN`],
    ["RANGE", `${stats.range} AU`],
    ["MASS", `${stats.mass} kg`],
    ["CREW.CAP", `${stats.crew} pax`],
  ];
  statRows.forEach(([key, val], i) => {
    const y = 295 + i * 22;
    ctx.font = "11px monospace";
    ctx.fillStyle = "rgba(230, 230, 230, 0.3)";
    ctx.fillText(key, 40, y);
    ctx.fillStyle = "rgba(210, 170, 60, 0.7)";
    ctx.fillText(val, 200, y);
  });

  // Footer
  ctx.strokeStyle = "rgba(210, 170, 60, 0.15)";
  ctx.beginPath();
  ctx.moveTo(40, 370);
  ctx.lineTo(560, 370);
  ctx.stroke();

  ctx.font = "9px monospace";
  ctx.fillStyle = "rgba(230, 230, 230, 0.15)";
  ctx.fillText("CLASSIFICATION: UNCLASSIFIED // DISTRIBUTION: PUBLIC", 40, 388);
  ctx.fillText("AD ASTRA PER ASPERA", 430, 388);

  // Download
  const link = document.createElement("a");
  link.download = `astrax-briefing-${buildId}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ─── Briefing download button with generating state ─── */

function BriefingButton({ config, stats }: { config: ShipConfig; stats: ShipStats }) {
  const [generating, setGenerating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (generating) return;
    setGenerating(true);

    // Flash scanline across button
    if (btnRef.current) {
      const line = document.createElement("div");
      line.style.cssText = `
        position: absolute; top: 0; left: -10%; width: 2px; height: 100%;
        background: var(--color-amber); opacity: 0.5;
        box-shadow: 0 0 8px var(--color-amber);
        pointer-events: none;
      `;
      btnRef.current.style.position = "relative";
      btnRef.current.style.overflow = "hidden";
      btnRef.current.appendChild(line);
      gsap.to(line, { left: "110%", duration: 0.4, ease: "power2.inOut", onComplete: () => line.remove() });
    }

    setTimeout(() => {
      downloadBriefing(config, stats);
      setGenerating(false);
    }, 600);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={generating}
      className={`relative w-full overflow-hidden border py-2 font-mono text-[9px] tracking-[0.15em] uppercase transition-all duration-200 ${
        generating
          ? "border-amber/20 text-amber/40"
          : "border-border/15 text-foreground/25 hover:border-amber/20 hover:text-foreground/40"
      }`}
    >
      {generating ? "Generating..." : "↓ Download Mission Briefing"}
    </button>
  );
}

/* ─── Main component ─── */

export default function Configurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const engineRef = useRef<SVGGElement>(null);
  const hullRef = useRef<SVGGElement>(null);
  const payloadRef = useRef<SVGGElement>(null);

  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);
  const [previewEngine, setPreviewEngine] = useState<EngineType | null>(null);
  const [previewHull, setPreviewHull] = useState<HullType | null>(null);
  const [previewPayload, setPreviewPayload] = useState<PayloadType | null>(null);
  const [launchPhase, setLaunchPhase] = useState<"idle" | "countdown" | "ignition" | "launched">("idle");
  const launchTlRef = useRef<gsap.core.Timeline | null>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const launchBtnRef = useRef<HTMLButtonElement>(null);
  const exhaustRef = useRef<SVGGElement>(null);

  const { config, setConfig } = useShipConfig();

  // Zone hover glow effects
  useZoneHover(payloadRef, hoveredZone === "payload", zoneColors.payload);
  useZoneHover(hullRef, hoveredZone === "hull", zoneColors.hull);
  useZoneHover(engineRef, hoveredZone === "engine", zoneColors.engine);

  const hoveredTooltipLabel = useMemo(() => {
    if (!hoveredZone) return "";
    const configKey = hoveredZone === "engine" ? config.engine : hoveredZone === "hull" ? config.hull : config.payload;
    return zoneLabelMap[hoveredZone][configKey] ?? "";
  }, [hoveredZone, config]);

  // Track which config is currently drawn in the SVG (for transitions)
  const drawnConfig = useRef<ShipConfig>({ ...config });
  const [displayConfig, setDisplayConfig] = useState<ShipConfig>({ ...config });
  const isTransitioning = useRef(false);

  const eraseZone = useRedrawZone();
  const drawZone = useDrawZone();
  const { flash, element: scanlineEl } = useScanlineFlash(containerRef);

  const stats = getStats(displayConfig);

  // Handle config changes with redraw animation
  const handleChange = useCallback(
    <K extends keyof ShipConfig>(key: K, value: ShipConfig[K]) => {
      if (config[key] === value || isTransitioning.current) return;

      const newConfig = { ...config, [key]: value };
      setConfig(newConfig);
      isTransitioning.current = true;

      // Determine which zone(s) changed
      const refMap = { engine: engineRef, hull: hullRef, payload: payloadRef };
      const changedRef = refMap[key];

      // Erase the changed zone
      const eraseTl = eraseZone(changedRef.current, () => {
        // Update the drawn config and trigger re-render with new SVG parts
        drawnConfig.current = newConfig;
        setDisplayConfig(newConfig);

        // Flash scanline at transition point
        flash();

        // Wait for React to render new SVG, then draw it
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            drawZone(changedRef.current);
            isTransitioning.current = false;
          });
        });
      });

      return () => {
        eraseTl?.kill();
      };
    },
    [config, eraseZone, drawZone, flash]
  );

  // Launch sequence
  const handleLaunch = useCallback(() => {
    if (launchPhase !== "idle" || !svgRef.current) return;

    launchTlRef.current?.kill();
    const tl = gsap.timeline();
    launchTlRef.current = tl;

    const exhaustGroup = exhaustRef.current;
    const allZoneStrokes = svgRef.current.querySelectorAll<SVGElement>(
      ".cfg-zone-engine .cfg-stroke, .cfg-zone-engine .cfg-fill"
    );

    // Random vertical offset for flyout
    const flyoutY = (Math.random() - 0.5) * 300;
    // Rotation matches flyout direction: negative Y (up) = negative rotation (nose up), and vice versa
    const rotationAngle = -(flyoutY / 300) * (5 + Math.random() * 5);

    // Phase 1: Countdown — 3 ... 2 ... 1 ... (3.5s total)
    setLaunchPhase("countdown");
    tl.to({}, { duration: 3.5 }); // countdown runs in its own useEffect

    // Phase 2: Ignition — engine brightens, exhaust draws, ship vibrates (1.5s)
    tl.call(() => setLaunchPhase("ignition"));
    tl.to(allZoneStrokes, {
      opacity: 0.9,
      duration: 0.5,
      ease: "power2.out",
    });

    // Show exhaust plume lines
    if (exhaustGroup) {
      tl.fromTo(
        exhaustGroup.children,
        { strokeDashoffset: 60, autoAlpha: 0 },
        { strokeDashoffset: 0, autoAlpha: 0.7, duration: 0.6, stagger: 0.06, ease: "power2.out" },
        "<"
      );
      // Sustained flicker for 1.2s
      tl.to(exhaustGroup.children, {
        opacity: "random(0.3, 0.9)",
        duration: 0.06,
        stagger: { each: 0.02, repeat: 18 },
        ease: "none",
      });
    }

    // Vibration builds over the ignition phase
    tl.to(svgRef.current, {
      x: 1.5,
      duration: 0.04,
      yoyo: true,
      repeat: 30,
      ease: "none",
    }, "<");

    // Phase 3: Single continuous acceleration — expo.in is naturally
    // very slow at the start and rockets exponentially at the end
    tl.to(svgRef.current, {
      x: -1600,
      y: flyoutY,
      rotation: rotationAngle,
      transformOrigin: "70% 50%",
      duration: 3.0,
      ease: "expo.in",
    });

    // Phase 4: Launched state
    tl.call(() => setLaunchPhase("launched"));

    // Phase 5: Reset after a pause
    tl.to({}, { duration: 2.5 });
    tl.call(() => {
      // Reset SVG position
      gsap.set(svgRef.current, { x: 0, y: 0, rotation: 0, clearProps: "transform" });
      // Reset exhaust
      if (exhaustGroup) {
        gsap.set(exhaustGroup.children, { autoAlpha: 0 });
      }
      // Reset engine zone brightness
      gsap.set(allZoneStrokes, { clearProps: "opacity" });
      setLaunchPhase("idle");

      // Ship re-enters from the right
      if (svgRef.current) {
        gsap.fromTo(svgRef.current, { x: 800, autoAlpha: 0 }, {
          x: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    });
  }, [launchPhase]);

  // Countdown text animation — proper 3 ... 2 ... 1 ... LIFTOFF
  useEffect(() => {
    if (launchPhase !== "countdown" || !countdownRef.current) return;

    const el = countdownRef.current;
    const steps = ["3", "2", "1", "LIFTOFF"];
    let i = 0;
    let cancelled = false;

    el.textContent = steps[0];
    gsap.fromTo(el, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" });

    const interval = setInterval(() => {
      if (cancelled) return;
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        return;
      }
      // Scale punch on each tick
      el.textContent = steps[i];
      if (steps[i] === "LIFTOFF") {
        gsap.fromTo(el, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" });
      } else {
        gsap.fromTo(el, { scale: 1.6, autoAlpha: 0.5 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out" });
      }
    }, 1000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [launchPhase]);

  // Scroll entrance animation
  useGSAP(
    () => {
      if (!svgRef.current) return;

      // Header animations
      gsap.from(".cfg-tag", {
        autoAlpha: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".cfg-tag", start: "top 85%" },
      });

      gsap.from(".cfg-heading span", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cfg-heading", start: "top 80%" },
      });

      gsap.from(".cfg-body", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".cfg-body", start: "top 85%" },
      });

      // Draw the spine first
      const spine = svgRef.current.querySelector(".cfg-spine") as SVGGeometryElement | null;
      if (spine) {
        const len = spine.getTotalLength();
        gsap.set(spine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(spine, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
        });
      }

      // Then draw all three zones
      [engineRef, hullRef, payloadRef].forEach((ref, i) => {
        const group = ref.current;
        if (!group) return;
        const strokes = group.querySelectorAll<SVGGeometryElement>(".cfg-stroke");
        const fills = group.querySelectorAll<SVGElement>(".cfg-fill");
        const labels = group.querySelectorAll<SVGElement>(".cfg-label");

        strokes.forEach((el, j) => {
          const length = el.getTotalLength?.() ?? 200;
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(el, {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
            delay: 0.8 + i * 0.3 + j * 0.05,
          });
        });

        gsap.from(fills, {
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
          delay: 1.2 + i * 0.3,
        });

        gsap.to(labels, {
          autoAlpha: 0.35,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
          delay: 1.4 + i * 0.3,
        });
      });

      // Controls stagger in
      gsap.from(".cfg-control", {
        x: 30,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: ".cfg-control", start: "top 85%" },
        delay: 0.4,
      });

      // Stats stagger in
      gsap.from(".stat-row", {
        x: -15,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".stat-row", start: "top 90%" },
        delay: 0.8,
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} data-section="configurator" className="relative w-full overflow-hidden bg-background">
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
          {/* Header */}
          <div className="cfg-tag invisible mb-4 font-mono text-[10px] tracking-[0.3em] text-amber/60 uppercase">
            // Ship.Config — Interactive
          </div>

          <h2 className="cfg-heading mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="invisible block">Configure</span>
            <span className="invisible block text-amber">Your Vessel</span>
          </h2>

          <p className="cfg-body invisible max-w-lg font-mono text-xs leading-relaxed text-foreground/40 sm:text-sm">
            Select engine, hull, and payload configuration.
            Blueprint updates in real-time as systems are swapped.
          </p>

          <Separator className="my-8 bg-border/30" />

          {/* Main layout: blueprint + controls */}
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Blueprint SVG */}
            <div className="relative flex-1 min-w-0">
              {scanlineEl}

              {/* Countdown / launched overlay */}
              {launchPhase !== "idle" && (
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                  {(launchPhase === "countdown" || launchPhase === "ignition") && (
                    <div
                      ref={countdownRef}
                      className="font-mono text-6xl font-bold tracking-[0.15em] text-amber"
                      style={{ textShadow: "0 0 30px oklch(0.82 0.16 75 / 0.6), 0 0 60px oklch(0.82 0.16 75 / 0.3)" }}
                    />
                  )}
                  {launchPhase === "launched" && (
                    <div className="text-center">
                      <div
                        className="mb-2 font-mono text-sm tracking-[0.4em] text-teal uppercase"
                        style={{ textShadow: "0 0 20px oklch(0.75 0.14 175 / 0.5)" }}
                      >
                        Launch Successful
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.2em] text-foreground/30">
                        BUILD {config.engine.slice(0, 3).toUpperCase()}-{config.hull.slice(0, 3).toUpperCase()}-{config.payload.slice(0, 3).toUpperCase()} // DEPLOYED
                      </div>
                    </div>
                  )}
                </div>
              )}
              <svg
                ref={svgRef}
                viewBox="0 0 800 220"
                className="w-full"
                fill="none"
              >
                <defs>
                  <radialGradient id="cfg-glow-engine" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-teal)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="var(--color-teal)" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="cfg-glow-payload" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Center spine */}
                <line className="cfg-spine" x1="100" y1="110" x2="700" y2="110" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.15" />

                {/* Ambient glows */}
                <ellipse cx="620" cy="110" rx="40" ry="50" fill="url(#cfg-glow-engine)" />
                <ellipse cx="160" cy="110" rx="35" ry="40" fill="url(#cfg-glow-payload)" />

                {/* Command module (static) */}
                <path className="cfg-stroke" d="M 100,110 L 120,95 L 120,125 Z" stroke="var(--color-amber)" strokeWidth="0.5" opacity="0.3" fill="none" />

                {/* Ghost preview zones (shown on button hover) */}
                {previewEngine && (
                  <g opacity="0.4" style={{ filter: "blur(0.3px)" }}>
                    <SvgZone groupRef={{ current: null }} part={engineParts[previewEngine]} className="cfg-ghost" />
                  </g>
                )}
                {previewHull && (
                  <g opacity="0.4" style={{ filter: "blur(0.3px)" }}>
                    <SvgZone groupRef={{ current: null }} part={hullParts[previewHull]} className="cfg-ghost" />
                  </g>
                )}
                {previewPayload && (
                  <g opacity="0.4" style={{ filter: "blur(0.3px)" }}>
                    <SvgZone groupRef={{ current: null }} part={payloadParts[previewPayload]} className="cfg-ghost" />
                  </g>
                )}

                {/* Dynamic zones */}
                <SvgZone groupRef={payloadRef} part={payloadParts[displayConfig.payload]} className="cfg-zone-payload" />
                <SvgZone groupRef={hullRef} part={hullParts[displayConfig.hull]} className="cfg-zone-hull" />
                <SvgZone groupRef={engineRef} part={engineParts[displayConfig.engine]} className="cfg-zone-engine" />

                {/* Exhaust plume (hidden until launch) */}
                <g ref={exhaustRef}>
                  <line x1="660" y1="95" x2="750" y2="85" stroke="var(--color-teal)" strokeWidth="0.8" opacity="0" strokeDasharray="60" />
                  <line x1="660" y1="102" x2="770" y2="97" stroke="var(--color-teal)" strokeWidth="1.0" opacity="0" strokeDasharray="60" />
                  <line x1="660" y1="110" x2="790" y2="110" stroke="var(--color-teal)" strokeWidth="1.2" opacity="0" strokeDasharray="60" />
                  <line x1="660" y1="118" x2="770" y2="123" stroke="var(--color-teal)" strokeWidth="1.0" opacity="0" strokeDasharray="60" />
                  <line x1="660" y1="125" x2="750" y2="135" stroke="var(--color-teal)" strokeWidth="0.8" opacity="0" strokeDasharray="60" />
                  {/* Wide outer plume */}
                  <line x1="670" y1="88" x2="730" y2="75" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0" strokeDasharray="60" />
                  <line x1="670" y1="132" x2="730" y2="145" stroke="var(--color-teal)" strokeWidth="0.4" opacity="0" strokeDasharray="60" />
                </g>

                {/* Zone boundary markers */}
                <line x1="200" y1="65" x2="200" y2="155" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.08" strokeDasharray="3 4" />
                <line x1="530" y1="65" x2="530" y2="155" stroke="var(--color-teal)" strokeWidth="0.3" opacity="0.08" strokeDasharray="3 4" />

                {/* Hover hitboxes — invisible rects over each zone */}
                {(["payload", "hull", "engine"] as ZoneId[]).map((zone) => {
                  const hb = zoneHitboxes[zone];
                  return (
                    <rect
                      key={zone}
                      x={hb.x}
                      y={hb.y}
                      width={hb.width}
                      height={hb.height}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredZone(zone)}
                      onMouseLeave={() => setHoveredZone(null)}
                    />
                  );
                })}

                {/* Hover tooltip */}
                {hoveredZone && (
                  <ZoneTooltip zone={hoveredZone} label={hoveredTooltipLabel} />
                )}

                {/* Dimension line */}
                <line className="cfg-stroke" x1="100" y1="205" x2="680" y2="205" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.12" fill="none" />
                <line className="cfg-stroke" x1="100" y1="201" x2="100" y2="209" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.12" fill="none" />
                <line className="cfg-stroke" x1="680" y1="201" x2="680" y2="209" stroke="var(--color-amber)" strokeWidth="0.3" opacity="0.12" fill="none" />
                <text x="390" y="215" fill="var(--color-amber)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.2">
                  {displayConfig.hull === "reinforced" ? "94.2 m" : displayConfig.hull === "stealth" ? "78.6 m" : "82.4 m"}
                </text>
              </svg>
            </div>

            {/* Controls panel */}
            <div className="w-full space-y-5 lg:w-72 shrink-0">
              <SegmentedControl
                label="ENGINE.TYPE"
                options={[
                  { id: "ion" as EngineType, name: "Ion" },
                  { id: "chemical" as EngineType, name: "Chem" },
                  { id: "nuclear" as EngineType, name: "Nuclear" },
                ]}
                value={config.engine}
                onChange={(v) => handleChange("engine", v)}
                onHover={setPreviewEngine}
              />

              <SegmentedControl
                label="HULL.CLASS"
                options={[
                  { id: "lightweight" as HullType, name: "Lite" },
                  { id: "reinforced" as HullType, name: "Armor" },
                  { id: "stealth" as HullType, name: "Stealth" },
                ]}
                value={config.hull}
                onChange={(v) => handleChange("hull", v)}
                onHover={setPreviewHull}
              />

              <SegmentedControl
                label="PAYLOAD.MOD"
                options={[
                  { id: "science" as PayloadType, name: "Sci" },
                  { id: "cargo" as PayloadType, name: "Cargo" },
                  { id: "weapons" as PayloadType, name: "Wpns" },
                ]}
                value={config.payload}
                onChange={(v) => handleChange("payload", v)}
                onHover={setPreviewPayload}
              />

              <Separator className="bg-border/20" />

              {/* Stats readout */}
              <div>
                <div className="mb-3 font-mono text-[9px] tracking-[0.25em] text-foreground/30 uppercase">
                  Computed Stats
                </div>
                <div className="space-y-2">
                  <StatRow label="THRUST" value={stats.thrust} unit="kN" />
                  <StatRow label="RANGE" value={stats.range} unit="AU" />
                  <StatRow label="MASS" value={stats.mass} unit="kg" />
                  <StatRow label="CREW.CAP" value={String(stats.crew)} unit="pax" />
                </div>
              </div>

              <Separator className="bg-border/20" />

              {/* Config signature */}
              <div className="font-mono text-[9px] text-foreground/20">
                <span className="text-foreground/30">BUILD.ID</span>{" "}
                <span className="text-amber/50">
                  {config.engine.slice(0, 3).toUpperCase()}-
                  {config.hull.slice(0, 3).toUpperCase()}-
                  {config.payload.slice(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Launch button — 3D wireframe panel */}
              <button
                ref={launchBtnRef}
                onClick={handleLaunch}
                disabled={launchPhase !== "idle"}
                className="group relative w-full"
              >
                {/* Outer bezel — 3D effect via offset borders */}
                <div
                  className={`relative border transition-all duration-300 ${
                    launchPhase !== "idle"
                      ? "border-border/10"
                      : "border-teal/25 hover:border-teal/50"
                  }`}
                  style={{
                    background: launchPhase === "idle"
                      ? "linear-gradient(180deg, oklch(0.1 0.01 175 / 0.3), oklch(0.06 0.005 250))"
                      : "oklch(0.06 0.005 250)",
                  }}
                >
                  {/* Top highlight edge */}
                  <div
                    className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(90deg, transparent 10%, oklch(0.75 0.14 175 / 0.3) 50%, transparent 90%)",
                      opacity: launchPhase === "idle" ? 1 : 0,
                    }}
                  />
                  {/* Bottom shadow edge */}
                  <div
                    className="absolute inset-x-0 -bottom-px h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent 10%, oklch(0.02 0 0 / 0.8) 50%, transparent 90%)",
                    }}
                  />
                  {/* Inner recessed area */}
                  <div
                    className={`mx-1.5 my-1.5 border border-b-0 transition-all duration-300 ${
                      launchPhase !== "idle" ? "border-border/5" : "border-teal/10"
                    }`}
                    style={{
                      background: launchPhase === "idle"
                        ? "linear-gradient(180deg, oklch(0.08 0.008 175 / 0.4), oklch(0.05 0.003 250))"
                        : "oklch(0.05 0.003 250)",
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      {/* Indicator light */}
                      <div className="relative flex items-center gap-2.5">
                        <div
                          className="size-2 rounded-full"
                          style={{
                            backgroundColor: launchPhase === "idle"
                              ? "oklch(0.75 0.14 175)"
                              : launchPhase === "launched"
                                ? "oklch(0.82 0.16 75)"
                                : "oklch(0.75 0.14 175 / 0.15)",
                            boxShadow: launchPhase === "idle"
                              ? "0 0 6px oklch(0.75 0.14 175 / 0.8), 0 0 12px oklch(0.75 0.14 175 / 0.4)"
                              : "none",
                            animation: launchPhase === "idle"
                              ? "launch-blink 2s ease-in-out infinite"
                              : "none",
                          }}
                        />
                        <span
                          className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                            launchPhase !== "idle" ? "text-foreground/15" : "text-teal group-hover:text-teal"
                          }`}
                        >
                          {launchPhase === "idle" && "Initiate Launch"}
                          {launchPhase === "countdown" && "Sequence Active"}
                          {launchPhase === "ignition" && "Ignition"}
                          {launchPhase === "launched" && "Deployed"}
                        </span>
                      </div>
                      {/* Right chevron */}
                      <span
                        className={`font-mono text-[10px] transition-all duration-300 ${
                          launchPhase !== "idle"
                            ? "text-foreground/10"
                            : "text-teal/40 group-hover:text-teal/70 group-hover:translate-x-0.5"
                        }`}
                      >
                        ▸▸
                      </span>
                    </div>
                  </div>
                  {/* Bottom inner edge */}
                  <div
                    className="mx-1.5 h-px"
                    style={{
                      background: launchPhase === "idle"
                        ? "linear-gradient(90deg, transparent, oklch(0.75 0.14 175 / 0.15), transparent)"
                        : "transparent",
                    }}
                  />
                </div>
              </button>

              {/* Mission briefing download */}
              <BriefingButton config={config} stats={stats} />
            </div>
          </div>

          <Separator className="my-12 bg-border/30" />

          {/* Bottom readout */}
          <div className="flex flex-wrap items-center gap-8 font-mono text-[10px] text-foreground/25">
            <div>
              CONFIG.REV <span className="text-teal/60">v1.0.0-draft</span>
            </div>
            <div>
              LAST.MODIFIED <span className="text-amber/60">2026-03-26T09:15:00Z</span>
            </div>
            <div>
              STATUS <span className="text-amber/60">SIMULATED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
