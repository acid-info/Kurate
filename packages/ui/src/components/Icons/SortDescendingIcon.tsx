import { LsdIcon } from "@acid-info/lsd-react";

export const SortDescendingIcon = LsdIcon(
  (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={20}
      height={20}
      {...props}
    >
      <polygon points="18 22 19.414 20.586 23 24.172 23 4 25 4 25 24.172 28.586 20.586 30 22 24 28 18 22" />
      <rect x="2" y="6" width="14" height="2" />
      <rect x="6" y="12" width="10" height="2" />
      <rect x="10" y="18" width="6" height="2" />
    </svg>
  ),
  { filled: true }
);
