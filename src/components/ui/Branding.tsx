import prmdoPurple from "../../assets/prmdo-purple.png";
import prmdoEmerald from "../../assets/prmdo-emerald.png";
import prmdoAmber from "../../assets/prmdo-amber.png";
import prmdoOcean from "../../assets/prmdo-ocean.png";
import prmdoBlood from "../../assets/prmdo-blood.png";

export function Branding({
  footer,
  theme,
}: {
  footer?: boolean;
  theme?: string;
}) {
  const logoSrc = (() => {
    switch (theme) {
      case "emerald":
        return prmdoEmerald;
      case "amber":
        return prmdoAmber;
      case "ocean":
        return prmdoOcean;
      case "blood":
        return prmdoBlood;
      default:
        return prmdoPurple;
    }
  })();

  return (
    <div className="flex gap-2 items-center">
      <img
        src={logoSrc}
        alt={`pmdro ${theme ?? "default"} logo`}
        width={32}
        height={32}
      />

      {!footer && <h1 className="font-header text-accent text-2xl">pmdro</h1>}
    </div>
  );
}
