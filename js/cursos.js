// Configuración global para PDF.js (requiere la librería en <head>)
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Datos de cursos (sin cambios)
const cursos = {
  arquitectura: {
    titulo: "Arquitectura de Software",
    descripcion: "Repositorio del curso de Arquitectura de Software",
    info: "El curso de Arquitectura de Software tiene como objetivo brindar a los estudiantes los conocimientos y habilidades necesarios para diseñar, documentar y evaluar arquitecturas de sistemas de software.",
    contenido: [
      "Mapas conceptuales sobre los fundamentos de la arquitectura",
      "Informe técnico con aplicación de estándares en un proyecto.",
      "Documento de diseñoarquitectónico con diagramas UML o C4.",
    ],
    semanaActual: { titulo: "Semana 1", tema: "Mapas conceptuales sobre los fundamentos de la arquitectura." }
    
  },
  sistemas: {
    titulo: "Sistemas Operativos",
    descripcion: "Repositorio del curso de Sistemas Operativos",
    info: "Este curso enseña los conceptos básicos de procesos, memoria, E/S y sistemas de archivos.",
    contenido: [
      "Introducción a sistemas operativos",
      "Gestión de procesos",
      "Planificación de CPU",
      "Gestión de memoria",
      "Sistemas de archivos",
      "Seguridad"
    ],
    semanaActual: { titulo: "Semana 1", tema: "Historia y evolución de los sistemas operativos" }
  },
  redes: {
    titulo: "Redes de Computadoras",
    descripcion: "Repositorio del curso de Redes",
    info: "En este curso se estudian los fundamentos de redes, protocolos y servicios de comunicación.",
    contenido: [
      "Modelo OSI",
      "Modelo TCP/IP",
      "Redes LAN y WAN",
      "Protocolos de enrutamiento",
      "Servicios de red",
      "Seguridad en redes"
    ],
    semanaActual: { titulo: "Semana 1", tema: "Fundamentos de redes y modelo OSI" }
  },
  base_datos: {
    titulo: "Base de Datos",
    descripcion: "Repositorio del curso de Base de Datos",
    info: "Este curso enseña a diseñar, implementar y administrar bases de datos relacionales.",
    contenido: [
      "Modelo entidad-relación",
      "Normalización",
      "Lenguaje SQL",
      "Procedimientos almacenados",
      "Índices y optimización",
      "Administración de bases de datos"
    ],
    semanaActual: { titulo: "Semana 1", tema: "Introducción a las bases de datos" }
  }
};

// Archivos subidos (placeholder, se usará después del login) - Agregué ejemplos para testing
const archivosSubidos = {
  arquitectura: { 
    1: [
      { nombre: "Semana 1.pdf", url: "https://lsgjlhpriezzjonrnwiq.supabase.co/storage/v1/object/public/archivos_curso/Semana%201%20(1).pdf" }
    ], 
    2: [
      { nombre: "Semana 2.pdf", url: "https://lsgjlhpriezzjonrnwiq.supabase.co/storage/v1/object/public/archivos_curso/Semana%202%20(1).pdf" }
    ], 
    3: [] 
  },
  sistemas: { 1: [], 2: [], 3: [] },
  redes: { 1: [], 2: [], 3: [] },
  base_datos: { 1: [], 2: [], 3: [] }
};

// Referencias a elementos (sin cambios)
const cursoSelect = document.getElementById("cursoSelect");
const titulo = document.getElementById("cursoTitulo");
const descripcion = document.getElementById("cursoDescripcion");
const info = document.getElementById("cursoInfo");
const contenidoOl = document.getElementById("cursoContenido");
const footerCurso = document.getElementById("cursoFooter");
const cardsSemanaContainer = document.getElementById("cardsSemanaContainer");

// Crear modal para mostrar archivos (MODIFICADA: Más ancho, responsiva, con estilos para previews y accesibilidad)
function crearModalArchivos() {
  if (document.getElementById('modalArchivos')) return;

  const modal = document.createElement('div');
  modal.id = 'modalArchivos';
  modal.style = `
    display:none; position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.8); justify-content:center; align-items:center; z-index:1000;
  `;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'Modal de archivos subidos');

  modal.innerHTML = `
    <div style="background:#222; padding:2rem; border-radius:8px; max-width:800px; width:90%; max-height:90vh; position:relative; color: white; overflow: hidden;">
      <span id="cerrarModalArchivos" style="position:absolute; top:10px; right:15px; cursor:pointer; font-size:1.5rem; color: white; z-index: 10;">&times;</span>
      <h2 style="color: white; margin-top: 0; text-align: center;">Archivos Subidos</h2>
      <div id="modalContenidoArchivos" style="max-height:500px; overflow-y:auto; color: white; padding: 1rem;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const cerrarBtn = document.getElementById('cerrarModalArchivos');
  cerrarBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

// Mostrar archivos en modal (MODIFICADA: Con vista previa como en semanas.html, loader y manejo de errores)
function mostrarArchivos(curso, semana) {
  crearModalArchivos();
  const modal = document.getElementById('modalArchivos');
  const modalContenido = document.getElementById('modalContenidoArchivos');

  const archivos = archivosSubidos[curso]?.[semana] || [];

  modalContenido.innerHTML = '<div style="text-align: center; color: #ccc;">Cargando archivos...</div>'; // Loader simple

  setTimeout(() => { // Simular carga asíncrona (remueve si usas fetch real de Supabase)
    modalContenido.innerHTML = "";

    if (archivos.length === 0) {
      modalContenido.innerHTML = "<p style='color: white; text-align: center;'>No hay archivos disponibles para esta semana.</p>";
    } else {
      archivos.forEach(archivo => {
        const contenedorArchivo = document.createElement('div');
        contenedorArchivo.style = "border: 1px solid #444; margin-bottom: 1rem; padding: 1rem; border-radius: 5px; background: #333; position: relative;";

        const nombreArchivo = document.createElement('h4');
        nombreArchivo.textContent = archivo.nombre;
        nombreArchivo.style.margin = "0 0 0.5rem 0";
        nombreArchivo.style.color = "white";

        const extension = archivo.nombre.split('.').pop().toLowerCase();
        const url = archivo.url || '#';

        let previewElement = document.createElement('div');
        previewElement.style = "min-height: 100px; display: flex; align-items: center; justify-content: center; background: #444; border-radius: 5px; margin-bottom: 0.5rem; color: #ccc;";
        previewElement.textContent = "Cargando vista previa...";
        previewElement.id = `preview-${Date.now()}-${Math.random()}`; // ID único para manejo

        // VISTA PREVIA SEGÚN TIPO DE ARCHIVO
        try {
          if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'webp') {
            // Preview para imágenes
            previewElement = document.createElement('img');
            previewElement.src = url;
            previewElement.alt = `Vista previa de ${archivo.nombre}`;
            previewElement.style.maxWidth = "100%";
            previewElement.style.maxHeight = "200px";
            previewElement.style.borderRadius = "5px";
            previewElement.onerror = () => { 
              previewElement.style.display = 'none';
              const fallback = document.createElement('p');
              fallback.textContent = "Error al cargar imagen. Usa el enlace de descarga.";
              fallback.style.color = "#ccc";
              contenedorArchivo.appendChild(fallback);
            };

          } else if (extension === 'pdf') {
            // Preview para PDFs con PDF.js
            previewElement = document.createElement('div');
            previewElement.style.height = "200px";
            previewElement.style.overflow = "auto";
            previewElement.style.border = "1px solid #ccc";
            previewElement.style.borderRadius = "5px";
            previewElement.style.background = "white";

            if (typeof pdfjsLib !== 'undefined') {
              pdfjsLib.getDocument(url).promise.then(pdf => {
                pdf.getPage(1).then(page => {
                  const scale = 1.5;
                  const viewport = page.getViewport({ scale });
                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  previewElement.innerHTML = ''; // Limpiar loader
                  previewElement.appendChild(canvas);

                  const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                  };
                  page.render(renderContext);
                });
              }).catch(error => {
                console.error('Error cargando PDF:', error);
                previewElement.innerHTML = '<p style="color: #ccc; padding: 1rem;">Error al cargar PDF. Usa el enlace de descarga.</p>';
              });
            } else {
              // Fallback sin PDF.js: Iframe
              previewElement.innerHTML = '<iframe src="' + url + '" width="100%" height="200px" style="border:none;"></iframe>';
            }

          } else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
            // Preview para videos
            previewElement = document.createElement('video');
            previewElement.src = url;
            previewElement.controls = true;
            previewElement.style.maxWidth = "100%";
            previewElement.style.maxHeight = "200px";
            previewElement.onerror = () => { 
              previewElement.style.display = 'none';
              const fallback = document.createElement('p');
              fallback.textContent = "Error al cargar video. Usa el enlace de descarga.";
              fallback.style.color = "#ccc";
              contenedorArchivo.appendChild(fallback);
            };

          } else {
            // Fallback para otros archivos
            previewElement.innerHTML = '<p style="color: #ccc; padding: 1rem;">Vista previa no disponible para este tipo de archivo (' + extension + ').</p>';
          }

          // Enlace de descarga (siempre disponible)
          const enlaceDescarga = document.createElement('a');
          enlaceDescarga.href = url;
          enlaceDescarga.textContent = "Descargar archivo";
          enlaceDescarga.target = "_blank";
          enlaceDescarga.style.color = "#007bff";
          enlaceDescarga.style.display = "block";
          enlaceDescarga.style.marginTop = "0.5rem";
          enlaceDescarga.style.textDecoration = "underline";

          // Armar contenedor
          contenedorArchivo.appendChild(nombreArchivo);
          contenedorArchivo.appendChild(previewElement);
          contenedorArchivo.appendChild(enlaceDescarga);

        } catch (error) {
          console.error('Error en preview:', error);
          previewElement.textContent = "Error al generar vista previa.";
        }

        modalContenido.appendChild(contenedorArchivo);
      });
    }

    modal.style.display = 'flex';
  }, 500); // Delay para simular carga; ajusta o remueve para integración real
}

// NUEVA FUNCIÓN: Mostrar modal de "Login Requerido" (sin cambios)
function mostrarModalLoginRequerido() {
  const modal = document.getElementById('modalLoginRequerido');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Agregar listeners a botones (MODIFICADO: Interceptar "Subir archivo") (sin cambios)
function agregarListenersBotones() {
  // Subir archivo - AHORA REQUIERE LOGIN
  document.querySelectorAll('.btn-semana.subir-archivo').forEach(button => {
    button.onclick = (e) => {
      e.preventDefault(); // Prevenir acción por defecto
      
      // Simular verificación de login (por ahora siempre muestra el modal)
      // En el futuro: if (!usuarioLogueado) { mostrarModalLoginRequerido(); }
      mostrarModalLoginRequerido();
      
      // Opcional: Si ya estuviera logueado, aquí iría el código de subida
      // const fileInputId = button.dataset.fileinput;
      // ... (código de input file)
    };
  });

  // Ver más (sin cambios)
  document.querySelectorAll('.btn-semana.ver-mas').forEach(button => {
    button.onclick = () => {
      const curso = button.dataset.curso;
      const semana = button.dataset.semana;
      mostrarArchivos(curso, semana);
    };
  });
}

// Actualizar curso y cards (COMPLETADA: Incluye el loop para cards y todo lo restante)
function actualizarCurso(curso) {
  const data = cursos[curso];
  if (!data) return;

  titulo.textContent = data.titulo;
  descripcion.textContent = data.descripcion;
  info.textContent = data.info;

  contenidoOl.innerHTML = "";
  data.contenido.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    contenidoOl.appendChild(li);
  });

  const temasSemana = [
    data.semanaActual.tema,
    curso === "arquitectura" ? "Informe técnico con aplicación de estándares en un proyecto." : curso === "sistemas" ? "Gestión de procesos" : curso === "redes" ? "Protocolos de enrutamiento" : "Normalización",
    curso === "arquitectura" ? "Documento de diseño arquitectónico con diagramas UML o C4." : curso === "sistemas" ? "Planificación de CPU" : curso === "redes" ? "Seguridad en redes" : "Lenguaje SQL"
  ];

  cardsSemanaContainer.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    const card = document.createElement('div');
    card.className = 'card-semana';
    card.style = "flex: 1 1 30%; background: #222; padding: 1rem; border-radius: 8px; color: white;";

    card.innerHTML = `
      <h3>Semana ${i}</h3>
      <p>Tema: ${temasSemana[i - 1] || "Tema no definido"}</p>
      <input type="file" id="fileSemana${i}" style="display:none;">
      <button class="btn-semana subir-archivo" data-semana="${i}" data-curso="${curso}" data-fileinput="fileSemana${i}">Subir archivo</button>
      <button class="btn-semana ver-mas" data-semana="${i}" data-curso="${curso}">Ver más</button>
    `;

    cardsSemanaContainer.appendChild(card);
  }

  footerCurso.textContent = `Curso: ${data.titulo}`;

  agregarListenersBotones();
}

// Inicializar (sin cambios)
document.addEventListener('DOMContentLoaded', () => {
  actualizarCurso(cursoSelect.value);

  cursoSelect.addEventListener("change", e => {
    actualizarCurso(e.target.value);
  });
});

// NUEVO: Listeners para el modal de Login Requerido (agregar al final del script inline en index.html o aquí)
document.addEventListener('DOMContentLoaded', () => {
  // Cerrar modal de Login Requerido
   const closeLoginRequerido = document.getElementById('closeLoginRequerido');
  if (closeLoginRequerido) {
    closeLoginRequerido.addEventListener('click', () => {
      document.getElementById('modalLoginRequerido').style.display = 'none';
    });
  }
  // Clic fuera del modal
  const modalLoginRequerido = document.getElementById('modalLoginRequerido');
  if (modalLoginRequerido) {
    modalLoginRequerido.addEventListener('click', e => {
      if (e.target === modalLoginRequerido) {
        modalLoginRequerido.style.display = 'none';
      }
    });
  }
  // Botón "Iniciar Sesión" en el modal - Abre el modal de login
  const btnIrALogin = document.getElementById('btnIrALogin');
  if (btnIrALogin) {
    btnIrALogin.addEventListener('click', () => {
      document.getElementById('modalLoginRequerido').style.display = 'none'; // Cierra este modal
      document.getElementById('modalLogin').style.display = 'flex'; // Abre el de login
    });
  }
}); // Cierre del document.addEventListener('DOMContentLoaded', () => { ... });
