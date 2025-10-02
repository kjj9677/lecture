"use client";

import { Text, Button, Input } from "@/components/base";
import { PageContainer } from "@/components/layout";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleLogin = () => {
    console.log("로그인 시도:", loginForm);
  };

  const handleSignupClick = () => {
    console.log("회원가입 페이지로 이동");
  };

  return (
    <PageContainer>
      <header className={styles.header}>
        <Text type="HEADER_1" color="primary" as="h1">
          월급쟁이부자들
        </Text>
        <Text type="BODY_1" color="secondary">
          강의 플랫폼
        </Text>
      </header>

      <main className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <Text type="BODY_2" color="neutral" className={styles.label}>
            아이디
          </Text>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={loginForm.email}
            onChange={handleInputChange("email")}
            ariaLabel="이메일 입력"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <Text type="BODY_2" color="neutral" className={styles.label}>
            비밀번호
          </Text>
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={loginForm.password}
            onChange={handleInputChange("password")}
            ariaLabel="비밀번호 입력"
            required
          />
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={handleLogin}
          className={styles.loginButton}
          ariaLabel="로그인"
        >
          로그인
        </Button>
      </main>

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
    </PageContainer>
  );
}
