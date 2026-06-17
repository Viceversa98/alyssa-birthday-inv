"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type JourneySection = {
  id: string;
  label: string;
};

type JourneyNavProps = {
  sections: JourneySection[];
  navLabel: string;
};

export const JourneyNav = ({ sections, navLabel }: JourneyNavProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleNavigate = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);

    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }
    target.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate(id);
    }
  };

  return (
    <nav
      aria-label={navLabel}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-gold-light/40 bg-blush/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-1 sm:gap-2">
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleNavigate(section.id)}
              onKeyDown={(e) => handleKeyDown(e, section.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "min-h-11 flex-1 rounded-full px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-blush sm:px-4 sm:text-sm",
                isActive
                  ? "bg-rose text-ink shadow-sm"
                  : "text-ink/70 hover:bg-pink-light/60 hover:text-ink",
              )}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
