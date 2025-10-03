import { Text } from "@/components/base";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className={styles.errorContainer}>
      <Text type="BODY_1" color="error" className={styles.errorMessage}>
        {message}
      </Text>
    </div>
  );
}
