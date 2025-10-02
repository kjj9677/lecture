import { Text } from "@/components/base";
import styles from "./SignupHeader.module.css";

export default function SignupHeader() {
  return (
    <header className={styles.header}>
      <Text type="HEADER_1" color="primary" as="h1">
        회원가입
      </Text>
    </header>
  );
}
