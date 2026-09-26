// projects.js — Genera las tarjetas de proyectos desde un arreglo
// Para agregar un proyecto NO tocas el HTML: solo agregas un objeto aquí.

// TODO(Fernando): agrega capturas de cada proyecto.
// - imagen: ruta a una captura (ej. "media/bimbo.webp") o "" para usar la portada de color
// - repo / demo: enlaces ("" si no hay → no aparece el botón)
const proyectos = [
    {
        titulo: "Bimbo Honduras",
        rol: "Desarrollador principal",
        descripcion:
            "Portal interno de gestión de planta: pesaje de materia prima, inventario, catálogos, " +
            "reportes PDF/Excel, bitácora de auditoría y notificaciones en tiempo real. " +
            "Arquitectura limpia (MVVM + CQRS) con permisos por rol y más de 600 pruebas unitarias.",
        tecnologias: ["C#", ".NET", "WPF", "MVVM", "Supabase", "PostgreSQL"],
        imagen: "",
        color: "#1d4fa0",
        repo: "",
        demo: "",
    },
    {
        titulo: "El Cairo POS",
        rol: "Desarrollador principal",
        descripcion:
            "Sistema de punto de venta de escritorio: facturación con formato SAR Honduras exportada a PDF, " +
            "carrito y buscador de productos, inventario por bodega, productos más vendidos " +
            "y control de sesión por roles. Arquitectura en capas.",
        tecnologias: ["C#", ".NET 8", "WinForms", "Supabase", "PostgreSQL"],
        imagen: "",
        color: "#c9772b",
        repo: "https://github.com/RedFer855/ElCairo",
        demo: "",
    },
    {
        titulo: "Restaurante App",
        rol: "Desarrollador principal · proyecto final",
        descripcion:
            "App Android para gestionar un restaurante: login, menú, pedidos y mesas. " +
            "Base de datos local (Room) sincronizada con Supabase en tiempo real, " +
            "arquitectura MVVM por capas y más de 400 pruebas.",
        tecnologias: ["Java", "Android", "Room", "Supabase"],
        imagen: "",
        color: "#2a9d57",
        repo: "https://github.com/RedFer855/ProyectoFinalRestaurante",
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

    // El rol es opcional: solo se muestra si el objeto lo trae
    if (proyecto.rol) {
        const rol = document.createElement("p");
        rol.className = "project-card__rol";
        rol.textContent = proyecto.rol;
        body.appendChild(rol);
    }

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
