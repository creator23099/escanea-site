"use client";
import { useCallback, type KeyboardEvent } from "react";

interface ChipsProps {
  options: string[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  multi?: boolean;
  label?: string; // for group aria-label
}

export function Chips({ options, value, onChange, multi = false, label }: ChipsProps) {
  const toggle = useCallback(
    (o: string) => {
      if (multi) {
        const arr = Array.isArray(value) ? value : [];
        onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
      } else {
        onChange(o);
      }
    },
    [multi, value, onChange]
  );

  const isSelected = (o: string) =>
    multi ? Array.isArray(value) && value.includes(o) : value === o;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, o: string) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(o);
    }
  };

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={label}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={isSelected(o)}
          className={`chip ${isSelected(o) ? "selected" : ""}`}
          onClick={() => toggle(o)}
          onKeyDown={(e) => handleKeyDown(e, o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
