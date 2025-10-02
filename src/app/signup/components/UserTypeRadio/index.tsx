import { Text } from "@/components/base";
import styles from "./UserTypeRadio.module.css";

interface UserTypeRadioProps {
  value: "student" | "instructor";
  onChange: (userType: "student" | "instructor") => void;
}

export default function UserTypeRadio({ value, onChange }: UserTypeRadioProps) {
  return (
    <div className={styles.inputGroup}>
      <Text type="BODY_2" color="neutral" className={styles.label}>
        회원 유형
      </Text>
      <div
        className={styles.radioGroup}
        role="radiogroup"
        aria-label="회원 유형 선택"
      >
        <label className={styles.radioOption}>
          <input
            type="radio"
            name="userType"
            value="student"
            checked={value === "student"}
            onChange={() => onChange("student")}
            className={styles.radioInput}
            aria-label="수강생"
          />
          <Text type="BODY_2" color="neutral" className={styles.radioLabel}>
            수강생
          </Text>
        </label>
        <label className={styles.radioOption}>
          <input
            type="radio"
            name="userType"
            value="instructor"
            checked={value === "instructor"}
            onChange={() => onChange("instructor")}
            className={styles.radioInput}
            aria-label="강사"
          />
          <Text type="BODY_2" color="neutral" className={styles.radioLabel}>
            강사
          </Text>
        </label>
      </div>
    </div>
  );
}