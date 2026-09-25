// companion.js — Pixi, el personaje pixel que acompaña al visitante
// 1) Dibuja el sprite a partir de una matriz de texto (arreglo de strings).
// 2) Parpadea cada cierto tiempo cambiando de "frame".
// 3) Cambia su frase según la sección que se está viendo.

// Cada letra es un color. El punto "." es transparente.
const PALETA = {
    K: "#1f1b2e", // contorno
    H: "#6b3f1d", // cabello
    S: "#f5c9a0", // piel
    E: "#1f1b2e", // ojos
    P: "#5b3cc4", // camisa (mismo morado del sitio)
    B: "#2d3561", // pantalón
};

// Cada string es una fila del dibujo; cada carácter es un pixel.
// Todas las filas deben tener el mismo largo (12).
const FRAME_NORMAL = [
    "...KKKKKK...",
    "..KHHHHHHK..",
    ".KHHHHHHHHK.",
    ".KHSSSSSSHK.",
    ".KSSESSESSK.",
    ".KSSESSESSK.",
    ".KSSSKKSSSK.",
    "..KSSSSSSK..",
    "...KPPPPK...",
    "..KPPPPPPK..",
    ".KSKPPPPKSK.",
    "..KKBBBBKK..",
    "...KB..BK...",
    "...KK..KK...",
];

// Igual que el normal pero con los ojos "cerrados" (fila 4 sin ojos)
const FRAME_PARPADEO = FRAME_NORMAL.map((fila, i) =>
    i === 4 ? ".KSSSSSSSSK." : fila
);

// Frase de Pixi para cada sección (la clave es el data-companion del HTML)
const FRASES = {
    inicio: "¡Hola! Soy Pixi, el guía de este portafolio.",
    "sobre-mi": "Aquí te cuento quién es Fernando y qué sabe hacer.",
    proyectos: "¡Mira! Estos son sus proyectos. Pasa el mouse encima.",
    contacto: "¿Te gustó? ¡Escríbele un mensaje!",
};

// Segundos que el globo queda visible antes de esconderse solo
const SEGUNDOS_VISIBLE = 5;
let temporizadorGlobo = null;

document.addEventListener("DOMContentLoaded", () => {
    const companion = document.getElementById("companion");
    const sprite = document.getElementById("companion-sprite");
    const bubble = document.getElementById("companion-bubble");

    dibujarSprite(sprite, FRAME_NORMAL);
    iniciarParpadeo(sprite);
    observarSecciones(companion, bubble);
    mostrarGlobo(companion);

    // Clic en Pixi: muestra el globo si está oculto, lo oculta si está visible
    sprite.addEventListener("click", () => {
        if (companion.classList.contains("is-quiet")) {
            mostrarGlobo(companion);
        } else {
            companion.classList.add("is-quiet");
        }
    });
});

// Convierte la matriz en <span> de colores dentro de una CSS Grid
function dibujarSprite(contenedor, matriz) {
    contenedor.style.setProperty("--cols", matriz[0].length);
    contenedor.replaceChildren(); // borra el dibujo anterior

    // Ciclo anidado: filas y luego cada pixel de la fila
    for (const fila of matriz) {
        for (const letra of fila) {
            const pixel = document.createElement("span");
            pixel.style.backgroundColor = PALETA[letra] ?? "transparent";
            contenedor.appendChild(pixel);
        }
    }
}

// Cada 3.5 s cierra los ojos por 150 ms
function iniciarParpadeo(sprite) {
    setInterval(() => {
        dibujarSprite(sprite, FRAME_PARPADEO);
        setTimeout(() => dibujarSprite(sprite, FRAME_NORMAL), 150);
    }, 3500);
}

// IntersectionObserver avisa cuando una sección entra en la zona central de la pantalla
function observarSecciones(companion, bubble) {
    const secciones = document.querySelectorAll("[data-companion]");

    const observer = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                const clave = entrada.target.dataset.companion;
                decir(companion, bubble, FRASES[clave]);
            });
        },
        // Solo cuenta la franja del medio de la pantalla (40% arriba y 50% abajo se ignoran)
        { rootMargin: "-40% 0px -50% 0px" }
    );

    secciones.forEach((seccion) => observer.observe(seccion));
}

// Cambia la frase y hace que Pixi dé un saltito
function decir(companion, bubble, frase) {
    if (!frase || bubble.textContent === frase) return;

    bubble.textContent = frase;
    mostrarGlobo(companion);
    companion.classList.add("is-talking");
    setTimeout(() => companion.classList.remove("is-talking"), 400);
}

// Muestra el globo y lo esconde solo después de unos segundos,
// así no tapa el contenido (sobre todo en celular)
function mostrarGlobo(companion) {
    companion.classList.remove("is-quiet");
    clearTimeout(temporizadorGlobo);
    temporizadorGlobo = setTimeout(() => {
        companion.classList.add("is-quiet");
    }, SEGUNDOS_VISIBLE * 1000);
}
