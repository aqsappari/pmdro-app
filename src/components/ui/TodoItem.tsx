import type { ReactNode } from "react";

interface TodoItemProps {
  complete?: boolean;
  children: ReactNode;
  onToggle: () => void;
  onDelete: () => void;
}
export function TodoItem({
  complete,
  children,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <li
      onClick={onToggle}
      className="flex items-center border-b border-subtext/10 justify-between py-3 cursor-pointer group transition-all ease-in duration-200"
    >
      <div className="flex grow items-center gap-4">
        <div
          className={`aspect-square rounded-full ${complete ? "w-1.5 bg-subtext" : "w-2 bg-accent"} `}
        />
        <span
          className={`capitalize ${complete ? "text-subtext line-through" : ""}`}
        >
          {children}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="bg-transparent text-red-300 sm:text-subtext text-sm sm:hidden group-hover:block hover:text-red-300"
      >
        Erase
      </button>
    </li>
  );
}
