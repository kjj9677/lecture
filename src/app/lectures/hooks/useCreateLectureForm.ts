import { useState } from "react";
import { lectureApi } from "@/data/mockApi";
import { CreateLectureRequest } from "@/types";

export const MIN_PRICE = 50000;
export const MIN_STUDENTS = 5;

interface UseCreateLectureFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function useCreateLectureForm({
  onSuccess,
  onClose,
}: UseCreateLectureFormProps) {
  const [formData, setFormData] = useState<CreateLectureRequest>({
    title: "",
    price: MIN_PRICE,
    maxStudents: MIN_STUDENTS,
  });
  const [errors, setErrors] = useState<Partial<CreateLectureRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateLectureRequest> = {};

    if (!formData.title.trim()) {
      newErrors.title = "강의명을 입력해주세요.";
    }

    if (formData.price < MIN_PRICE) {
      newErrors.price = MIN_PRICE;
    }

    if (formData.maxStudents < MIN_STUDENTS) {
      newErrors.maxStudents = MIN_STUDENTS;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await lectureApi.createLecture(formData);

      if (response.success) {
        setFormData({ title: "", price: MIN_PRICE, maxStudents: MIN_STUDENTS });
        setErrors({});
        onSuccess();
        onClose();
      } else {
        setApiError(response.message || "강의 생성에 실패했습니다.");
      }
    } catch {
      setApiError("강의 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ title: "", price: MIN_PRICE, maxStudents: MIN_STUDENTS });
      setErrors({});
      setApiError("");
      onClose();
    }
  };

  const updateField = <K extends keyof CreateLectureRequest>(
    field: K,
    value: CreateLectureRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleSubmit,
    handleClose,
    updateField,
  };
}
