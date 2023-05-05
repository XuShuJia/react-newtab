import React, { FC } from "react";
import styles from "./style.module.less";
import Clock from "./components/Clock";
import SearchBar from "./components/SearchBar";

const Main: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles["header-bar"]}>
        <div className={styles["header-bar-left"]}></div>
        <div className={styles["header-bar-right"]}>
          <button
            onClick={() => {
              if (document.documentElement.dataset.theme === "dark") {
                document.documentElement.dataset.theme = "light";
              } else {
                document.documentElement.dataset.theme = "dark";
              }
            }}
          >
            Light/Dark
          </button>
        </div>
      </div>
      <div className={styles["center-box"]}>
        <Clock />
        <SearchBar />
      </div>
    </div>
  );
};

export default Main;
