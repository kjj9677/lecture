import { Text } from "@/components/base";
import styles from "./SignupHeader.module.css";

export default function SignupHeader() {
  return (
    <header className={styles.header}>
      <Text type="HEADER_1" color="primary" as="h1">
        회원가입
      </Text>
      <Text type="BODY_1" color="secondary">
        월급쟁이부자들 강의 플랫폼
      </Text>
    </header>
  );
}