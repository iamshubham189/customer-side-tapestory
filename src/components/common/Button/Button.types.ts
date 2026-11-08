import type React from "react";

export interface ButtonPrimaryProps {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  tone?: "Forest" | "Ivory";
  showArrow?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ButtonSecondaryProps {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  tone?: "Standard" | "Inverse";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ButtonTextProps {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export interface BadgeProps {
  label: string;
  tone?: "Neutral" | "Accent" | "Forest";
  className?: string;
}
