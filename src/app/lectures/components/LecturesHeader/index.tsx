import { useRouter } from "next/navigation";
import { Text, Button } from "@/components/base";
import { useAuth } from "@/hooks/useAuth";
import { LectureSortOption } from "@/types";
import styles from "./LecturesHeader.module.css";

interface LecturesHeaderProps {
  totalCount: number;
  sortOption: LectureSortOption;
  onSortChange: (option: LectureSortOption) => void;
}

const sortOptions = [
  { value: "recent" as LectureSortOption, label: "최근 등록순" },
  { value: "popular" as LectureSortOption, label: "신청자 많은순" },
  { value: "enrollment-rate" as LectureSortOption, label: "신청률 높은 순" },
];

export default function LecturesHeader({
  totalCount,
  sortOption,
  onSortChange
}: LecturesHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
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
          강의 목록
        </Text>
        <Text type="BODY_2" color="secondary" className={styles.countText}>
          총 {totalCount}개 강의
        </Text>
      </div>

      <div className={styles.sortSection}>
        <Text type="BODY_2" color="neutral" className={styles.sortLabel}>
          정렬
        </Text>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as LectureSortOption)}
          className={styles.sortSelect}
          aria-label="강의 정렬 방식 선택"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}