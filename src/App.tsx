import type { ReactNode } from "react";
import { LuSettings, LuPlus } from "react-icons/lu";
import { SiGithub, SiFacebook, SiGmail } from "react-icons/si";

export default function App() {
  return (
    <div className="bg-background text-maintext font-body h-dvh w-full flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-2">
        <div className="h-full w-full md:max-w-3/4 mx-auto flex flex-col xl:flex-row gap-1.5">
          <div className="w-full xl:w-3/5">
            <Timer />
          </div>
          <div className="grow w-full min-w-[min(100%,410px)] xl:w-2/5">
            <TodoListContainer />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="w-full px-4 py-8 border-b border-accent/20">
      <div className="w-full md:max-w-3/4 mx-auto flex justify-between items-center">
        <Branding />

        <Utility />
      </div>
    </header>
  );
}

function Branding({ footer }: { footer?: boolean }) {
  return (
    <div className="flex gap-2 items-center">
      <img
        src="/android-chrome-512x512.png"
        alt="pdrmo_logo"
        width={32}
        height={32}
      />

      {!footer && <h1 className="font-header text-accent text-2xl">pmdro</h1>}
    </div>
  );
}

function Utility() {
  return (
    <div className="flex items-center gap-4">
      <div className="px-4 flex flex-col items-end border-r border-accent">
        <span>10:25pm</span>
        <span className="text-xs text-subtext">Jun 22 - Mon</span>
      </div>

      <button className="border border-maintext hover:border-accent hover:text-accent hover:scale-110 px-1.5 aspect-square rounded-full transition-all duration-100 ease-in">
        <LuSettings />
      </button>
    </div>
  );
}

function Footer() {
  return (
    <div className="w-full px-4 py-6 border-t border-accent/20">
      <div className="w-full md:max-w-3/4 mx-auto flex flex-row-reverse justify-between items-center">
        <Branding footer />

        <div className="flex gap-4 sm:gap-10">
          <button>
            <SiGithub />
          </button>
          <button>
            <SiFacebook />
          </button>
          <button>
            <SiGmail />
          </button>
        </div>
      </div>
    </div>
  );
}

function Timer() {
  return (
    <section className="h-full p-8 flex flex-col justify-center items-center xl:items-start gap-8">
      <div className="flex gap-12 xl:gap-4 text-lg sm:text-xl">
        <button className="uppercase text-subtext active">Focus</button>
        <button className="uppercase text-subtext ">
          Short <span className="hidden sm:inline">Break</span>
        </button>
        <button className="uppercase text-subtext">
          Long <span className="hidden sm:inline">Break</span>
        </button>
      </div>
      <span className="text-8xl sm:text-9xl font-header">25 : 00</span>
      <div className="flex gap-12 sm:text-lg">
        <button className="uppercase font-bold scale-95">Reset</button>
        <button className="uppercase font-bold text-accent scale-110">
          Play
        </button>
        <button className="uppercase font-bold scale-95">Skip</button>
      </div>
    </section>
  );
}

function TodoListContainer() {
  return (
    <section className="h-full p-8 flex flex-col justify-center items-center xl:items-start gap-2">
      <h2 className="text-sm font-bold uppercase">1 focus Objectives</h2>
      <form className="relative w-full mb-4 border-b focus-within:border-accent transition-all duration-100 ease-in">
        <input
          className="w-full px-1 pr-8 py-1.5 outline-none focus:outline-none peer"
          type="text"
          name="todo"
          id="todo"
          placeholder="Declare a focus objective..."
        />
        <button className="absolute right-1 top-2.5 peer-focus:text-accent">
          <LuPlus />
        </button>
      </form>
      <TodoList>{/* <TodoItem complete>ASDASDSAD</TodoItem> */}</TodoList>
    </section>
  );
}

function TodoList({ children }: { children?: ReactNode }) {
  if (!children) {
    return (
      <div className="grow max-h-75 w-full text-center text-subtext">
        No Focus Objective yet
      </div>
    );
  }

  return (
    <ul className="grow max-h-75 w-full pr-2 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-subtext [&::-webkit-scrollbar-thumb]:rounded">
      {children}
    </ul>
  );
}

function TodoItem({
  complete,
  children,
}: {
  complete?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center justify-between py-3 cursor-pointer group transition-all ease-in duration-200">
      <div className="flex grow items-center gap-4">
        <div
          className={`w-1 aspect-square rounded-full ${complete ? "bg-subtext" : "bg-accent"} `}
        />
        <span
          className={`capitalize ${complete ? "text-sm text-subtext line-through" : ""}`}
        >
          {children}
        </span>
      </div>
      <button className="bg-transparent text-red-300 sm:text-subtext text-sm sm:hidden group-hover:block hover:text-red-300">
        Erase
      </button>
    </li>
  );
}
