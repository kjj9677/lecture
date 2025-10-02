import { Text } from "@/components/base";
import { LectureSortOption } from "@/types";
import styles from "./LecturesHeader.module.css";

interface LecturesHeaderProps {
  totalCount: number;
  sortOption: LectureSortOption;
  onSortChange: (option: LectureSortOption) => void;
}

const sortOptions = [
  { value: "recent" as LectureSortOption, label: "최신순" },
  { value: "popular" as LectureSortOption, label: "인기순" },
  { value: "enrollment-rate" as LectureSortOption, label: "등록률순" },
];

export default function LecturesHeader({
  totalCount,
  sortOption,
  onSortChange
}: LecturesHeaderProps) {
  return (
    <header className={styles.header}>
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