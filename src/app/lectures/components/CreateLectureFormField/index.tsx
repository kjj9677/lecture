import { Input, InputType } from "@/components/base";
import styles from "./CreateLectureFormField.module.css";

interface CreateLectureFormFieldProps {
  label: string;
  type?: InputType;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  min?: string;
  className?: string;
}

export default function CreateLectureFormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  inputMode,
  min,
  className,
}: CreateLectureFormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        inputMode={inputMode}
        min={min}
        className={`${error ? styles.inputError : ""} ${className || ""}`}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
