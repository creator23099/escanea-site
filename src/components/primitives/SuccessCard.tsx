import { T } from "@/lib/tokens";

export function SuccessCard({
  title,
  message,
  bg = T.ivoryDk,
}: {
  title: string;
  message: string;
  bg?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: bg,
        border: `1.5px solid ${T.stone}`,
        borderRadius: 16,
        padding: "3rem",
        textAlign: "center",
      }}
    >
      {/* Premium-refinement pass: dropped the previous oversized
          check-mark glyph (read as startup-template at 2.5rem). A thin
          cobalt rule signals "state change" with the same minimal
          vocabulary Stripe/Linear use on confirmation screens, keeping
          the brand typography as the hero of the card. */}
      <div
        aria-hidden="true"
        style={{
          width: 48,
          height: 1,
          background: T.cobalt,
          opacity: 0.5,
          margin: "0 auto 1.5rem",
        }}
      />
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.5rem", color: T.ink, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ color: T.inkMd, fontSize: "0.9rem" }}>{message}</p>
    </div>
  );
}
