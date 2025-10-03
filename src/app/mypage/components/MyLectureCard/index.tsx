import { Text } from "@/components/base";
import { Lecture } from "@/types";
import styles from "./MyLectureCard.module.css";

interface MyLectureCardProps {
  lecture: Lecture;
}

export default function MyLectureCard({ lecture }: MyLectureCardProps) {
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
              수강 인원 ({lecture.currentStudents}/{lecture.maxStudents})
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
