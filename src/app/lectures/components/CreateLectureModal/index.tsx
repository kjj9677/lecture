"use client";

import { Modal, Button } from "@/components/base";
import { formatPrice } from "@/utils";
import {
  MIN_PRICE,
  MIN_STUDENTS,
  useCreateLectureForm,
} from "@/app/lectures/hooks/useCreateLectureForm";
import CreateLectureFormField from "../CreateLectureFormField";
import styles from "./CreateLectureModal.module.css";

interface CreateLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLectureModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLectureModalProps) {
  const {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleSubmit,
    handleClose,
    updateField,
  } = useCreateLectureForm({ onSuccess, onClose });

  const CREATE_LECTURE_FIELDS = [
    {
      name: "title" as const,
      label: "강의명",
      type: "text" as const,
      placeholder: "강의명을 입력하세요",
      value: formData.title,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateField("title", e.target.value),
      error: errors.title,
    },
    {
      name: "price" as const,
      label: `수강료 (최소 ${formatPrice(MIN_PRICE, true)})`,
      type: "text" as const,
      placeholder: `${formatPrice(MIN_PRICE)}원`,
      inputMode: "numeric" as const,
      value: formData.price > 0 ? formatPrice(formData.price) : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        updateField("price", parseInt(value) || 0);
      },
      error:
        errors.price !== undefined
          ? `수강료는 최소 ${formatPrice(MIN_PRICE, true)} 이상이어야 합니다.`
          : undefined,
    },
    {
      name: "maxStudents" as const,
      label: `최대 수강 인원 (최소 ${MIN_STUDENTS}명)`,
      type: "number" as const,
      placeholder: MIN_STUDENTS.toString(),
      value: formData.maxStudents.toString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 0 || e.target.value === "") {
          updateField("maxStudents", value > 0 ? value : 0);
        }
      },
      error:
        errors.maxStudents !== undefined
          ? `최대 수강 인원은 최소 ${MIN_STUDENTS}명 이상이어야 합니다.`
          : undefined,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="강의 개설하기"
      description="새로운 강의를 개설하기 위해 다음 정보를 입력해주세요."
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {CREATE_LECTURE_FIELDS.map((field) => (
          <CreateLectureFormField
            key={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={field.value}
            onChange={field.onChange}
            error={field.error}
            disabled={isSubmitting}
            inputMode={"inputMode" in field ? field.inputMode : undefined}
          />
        ))}

        {apiError && <div className={styles.apiError}>{apiError}</div>}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "생성 중..." : "강의 개설"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
