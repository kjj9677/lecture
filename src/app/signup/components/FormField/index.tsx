import { Text, Input, Button, InputType } from "@/components/base";
import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  type: InputType;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  ariaLabel: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  successMessage?: string;
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
  actionButton,
  successMessage,
}: FormFieldProps) {
  return (
    <div className={styles.inputGroup}>
      <Text type="BODY_2" color="neutral" className={styles.label}>
        {label}
      </Text>
      <div className={styles.inputWrapper}>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          ariaLabel={ariaLabel}
          ariaInvalid={!!error}
          required={required}
          className={actionButton ? styles.inputWithButton : ""}
        />
        {actionButton && (
          <Button
            variant="outline"
            size="medium"
            onClick={actionButton.onClick}
            disabled={actionButton.disabled}
            className={styles.actionButton}
          >
            {actionButton.label}
          </Button>
        )}
      </div>
      {successMessage && !error && (
        <Text type="CAPTION" color="success" className={styles.successMessage}>
          {successMessage}
        </Text>
      )}
      <Text type="CAPTION" color="error" className={styles.errorMessage}>
        {error}
      </Text>
    </div>
  );
}
