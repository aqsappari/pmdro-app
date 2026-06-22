import { LuPlus } from "react-icons/lu";
import { TodoItem } from "../ui/TodoItem";
import { useState } from "react";

interface TaskProps {
  id: number;
  text: string;
  completed: boolean;
  completedAt?: number;
}

interface TodoListProps {
  tasks: TaskProps[];
  setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
}

export function TodoList({ tasks, setTasks }: TodoListProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: TaskProps = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      }),
    );
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const activeCount = tasks.filter((t) => !t.completed).length;

  // ==========================================
  // SORTING LOGIC
  // ==========================================
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (!a.completed && !b.completed) {
      return a.id - b.id;
    }
    return (a.completedAt || 0) - (b.completedAt || 0);
  });

  return (
    <section className="h-full p-8 flex flex-col justify-center items-center xl:items-start gap-2">
      <h2 className="text-sm font-bold uppercase">
        {activeCount} focus Objectives
      </h2>
      <form
        onSubmit={handleAddTask}
        className="relative w-full mb-4 border-b-2 border-border hover:border-maintext/50 focus-within:border-accent hover:focus-within:border-accent transition-all duration-100 ease-in"
      >
        <input
          className="w-full px-1 pr-8 py-1.5 outline-none focus:outline-none peer"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Declare a focus objective..."
        />
        <button className="absolute right-1 top-2.5 peer-focus:text-accent focus:text-accent active:scale-85">
          <LuPlus />
        </button>
      </form>
      {tasks.length === 0 ? (
        <div className="grow max-h-75 w-full text-subtext/40 italic text-sm py-4">
          Lanes are clear. State your target above.
        </div>
      ) : (
        <ul className="grow xl:max-h-75 w-full pr-2 flex flex-col gap-4 overflow-y-auto custom-scroll">
          {sortedTasks.map((task) => (
            <TodoItem
              key={task.id}
              complete={task.completed}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => removeTask(task.id)}
            >
              {task.text}
            </TodoItem>
          ))}
        </ul>
      )}
    </section>
  );
}
