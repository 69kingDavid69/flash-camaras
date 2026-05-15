import Reveal from "./Reveal";
import { PILLARS } from "../data/services";

export default function Pillars() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {PILLARS.map((p, i) => {
        const Icon = p.icon;
        return (
          <Reveal key={p.title} delay={i * 0.1}>
            <div className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-bone-soft p-8 transition-all duration-500 hover:border-flash-600 hover:bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white transition-colors duration-500 group-hover:bg-flash-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-display text-xl text-ink">{p.title}</h3>
              <p className="mt-3 text-sm text-ink-mute leading-relaxed">{p.text}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
