import { Button } from "@/components/base";
import { useSignupForm } from "../../hooks/useSignupForm";
import FormField from "../FormField";
import UserTypeRadio from "../UserTypeRadio";
import styles from "./SignupForm.module.css";

interface SignupFormProps {
  onLoadingChange: (isLoading: boolean) => void;
}

export default function SignupForm({ onLoadingChange }: SignupFormProps) {
  const {
    formData,
    passwordConfirm,
    errors,
    isCheckingEmail,
    handleInputChange,
    handlePasswordConfirmChange,
    handleUserTypeChange,
    handleCheckEmail,
    handleSubmit,
    getEmailVerificationMessage,
  } = useSignupForm({ onLoadingChange });

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
          value={formData[field.name]}
          onChange={handleInputChange(field.name)}
          error={errors[field.name]}
          ariaLabel={field.ariaLabel}
          required
          actionButton={
            "actionButton" in field ? field.actionButton : undefined
          }
          successMessage={
            "successMessage" in field ? field.successMessage : undefined
          }
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

      <UserTypeRadio
        value={formData.userType}
        onChange={handleUserTypeChange}
      />

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
