import styles from "./LoadingState.module.css";

export default function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.topRow}>
              <div className={styles.skeletonHeader}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonInstructor} />
              </div>
              <div className={styles.skeletonCheckbox} />
            </div>

            <div className={styles.bottomRow}>
              <div className={styles.skeletonEnrollment} />
              <div className={styles.skeletonPrice} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}