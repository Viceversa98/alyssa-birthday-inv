"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicWish } from "@/lib/get-public-wishes";

type BubbleConfig = {
  key: string;
  wish: PublicWish;
  left: number;
  duration: number;
  delay: number;
  drift: number;
};

type FloatingWishBubblesProps = {
  wishes: PublicWish[];
};

const WISH_TRUNCATE_LENGTH = 120;
const MIN_BUBBLES = 4;
const MAX_BUBBLES = 12;

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

const truncateWish = (text: string) => {
  if (text.length <= WISH_TRUNCATE_LENGTH) return text;
  return `${text.slice(0, WISH_TRUNCATE_LENGTH).trimEnd()}…`;
};

const buildBubbleConfigs = (wishes: PublicWish[]): BubbleConfig[] => {
  if (wishes.length === 0) return [];

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches;
  const slotCount = Math.min(
    isMobile ? 6 : MAX_BUBBLES,
    Math.max(MIN_BUBBLES, wishes.length * 2),
  );

  return Array.from({ length: slotCount }, (_, index) => {
    const wish = wishes[index % wishes.length];
    return {
      key: `${wish.id}-${index}`,
      wish,
      left: randomBetween(4, 78),
      duration: randomBetween(16, 28),
      delay: randomBetween(-12, 8),
      drift: randomBetween(-50, 50),
    };
  });
};

const WishBubble = ({ config }: { config: BubbleConfig }) => {
  const { wish, left, duration, delay, drift } = config;

  return (
    <div
      className="absolute bottom-0 max-w-[200px] will-change-transform sm:max-w-[260px]"
      style={
        {
          left: `${left}%`,
          ["--balloon-drift" as string]: `${drift}px`,
          animation: `balloon-rise ${duration}s linear ${delay}s infinite backwards`,
        } as React.CSSProperties
      }
    >
      <div className="rounded-2xl border border-gold-light/60 bg-pink-light/90 px-3 py-2.5 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-medium text-gold">{wish.name}</p>
        <p className="mt-1 line-clamp-3 text-sm leading-snug text-ink/90">
          {truncateWish(wish.wishes)}
        </p>
      </div>
    </div>
  );
};

export const FloatingWishBubbles = ({ wishes }: FloatingWishBubblesProps) => {
  const [enabled, setEnabled] = useState(false);
  const [configs, setConfigs] = useState<BubbleConfig[]>([]);

  const wishSignature = useMemo(
    () => wishes.map((w) => `${w.id}:${w.wishes}`).join("|"),
    [wishes],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || wishes.length === 0) {
      setEnabled(false);
      setConfigs([]);
      return;
    }

    setEnabled(true);
    setConfigs(buildBubbleConfigs(wishes));
  }, [wishSignature, wishes]);

  if (!enabled || configs.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[16] overflow-hidden"
      aria-hidden="true"
    >
      {configs.map((config) => (
        <WishBubble key={config.key} config={config} />
      ))}
    </div>
  );
};
