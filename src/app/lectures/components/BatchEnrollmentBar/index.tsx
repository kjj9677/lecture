"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Button } from "@/components/base";
import { lectureApi } from "@/data/mockApi";
import { useAuth } from "@/hooks/useAuth";
import { Lecture } from "@/types";
import EnrollmentConfirmModal from "../EnrollmentConfirmModal";
import styles from "./BatchEnrollmentBar.module.css";

interface BatchEnrollmentBarProps {
  selectedLectureIds: string[];
  lectures: Lecture[];
  onEnrollmentSuccess: () => void;
  onClearSelection: () => void;
}

export default function BatchEnrollmentBar({
  selectedLectureIds,
  lectures,
  onEnrollmentSuccess,
  onClearSelection,
}: BatchEnrollmentBarProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const selectedCount = selectedLectureIds.length;
  const selectedLectures = lectures.filter((lecture) =>
    selectedLectureIds.includes(lecture.id)
  );

  const handleOpenConfirmModal = () => {
    if (selectedCount === 0) return;

    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleBatchEnroll = async () => {
    setIsConfirmModalOpen(false);

    setIsEnrolling(true);

    try {
      const results = await Promise.allSettled(
        selectedLectureIds.map((lectureId) =>
          lectureApi.applyToLecture(lectureId)
        )
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;

      const failedCount = selectedCount - successCount;

      if (successCount > 0) {
        let message = `${successCount}개 강의 신청이 완료되었습니다!`;
        if (failedCount > 0) {
          message += `\n(${failedCount}개 강의는 신청에 실패했습니다.)`;
        }
        alert(message);
        onEnrollmentSuccess();
        onClearSelection();
      } else {
        alert("모든 강의 신청에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("강의 신청 중 오류가 발생했습니다.");
      console.error("Batch enrollment error:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <Text type="BODY_2" color="primary" className={styles.countText}>
            선택한 {selectedCount}개 과목
          </Text>
          <button
            onClick={onClearSelection}
            className={styles.clearButton}
            aria-label="선택 해제"
          >
            <Text type="CAPTION" color="secondary">
              선택 해제
            </Text>
          </button>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={handleOpenConfirmModal}
          disabled={isEnrolling}
          className={styles.enrollButton}
          ariaLabel={`선택한 ${selectedCount}개 과목 일괄 신청`}
        >
          {isEnrolling ? "신청 중..." : "신청하기"}
        </Button>
      </div>

      <EnrollmentConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleBatchEnroll}
        selectedLectures={selectedLectures}
      />
    </div>
  );
}
