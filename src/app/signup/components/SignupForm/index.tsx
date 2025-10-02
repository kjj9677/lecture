import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base";
import { authApi } from "@/data/mockApi";
import { useAuth } from "@/hooks/useAuth";
import { SignupRequest } from "@/types";
import { validateEmail, validatePassword, validatePhoneNumber } from "@/utils";
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
  const { login } = useAuth();
  const [formData, setFormData] = useState<SignupRequest>(initialFormData);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    onLoadingChange(true);

    try {
      const response = await authApi.signup(formData);

      if (response.success) {
        const loginResponse = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse.success && loginResponse.data) {
          login(loginResponse.data);
          router.push("/lectures");
        } else {
          router.push("/login");
        }
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

  const FORM_FIELDS = [
    {
      name: "name" as const,
      label: "이름",
      type: "text",
      placeholder: "이름을 입력해주세요",
      ariaLabel: "이름 입력",
    },
    {
      name: "email" as const,
      label: "이메일",
      type: "email",
      placeholder: "이메일을 입력해주세요",
      ariaLabel: "이메일 입력",
      actionButton: {
        label: "중복확인",
        onClick: handleCheckEmail,
        disabled: isCheckingEmail || !formData.email.trim(),
      },
      successMessage: getEmailVerificationMessage(),
    },
    {
      name: "password" as const,
      label: "비밀번호",
      type: "password",
      placeholder: "6-10자 영문+숫자 조합",
      ariaLabel: "비밀번호 입력",
    },
  ] as const;

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit}>
      {FORM_FIELDS.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={field.name === "name" ? formData.name : field.name === "email" ? formData.email : formData.password}
          onChange={handleInputChange(field.name)}
          error={field.name === "name" ? errors.name : field.name === "email" ? errors.email : errors.password}
          ariaLabel={field.ariaLabel}
          required
          actionButton={"actionButton" in field ? field.actionButton : undefined}
          successMessage={"successMessage" in field ? field.successMessage : undefined}
        />
      ))}

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
        type="submit"
        className={styles.submitButton}
        ariaLabel="회원가입"
      >
        가입하기
      </Button>
    </form>
  );
}