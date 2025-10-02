"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/base";
import styles from "./LoginFooter.module.css";

export default function LoginFooter() {
  const router = useRouter();

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <footer className={styles.signupSection}>
      <Text type="BODY_2" color="secondary" className={styles.signupText}>
        아이디가 없으신가요?
      </Text>
      <Text
        type="BODY_2"
        color="primary"
        className={styles.signupLink}
        onClick={handleSignupClick}
        tabIndex={0}
        ariaLabel="회원가입 페이지로 이동"
        role="button"
      >
        회원가입하기
      </Text>
    </footer>
  );
}