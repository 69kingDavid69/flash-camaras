import Reveal from "./Reveal";

export default function SectionTitle({ eyebrow, title, accent, sub, align = "left" }) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start";
  return (
    <Reveal className={`flex flex-col ${alignClass} max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] text-ink">
        {title}{" "}
        {accent && <span className="italic text-flash-700">{accent}</span>}
      </h2>
      {sub && (
        <p className="mt-5 text-base sm:text-lg text-ink-mute leading-relaxed max-w-2xl">
          {sub}
        </p>
      )}
    </Reveal>
  );
}
