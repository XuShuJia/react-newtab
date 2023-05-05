import React, { FC, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import styles from "./style.module.less";

const WeekCN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const Clock: FC = () => {
  const updateTimerRef = useRef<NodeJS.Timer>();
  const [state, setState] = useImmer({
    hours: "16",
    minutes: "01",
    month: "4",
    date: "29",
    week: 6,
    showColon: true,
  });

  // update
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const month = d.getMonth() + 1;
      const date = d.getDate();
      const week = d.getDay();
      setState((draft) => {
        draft.hours = hours < 10 ? `0${hours}` : `${hours}`;
        draft.minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        draft.month = `${month}`;
        draft.date = `${date}`;
        draft.week = week;
        draft.showColon = !draft.showColon;
      });
    };
    updateClock();
    updateTimerRef.current = setInterval(updateClock, 1000);
    return () => {
      clearInterval(updateTimerRef.current);
    };
  }, [setState]);

  return (
    <div className={[styles.clock, "theme-transition"].join(" ")}>
      <div className={styles.time}>
        <div data-type="hours">{state.hours}</div>
        <div data-type="colon">{state.showColon ? ":" : ""}</div>
        <div data-type="minutes">{state.minutes}</div>
      </div>
      <div className={styles.date}>
        <div data-type="month">{`${state.month}月${state.date}日`}</div>
        <div data-type="week">{WeekCN[state.week]}</div>
      </div>
    </div>
  );
};

export default Clock;
