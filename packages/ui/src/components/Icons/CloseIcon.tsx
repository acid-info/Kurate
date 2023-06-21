import { LsdIcon } from "@acid-info/lsd-react";

export const UndoIcon = LsdIcon(
  (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={20}
      height={20}
      {...props}
    >
      <polygon points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4" />
    </svg>
  ),
  { filled: true }
);
