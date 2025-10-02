"use client";

import React from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  role?: string;
  tabIndex?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  className = "",
  children,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  role,
  tabIndex,
  onClick,
  onFocus,
  onBlur,
}) => {
  const combinedClassName = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      role={role}
      tabIndex={tabIndex}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
};
