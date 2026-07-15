import { Component } from "react";

// Algunas extensiones de Chrome (scroll suave, accesibilidad, etc.) parchean
// APIs nativas como window.scrollTo y devuelven un valor truthy. Si un
// useEffect sin llaves llega a devolver ese valor como "cleanup", React
// intenta ejecutarlo como función en el próximo efecto y crashea toda la
// app dejando la pantalla en blanco (sin este boundary, sin forma de
// recuperarse). Este componente detecta cualquier crash de render y se
// recupera solo recargando la página una vez; si vuelve a crashear dentro
// de la misma ventana de tiempo, evita un loop infinito y muestra un
// botón para reintentar a mano.
const STORAGE_KEY = "__flascamaras_last_crash_reload";
const RETRY_WINDOW_MS = 10_000;

export default class ErrorBoundary extends Component {
  state = { hasError: false, showFallback: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);

    let lastReloadAt = 0;
    try {
      lastReloadAt = Number(sessionStorage.getItem(STORAGE_KEY)) || 0;
    } catch (_) {
      // sessionStorage puede no estar disponible (modo privado, etc.)
    }

    const recentlyReloaded = Date.now() - lastReloadAt < RETRY_WINDOW_MS;

    if (recentlyReloaded) {
      // Ya nos recargamos solos hace poco y volvió a fallar: no reintentamos
      // automáticamente para no entrar en un loop, mostramos el fallback.
      this.setState({ showFallback: true });
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch (_) {}
    window.location.reload();
  }

  handleRetry = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (!this.state.showFallback) {
        // Recarga automática en curso: no mostramos nada mientras tanto.
        return null;
      }
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "#FAFAF7",
            color: "#0A0A0A",
          }}
        >
          <p style={{ fontSize: "1.125rem", fontWeight: 500, maxWidth: "24rem" }}>
            Algo salió mal cargando la página.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              border: "none",
              background: "#996E1E",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Volver a intentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
