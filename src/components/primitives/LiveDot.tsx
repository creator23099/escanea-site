import { T } from "@/lib/tokens";

export function LiveDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: T.cobalt,
        animation: "pulse 2s infinite",
      }}
    />
  );
}
