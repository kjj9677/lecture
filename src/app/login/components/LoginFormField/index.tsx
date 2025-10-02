import { Text, Input, InputType } from "@/components/base";
import styles from "./LoginFormField.module.css";

interface LoginFormFieldProps {
  label: string;
  type: InputType;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  required?: boolean;
}

export default function LoginFormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  ariaLabel,
  required = false,
}: LoginFormFieldProps) {
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
        required={required}
      />
    </div>
  );
}
