// Simulación de carga de datos desde el archivo data.json (Backend)
const APP_DATA = {
  currentIssue: {
    id: 1,
    number: 15,
    month: "Marzo",
    year: 2026,
    title: "Cultura en Mar del Plata: Tradición y Vanguardia",
    description:
      "En esta edición exploramos la rica escena cultural de Mar del Plata, desde sus tradiciones más arraigadas hasta las expresiones artísticas más vanguardistas. Descubre entrevistas exclusivas, reseñas de eventos y análisis profundos sobre el patrimonio cultural de la ciudad.",
    cover:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAPwCdABmQn//Z",
    pdf: "#",
  },
  issues: [
    {
      id: 2,
      number: 14,
      month: "Febrero",
      year: 2026,
      title: "Arte Urbano y Expresión Callejera",
      cover:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1458&q=80",
    },
    {
      id: 3,
      number: 13,
      month: "Enero",
      year: 2026,
      title: "Música y Festivales de Verano",
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 4,
      number: 12,
      month: "Diciembre",
      year: 2025,
      title: "Fin de Año Cultural",
      cover:
        "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80",
    },
    {
      id: 5,
      number: 11,
      month: "Noviembre",
      year: 2025,
      title: "Patrimonio Histórico de la Ciudad",
      cover:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1458&q=80",
    },
    {
      id: 6,
      number: 10,
      month: "Octubre",
      year: 2025,
      title: "Literatura y Escritores Locales",
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
  ],
  categories: [
    {
      id: 1,
      name: "Artes Visuales",
      description:
        "Pintura, escultura, fotografía y otras expresiones visuales",
      icon: "fas fa-palette",
    },
    {
      id: 2,
      name: "Música",
      description: "Conciertos, festivales y artistas locales",
      icon: "fas fa-music",
    },
    {
      id: 3,
      name: "Teatro",
      description: "Obras, actores y directores de la escena teatral",
      icon: "fas fa-theater-masks",
    },
    {
      id: 4,
      name: "Literatura",
      description: "Escritores, libros y eventos literarios",
      icon: "fas fa-book",
    },
    {
      id: 5,
      name: "Cine",
      description: "Estrenos, festivales y realizadores locales",
      icon: "fas fa-film",
    },
    {
      id: 6,
      name: "Patrimonio",
      description: "Historia, arquitectura y tradiciones culturales",
      icon: "fas fa-landmark",
    },
  ],
  notes: [
    {
      id: 1,
      title: "El renacimiento del arte callejero en Mar del Plata",
      category: 1,
      author: "Ana López",
      date: "2026-03-15",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1458&q=80",
      content:
        "Exploramos cómo los artistas urbanos están transformando los espacios públicos de la ciudad con murales y grafitis que reflejan la identidad cultural marplatense.",
    },
    {
      id: 2,
      title: "Festival de Jazz: Una tradición que crece",
      category: 2,
      author: "Carlos Méndez",
      date: "2026-03-10",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content:
        "El Festival Internacional de Jazz de Mar del Plata celebra su décima edición con artistas de renombre mundial y propuestas locales innovadoras.",
    },
    {
      id: 3,
      title: "Nueva obra del Teatro Municipal",
      category: 3,
      author: "Laura Fernández",
      date: "2026-03-05",
      image:
        "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80",
      content:
        "El Teatro Municipal estrena 'Memorias de la Costa', una obra que explora la historia de la ciudad a través de las vidas de sus habitantes.",
    },
    {
      id: 4,
      title: "Escritores marplatenses en la Feria del Libro",
      category: 4,
      author: "Roberto Sosa",
      date: "2026-02-28",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
      content:
        "Autores locales presentan sus últimas obras en la Feria Internacional del Libro, destacando la diversidad literaria de la región.",
    },
    {
      id: 5,
      title: "Cine independiente en el Festival de Mar del Plata",
      category: 5,
      author: "María González",
      date: "2026-02-20",
      image:
        "https://images.unsplash.com/photo-1489599809505-f2d4cac355af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content:
        "El festival cinematográfico más importante del país presenta una selección de películas independientes que exploran nuevas narrativas.",
    },
    {
      id: 6,
      title: "Restauración del Hotel Bristol: Un ícono arquitectónico",
      category: 6,
      author: "Diego Ramírez",
      date: "2026-02-15",
      image:
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1465&q=80",
      content:
        "El proceso de restauración del histórico Hotel Bristol busca preservar su valor patrimonial mientras se adapta a las necesidades contemporáneas.",
    },
  ],
};

// Estado de la aplicación
let appState = {
  currentView: "public",
  currentCategory: null,
  isLoggedIn: false,
};

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  // Carga inicial de datos de la vista pública
  loadCurrentIssue();
  loadIssues();
  loadCategories();
  loadNotes();

  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  // Navegación entre vistas
  document
    .getElementById("admin-toggle")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showLogin();
    });

  document
    .getElementById("public-toggle")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showPublicView();
    });

  document.getElementById("logout-btn").addEventListener("click", function (e) {
    e.preventDefault();
    logout();
  });

  // Login
  document.getElementById("login-btn").addEventListener("click", login);

  // Tabs del admin
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Carrusel
  document
    .getElementById("carousel-prev")
    .addEventListener("click", carouselPrev);
  document
    .getElementById("carousel-next")
    .addEventListener("click", carouselNext);

  // Botones de administración - Funcionalidad implementada
  document.getElementById("add-issue-btn").addEventListener("click", addIssue);
  document
    .getElementById("add-category-btn")
    .addEventListener("click", addCategory);
  document.getElementById("add-note-btn").addEventListener("click", addNote);

  // Previsualización de archivos
  document
    .getElementById("issue-cover")
    .addEventListener("change", function (e) {
      previewImage(e.target, "issue-cover-preview");
    });

  document
    .getElementById("note-image")
    .addEventListener("change", function (e) {
      previewImage(e.target, "note-image-preview");
    });

  // Navegación por categorías
  document
    .getElementById("back-to-categories")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showCategoriesView();
    });
}

// =================================================================
// VISTA PÚBLICA (Funciones de Carga)
// =================================================================

function loadCurrentIssue() {
  const issue = APP_DATA.currentIssue;
  document.getElementById("current-cover").src = issue.cover;
  document.getElementById("current-title").textContent = issue.title;
  document.getElementById(
    "current-meta"
  ).textContent = `N° ${issue.number} - ${issue.month} ${issue.year}`;
  document.getElementById("current-description").textContent =
    issue.description;
  document.getElementById("current-pdf").href = issue.pdf;
}

function loadIssues() {
  const carousel = document.getElementById("issues-carousel");
  carousel.innerHTML = "";

  APP_DATA.issues.forEach((issue) => {
    const issueElement = document.createElement("div");
    issueElement.className = "carousel-item";
    issueElement.innerHTML = `
                <div class="carousel-cover">
                    <img src="${issue.cover}" alt="${issue.title}">
                </div>
                <div class="carousel-info">
                    <h4>N° ${issue.number}</h4>
                    <p>${issue.month} ${issue.year}</p>
                    <p>${issue.title}</p>
                </div>
            `;
    carousel.appendChild(issueElement);
  });
}

function loadCategories() {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  APP_DATA.categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "category-card";
    categoryElement.setAttribute("data-category-id", category.id);
    categoryElement.innerHTML = `
                <h3><i class="${category.icon}"></i> ${category.name}</h3>
                <p>${category.description}</p>
            `;

    categoryElement.addEventListener("click", function () {
      showCategoryNotes(category.id);
    });

    container.appendChild(categoryElement);
  });
}

function loadNotes() {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  // Ordenar notas por fecha, de la más reciente a la más antigua
  const sortedNotes = [...APP_DATA.notes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedNotes.forEach((note) => {
    const category = APP_DATA.categories.find((c) => c.id === note.category);
    const noteElement = createNoteElement(note, category);
    container.appendChild(noteElement);
  });
}

function createNoteElement(note, category) {
  const noteElement = document.createElement("div");
  noteElement.className = "note-card";
  const categoryName = category ? category.name : "Sin Categoría";

  noteElement.innerHTML = `
            <div class="note-image">
                <img src="${
                  note.image ||
                  "https://via.placeholder.com/400x200?text=Imagen+por+Defecto"
                }" alt="${note.title}">
            </div>
            <div class="note-content">
                <span class="note-category">${categoryName}</span>
                <h3>${note.title}</h3>
                <p>${note.content.substring(0, 100)}...</p>
                <div class="note-meta">
                    <span>Por ${note.author}</span>
                    <span>${formatDate(note.date)}</span>
                </div>
            </div>
        `;
  return noteElement;
}

// =================================================================
// PANEL DE ADMINISTRACIÓN (Funciones de Carga y Acciones)
// =================================================================

function loadAdminData() {
  // Llama a las funciones de carga solo una vez para llenar todos los listados
  loadAdminIssues();
  loadAdminCategories();
  loadAdminNotes();
  populateCategorySelect();
}

function loadAdminIssues() {
  const container = document.getElementById("issues-list");
  container.innerHTML = "";

  // Revista actual
  const currentIssue = APP_DATA.currentIssue;
  const issueElement = createIssueAdminElement(currentIssue);
  container.appendChild(issueElement);

  // Revistas anteriores
  APP_DATA.issues.forEach((issue) => {
    const issueElement = createIssueAdminElement(issue);
    container.appendChild(issueElement);
  });
}

function createIssueAdminElement(issue) {
  const issueElement = document.createElement("div");
  issueElement.className = "item-card";
  issueElement.innerHTML = `
            <div class="item-image">
                <img src="${issue.cover}" alt="${issue.title}">
            </div>
            <div class="item-content">
                <h4>N° ${issue.number} - ${issue.month} ${issue.year}</h4>
                <p>${issue.title}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-small">Editar</button>
                <button class="btn btn-small btn-danger">Eliminar</button>
            </div>
        `;
  return issueElement;
}

function loadAdminCategories() {
  const container = document.getElementById("categories-list");
  container.innerHTML = "";

  APP_DATA.categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "item-card";
    categoryElement.innerHTML = `
                <div class="item-content">
                    <h4><i class="${category.icon}"></i> ${category.name}</h4>
                    <p>${category.description}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small edit-category" data-id="${category.id}">Editar</button>
                    <button class="btn btn-small btn-danger delete-category" data-id="${category.id}">Eliminar</button>
                </div>
            `;
    container.appendChild(categoryElement);
  });

  // Añadir Event Listeners a los botones dinámicos de CATEGORÍAS
  document.querySelectorAll(".delete-category").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      deleteCategory(id);
    });
  });

  document.querySelectorAll(".edit-category").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      editCategory(id);
    });
  });
}

function loadAdminNotes() {
  const container = document.getElementById("notes-list");
  container.innerHTML = "";

  APP_DATA.notes.forEach((note) => {
    const category = APP_DATA.categories.find((c) => c.id === note.category);
    const categoryName = category ? category.name : "N/A";

    const noteElement = document.createElement("div");
    noteElement.className = "item-card";
    noteElement.innerHTML = `
                <div class="item-image">
                    <img src="${
                      note.image ||
                      "https://via.placeholder.com/80x100?text=IMG"
                    }" alt="${note.title}">
                </div>
                <div class="item-content">
                    <h4>${note.title}</h4>
                    <p><strong>Categoría:</strong> ${categoryName} | <strong>Autor:</strong> ${
      note.author
    } | <strong>Fecha:</strong> ${formatDate(note.date)}</p>
                    <p>${note.content.substring(0, 150)}...</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small edit-note" data-id="${
                      note.id
                    }">Editar</button>
                    <button class="btn btn-small btn-danger delete-note" data-id="${
                      note.id
                    }">Eliminar</button>
                </div>
            `;
    container.appendChild(noteElement);
  });

  // Añadir Event Listeners a los botones dinámicos de NOTAS
  document.querySelectorAll(".delete-note").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      deleteNote(id);
    });
  });

  document.querySelectorAll(".edit-note").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      editNote(id);
    });
  });
}

function populateCategorySelect() {
  const select = document.getElementById("note-category");
  select.innerHTML = "";

  // Añadir opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccione una categoría";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  APP_DATA.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// =================================================================
// FUNCIONES CRUD (Simuladas)
// =================================================================

// --- Revistas ---
function addIssue() {
  // Simulación de agregar revista...
  alert("Simulación: Revista agregada.");
  document.getElementById("issue-number").value = "";
  document.getElementById("issue-title").value = "";
  document.getElementById("issue-description").value = "";
  document.getElementById("issue-cover").value = "";
  document.getElementById("issue-pdf").value = "";
  document.getElementById("issue-cover-preview").innerHTML = "";
  loadAdminIssues();
  loadIssues();
}

// --- Categorías ---

function addCategory() {
  const name = document.getElementById("category-name").value;
  const description = document.getElementById("category-description").value;
  const icon = document.getElementById("category-icon").value;

  if (!name || !description || !icon) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const newCategory = {
    id: APP_DATA.categories.length + 1, // Nuevo ID simulado
    name: name,
    description: description,
    icon: icon,
  };

  APP_DATA.categories.push(newCategory);

  alert(`Categoría '${name}' creada y agregada correctamente.`);

  loadAdminCategories();
  loadCategories();
  populateCategorySelect();

  document.getElementById("category-name").value = "";
  document.getElementById("category-description").value = "";
  document.getElementById("category-icon").value = "";
}

function deleteCategory(id) {
  if (confirm(`¿Está seguro de eliminar la categoría con ID: ${id}?`)) {
    const initialLength = APP_DATA.categories.length;
    APP_DATA.categories = APP_DATA.categories.filter((c) => c.id !== id);

    if (APP_DATA.categories.length < initialLength) {
      alert(`Categoría ${id} eliminada correctamente (simulación).`);
      loadAdminCategories();
      loadCategories();
      populateCategorySelect();
      loadAdminNotes();
      loadNotes();
    } else {
      alert("Error al intentar eliminar (simulación: ID no encontrado).");
    }
  }
}

function editCategory(id) {
  alert(`Simulación: Iniciando edición para la categoría ID: ${id}.`);
}

// --- Notas ---

function addNote() {
  const title = document.getElementById("note-title").value;
  const categoryId = parseInt(document.getElementById("note-category").value);
  const author = document.getElementById("note-author").value;
  const date = document.getElementById("note-date").value;
  const content = document.getElementById("note-content").value;
  const imageFile = document.getElementById("note-image").files[0];

  if (!title || !categoryId || !author || !date || !content) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
  }

  const imageUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : "https://via.placeholder.com/400x200?text=Nueva+Nota";

  const newNote = {
    id: APP_DATA.notes.length + 1, // Nuevo ID simulado
    title: title,
    category: categoryId,
    author: author,
    date: date,
    image: imageUrl,
    content: content,
  };

  APP_DATA.notes.push(newNote);

  alert(`Nota '${title}' creada y agregada correctamente.`);

  loadAdminNotes();
  loadNotes();

  document.getElementById("note-title").value = "";
  document.getElementById("note-author").value = "";
  document.getElementById("note-date").value = "";
  document.getElementById("note-content").value = "";
  document.getElementById("note-image").value = "";
  document.getElementById("note-image-preview").innerHTML = "";
}

function deleteNote(id) {
  if (confirm(`¿Está seguro de eliminar la nota con ID: ${id}?`)) {
    const initialLength = APP_DATA.notes.length;
    APP_DATA.notes = APP_DATA.notes.filter((n) => n.id !== id);

    if (APP_DATA.notes.length < initialLength) {
      alert(`Nota ${id} eliminada correctamente (simulación).`);
      loadAdminNotes();
      loadNotes();
    } else {
      alert("Error al intentar eliminar (simulación: ID no encontrado).");
    }
  }
}

function editNote(id) {
  alert(`Simulación: Iniciando edición para la nota ID: ${id}.`);
}

// =================================================================
// FUNCIONES DE NAVEGACIÓN Y UTILITARIAS
// =================================================================

/**
 * Función CLAVE: Maneja el cambio de pestañas y asegura la recarga de contenido.
 */
function switchTab(tabId) {
  // 1. Desactivar todas las pestañas y su contenido
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // 2. Activar la pestaña seleccionada
  document
    .querySelector(`.tab-btn[data-tab="${tabId}"]`)
    .classList.add("active");
  document.getElementById(tabId).classList.add("active");

  // 3. Recargar contenido específico
  if (tabId === "categorias") {
    loadAdminCategories();
    populateCategorySelect();
  } else if (tabId === "notas") {
    loadAdminNotes();
    populateCategorySelect();
  } else if (tabId === "revistas") {
    loadAdminIssues();
  }
}

function showLogin() {
  document.getElementById("login-container").style.display = "flex";
}

function showPublicView() {
  document.getElementById("public-view").style.display = "block";
  document.getElementById("admin-panel").style.display = "none";
  appState.currentView = "public";
}

/**
 * Función CLAVE: Se encarga de la carga inicial de datos y la activación
 * de la pestaña de Revistas al entrar al panel, garantizando que el contenido exista.
 */
function showAdminPanel() {
  document.getElementById("public-view").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  appState.currentView = "admin";

  // 1. Carga inicial de todos los datos (IMPORTANTE: Llena las listas de Revistas, Categorías y Notas)
  loadAdminData();

  // 2. Forzar la activación y visualización de la pestaña por defecto: 'revistas'
  const defaultTabId = "revistas";

  // Asegurarse de que solo la pestaña inicial esté activa
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Activar la pestaña por defecto
  document
    .querySelector(`.tab-btn[data-tab="${defaultTabId}"]`)
    .classList.add("active");
  document.getElementById(defaultTabId).classList.add("active");
}

function showCategoriesView() {
  document.getElementById("category-notes").style.display = "none";
  document.getElementById("notas").style.display = "block";
  appState.currentCategory = null;
}

function showCategoryNotes(categoryId) {
  const category = APP_DATA.categories.find((c) => c.id === categoryId);
  if (!category) return;

  appState.currentCategory = categoryId;

  document.getElementById("notas").style.display = "none";
  document.getElementById("category-notes").style.display = "block";

  document.getElementById(
    "category-title"
  ).textContent = `Notas de ${category.name}`;

  const container = document.getElementById("category-notes-container");
  container.innerHTML = "";

  const categoryNotes = APP_DATA.notes.filter(
    (note) => note.category === categoryId
  );

  if (categoryNotes.length === 0) {
    container.innerHTML =
      "<p>No hay notas disponibles para esta categoría.</p>";
  } else {
    categoryNotes.forEach((note) => {
      const noteElement = createNoteElement(note, category);
      container.appendChild(noteElement);
    });
  }
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("login-error").style.display = "none";
    appState.isLoggedIn = true;
    showAdminPanel(); // Llama a la función mejorada
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}

function logout() {
  appState.isLoggedIn = false;
  showPublicView();
}

function carouselPrev() {
  const carousel = document.getElementById("issues-carousel");
  carousel.scrollBy({
    left: -250,
    behavior: "smooth",
  });
}

function carouselNext() {
  const carousel = document.getElementById("issues-carousel");
  carousel.scrollBy({
    left: 250,
    behavior: "smooth",
  });
}

function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  preview.innerHTML = "";

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "Fecha Inválida";
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
