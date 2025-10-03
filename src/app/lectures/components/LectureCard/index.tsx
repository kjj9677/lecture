import { Text } from "@/components/base";
import { Lecture } from "@/types";
import { formatPrice } from "@/utils";
import styles from "./LectureCard.module.css";

const ALMOST_FULL_THRESHOLD = 0.9;

interface LectureCardProps {
  lecture: Lecture;
  isSelected: boolean;
  onSelectionChange: (lectureId: string, selected: boolean) => void;
  currentUserId?: string;
}

export default function LectureCard({
  lecture,
  isSelected,
  onSelectionChange,
  currentUserId,
}: LectureCardProps) {
  const isFullyBooked = lecture.currentStudents >= lecture.maxStudents;
  const enrollmentRate = lecture.currentStudents / lecture.maxStudents;
  const isAlmostFull =
    enrollmentRate >= ALMOST_FULL_THRESHOLD && !isFullyBooked;

  const isMyLecture = currentUserId === lecture.instructorId;
  const isEnrolled = lecture.applicants.some((s) => s === currentUserId);
  const showBadge = isMyLecture || isEnrolled;
  const isCardClickable = !showBadge && !isFullyBooked;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(lecture.id, e.target.checked);
  };

  const handleCardClick = () => {
    if (isCardClickable) {
      onSelectionChange(lecture.id, !isSelected);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && isCardClickable) {
      e.preventDefault();
      onSelectionChange(lecture.id, !isSelected);
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""} ${
        isCardClickable ? styles.clickable : ""
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={isCardClickable ? "button" : undefined}
      aria-pressed={isCardClickable ? isSelected : undefined}
      tabIndex={isCardClickable ? 0 : undefined}
      aria-label={
        isCardClickable
          ? `${lecture.title} 강의 ${isSelected ? "선택됨" : "선택"}`
          : undefined
      }
    >
      <div className={styles.topRow}>
        <div className={styles.header}>
          <Text type="BODY_1" color="primary" className={styles.title}>
            {lecture.title}
          </Text>
          <Text type="BODY_2" color="secondary" className={styles.instructor}>
            {lecture.instructorName}
          </Text>
        </div>
        <div className={styles.checkbox}>
          {showBadge ? (
            <span
              className={
                isMyLecture ? styles.myLectureBadge : styles.enrolledBadge
              }
            >
              {isMyLecture ? "나의 강의" : "수강중"}
            </span>
          ) : (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              disabled={isFullyBooked}
              className={styles.checkboxInput}
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.enrollment}>
          <Text type="BODY_2" color="neutral" className={styles.enrollmentText}>
            {isFullyBooked ? (
              <span className={styles.fullText}>정원 마감</span>
            ) : (
              <>
                수강 인원 ({lecture.currentStudents}/{lecture.maxStudents})
                {isAlmostFull && (
                  <span className={styles.almostFull}>마감임박</span>
                )}
              </>
            )}
          </Text>
        </div>
        <div className={styles.price}>
          <Text type="BODY_1" color="primary" className={styles.priceText}>
            {formatPrice(lecture.price, true)}
          </Text>
        </div>
      </div>
    </div>
  );
}
