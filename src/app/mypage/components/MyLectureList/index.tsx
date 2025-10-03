import { Text } from "@/components/base";
import { Lecture } from "@/types";
import MyLectureCard from "@/app/mypage/components/MyLectureCard";
import LoadingState from "@/app/lectures/components/LoadingState";
import ErrorState from "@/app/lectures/components/ErrorState";
import styles from "./MyLectureList.module.css";

interface MyLectureListProps {
  lectures: Lecture[];
  isLoading: boolean;
  error: string | null;
}

export default function MyLectureList({
  lectures,
  isLoading,
  error,
}: MyLectureListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (lectures.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Text type="BODY_1" color="secondary">
          강의가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.lectureList}>
      {lectures.map((lecture) => (
        <MyLectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  );
}
