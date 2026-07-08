import type { NetworkStat } from "@/lib/network-stats";
import { T } from "@/lib/tokens";
import type { CSSProperties } from "react";
import styles from "./NetworkStatsGrid.module.css";

const valueBaseStyle: CSSProperties = {
  fontFamily: "'DM Serif Display',serif",
  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
  color: T.cobalt,
  lineHeight: 1,
};

const labelStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: "0.95rem",
  color: T.ink,
  marginBottom: "0.35rem",
};

const descStyle: CSSProperties = {
  fontSize: "0.87rem",
  color: T.inkMd,
  lineHeight: 1.7,
  margin: 0,
};

const cardShell: CSSProperties = {
  background: T.white,
  border: `1.5px solid ${T.stone}`,
  borderRadius: 12,
  padding: "1.5rem",
};

type NetworkStatsGridProps = {
  stats: readonly NetworkStat[];
  variant: "cards" | "compact-dark";
};

export function NetworkStatsGrid({ stats, variant }: NetworkStatsGridProps) {
  if (variant === "compact-dark") {
    const compactLabelStyle: CSSProperties = {
      ...labelStyle,
      color: "rgba(255,255,255,0.85)",
      marginBottom: 0,
    };

    return (
      <div className={styles.compactGrid} aria-label="Cifras de la red">
        {stats.map(({ value, label, desc, valueStyle: statValueStyle }) => (
          <div key={label} className={styles.compactStat}>
            <div
              className={`${styles.compactValue}${statValueStyle === "small" ? ` ${styles.compactValueSmall}` : ""}`}
            >
              {value}
            </div>
            <div style={compactLabelStyle}>{label}</div>
            {desc ? <p className={styles.compactFootnote}>{desc}</p> : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.cardsGrid}>
      {stats.map(({ value, label, desc }) => (
        <div key={label} style={cardShell}>
          <div style={{ ...valueBaseStyle, marginBottom: "0.65rem" }}>{value}</div>
          <div style={labelStyle}>{label}</div>
          <p style={descStyle}>{desc}</p>
        </div>
      ))}
    </div>
  );
}
