import Image from "next/image";
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
      <Image
        src={mobileSrc}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={`${imageClass} hero-bg-img--mobile`}
        style={imageStyle}
      />
      <Image
        src={desktopSrc}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={`${imageClass} hero-bg-img--desktop`}
        style={imageStyle}
      />
    </div>
  );
}
