import { Text } from "@/components/base";
import { Lecture } from "@/types";
import styles from "./MyLectureCard.module.css";

const ALMOST_FULL_THRESHOLD = 0.9;

interface MyLectureCardProps {
  lecture: Lecture;
}

export default function MyLectureCard({ lecture }: MyLectureCardProps) {
  const isFullyBooked = lecture.currentStudents >= lecture.maxStudents;
  const enrollmentRate = lecture.currentStudents / lecture.maxStudents;
  const isAlmostFull =
    enrollmentRate >= ALMOST_FULL_THRESHOLD && !isFullyBooked;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Text type="BODY_1" color="primary" className={styles.title}>
            {lecture.title}
          </Text>
          <Text type="BODY_2" color="secondary" className={styles.instructor}>
            {lecture.instructorName}
          </Text>
        </div>

        <div className={styles.info}>
          <div className={styles.enrollment}>
            <Text
              type="BODY_2"
              color="neutral"
              className={styles.enrollmentText}
            >
              {isFullyBooked ? (
                <span className={styles.fullText}>마감</span>
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
        </div>
      </div>
    </div>
  );
}
