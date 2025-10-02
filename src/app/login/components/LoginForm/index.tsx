"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base";
import { authApi } from "@/data/mockApi";
import { useAuth } from "@/hooks/useAuth";
import LoginFormField from "../LoginFormField";
import styles from "./LoginForm.module.css";

const DEFAULT_LOGIN_INPUTS = {
  email: "",
  password: "",
};

const FORM_FIELDS = [
  {
    name: "email" as const,
    label: "아이디",
    type: "email" as const,
    placeholder: "이메일을 입력해주세요",
    ariaLabel: "이메일 입력",
  },
  {
    name: "password" as const,
    label: "비밀번호",
    type: "password" as const,
    placeholder: "비밀번호를 입력해주세요",
    ariaLabel: "비밀번호 입력",
  },
];

interface LoginFormProps {
  onLoadingChange: (isLoading: boolean) => void;
}

export default function LoginForm({ onLoadingChange }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [loginInputs, setLoginInputs] = useState(() => DEFAULT_LOGIN_INPUTS);

  const handleInputChange =
    (field: keyof typeof DEFAULT_LOGIN_INPUTS) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoginInputs((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginInputs.email.trim() || !loginInputs.password.trim()) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    onLoadingChange(true);

    try {
      const response = await authApi.login({
        email: loginInputs.email,
        password: loginInputs.password,
      });

      if (response.success && response.data) {
        login(response.data);
        router.push("/lectures");
      } else {
        alert(response.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      {FORM_FIELDS.map((field) => (
        <LoginFormField
          key={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={loginInputs[field.name]}
          onChange={handleInputChange(field.name)}
          ariaLabel={field.ariaLabel}
          required
        />
      ))}

      <Button
        variant="primary"
        size="large"
        type="submit"
        className={styles.loginButton}
        ariaLabel="로그인"
      >
        로그인
      </Button>
    </form>
  );
}
