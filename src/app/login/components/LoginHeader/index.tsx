import { Text } from "@/components/base";
import styles from "./LoginHeader.module.css";

export default function LoginHeader() {
  return (
    <header className={styles.header}>
      <Text type="HEADER_1" color="primary" as="h1">
        월급쟁이부자들
      </Text>
      <Text type="BODY_1" color="secondary">
        강의 플랫폼
      </Text>
    </header>
  );
}