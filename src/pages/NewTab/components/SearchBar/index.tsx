import React, { FC, useEffect, useRef } from "react";
import styles from "./style.module.less";

const SearchBar: FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current instanceof HTMLInputElement) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles["search-bar"]}>
      <input
        ref={inputRef}
        type="text"
        className="theme-transition"
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const searchText = (e.target as HTMLInputElement).value.trim();
            const searchUrl = `https://www.google.com/search?q=${searchText}&ie=UTF-8`;
            window.open(searchUrl, "_self");
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
