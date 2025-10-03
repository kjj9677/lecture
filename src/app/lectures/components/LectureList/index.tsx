import { Lecture } from "@/types";
import LectureCard from "../LectureCard";
import styles from "./LectureList.module.css";

interface LectureListProps {
  lectures: Lecture[];
  selectedLectures: string[];
  onSelectionChange: (lectureId: string, selected: boolean) => void;
  currentUserId?: string;
}

export default function LectureList({
  lectures,
  selectedLectures,
  onSelectionChange,
  currentUserId
}: LectureListProps) {
  return (
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
  );
}