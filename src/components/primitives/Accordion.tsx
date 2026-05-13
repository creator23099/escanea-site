"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AccordionItem } from "@/lib/types";

/**
 * Uses measured pixel height instead of a fixed maxHeight cap,
 * so content never clips regardless of length.
 */
function AccordionPanel({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    if (isOpen) {
      setHeight(innerRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const panelId = `acc-panel-${index}`;
  const triggerId = `acc-trigger-${index}`;

  return (
    <div className="acc-item">
      <button
        id={triggerId}
        className="acc-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span>{item.q}</span>
        <span className={`acc-icon ${isOpen ? "open" : ""}`} aria-hidden="true">+</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="acc-body"
        style={{ height, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={innerRef} className="acc-body-inner">{item.a}</div>
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setOpen((prev) => (prev === i ? null : i)), []);

  return (
    <div>
      {items.map((item, i) => (
        <AccordionPanel
          key={i}
          item={item}
          isOpen={open === i}
          onToggle={() => toggle(i)}
          index={i}
        />
      ))}
    </div>
  );
}
