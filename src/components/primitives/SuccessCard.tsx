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
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }} aria-hidden="true">✓</div>
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.5rem", color: T.ink, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ color: T.inkMd, fontSize: "0.9rem" }}>{message}</p>
    </div>
  );
}
