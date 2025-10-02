import { Text, Input } from "@/components/base";
import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  ariaLabel: string;
}

export default function FormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  ariaLabel,
}: FormFieldProps) {
  return (
    <div className={styles.inputGroup}>
      <Text type="BODY_2" color="neutral" className={styles.label}>
        {label}
      </Text>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
        ariaInvalid={!!error}
        required={required}
      />
      <Text type="CAPTION" color="error" className={styles.errorMessage}>
        {error}
      </Text>
    </div>
  );
}