"use client";

import { useInView } from "@/lib/use-in-view";
import type { CSSProperties, ReactNode } from "react";

type FadeUpSectionProps = {
  children: ReactNode;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  id?: string;
  "aria-label"?: string;
};

export function FadeUpSection({
  children,
  style,
  innerStyle,
  id,
  "aria-label": ariaLabel,
}: FadeUpSectionProps) {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <section ref={ref} id={id} style={style} aria-label={ariaLabel}>
      <div
        className={`fade-up ${visible ? "visible" : ""}`}
        style={innerStyle}
      >
        {children}
      </div>
    </section>
  );
}
