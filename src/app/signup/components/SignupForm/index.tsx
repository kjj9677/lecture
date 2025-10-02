import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base";
import { authApi } from "@/data/mockApi";
import { SignupRequest } from "@/types";
import FormField from "../FormField";
import UserTypeRadio from "../UserTypeRadio";
import styles from "./SignupForm.module.css";

interface FormErrors {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  userType: string;
}

const initialFormData: SignupRequest = {
  name: "",
  email: "",
  phone: "",
  password: "",
  userType: "student",
};

const initialErrors: FormErrors = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  passwordConfirm: "",
  userType: "",
};

interface SignupFormProps {
  onLoadingChange: (isLoading: boolean) => void;
}

export default function SignupForm({ onLoadingChange }: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupRequest>(initialFormData);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 6 || password.length > 10) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
      userType: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    } else if (emailVerified !== true) {
      newErrors.email = "이메일 중복 확인이 필요합니다.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "6-10자의 영문+숫자 조합이어야 합니다.";
    }

    if (!passwordConfirm.trim()) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.phone.trim()) {
      newErrors.phoneNumber = "휴대폰 번호를 입력해주세요.";
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phoneNumber = "010-0000-0000 형식으로 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleInputChange =
    (field: keyof SignupRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      if (field === "email") {
        setEmailVerified(null);
      }

      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const handlePasswordConfirmChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(event.target.value);

    if (errors.passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: "",
      }));
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일을 입력해주세요.",
      }));
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return;
    }

    setIsCheckingEmail(true);

    try {
      const response = await authApi.checkEmailDuplicate(formData.email);

      if (response.success && response.data) {
        setEmailVerified(response.data.available);
        setErrors((prev) => ({
          ...prev,
          email: response.data!.available ? "" : response.message || "",
        }));
      }
    } catch (error) {
      console.error("Email check error:", error);
      alert("이메일 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleUserTypeChange = (userType: "student" | "instructor") => {
    setFormData((prev) => ({
      ...prev,
      userType,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    onLoadingChange(true);

    try {
      const response = await authApi.signup(formData);

      if (response.success) {
        router.push("/lectures");
      } else {
        if (response.message?.includes("이메일")) {
          setErrors((prev) => ({
            ...prev,
            email: response.message || "",
          }));
        } else {
          alert(response.message || "회원가입에 실패했습니다.");
        }
      }
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
      console.error("Signup error:", error);
    } finally {
      onLoadingChange(false);
    }
  };

  const getEmailVerificationMessage = () => {
    if (emailVerified === true) {
      return "사용 가능한 이메일입니다.";
    }
    return "";
  };

  return (
    <main className={styles.signupForm}>
      <FormField
        label="이름"
        type="text"
        placeholder="이름을 입력해주세요"
        value={formData.name}
        onChange={handleInputChange("name")}
        error={errors.name}
        ariaLabel="이름 입력"
        required
      />

      <FormField
        label="이메일"
        type="email"
        placeholder="이메일을 입력해주세요"
        value={formData.email}
        onChange={handleInputChange("email")}
        error={errors.email}
        ariaLabel="이메일 입력"
        required
        actionButton={{
          label: "중복확인",
          onClick: handleCheckEmail,
          disabled: isCheckingEmail || !formData.email.trim(),
        }}
        successMessage={getEmailVerificationMessage()}
      />

      <FormField
        label="비밀번호"
        type="password"
        placeholder="6-10자 영문+숫자 조합"
        value={formData.password}
        onChange={handleInputChange("password")}
        error={errors.password}
        ariaLabel="비밀번호 입력"
        required
      />

      <FormField
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
        error={errors.passwordConfirm}
        ariaLabel="비밀번호 확인 입력"
        required
      />

      <FormField
        label="휴대폰 번호"
        type="tel"
        placeholder="010-0000-0000"
        value={formData.phone}
        onChange={handleInputChange("phone")}
        error={errors.phoneNumber}
        ariaLabel="휴대폰 번호 입력"
        required
      />

      <UserTypeRadio value={formData.userType} onChange={handleUserTypeChange} />

      <Button
        variant="primary"
        size="large"
        onClick={handleSubmit}
        className={styles.submitButton}
        ariaLabel="회원가입"
      >
        가입하기
      </Button>
    </main>
  );
}