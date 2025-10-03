import { Text } from "@/components/base";
import styles from "./TabSelector.module.css";

type TabType = "created" | "enrolled";

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { value: "created" as TabType, label: "개설 과목" },
  { value: "enrolled" as TabType, label: "수강 과목" },
];

export default function TabSelector({
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`${styles.tab} ${
            activeTab === tab.value ? styles.active : ""
          }`}
          onClick={() => onTabChange(tab.value)}
          aria-label={tab.label}
        >
          <Text
            type="BODY_2"
            color={activeTab === tab.value ? "primary" : "neutral"}
            className={styles.tabLabel}
          >
            {tab.label}
          </Text>
        </button>
      ))}
    </div>
  );
}
