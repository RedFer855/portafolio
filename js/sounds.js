// sounds.js — Sonidos estilo videojuego de 8 bits
// No usa archivos de audio: los sonidos se SINTETIZAN con la Web Audio API,
// igual que los chips de sonido de las consolas retro (ondas cuadradas).
//
// Otros archivos lo usan así:  Sonidos.reproducir("moneda");

const Sonidos = (() => {
    // Cada sonido es una lista de notas: frecuencia (Hz), duración (s) y forma de onda.
    // "hasta" hace que la nota suba o baje de tono mientras suena (efecto de salto).
    const CATALOGO = {
        blip:   [{ freq: 660, dur: 0.05 }, { freq: 990, dur: 0.06 }],                // botones y enlaces
        menu:   [{ freq: 440, dur: 0.06, onda: "triangle" }, { freq: 660, dur: 0.08, onda: "triangle" }],
        salto:  [{ freq: 300, hasta: 900, dur: 0.15 }],                               // clic en Pixi
        moneda: [{ freq: 988, dur: 0.08 }, { freq: 1319, dur: 0.3 }],                 // formulario enviado
        error:  [{ freq: 220, dur: 0.1, onda: "sawtooth" }, { freq: 160, dur: 0.18, onda: "sawtooth" }],
    };

    const VOLUMEN = 0.06;             // bajito: es un detalle, no una alarma
    const CLAVE_GUARDADO = "sonidos-activos";

    let contexto = null;              // el AudioContext se crea con el primer clic (regla de los navegadores)
    let activos = leerPreferencia();

    function obtenerContexto() {
        if (!contexto) {
            contexto = new AudioContext();
        }
        return contexto;
    }

    // Toca una nota: oscilador (genera la onda) → ganancia (volumen) → parlantes
    function tocarNota(ctx, nota, inicio) {
        const oscilador = ctx.createOscillator();
        const ganancia = ctx.createGain();

        oscilador.type = nota.onda ?? "square";
        oscilador.frequency.setValueAtTime(nota.freq, inicio);
        if (nota.hasta) {
            oscilador.frequency.exponentialRampToValueAtTime(nota.hasta, inicio + nota.dur);
        }

        // El volumen baja al final para que no suene un "clic" feo al cortar
        ganancia.gain.setValueAtTime(VOLUMEN, inicio);
        ganancia.gain.exponentialRampToValueAtTime(0.001, inicio + nota.dur);

        oscilador.connect(ganancia);
        ganancia.connect(ctx.destination);
        oscilador.start(inicio);
        oscilador.stop(inicio + nota.dur);
    }

    function reproducir(nombre) {
        const notas = CATALOGO[nombre];
        if (!activos || !notas) return;

        const ctx = obtenerContexto();
        let tiempo = ctx.currentTime;
        // Las notas suenan una detrás de otra
        for (const nota of notas) {
            tocarNota(ctx, nota, tiempo);
            tiempo += nota.dur;
        }
    }

    // localStorage puede fallar (modo privado), por eso va dentro de try/catch
    function leerPreferencia() {
        try {
            return localStorage.getItem(CLAVE_GUARDADO) !== "no";
        } catch {
            return true;
        }
    }

    function alternar() {
        activos = !activos;
        try {
            localStorage.setItem(CLAVE_GUARDADO, activos ? "si" : "no");
        } catch {
            // sin localStorage el cambio dura solo esta visita
        }
        return activos;
    }

    function estanActivos() {
        return activos;
    }

    // Solo esto queda visible para los demás archivos
    return { reproducir, alternar, estanActivos };
})();

document.addEventListener("DOMContentLoaded", () => {
    initBotonSonido();
    initSonidosDeClic();
});

function initBotonSonido() {
    const boton = document.getElementById("sound-toggle");
    const actualizar = () => {
        const activos = Sonidos.estanActivos();
        boton.setAttribute("aria-pressed", String(activos));
        boton.setAttribute("aria-label", activos ? "Silenciar sonidos" : "Activar sonidos");
        boton.firstElementChild.textContent = activos ? "🔊" : "🔇";
    };

    actualizar();
    boton.addEventListener("click", () => {
        Sonidos.alternar();
        actualizar();
        Sonidos.reproducir("blip"); // si se acaba de activar, suena como confirmación
    });
}

// Delegación de eventos: UN listener en todo el documento decide qué sonido tocar
function initSonidosDeClic() {
    document.addEventListener("click", (event) => {
        const elemento = event.target.closest("a, button"); // el enlace o botón clicado (o null)
        if (!elemento) return;

        const nombre = elegirSonido(elemento);
        if (nombre) {
            Sonidos.reproducir(nombre);
        }
    });
}

// Decide qué sonido va con cada elemento (null = ninguno)
function elegirSonido(elemento) {
    if (elemento.id === "sound-toggle") return null;              // tiene su propio sonido
    if (elemento.type === "submit") return null;                  // el formulario decide: moneda o error
    if (elemento.id === "companion-sprite") return "salto";
    if (elemento.classList.contains("hmb-button")) return "menu";
    return "blip";
}
