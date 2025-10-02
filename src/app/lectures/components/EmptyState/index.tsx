import { Text } from "@/components/base";
import styles from "./EmptyState.module.css";

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>📚</div>
        <Text type="HEADER_3" color="secondary" className={styles.title}>
          강의가 없습니다
        </Text>
        <Text type="BODY_2" color="secondary" className={styles.message}>
          현재 등록된 강의가 없습니다.
          <br />
          새로운 강의가 등록되면 알려드릴게요.
        </Text>
      </div>
    </div>
  );
}