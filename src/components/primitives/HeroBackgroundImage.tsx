import type { CSSProperties } from "react";

type HeroBackgroundImageProps = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  objectPosition?: string;
  variant?: "default" | "conductores";
};

export function HeroBackgroundImage({
  desktopSrc,
  mobileSrc,
  alt,
  objectPosition = "center center",
  variant = "default",
}: HeroBackgroundImageProps) {
  const isConductores = variant === "conductores";
  const imageClass = isConductores
    ? "hero-bg-img conductores-hero-bg-img"
    : "hero-bg-img";

  const imageStyle: CSSProperties = isConductores
    ? { objectFit: "cover" }
    : { objectFit: "cover", objectPosition };

  return (
    <div aria-hidden className="hero-bg">
      <picture>
        <source media="(min-width: 769px)" srcSet={desktopSrc} />
        {/* Pre-optimized WebP served directly — skips /_next/image optimizer hop */}
        <img
          src={mobileSrc}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className={imageClass}
          style={imageStyle}
        />
      </picture>
    </div>
  );
}
