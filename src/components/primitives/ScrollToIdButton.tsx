"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ScrollToIdButtonProps = {
  targetId: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;

export function ScrollToIdButton({
  targetId,
  children,
  ...buttonProps
}: ScrollToIdButtonProps) {
  return (
    <button
      type="button"
      {...buttonProps}
      onClick={() =>
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
      }
    >
      {children}
    </button>
  );
}
