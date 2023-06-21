import { useEffect, useState } from "react";

export default function useWindow() {
  const [innerWidth, setInnerWidth] = useState(0);
  const [scrollValue, setScrollValue] = useState<number>(0);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  });

  const handleScroll = () => {
    setScrollValue(window.scrollY);
  };

  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };

  return { innerWidth, scrollValue };
}
