import { Text } from "@/components/base";
import styles from "./SignupFooter.module.css";

export default function SignupFooter() {
  const handleLoginClick = () => {
    window.location.href = "/";
  };

  return (
    <footer className={styles.loginSection}>
      <Text type="BODY_2" color="secondary" className={styles.loginText}>
        이미 계정이 있으신가요?
      </Text>
      <Text
        type="BODY_2"
        color="primary"
        className={styles.loginLink}
        onClick={handleLoginClick}
        tabIndex={0}
        ariaLabel="로그인 페이지로 이동"
        role="button"
      >
        로그인하기
      </Text>
    </footer>
  );
}