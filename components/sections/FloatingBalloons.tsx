"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type BalloonConfig = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  colorClass: string;
};

const BALLOON_COLORS = [
  "bg-rose",
  "bg-pink-light",
  "bg-gold-light",
  "bg-gold/70",
  "bg-rose/80",
] as const;

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

const generateBalloons = (count: number): BalloonConfig[] => {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: randomBetween(2, 92),
    size: randomBetween(28, 56),
    duration: randomBetween(12, 22),
    delay: randomBetween(0, 18),
    drift: randomBetween(-40, 40),
    colorClass:
      BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
  }));
};

const Balloon = ({ balloon }: { balloon: BalloonConfig }) => {
  const { size, colorClass, duration, delay, drift, left } = balloon;

  return (
    <div
      className="balloon-float absolute bottom-0"
      style={
        {
          left: `${left}%`,
          "--balloon-duration": `${duration}s`,
          "--balloon-delay": `${delay}s`,
          "--balloon-drift": `${drift}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative rounded-[50%] shadow-sm",
            colorClass,
          )}
          style={{
            width: size,
            height: size * 1.15,
          }}
        >
          <div
            className="absolute left-[28%] top-[22%] h-[22%] w-[18%] rounded-full bg-white/35"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold-light/80"
            aria-hidden="true"
          />
        </div>
        <div
          className="bg-gold-light/50"
          style={{ width: 1, height: size * 0.9 }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export const FloatingBalloons = () => {
  const [balloons, setBalloons] = useState<BalloonConfig[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    setBalloons(generateBalloons(isMobile ? 6 : 10));
  }, []);

  if (balloons.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    >
      {balloons.map((balloon) => (
        <Balloon key={balloon.id} balloon={balloon} />
      ))}
    </div>
  );
};
