import { useRouter } from "next/navigation";
import { Text, Button } from "@/components/base";
import { useAuth } from "@/hooks/useAuth";
import styles from "./MyPageHeader.module.css";

export default function MyPageHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleGoBack = () => {
    router.push("/lectures");
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

      <div className={styles.titleSection}>
        <Text type="HEADER_1" color="primary" as="h1">
          마이페이지
        </Text>
        <Button
          variant="ghost"
          size="small"
          onClick={handleGoBack}
          ariaLabel="강의 목록으로 돌아가기"
        >
          ← 강의 목록
        </Button>
      </div>
    </header>
  );
}
