import { T } from "@/lib/tokens";

export function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Paso ${current + 1} de ${total}`}
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem" }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`step-dot ${i < current ? "done" : i === current ? "curr" : "todo"}`}
        />
      ))}
      <span style={{ fontSize: "0.75rem", color: T.inkLt, marginLeft: 8 }} aria-hidden="true">
        {current + 1} / {total}
      </span>
    </div>
  );
}
