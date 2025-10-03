import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/data/mockApi";
import { useAuth } from "@/hooks/useAuth";
import { SignupRequest } from "@/types";
import { validateEmail, validatePassword, validatePhoneNumber } from "@/utils";

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

interface UseSignupFormProps {
  onLoadingChange: (isLoading: boolean) => void;
}

export function useSignupForm({ onLoadingChange }: UseSignupFormProps) {
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
    (field: keyof SignupRequest) => (event: ChangeEvent<HTMLInputElement>) => {
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
    event: ChangeEvent<HTMLInputElement>
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
    } catch {
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
    } catch {
      alert("회원가입 중 오류가 발생했습니다.");
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

  return {
    formData,
    passwordConfirm,
    errors,
    emailVerified,
    isCheckingEmail,
    handleInputChange,
    handlePasswordConfirmChange,
    handleUserTypeChange,
    handleCheckEmail,
    handleSubmit,
    getEmailVerificationMessage,
  };
}
