import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";
import { TESTIMONIALS } from "../data/products";

export default function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {TESTIMONIALS.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.1}>
          <figure className="relative flex h-full flex-col rounded-3xl bg-white p-8 shadow-card border border-ink/5">
            <Quote className="h-6 w-6 text-flash-600/40" />
            <blockquote className="mt-5 text-base text-ink leading-relaxed">
              "{t.text}"
            </blockquote>
            <div className="mt-auto pt-6 flex items-center gap-3 border-t border-ink/5 mt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-flash-50 text-flash-700 font-display text-lg">
                {t.name.charAt(0)}
              </div>
              <figcaption>
                <div className="text-sm font-medium text-ink">{t.name}</div>
                <div className="text-xs text-ink-mute">{t.role}</div>
              </figcaption>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3 w-3 fill-flash-600 text-flash-600" />
                ))}
              </div>
            </div>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
