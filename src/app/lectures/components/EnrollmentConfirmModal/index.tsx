"use client";

import { Modal, Button, Text } from "@/components/base";
import { Lecture } from "@/types";
import { formatPrice } from "@/utils";
import styles from "./EnrollmentConfirmModal.module.css";

interface EnrollmentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedLectures: Lecture[];
}

export default function EnrollmentConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedLectures,
}: EnrollmentConfirmModalProps) {
  const totalPrice = selectedLectures.reduce(
    (sum, lecture) => sum + lecture.price,
    0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="강의 신청 확인"
      description={`총 ${selectedLectures.length}개 강의를 신청합니다.`}
    >
      <div className={styles.content}>
        <div className={styles.lectureList}>
          {selectedLectures.map((lecture) => (
            <Text key={lecture.id} type="BODY_2" color="black">
              • {lecture.title}
            </Text>
          ))}
        </div>

        <div className={styles.totalPrice}>
          <Text type="BODY_1" color="primary" className={styles.totalLabel}>
            총 금액
          </Text>
          <Text type="HEADER_2" color="primary" className={styles.priceValue}>
            {formatPrice(totalPrice, true)}
          </Text>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" size="medium" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" size="medium" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
