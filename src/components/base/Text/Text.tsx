"use client";

import React from "react";
import styles from "./Text.module.css";

export type TextType =
  | "HEADER_1"
  | "HEADER_2"
  | "HEADER_3"
  | "BODY_1"
  | "BODY_2"
  | "CAPTION";

export type TextColor =
  | "primary"
  | "secondary"
  | "neutral"
  | "success"
  | "error"
  | "warning"
  | "white"
  | "black";

export type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";

export interface TextProps {
  type: TextType;
  color?: TextColor;
  as?: TextElement;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const getDefaultElement = (type: TextType): TextElement => {
  switch (type) {
    case "HEADER_1":
      return "h1";
    case "HEADER_2":
      return "h2";
    case "HEADER_3":
      return "h3";
    case "BODY_1":
    case "BODY_2":
      return "p";
    case "CAPTION":
      return "span";
    default:
      return "p";
  }
};

export const Text: React.FC<TextProps> = ({
  type,
  color = "neutral",
  as,
  id,
  className = "",
  style,
  children,
  ariaLabel,
  ariaDescribedBy,
  role,
  tabIndex,
  onClick,
  onFocus,
  onBlur,
}) => {
  const Element = as || getDefaultElement(type);

  const combinedClassName = [
    styles.text,
    styles[type.toLowerCase()],
    styles[`color-${color}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element
      id={id}
      className={combinedClassName}
      style={style}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </Element>
  );
};
