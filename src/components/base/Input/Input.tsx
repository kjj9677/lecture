"use client";

import React from "react";
import styles from "./Input.module.css";

export type InputType = "text" | "email" | "password" | "tel" | "number";
export type InputSize = "small" | "medium" | "large";

export interface InputProps {
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;

  min?: string;
  max?: string;
  step?: string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";

  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  role?: string;
  tabIndex?: number;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  size = "medium",
  placeholder,
  value,
  defaultValue,
  disabled = false,
  readOnly = false,
  required = false,
  className = "",
  style,
  min,
  max,
  step,
  inputMode,
  id,
  name,
  ariaLabel,
  ariaDescribedBy,
  ariaRequired,
  ariaInvalid,
  role,
  tabIndex,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
}) => {
  const combinedClassName = [
    styles.input,
    styles[size],
    disabled && styles.disabled,
    readOnly && styles.readonly,
    ariaInvalid && styles.invalid,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      type={type}
      className={combinedClassName}
      style={style}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      min={min}
      max={max}
      step={step}
      inputMode={inputMode}
      id={id}
      name={name}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-required={ariaRequired || required}
      aria-invalid={ariaInvalid}
      role={role}
      tabIndex={tabIndex}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  );
};
