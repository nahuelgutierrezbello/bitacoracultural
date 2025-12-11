/* ============================================================
   ARCHIVO: app.js
   Lógica completa con Datos del data.json integrados
   ============================================================ */

// 1. ESTADO DE LA APLICACIÓN
let appState = {
  currentView: "public",
  currentCategory: null,
  isLoggedIn: false,
  flipbook: null,
};

// 2. DATOS POR DEFECTO (Copia de tu data.json para asegurar visualización)
// Esto asegura que NO aparezca vacío si falla la carga externa
const DEFAULT_DATA = {
  issues: [
    {
      id: 1765372578,
      number: "1",
      month: "enero",
      year: "2026",
      title: "Arte y Cultura",
      description: "Arte y Cultura",
      cover: "./api/uploads/1765372578_Arte Urbano y Expresión Callejera.avif",
      pdf: "./api/uploads/1765372578_Ebook Marketing Digital .pdf",
    },
    {
      id: 1765372625,
      number: "2",
      month: "febrero",
      year: "2026",
      title: "Cine y Vacaciones",
      description: "Cine y Vacaciones",
      cover: "./api/uploads/1765372625_Fin de Año Cultural.avif",
      pdf: "./api/uploads/1765372625_Ebook Marketing Digital .pdf",
    },
    {
      id: 1765372668,
      number: "3",
      month: "marzo",
      year: "2026",
      title: "Literartura y Escritores Locales",
      description: "Literartura y Escritores Locales",
      cover: "./api/uploads/1765372668_Literatura y Escritores Locales.avif",
      pdf: "./api/uploads/1765372668_Ebook Marketing Digital .pdf",
    },
  ],
  categories: [
    {
      id: 1,
      name: "Artes Visuales",
      description: "Pintura, escultura, fotografía y otras expresiones visuales",
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
      title: "El renacimiento del arte callejero",
      category: 1,
      author: "Ana López",
      date: "2026-03-15",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80",
      content: "Exploramos cómo los artistas urbanos están transformando los espacios públicos...",
    },
    {
      id: 2,
      title: "Festival de Jazz: Una tradición que crece",
      category: 2,
      author: "Carlos Méndez",
      date: "2026-03-10",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
      content: "El Festival Internacional de Jazz de Mar del Plata celebra su décima edición...",
    },
    {
      id: 3,
      title: "Nueva obra del Teatro Municipal",
      category: 3,
      author: "Laura Fernández",
      date: "2026-03-05",
      image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80",
      content: "El Teatro Municipal estrena 'Memorias de la Costa'...",
    },
  ],
};

// Inicializar variable global
window.APP_DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));

// ============================================================
// 3. CARGA DE DATOS
// ============================================================

async function loadData() {
  try {
    const response = await fetch("./data.json", { cache: "no-cache" });
    if (response.ok) {
      const data = await response.json();
      // Si data.json tiene datos, actualizamos APP_DATA
      if (data && data.categories && data.categories.length > 0) {
        window.APP_DATA = data;
        console.log("Datos cargados desde data.json");
      }
    }
  } catch (error) {
    console.warn("Usando datos por defecto (offline o error fetch).");
  }

  // Una vez cargados (o usando fallback), refrescamos todo
  refreshAllViews();
}

document.addEventListener("DOMContentLoaded", function () {
  // 1. Cargar datos
  loadData();

  // 2. Configurar eventos
  setupEventListeners();

  // 3. Inicializar componentes visuales
  initializeFlipbook();

  // 4. Cargar vista inicial pública
  loadCurrentIssue();
});

// ============================================================
// 4. EVENT LISTENERS
// ============================================================

function setupEventListeners() {
  // --- Navegación Login/Logout ---
  document.getElementById("admin-toggle").addEventListener("click", function (e) {
    e.preventDefault();
    showLogin();
  });

  document.getElementById("public-toggle").addEventListener("click", function (e) {
    e.preventDefault();
    showPublicView();
  });

  document.getElementById("logout-btn").addEventListener("click", function (e) {
    e.preventDefault();
    logout();
  });

  document.getElementById("login-btn").addEventListener("click", login);

  // --- Navegación Tabs Admin ---
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // --- Carrusel público ---
  const prevBtn = document.getElementById("carousel-prev");
  if (prevBtn) prevBtn.addEventListener("click", carouselPrev);

  const nextBtn = document.getElementById("carousel-next");
  if (nextBtn) nextBtn.addEventListener("click", carouselNext);

  // --- BOTONES DE AGREGAR (ADMIN) ---
  const addCatBtn = document.getElementById("add-category-btn");
  if (addCatBtn) addCatBtn.addEventListener("click", addCategory);

  const addNoteBtn = document.getElementById("add-note-btn");
  if (addNoteBtn) addNoteBtn.addEventListener("click", addNote);

  const addIssueBtn = document.getElementById("add-issue-btn");
  if (addIssueBtn) {
    addIssueBtn.addEventListener("click", function () {
      // Aquí iría la lógica de agregar revista a la DB simulada
      alert("Simulación: Revista agregada (Backend necesario para archivos reales)");
    });
  }

  // --- MODALES DE EDICIÓN ---

  // Formulario Categoría
  const editCatForm = document.getElementById("edit-category-form");
  if (editCatForm) {
    editCatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveEditCategory();
    });
  }

  // Formulario Nota
  const editNoteForm = document.getElementById("edit-note-form");
  if (editNoteForm) {
    editNoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveEditNote();
    });
  }

  // Cerrar Modales
  document.querySelectorAll(".close-category-modal").forEach((btn) => {
    btn.addEventListener("click", () => (document.getElementById("edit-category-modal").style.display = "none"));
  });
  document.querySelectorAll(".close-note-modal").forEach((btn) => {
    btn.addEventListener("click", () => (document.getElementById("edit-note-modal").style.display = "none"));
  });

  // Cerrar modal al hacer clic afuera
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) this.style.display = "none";
    });
  });

  // Previsualización de archivos (Input File)
  const issueCoverInput = document.getElementById("issue-cover");
  if (issueCoverInput) {
    issueCoverInput.addEventListener("change", function (e) {
      previewImage(e.target, "issue-cover-preview");
    });
  }

  const noteImageInput = document.getElementById("note-image");
  if (noteImageInput) {
    noteImageInput.addEventListener("change", function (e) {
      previewImage(e.target, "note-image-preview");
    });
  }

  const editNoteImgInput = document.getElementById("edit-note-image");
  if (editNoteImgInput) {
    editNoteImgInput.addEventListener("change", function (e) {
      // Preview opcional dentro del modal si se desea
    });
  }
}

// =================================================================
// 5. FUNCIONES DE RENDERIZADO (ADMIN)
// =================================================================

function refreshAllViews() {
  // Admin
  loadAdminCategories(window.APP_DATA);
  loadAdminNotes(window.APP_DATA);
  populateCategorySelect(window.APP_DATA);
  loadAdminIssues(window.APP_DATA);

  // Público
  loadCategories(window.APP_DATA);
  loadNotes(window.APP_DATA);
  loadIssues(window.APP_DATA);

  // Métricas
  updateMetrics();
}

function updateMetrics() {
  const totalNotes = document.getElementById("total-notes");
  if (totalNotes) totalNotes.innerText = window.APP_DATA.notes.length;

  // Calcular categoría más popular (simple)
  const popularList = document.getElementById("popular-categories");
  if (popularList) {
    popularList.innerHTML = "";
    // Logica simple: mostrar las primeras 3
    window.APP_DATA.categories.slice(0, 3).forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c.name;
      popularList.appendChild(li);
    });
  }
}

// --- CATEGORÍAS EN ADMIN ---
function loadAdminCategories(data) {
  const container = document.getElementById("categories-list");
  if (!container) return;

  container.innerHTML = ""; // Limpiar lista

  if (!data.categories || data.categories.length === 0) {
    container.innerHTML = "<p>No hay categorías creadas.</p>";
    return;
  }

  data.categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "item-card";
    categoryElement.style.display = "flex";
    categoryElement.style.justifyContent = "space-between";
    categoryElement.style.alignItems = "center";
    categoryElement.style.padding = "15px";
    categoryElement.style.marginBottom = "10px";
    categoryElement.style.backgroundColor = "#f8f9fa";
    categoryElement.style.borderRadius = "4px";
    categoryElement.style.borderLeft = "4px solid var(--secondary)";

    categoryElement.innerHTML = `
      <div class="item-details-container" style="display:flex; align-items:center; flex:1;">
        <div class="cat-icon-large" style="font-size:1.5rem; margin-right:15px; color:#ff6f61;">
          <i class="${category.icon}"></i>
        </div>
        <div class="item-content" style="flex:1;">
          <h4 style="margin:0 0 5px 0;">${category.name}</h4>
          <p style="margin:0; font-size:0.85em; color:#666;">${category.description}</p>
        </div>
      </div>
      <div class="item-actions-group" style="display:flex; gap:10px;">
        <button class="action-btn btn-edit" onclick="editCategory(${category.id})" title="Editar" 
                style="background:#ffc107; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; color:#333;">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="action-btn btn-delete" onclick="deleteCategory(${category.id})" title="Eliminar" 
                style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    container.appendChild(categoryElement);
  });
}

// --- NOTAS EN ADMIN ---
function loadAdminNotes(data) {
  const container = document.getElementById("notes-list");
  if (!container) return;

  container.innerHTML = "";

  if (!data.notes || data.notes.length === 0) {
    container.innerHTML = "<p>No hay notas publicadas.</p>";
    return;
  }

  data.notes.forEach((note) => {
    const category = data.categories.find((c) => c.id == note.category);
    const categoryName = category
      ? category.name
      : "<span style='color:red'>Sin Categoría</span>";

    const noteElement = document.createElement("div");
    noteElement.className = "item-card";
    noteElement.style.display = "flex";
    noteElement.style.justifyContent = "space-between";
    noteElement.style.alignItems = "center";
    noteElement.style.padding = "15px";
    noteElement.style.marginBottom = "10px";
    noteElement.style.backgroundColor = "#f8f9fa";
    noteElement.style.borderRadius = "4px";
    noteElement.style.borderLeft = "4px solid var(--secondary)";

    noteElement.innerHTML = `
      <div class="item-details-container" style="display:flex; align-items:center; flex:1;">
        <div class="item-image" style="width:80px; height:80px; margin-right:15px; flex-shrink:0; overflow:hidden; border-radius:4px;">
          <img src="${note.image}" 
               style="width:100%; height:100%; object-fit:cover;" 
               onerror="this.src='https://via.placeholder.com/80'"
               alt="${note.title}">
        </div>
        <div class="item-content" style="flex:1;">
          <h4 style="margin:0 0 5px 0;">${note.title}</h4>
          <p style="margin:0; font-size:0.85em; color:#666;">
            <strong>Cat:</strong> ${categoryName} | 
            <strong>Autor:</strong> ${note.author} | 
            <strong>Fecha:</strong> ${formatDate(note.date)}
          </p>
        </div>
      </div>
      <div class="item-actions-group" style="display:flex; gap:10px;">
        <button class="action-btn btn-edit" onclick="editNote(${note.id})" title="Editar" 
                style="background:#ffc107; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; color:#333;">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="action-btn btn-delete" onclick="deleteNote(${note.id})" title="Eliminar" 
                style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    container.appendChild(noteElement);
  });
}

function loadAdminIssues(data) {
  const container = document.getElementById("issues-list");
  if (!container) return;
  container.innerHTML = "";

  if (!data.issues) return;

  data.issues.forEach((issue) => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.innerHTML = `
            <div style="width:50px; height:70px; background:#ddd; margin-right:10px;">
                <img src="${issue.cover}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://via.placeholder.com/50x70'">
            </div>
            <div>
                <strong>N° ${issue.number}</strong> - ${issue.title}<br>
                <small>${issue.month} ${issue.year}</small>
            </div>
        `;
    container.appendChild(div);
  });
}

function populateCategorySelect(data) {
  const selects = [
    document.getElementById("note-category"),
    document.getElementById("edit-note-cat"),
  ];

  selects.forEach((select) => {
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">Seleccione una categoría</option>';

    data.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      if (currentVal == category.id) option.selected = true;
      select.appendChild(option);
    });
  });
}

// =================================================================
// 6. FUNCIONES CRUD (VISUALES)
// =================================================================

// --- Categorías ---
function addCategory() {
  const name = document.getElementById("category-name").value;
  const description = document.getElementById("category-description").value;
  const icon = document.getElementById("category-icon").value || "fas fa-folder";

  if (!name || !description) {
    alert("Complete nombre y descripción.");
    return;
  }

  const newCategory = {
    id:
      window.APP_DATA.categories.length > 0
        ? Math.max(...window.APP_DATA.categories.map((c) => c.id)) + 1
        : 1,
    name,
    description,
    icon,
  };

  window.APP_DATA.categories.push(newCategory);

  // Limpiar formulario
  document.getElementById("category-name").value = "";
  document.getElementById("category-description").value = "";
  document.getElementById("category-icon").value = "";

  refreshAllViews();
  alert(`Categoría '${name}' creada.`);
}

// Exportar funciones al scope global para que onclick funcione
window.editCategory = function (id) {
  const category = window.APP_DATA.categories.find((c) => c.id === id);
  if (category) {
    document.getElementById("edit-cat-id").value = category.id;
    document.getElementById("edit-cat-name").value = category.name;
    document.getElementById("edit-cat-desc").value = category.description;
    document.getElementById("edit-cat-icon").value = category.icon;
    document.getElementById("edit-category-modal").style.display = "flex";
  }
};

window.deleteCategory = function (id) {
  if (!confirm(`¿Eliminar categoría? Las notas quedarán sin categoría.`)) return;

  window.APP_DATA.categories = window.APP_DATA.categories.filter((c) => c.id !== id);
  // Desvincular notas
  window.APP_DATA.notes = window.APP_DATA.notes.map((n) =>
    n.category === id ? { ...n, category: null } : n
  );

  refreshAllViews();
};

function saveEditCategory() {
  const id = parseInt(document.getElementById("edit-cat-id").value);
  const index = window.APP_DATA.categories.findIndex((c) => c.id === id);

  if (index !== -1) {
    window.APP_DATA.categories[index].name = document.getElementById("edit-cat-name").value;
    window.APP_DATA.categories[index].description = document.getElementById("edit-cat-desc").value;
    window.APP_DATA.categories[index].icon = document.getElementById("edit-cat-icon").value;

    document.getElementById("edit-category-modal").style.display = "none";
    refreshAllViews();
    alert("Categoría actualizada.");
  }
}

// --- Notas ---
function addNote() {
  const title = document.getElementById("note-title").value;
  const categoryId = parseInt(document.getElementById("note-category").value);
  const author = document.getElementById("note-author").value;
  const date = document.getElementById("note-date").value;
  const content = document.getElementById("note-content").value;
  const imageFile = document.getElementById("note-image").files[0];

  if (!title || !categoryId || !content) {
    alert("Título, Categoría y Contenido son obligatorios.");
    return;
  }

  const processNote = (imageUrl) => {
    const newNote = {
      id:
        window.APP_DATA.notes.length > 0
          ? Math.max(...window.APP_DATA.notes.map((n) => n.id)) + 1
          : 1,
      title,
      category: categoryId,
      author,
      date,
      image: imageUrl,
      content,
    };

    window.APP_DATA.notes.push(newNote);

    // Limpiar formulario
    document.getElementById("note-title").value = "";
    document.getElementById("note-category").value = "";
    document.getElementById("note-author").value = "";
    document.getElementById("note-date").value = "";
    document.getElementById("note-content").value = "";
    document.getElementById("note-image").value = "";
    const preview = document.getElementById("note-image-preview");
    if (preview) preview.innerHTML = "";

    refreshAllViews();
    alert(`Nota '${title}' publicada.`);
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      processNote(e.target.result);
    };
    reader.readAsDataURL(imageFile);
  } else {
    processNote("https://via.placeholder.com/400x200?text=Nota+Sin+Imagen");
  }
}

window.editNote = function (id) {
  const note = window.APP_DATA.notes.find((n) => n.id === id);
  if (note) {
    document.getElementById("edit-note-id").value = note.id;
    document.getElementById("edit-note-title").value = note.title;
    populateCategorySelect(window.APP_DATA); // Refrescar select
    document.getElementById("edit-note-cat").value = note.category;
    document.getElementById("edit-note-author").value = note.author;
    document.getElementById("edit-note-date").value = note.date;
    document.getElementById("edit-note-content").value = note.content;

    const currentImg = document.getElementById("edit-note-current-img");
    if (currentImg) currentImg.src = note.image;

    document.getElementById("edit-note-image").value = ""; // Reset file input
    document.getElementById("edit-note-modal").style.display = "flex";
  }
};

window.deleteNote = function (id) {
  if (!confirm(`¿Eliminar nota permanentemente?`)) return;
  window.APP_DATA.notes = window.APP_DATA.notes.filter((n) => n.id !== id);
  refreshAllViews();
};

function saveEditNote() {
  const id = parseInt(document.getElementById("edit-note-id").value);
  const index = window.APP_DATA.notes.findIndex((n) => n.id === id);

  if (index !== -1) {
    const title = document.getElementById("edit-note-title").value;
    const categoryId = parseInt(document.getElementById("edit-note-cat").value);
    const author = document.getElementById("edit-note-author").value;
    const date = document.getElementById("edit-note-date").value;
    const content = document.getElementById("edit-note-content").value;
    const imageFile = document.getElementById("edit-note-image").files[0];

    const updateData = (imgUrl) => {
      window.APP_DATA.notes[index].title = title;
      window.APP_DATA.notes[index].category = categoryId;
      window.APP_DATA.notes[index].author = author;
      window.APP_DATA.notes[index].date = date;
      window.APP_DATA.notes[index].content = content;

      if (imgUrl) window.APP_DATA.notes[index].image = imgUrl;

      document.getElementById("edit-note-modal").style.display = "none";
      refreshAllViews();
      alert("Nota actualizada.");
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        updateData(e.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      updateData(null); // Mantener imagen actual si no se selecciona nueva
    }
  }
}

// =================================================================
// 7. FUNCIONES DE VISTA PÚBLICA (READ ONLY)
// =================================================================

function loadCurrentIssue() {
  // Si tenemos issues, cargamos la primera (más reciente por id o número)
  const issues = window.APP_DATA.issues || [];
  if (issues.length > 0) {
    const issue = issues[0];
    const cover = document.getElementById("current-cover");
    if (cover) cover.src = issue.cover;

    const title = document.getElementById("current-title");
    if (title) title.textContent = issue.title;

    const desc = document.getElementById("current-description");
    if (desc) desc.textContent = issue.description;

    const meta = document.getElementById("current-meta");
    if (meta) meta.textContent = `N° ${issue.number} - ${issue.month} ${issue.year}`;
  }
}

function loadCategories(data) {
  const container = document.getElementById("categories-container");
  if (!container) return;
  container.innerHTML = "";

  data.categories.forEach((category) => {
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

function loadNotes(data) {
  const container = document.getElementById("notes-container");
  if (!container) return;
  container.innerHTML = "";

  const sortedNotes = [...data.notes].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedNotes.forEach((note) => {
    const category = data.categories.find((c) => c.id === note.category);
    const noteElement = createNoteElement(note, category);
    container.appendChild(noteElement);
  });
}

function loadIssues(data) {
  const carousel = document.getElementById("issues-carousel");
  if (!carousel) return;
  carousel.innerHTML = "";

  if (!data.issues) return;

  data.issues.forEach((issue) => {
    const issueElement = document.createElement("div");
    issueElement.className = "carousel-item";

    issueElement.innerHTML = `
            <div class="carousel-cover">
                <img src="${issue.cover}" alt="${issue.title}"
                     onerror="this.onerror=null; this.src='https://picsum.photos/200/280?random=${Math.random()}';">
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

function createNoteElement(note, category) {
  const noteElement = document.createElement("div");
  noteElement.className = "note-card";
  const categoryName = category ? category.name : "Sin Categoría";

  noteElement.innerHTML = `
        <div class="note-image">
            <img src="${note.image || "https://via.placeholder.com/400x200?text=Imagen"}" alt="${note.title}">
        </div>
        <div class="note-content">
            <span class="note-category">${categoryName}</span>
            <h3>${note.title}</h3>
            <p>${note.content.substring(0, 100)}...</p>
            <div class="note-meta">
                <span><i class="fas fa-user"></i> ${note.author}</span>
                <span>${formatDate(note.date)}</span>
            </div>
        </div>
    `;
  return noteElement;
}

// =================================================================
// 8. UTILIDADES Y NAVEGACIÓN
// =================================================================

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));

  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add("active");

  const content = document.getElementById(tabId);
  if (content) content.classList.add("active");
}

function showLogin() {
  const loginCont = document.getElementById("login-container");
  if (loginCont) loginCont.style.display = "flex";
}

function showPublicView() {
  document.getElementById("public-view").style.display = "block";
  document.getElementById("admin-panel").style.display = "none";
  appState.currentView = "public";
}

function showCategoriesView() {
  const catNotes = document.getElementById("category-notes");
  if (catNotes) catNotes.style.display = "none";

  const notesSec = document.getElementById("notas");
  if (notesSec) notesSec.style.display = "block";

  appState.currentCategory = null;
}

function showCategoryNotes(categoryId) {
  const category = window.APP_DATA.categories.find((c) => c.id === categoryId);
  if (!category) return;
  appState.currentCategory = categoryId;

  document.getElementById("notas").style.display = "none";
  const catSection = document.getElementById("category-notes");
  if (catSection) {
    catSection.style.display = "block";
    document.getElementById("category-title").textContent = `Notas de: ${category.name}`;

    const container = document.getElementById("category-notes-container");
    container.innerHTML = "";

    const categoryNotes = window.APP_DATA.notes.filter((note) => note.category === categoryId);
    if (categoryNotes.length === 0) {
      container.innerHTML = "<p>No hay notas disponibles para esta categoría.</p>";
    } else {
      categoryNotes.forEach((note) => {
        const noteElement = createNoteElement(note, category);
        container.appendChild(noteElement);
      });
    }
  }
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin") {
    document.getElementById("login-container").style.display = "none";
    const err = document.getElementById("login-error");
    if (err) err.style.display = "none";
    appState.isLoggedIn = true;
    showAdminPanel(); // Redirige al admin
  } else {
    const err = document.getElementById("login-error");
    if (err) err.style.display = "block";
  }
}

function showAdminPanel() {
  document.getElementById("public-view").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  appState.currentView = "admin";

  // Forzar recarga de visuales
  refreshAllViews();
  switchTab("categorias");
}

function logout() {
  appState.isLoggedIn = false;
  showPublicView();
}

function carouselPrev() {
  const carousel = document.getElementById("issues-carousel");
  if (carousel) carousel.scrollBy({ left: -250, behavior: "smooth" });
}

function carouselNext() {
  const carousel = document.getElementById("issues-carousel");
  if (carousel) carousel.scrollBy({ left: 250, behavior: "smooth" });
}

function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview) return;

  preview.innerHTML = "";
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "100%";
      preview.appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- FLIPBOOK (Revista Interactiva) ---
function initializeFlipbook() {
  const btnVer = document.getElementById("btn-ver-revista");
  if (btnVer) {
    btnVer.addEventListener("click", function (e) {
      e.preventDefault();
      showMagazine();
    });
  }

  const btnClose = document.getElementById("close-magazine");
  if (btnClose) {
    btnClose.addEventListener("click", function () {
      hideMagazine();
    });
  }

  const backBtn = document.getElementById("back-to-categories");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showCategoriesView();
    });
  }

  // Navegación
  const nextMag = document.getElementById("magazine-next");
  if (nextMag)
    nextMag.addEventListener("click", () => {
      if (appState.flipbook) appState.flipbook.turn("next");
    });

  const prevMag = document.getElementById("magazine-prev");
  if (prevMag)
    prevMag.addEventListener("click", () => {
      if (appState.flipbook) appState.flipbook.turn("previous");
    });
}

function showMagazine() {
  const overlay = document.getElementById("magazine-overlay");
  if (overlay) overlay.style.display = "block";

  setTimeout(() => {
    if (typeof turn === "undefined") return;

    const width = window.innerWidth < 768 ? 400 : 800;
    const height = window.innerWidth < 768 ? 300 : 500;

    if (appState.flipbook) appState.flipbook.turn("destroy");

    appState.flipbook = $("#flipbook").turn({
      width: width,
      height: height,
      autoCenter: true,
      display: "double",
      acceleration: true,
      elevation: 50,
      gradients: true,
      duration: 1000,
    });
  }, 100);
}

function hideMagazine() {
  const overlay = document.getElementById("magazine-overlay");
  if (overlay) overlay.style.display = "none";
}

// Inicialización forzada
setTimeout(() => {
  if (document.getElementById("categories-list")) {
    refreshAllViews();
  }
}, 1000);