// main.js — Comportamiento general de la página
// Mismo patrón de la clase de PW1: esperar a que el DOM esté listo
// (con "defer" ya está listo, pero así queda explícito).

document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    setCurrentYear();
});

// Abre y cierra el menú en celular
function initMenu() {
    const hmbButton = document.querySelector(".hmb-button");
    const nav = document.querySelector(".site-nav");

    hmbButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        // aria-expanded le dice a lectores de pantalla si el menú está abierto
        hmbButton.setAttribute("aria-expanded", String(isOpen));
        hmbButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    // Al elegir una opción del menú, lo cerramos
    nav.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
            nav.classList.remove("is-open");
            hmbButton.setAttribute("aria-expanded", "false");
            hmbButton.setAttribute("aria-label", "Abrir menú");
        }
    });
}

// Pone el año actual en el footer para no editarlo cada enero
function setCurrentYear() {
    const yearSpan = document.getElementById("anio-actual");
    yearSpan.textContent = new Date().getFullYear();
}
