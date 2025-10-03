import { Text } from "@/components/base";
import styles from "./EmptyState.module.css";

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Text type="HEADER_3" color="secondary" className={styles.title}>
          강의가 없습니다
        </Text>
        <Text type="BODY_2" color="secondary" className={styles.message}>
          현재 등록된 강의가 없습니다.
        </Text>
      </div>
    </div>
  );
}
