// contactForm.js — Validación del formulario de contacto
// Versión mejorada del formValidator.js de la clase:
// en vez de repetir el mismo código por cada campo, definimos REGLAS
// y una sola función las revisa todas.

// Correo que recibe los mensajes del formulario (el mismo de la sección Contacto)
const CORREO_DESTINO = "fbarahona280@gmail.com";

const isEmptyRegex = /^\s*$/;
const isValidEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Cada campo tiene una lista de reglas: si "esValido" da false, se muestra el mensaje
const REGLAS = {
    txtNombre: [
        { esValido: (v) => !isEmptyRegex.test(v), mensaje: "¡El nombre no puede estar vacío!" },
    ],
    txtEmail: [
        { esValido: (v) => !isEmptyRegex.test(v), mensaje: "¡El correo no puede estar vacío!" },
        { esValido: (v) => isValidEmailRegex.test(v), mensaje: "¡Escribe un correo válido! Ej: nombre@correo.com" },
    ],
    txtMensaje: [
        { esValido: (v) => !isEmptyRegex.test(v), mensaje: "¡Escribe un mensaje!" },
    ],
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contacto");
    const status = document.getElementById("form-status");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // evita que la página se recargue
        status.textContent = "";
        status.classList.remove("is-success");

        if (!validarFormulario(form)) {
            Sonidos.reproducir("error");
            return;
        }

        Sonidos.reproducir("moneda");
        abrirCorreo(form);
        status.textContent = "¡Listo! Se abrirá tu app de correo para enviar el mensaje.";
        status.classList.add("is-success");
        form.reset();
    });

    // Al escribir en un campo con error, se vuelve a validar ese campo
    form.addEventListener("input", (event) => {
        const campo = event.target;
        if (campo.closest(".field")?.classList.contains("error")) {
            validarCampo(campo);
        }
    });
});

// Revisa todos los campos; enfoca el primero con error
function validarFormulario(form) {
    let primerError = null;

    for (const id of Object.keys(REGLAS)) {
        const campo = form.querySelector(`#${id}`);
        const esValido = validarCampo(campo);
        if (!esValido && !primerError) {
            primerError = campo;
        }
    }

    if (primerError) {
        primerError.focus();
        return false;
    }
    return true;
}

// Aplica las reglas de un campo. Devuelve true si pasa todas.
function validarCampo(campo) {
    const valor = campo.value;
    // find devuelve la primera regla que NO se cumple (o undefined)
    const reglaFallida = REGLAS[campo.id].find((regla) => !regla.esValido(valor));

    if (reglaFallida) {
        mostrarError(campo, reglaFallida.mensaje);
        return false;
    }
    limpiarError(campo);
    return true;
}

function mostrarError(campo, mensaje) {
    const field = campo.closest(".field");
    let span = field.querySelector(".field__error");

    if (!span) {
        span = document.createElement("span");
        span.className = "field__error";
        span.id = `${campo.id}-error`;
        field.appendChild(span);
    }
    span.textContent = mensaje;
    field.classList.add("error");
    // Conecta el mensaje con el input para lectores de pantalla
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", span.id);
}

function limpiarError(campo) {
    const field = campo.closest(".field");
    field.querySelector(".field__error")?.remove();
    field.classList.remove("error");
    campo.removeAttribute("aria-invalid");
    campo.removeAttribute("aria-describedby");
}

// GitHub Pages no tiene servidor, así que usamos mailto: para enviar
function abrirCorreo(form) {
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    const asunto = encodeURIComponent(`Contacto desde el portafolio - ${nombre}`);
    const cuerpo = encodeURIComponent(`${mensaje}\n\n${nombre} (${email})`);

    window.location.href = `mailto:${CORREO_DESTINO}?subject=${asunto}&body=${cuerpo}`;
}
