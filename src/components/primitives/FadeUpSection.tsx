import type { CSSProperties, ReactNode } from "react";

type FadeUpSectionProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  id?: string;
  "aria-label"?: string;
};

/** Scroll-triggered fade-up via CSS view() timeline — no client JS or hydration. */
export function FadeUpSection({
  children,
  className,
  style,
  innerStyle,
  id,
  "aria-label": ariaLabel,
}: FadeUpSectionProps) {
  return (
    <section id={id} className={className} style={style} aria-label={ariaLabel}>
      <div className="fade-up" style={innerStyle}>
        {children}
      </div>
    </section>
  );
}
