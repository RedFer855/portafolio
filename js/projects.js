// projects.js — Genera las tarjetas de proyectos desde un arreglo
// Para agregar un proyecto NO tocas el HTML: solo agregas un objeto aquí.

// TODO(Fernando): completa los datos reales de cada proyecto.
// - imagen: ruta a una captura (ej. "media/bimbo.jpg") o "" para usar la portada de color
// - repo / demo: enlaces a GitHub y GitHub Pages ("" si todavía no hay)
const proyectos = [
    {
        titulo: "Bimbo",
        descripcion: "Página web inspirada en la marca Bimbo. (Escribe aquí de qué trata y qué aprendiste.)",
        tecnologias: ["HTML", "CSS", "JavaScript"],
        imagen: "",
        color: "#1d4fa0",
        repo: "",
        demo: "",
    },
    {
        titulo: "El Cairo",
        descripcion: "Sitio web del proyecto El Cairo. (Escribe aquí de qué trata y qué aprendiste.)",
        tecnologias: ["HTML", "CSS"],
        imagen: "",
        color: "#c9772b",
        repo: "",
        demo: "",
    },
];

document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-proyectos");

    // forEach recorre el arreglo: una tarjeta por cada objeto
    proyectos.forEach((proyecto) => {
        lista.appendChild(crearTarjeta(proyecto));
    });
});

// Recibe un objeto proyecto y devuelve un <li> listo para insertar
function crearTarjeta(proyecto) {
    const item = document.createElement("li");

    const card = document.createElement("article");
    card.className = "project-card pixel-frame";

    card.appendChild(crearPortada(proyecto));

    const body = document.createElement("div");
    body.className = "project-card__body";

    const titulo = document.createElement("h3");
    titulo.textContent = proyecto.titulo; // textContent: seguro, no interpreta HTML
    body.appendChild(titulo);

    const desc = document.createElement("p");
    desc.className = "project-card__desc";
    desc.textContent = proyecto.descripcion;
    body.appendChild(desc);

    const tags = document.createElement("ul");
    tags.className = "tags";
    tags.setAttribute("aria-label", "Tecnologías usadas");
    proyecto.tecnologias.forEach((tec) => {
        const tag = document.createElement("li");
        tag.className = "tag";
        tag.textContent = tec;
        tags.appendChild(tag);
    });
    body.appendChild(tags);

    body.appendChild(crearEnlaces(proyecto));

    card.appendChild(body);
    item.appendChild(card);
    return item;
}

// Si hay imagen la usa; si no, muestra el título sobre un color
function crearPortada(proyecto) {
    const cover = document.createElement("div");
    cover.className = "project-card__cover";
    cover.style.setProperty("--cover-color", proyecto.color);

    if (proyecto.imagen) {
        const img = document.createElement("img");
        img.src = proyecto.imagen;
        img.alt = `Captura del proyecto ${proyecto.titulo}`;
        img.loading = "lazy";
        cover.appendChild(img);
    } else {
        cover.textContent = proyecto.titulo;
    }
    return cover;
}

// Crea los botones "Código" y "Demo" solo si el enlace existe
function crearEnlaces(proyecto) {
    const links = document.createElement("div");
    links.className = "project-card__links";

    const enlaces = [
        { texto: "Código", url: proyecto.repo, clase: "btn--ghost" },
        { texto: "Demo", url: proyecto.demo, clase: "btn--primary" },
    ];

    enlaces.forEach(({ texto, url, clase }) => {
        if (!url) return; // sin enlace, no hay botón
        const a = document.createElement("a");
        a.className = `btn ${clase}`;
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = texto;
        links.appendChild(a);
    });

    if (!links.children.length) {
        const pronto = document.createElement("span");
        pronto.className = "tag";
        pronto.textContent = "Próximamente";
        links.appendChild(pronto);
    }
    return links;
}
