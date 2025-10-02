import { useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Button, Input } from "@/components/base";
import { authApi } from "@/data/mockApi";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onLoadingChange: (isLoading: boolean) => void;
}

export default function LoginForm({ onLoadingChange }: LoginFormProps) {
  const router = useRouter();
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

  const handleLogin = async () => {
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    onLoadingChange(true);

    try {
      const response = await authApi.login({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (response.success) {
        router.push('/lectures');
      } else {
        alert(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', error);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
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
  );
}