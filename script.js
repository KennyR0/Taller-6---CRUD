let libros = JSON.parse(localStorage.getItem('listaLibros')) || [];
let estaEditando = false;

const formulario = document.getElementById('formulario-crud');
const entradaTitulo = document.getElementById('titulo');
const entradaAutor = document.getElementById('autor');
const entradaId = document.getElementById('id-elemento');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');

function renderizarLibros() {
  cuerpoTabla.innerHTML = '';

  if (libros.length === 0) {
    cuerpoTabla.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;">
          No hay libros registrados.
        </td>
      </tr>
    `;
    return;
  }

  libros.forEach(libro => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>
        <button class="btn-editar" onclick="prepararEdicion('${libro.id}')">Editar</button>
        <button class="btn-eliminar" onclick="eliminarLibro('${libro.id}')">Eliminar</button>
      </td>
    `;

    cuerpoTabla.appendChild(fila);
  });

  localStorage.setItem('listaLibros', JSON.stringify(libros));
}

formulario.addEventListener('submit', function(evento) {
  evento.preventDefault();

  const valorTitulo = entradaTitulo.value.trim();
  const valorAutor = entradaAutor.value.trim();
  const idActual = entradaId.value;

  if (estaEditando) {
    libros = libros.map(libro =>
      libro.id === idActual
        ? { ...libro, titulo: valorTitulo, autor: valorAutor }
        : libro
    );

    estaEditando = false;
    botonGuardar.textContent = 'Guardar Libro';
    botonCancelar.classList.add('oculto');
  } else {
    const nuevoLibro = {
      id: crypto.randomUUID(),
      titulo: valorTitulo,
      autor: valorAutor
    };

    libros.push(nuevoLibro);
  }

  reiniciarFormulario();
  renderizarLibros();
});

window.prepararEdicion = function(id) {
  const libroEncontrado = libros.find(libro => libro.id === id);

  if (!libroEncontrado) return;

  entradaTitulo.value = libroEncontrado.titulo;
  entradaAutor.value = libroEncontrado.autor;
  entradaId.value = libroEncontrado.id;

  estaEditando = true;
  botonGuardar.textContent = 'Actualizar Libro';
  botonCancelar.classList.remove('oculto');
};

window.eliminarLibro = function(id) {
  if (confirm('¿Está seguro de que desea eliminar este libro?')) {
    libros = libros.filter(libro => libro.id !== id);

    if (estaEditando && entradaId.value === id) {
      reiniciarFormulario();
    }

    renderizarLibros();
  }
};

botonCancelar.addEventListener('click', reiniciarFormulario);

function reiniciarFormulario() {
  formulario.reset();
  entradaId.value = '';
  estaEditando = false;
  botonGuardar.textContent = 'Guardar Libro';
  botonCancelar.classList.add('oculto');
}

renderizarLibros();