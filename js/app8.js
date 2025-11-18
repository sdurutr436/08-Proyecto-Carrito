//  *** Variables ***
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

// Referencias flotante y modal
const carritoFlotante = document.getElementById('carrito-flotante');
const modalCarrito = document.getElementById('modal-carrito');
const carritoCopia = document.getElementById('carrito-copia');
const cerrarModalBtn = document.getElementById('cerrar-modal');
const contadorFlotante = document.getElementById('contador-carrito-flotante');

// *** Función para mostrar notificación ***
function mostrarNotificacion(titulo, mensaje) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-title">${titulo}</div>
        <div class="toast-message">${mensaje}</div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    setTimeout(() => {
        toast.classList.add('hide');
        toast.classList.remove('show');
    }, 3000);
    setTimeout(() => {
        container.removeChild(toast);
    }, 3400);
}

//  *** Listeners ***
cargarEventListeners();
function cargarEventListeners () {
    document.addEventListener('DOMContentLoaded', () => {
        cargarCarritoLocalStorage();
        carritoHTML();
        carritoModalHTML();
        checkCarritoVisible();
    });
    listaCursos.addEventListener('click', añadirCurso);
    carrito.addEventListener('click', eliminarCurso);
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
        sincronizarStorage();
        carritoHTML();
        carritoModalHTML();
    });
    cerrarModalBtn.addEventListener('click', () => {
        modalCarrito.classList.add('oculto');
    });
    carritoCopia.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'vaciar-carrito-modal') {
            e.preventDefault();
            articulosCarrito = [];
            carritoHTML();
            carritoModalHTML();
            sincronizarStorage();
            modalCarrito.classList.add('oculto');
        }
        if (e.target && e.target.classList.contains('borrar-curso-modal')) {
            e.preventDefault();
            const cursoId = e.target.getAttribute('data-id');
            articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
            carritoHTML();
            carritoModalHTML();
            sincronizarStorage();
        }
    });
    window.addEventListener('scroll', checkCarritoVisible);
    window.addEventListener('resize', checkCarritoVisible);
    carritoFlotante.addEventListener('click', () => {
        carritoModalHTML();
        modalCarrito.classList.remove('oculto');
    });
}

// función para cargar carrito desde localStorage
function cargarCarritoLocalStorage() {
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
}

// función para guardar carrito en localStorage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Función para añadir cursos al carrito
function añadirCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement;
        leerDatosCurso(curso);
    }
}

// Elimina cursos del carrito
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
        carritoHTML();
        carritoModalHTML();
        sincronizarStorage();
    }
}

// Lee la información del curso seleccionado
function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        articulosCarrito = articulosCarrito.map((curso) => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                mostrarNotificacion('✓ Cantidad actualizada', `${infoCurso.titulo} (${curso.cantidad})`);
            }
            return curso;
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
        mostrarNotificacion('✓ Añadido al carrito', infoCurso.titulo);
    }
    carritoHTML();
    carritoModalHTML();
    sincronizarStorage();
}

// Muestra el carrito de compras en el HTML (barra)
function carritoHTML() {
    limpiarHTML();
    articulosCarrito.forEach((curso) => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="100"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });
    actualizarContadorCarrito();
}

// Muestra el carrito de compras en el modal
function carritoModalHTML() {
    carritoCopia.innerHTML = `
        <table class="u-full-width">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <a href="#" id="vaciar-carrito-modal" class="button u-full-width">Vaciar Carrito</a>
    `;
    const tbodyModal = carritoCopia.querySelector('tbody');
    articulosCarrito.forEach((curso) => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="100"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso-modal" data-id="${id}">X</a></td>
        `;
        tbodyModal.appendChild(row);
    });
}

// Actualiza el contador del carrito flotante
function actualizarContadorCarrito() {
    contadorFlotante.textContent = articulosCarrito.reduce((acum, curso) => acum + curso.cantidad, 0);
}

// Lógica para mostrar carrito flotante cuando el original no está en viewport
function checkCarritoVisible() {
    const headerOriginal = document.getElementById('header');
    const carritoFlotante = document.getElementById('carrito-flotante');
    if (!headerOriginal || !carritoFlotante) return;
    const rect = headerOriginal.getBoundingClientRect();

    // Mostrar flotante SOLO si el header completo está fuera del viewport
    if (rect.bottom <= 0) {
        carritoFlotante.classList.remove('oculto');
    } else {
        carritoFlotante.classList.add('oculto');
    }
}


// Función para limpiar el HTML del carrito de barra
function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.firstChild.remove();
    }
}
