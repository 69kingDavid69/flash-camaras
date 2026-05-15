import { useEffect, useRef, useState } from "react";
import { ArrowDown, Wrench, Sparkles, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const SCENES = [
  {
    eyebrow: "Servicio técnico premium",
    title: "Conocemos",
    accent: "cada pieza",
    after: "de tu cámara.",
    sub: "Mantenemos, diagnosticamos y reparamos lo que otros no se atreven a abrir.",
  },
  {
    eyebrow: "Mantenimiento de precisión",
    title: "La desarmamos",
    accent: "con cuidado",
    after: "quirúrgico.",
    sub: "Cuarto limpio, herramientas calibradas y técnicos certificados en Sony, Canon, Nikon y Fuji.",
  },
  {
    eyebrow: "Cada componente importa",
    title: "Reparamos lo",
    accent: "que parece",
    after: "imposible.",
    sub: "Obturadores, electrónica, lentes con focus motor, sensores con polvo o humedad. Lo arreglamos.",
  },
  {
    eyebrow: "Lista para disparar",
    title: "Tu equipo,",
    accent: "como nuevo.",
    after: "",
    sub: "Garantía real de 90 días sobre cada reparación. Entrega en tiempos honestos.",
  },
];

export default function ScrollHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const targetTimeRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    targetTimeRef.current = 0;
    progressRef.current = 0;

    const onReady = () => {
      video.pause();
      video.currentTime = 0;
    };
    video.addEventListener("loadedmetadata", onReady, { once: true });

    // Force fresh load — guarantees loadedmetadata fires even after back-navigation
    video.load();

    let active = true;
    const tick = () => {
      if (!active) return;
      const v = videoRef.current;
      if (v && v.duration) {
        targetTimeRef.current = Math.min(v.duration - 0.05, progressRef.current * v.duration);
        const diff = targetTimeRef.current - v.currentTime;
        if (Math.abs(diff) < 0.04) {
          v.currentTime = targetTimeRef.current;
        } else {
          v.currentTime += diff * 0.35;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      video.removeEventListener("loadedmetadata", onReady);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video) return;

      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);
      progressRef.current = p;

      const idx = Math.min(
        SCENES.length - 1,
        Math.floor(p * SCENES.length * 0.999)
      );
      setSceneIdx(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scene = SCENES[sceneIdx];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "380vh" }}
      aria-label="Presentación Flash Cámaras"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-bone">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(200,16,46,0.12),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,_rgba(255,255,255,0.55),_transparent_60%)] lg:bg-[radial-gradient(ellipse_at_72%_50%,_rgba(255,255,255,0.65),_transparent_55%)]" />

          <div className="absolute inset-0 flex items-start justify-center pt-20 lg:items-center lg:justify-end lg:pt-0 lg:pr-8 xl:pr-16">
            {/* Mobile: static poster image (iOS can't scrub video) */}
            <img
              src="/media/camera-exploded.png"
              alt=""
              aria-hidden="true"
              className="lg:hidden h-[42vh] w-full max-w-[340px] object-contain mix-blend-multiply"
            />
            {/* Desktop: scroll-driven video */}
            <video
              ref={videoRef}
              src="/media/camera.mp4"
              poster="/media/camera-exploded.png"
              muted
              playsInline
              preload="auto"
              className="hidden lg:block lg:h-[80vh] lg:max-w-[820px] xl:max-w-[960px] w-full object-contain mix-blend-multiply"
              aria-hidden="true"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bone pointer-events-none" />
          <div className="absolute inset-y-0 left-0 hidden lg:block w-1/3 bg-gradient-to-r from-bone via-bone/60 to-transparent pointer-events-none" />
        </div>

        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-ink/5">
          <div
            className="h-full bg-flash-600 transition-[width] duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="relative z-10 h-full container-x flex flex-col justify-end pb-24 pt-32 lg:justify-center">
          <div className="max-w-2xl">
            <div
              key={`eyebrow-${sceneIdx}`}
              className="eyebrow animate-fade-up"
            >
              {scene.eyebrow}
            </div>

            <h1
              key={`title-${sceneIdx}`}
              className="mt-6 font-display text-[44px] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[88px] font-medium text-ink animate-fade-up"
            >
              {scene.title}{" "}
              <span className="italic text-flash-700">{scene.accent}</span>{" "}
              {scene.after}
            </h1>

            <p
              key={`sub-${sceneIdx}`}
              className="mt-7 max-w-xl text-base sm:text-lg text-ink-mute leading-relaxed animate-fade-up"
            >
              {scene.sub}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/servicios" className="btn-primary">
                Ver servicios
                <Wrench className="h-4 w-4" />
              </Link>
              <Link to="/tienda" className="btn-ghost">
                Explorar tienda
                <Camera className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-mute">
            <span className="text-[10px] uppercase tracking-[0.3em]">Desliza</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-10">
          {SCENES.map((_, i) => (
            <span
              key={i}
              className={`h-8 w-1 rounded-full transition-all duration-500 ${
                i === sceneIdx ? "bg-flash-600 h-12" : "bg-ink/15"
              }`}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute top-32 right-8 hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-mute z-10">
          <Sparkles className="h-3 w-3 text-flash-600" />
          {String(sceneIdx + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
