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
  const videoMobileRef = useRef(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const targetTimeRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const videoMobile = videoMobileRef.current;
    if (!video && !videoMobile) return;

    targetTimeRef.current = 0;
    progressRef.current = 0;

    const initVideo = (v) => {
      if (!v) return;
      v.pause();
      const onReady = () => {
        v.pause();
        v.currentTime = 0;
      };
      v.addEventListener("loadedmetadata", onReady, { once: true });
      v.load();
    };
    initVideo(video);
    initVideo(videoMobile);

    // iOS Safari requires a user gesture to enable currentTime scrubbing.
    // play()→pause() on first touch primes the mobile video.
    const unlockMobile = () => {
      const v = videoMobileRef.current;
      if (!v) return;
      const p = v.play();
      if (p && p.then) p.then(() => v.pause()).catch(() => {});
      else v.pause();
    };
    window.addEventListener("touchstart", unlockMobile, { once: true, passive: true });
    window.addEventListener("click", unlockMobile, { once: true });

    let active = true;
    const seek = (v) => {
      if (!v || !v.duration) return;
      const target = Math.min(v.duration - 0.05, progressRef.current * v.duration);
      const diff = target - v.currentTime;
      if (Math.abs(diff) < 0.04) {
        v.currentTime = target;
      } else {
        v.currentTime += diff * 0.35;
      }
    };
    const tick = () => {
      if (!active) return;
      seek(videoRef.current);
      seek(videoMobileRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      window.removeEventListener("touchstart", unlockMobile);
      window.removeEventListener("click", unlockMobile);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

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

  // Restart videos when tab/window becomes visible again
  useEffect(() => {
    const onVisible = () => {
      if (document.hidden) return;
      const section = sectionRef.current;
      if (!section) return;
      section.querySelectorAll("video").forEach((v) => v.load());
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
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
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-bone flex flex-col lg:block">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(200,16,46,0.12),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,_rgba(255,255,255,0.55),_transparent_60%)] lg:bg-[radial-gradient(ellipse_at_72%_50%,_rgba(255,255,255,0.65),_transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bone" />
          <div className="absolute inset-y-0 left-0 hidden lg:block w-1/3 bg-gradient-to-r from-bone via-bone/60 to-transparent" />
        </div>

        {/* Mobile: scroll-driven video at top of flex column */}
        <div className="lg:hidden flex-shrink-0 pt-20 pb-4 flex justify-center relative z-10">
          <video
            ref={videoMobileRef}
            src="/media/camera.mp4"
            poster="/media/camera-exploded.png"
            muted
            playsInline
            preload="auto"
            className="h-[26vh] max-h-[210px] w-full max-w-[280px] object-contain mix-blend-darken"
            aria-hidden="true"
          />
        </div>

        {/* Desktop: absolute video on right */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-end pr-8 xl:pr-16">
          <video
            ref={videoRef}
            src="/media/camera.mp4"
            poster="/media/camera-exploded.png"
            muted
            playsInline
            preload="auto"
            className="h-[80vh] max-w-[820px] xl:max-w-[960px] w-full object-contain mix-blend-multiply"
            aria-hidden="true"
          />
        </div>

        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-ink/5">
          <div
            className="h-full bg-flash-600 transition-[width] duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="relative z-10 flex-1 min-h-0 container-x flex flex-col justify-start pb-12 lg:absolute lg:inset-0 lg:h-full lg:flex-initial lg:pt-32 lg:pb-24 lg:justify-center">
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
