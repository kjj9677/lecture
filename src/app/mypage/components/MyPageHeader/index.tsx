"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Button } from "@/components/base";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/data/mockApi";
import ResetDataModal from "../ResetDataModal";
import styles from "./MyPageHeader.module.css";

export default function MyPageHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleNavigateToLectures = () => {
    router.push("/lectures");
  };

  const handleResetData = async () => {
    await authApi.resetData();
    setIsResetModalOpen(false);
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.userInfo}>
          <Text type="BODY_2" color="neutral" className={styles.userName}>
            {user?.name}님
          </Text>
          <Text type="CAPTION" color="secondary" className={styles.userType}>
            {user?.userType === "instructor" ? "강사" : "학생"}
          </Text>
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className={styles.resetButton}
            aria-label="데이터 초기화"
          >
            데이터 초기화
          </button>
          <Button
            variant="outline"
            size="small"
            onClick={handleLogout}
            className={styles.logoutButton}
            ariaLabel="로그아웃"
          >
            로그아웃
          </Button>
        </div>
      </div>

      <div className={styles.titleSection}>
        <Text type="HEADER_1" color="primary" as="h1">
          마이페이지
        </Text>
        <Button
          variant="secondary"
          size="small"
          onClick={handleNavigateToLectures}
          ariaLabel="강의 목록으로가기"
        >
          강의 목록 보기
        </Button>
      </div>

      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
      />
    </header>
  );
}
