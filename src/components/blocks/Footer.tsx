import { SiFacebook, SiGithub, SiGmail } from "react-icons/si";
import { Branding } from "../ui/Branding";

export function Footer() {
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
