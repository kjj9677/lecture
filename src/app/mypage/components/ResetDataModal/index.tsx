"use client";

import { Modal, Button, Text } from "@/components/base";
import styles from "./ResetDataModal.module.css";

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetDataModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetDataModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="데이터 초기화 (테스트용)"
      description="모든 데이터가 초기 상태로 되돌아가고 로그아웃됩니다."
    >
      <div className={styles.content}>
        <Text type="BODY_2" color="secondary">
          정말 초기화하시겠습니까?
        </Text>
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
