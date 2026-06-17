"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FloatingWishBubbles } from "@/components/sections/FloatingWishBubbles";
import type { PublicWish } from "@/lib/get-public-wishes";

type WishBubblesContextValue = {
  addWish: (wish: PublicWish) => void;
};

const WishBubblesContext = createContext<WishBubblesContextValue | null>(null);

type WishBubblesLayerProps = {
  initialWishes: PublicWish[];
  children: React.ReactNode;
};

export const WishBubblesLayer = ({
  initialWishes,
  children,
}: WishBubblesLayerProps) => {
  const [wishes, setWishes] = useState<PublicWish[]>(initialWishes);

  const addWish = useCallback((wish: PublicWish) => {
    setWishes((current) => {
      if (current.some((entry) => entry.id === wish.id)) {
        return current;
      }
      return [wish, ...current].slice(0, 30);
    });
  }, []);

  const value = useMemo(() => ({ addWish }), [addWish]);

  return (
    <WishBubblesContext.Provider value={value}>
      {children}
      <FloatingWishBubbles wishes={wishes} />
    </WishBubblesContext.Provider>
  );
};

export const useWishBubbles = () => {
  const context = useContext(WishBubblesContext);

  if (!context) {
    return null;
  }

  return context;
};
