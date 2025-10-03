import { Lecture } from "@/types";
import LectureCard from "../LectureCard";
import styles from "./LectureList.module.css";

interface LectureListProps {
  lectures: Lecture[];
  selectedLectures: string[];
  onSelectionChange: (lectureId: string, selected: boolean) => void;
  currentUserId?: string;
  observerRef?: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage?: boolean;
}

export default function LectureList({
  lectures,
  selectedLectures,
  onSelectionChange,
  currentUserId,
  observerRef,
  isFetchingNextPage,
}: LectureListProps) {
  return (
    <>
      <div className={styles.grid}>
        {lectures.map((lecture) => (
          <LectureCard
            key={lecture.id}
            lecture={lecture}
            isSelected={selectedLectures.includes(lecture.id)}
            onSelectionChange={onSelectionChange}
            currentUserId={currentUserId}
          />
        ))}
      </div>
      {observerRef && (
        <div ref={observerRef} className={styles.observer}>
          {isFetchingNextPage && <div className={styles.loading}>•••</div>}
        </div>
      )}
    </>
  );
}
