

// 1. ESTADO DE LA APLICACIÓN
let appState = {
  currentView: "public",
  currentCategory: null,
  isLoggedIn: false,
  flipbook: null,
};

// 2. DATOS POR DEFECTO


// Inicializar variable global
// window.APP_DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));

// ============================================================
// 3. CARGA DE DATOS
// ============================================================
async function loadData() {
  const response = await fetch("./data.json", { cache: "no-cache" });
  const data = await response.json();

  window.APP_DATA = {
    issues: data.issues || [],
    categories: data.categories || [],
    notes: data.notes || [],
  };

  syncLegacyData();  
  initApp();     
}


// ============================================================
// 4. INICIALIZACIÓN PRINCIPAL
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM cargado");

  setupEventListeners();
  initializeFlipbook();

  await loadData(); // ⬅️ ESPERAMOS A QUE CARGUE

  console.log("APP_DATA después de loadData:", window.APP_DATA);

  loadCurrentIssue();
});


// ============================================================
// 5. EVENT LISTENERS
// ============================================================

function setupEventListeners() {
  console.log("Configurando event listeners");

  // --- Navegación Login/Logout ---
  const adminToggle = document.getElementById("admin-toggle");
  if (adminToggle) {
    adminToggle.addEventListener("click", function (e) {
      e.preventDefault();
      showLogin();
    });
  }

  const publicToggle = document.getElementById("public-toggle");
  if (publicToggle) {
    publicToggle.addEventListener("click", function (e) {
      e.preventDefault();
      showPublicView();
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }

  // --- Navegación Tabs Admin ---
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      console.log("Cambiando a tab:", tabId);
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
  if (addCatBtn) {
    console.log("Botón agregar categoría encontrado");
    addCatBtn.addEventListener("click", addCategory);
  }

  const addNoteBtn = document.getElementById("add-note-btn");
  if (addNoteBtn) {
    console.log("Botón agregar nota encontrado");
    addNoteBtn.addEventListener("click", addNote);
  }

  const addIssueBtn = document.getElementById("add-issue-btn");
  if (addIssueBtn) {
    addIssueBtn.addEventListener("click", function () {
      alert(
        "Simulación: Revista agregada (Backend necesario para archivos reales)"
      );
    });
  }

  // --- MODALES DE EDICIÓN ---
  const editCatForm = document.getElementById("edit-category-form");
  if (editCatForm) {
    editCatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveEditCategory();
    });
  }

  const editNoteForm = document.getElementById("edit-note-form");
  if (editNoteForm) {
    editNoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveEditNote();
    });
  }

  // Cerrar Modales
  document.querySelectorAll(".close-category-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("edit-category-modal").style.display = "none";
    });
  });

  document.querySelectorAll(".close-note-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("edit-note-modal").style.display = "none";
    });
  });

  // Cerrar modal al hacer clic afuera
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) this.style.display = "none";
    });
  });

  // Back to categories button
  const backToCategories = document.getElementById("back-to-categories");
  if (backToCategories) {
    backToCategories.addEventListener("click", function (e) {
      e.preventDefault();
      showCategoriesView();
    });
  }
}

// =================================================================
// 6. FUNCIONES DE RENDERIZADO (ADMIN)
// =================================================================

function refreshAllViews() {
  console.log("Refrescando todas las vistas");

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

  const popularList = document.getElementById("popular-categories");
  if (popularList) {
    popularList.innerHTML = "";
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
  console.log("Cargando categorías en admin, contenedor:", container);

  if (!container) {
    console.error("No se encontró el contenedor categories-list");
    return;
  }

  container.innerHTML = "";

  if (!data.categories || data.categories.length === 0) {
    container.innerHTML = "<p>No hay categorías creadas.</p>";
    return;
  }

  data.categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "item-card";
    categoryElement.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid var(--secondary);
    `;

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
        <button class="action-btn btn-edit" onclick="window.editCategory(${category.id})" title="Editar" 
                style="background:#ffc107; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; color:#333;">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="action-btn btn-delete" onclick="window.deleteCategory(${category.id})" title="Eliminar" 
                style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    container.appendChild(categoryElement);
  });

  console.log(`Se cargaron ${data.categories.length} categorías en admin`);
}

// --- NOTAS EN ADMIN ---
function loadAdminNotes(data) {
  const container = document.getElementById("notes-list");
  console.log("Cargando notas en admin, contenedor:", container);

  if (!container) {
    console.error("No se encontró el contenedor notes-list");
    return;
  }

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
    noteElement.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid var(--secondary);
    `;

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
        <button class="action-btn btn-edit" onclick="window.editNote(${
          note.id
        })" title="Editar" 
                style="background:#ffc107; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; color:#333;">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="action-btn btn-delete" onclick="window.deleteNote(${
          note.id
        })" title="Eliminar" 
                style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    container.appendChild(noteElement);
  });

  console.log(`Se cargaron ${data.notes.length} notas en admin`);
}

function loadAdminIssues(data) {
  const container = document.getElementById("issues-list");
  if (!container) return;
  container.innerHTML = "";

  if (!data.issues) return;

  data.issues.forEach((issue) => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.style.cssText = `
      display: flex;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid var(--secondary);
    `;
    div.innerHTML = `
      <div style="width:50px; height:70px; background:#ddd; margin-right:10px; border-radius:4px; overflow:hidden;">
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
// 7. FUNCIONES CRUD (VISUALES)
// =================================================================

// --- Categorías ---
async function addCategory() {
  const name = document.getElementById("category-name").value;
  const description = document.getElementById("category-description").value;
  const icon =
    document.getElementById("category-icon").value || "fas fa-folder";

  if (!name || !description) {
    alert("Complete nombre y descripción.");
    return;
  }

  try {
    const response = await fetch("bicoracultural/api/categories.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, icon }),
    });

    if (!response.ok) throw new Error("Error al crear categoría");

    document.getElementById("category-name").value = "";
    document.getElementById("category-description").value = "";
    document.getElementById("category-icon").value = "";

    await loadData();
    alert(`Categoría '${name}' creada.`);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    alert("Error al crear categoría.");
  }
}


// Exportar funciones al scope global para que onclick funcione
window.editCategory = function (id) {
  const category = window.APP_DATA.categories.find((c) => c.id === id);

  if (!category) return;

  document.getElementById("edit-cat-id").value = category.id;
  document.getElementById("edit-cat-name").value = category.name;
  document.getElementById("edit-cat-desc").value = category.description;
  document.getElementById("edit-cat-icon").value = category.icon;

  document.getElementById("edit-category-modal").style.display = "flex";
};


window.deleteCategory = async function (id) {
  if (!confirm("¿Eliminar categoría? Las notas quedarán sin categoría."))
    return;

  try {
    await fetch(`./api/categories.php?id=${id}`, {
      method: "DELETE",
    });

    await loadData();
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    alert("Error al eliminar categoría.");
  }
};


async function saveEditCategory() {
  const id = document.getElementById("edit-cat-id").value;
  const name = document.getElementById("edit-cat-name").value;
  const description = document.getElementById("edit-cat-desc").value;
  const icon = document.getElementById("edit-cat-icon").value;

  if (!name || !description) {
    alert("Complete nombre y descripción.");
    return;
  }

  try {
    const response = await fetch("./api/categories.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, description, icon }),
    });

    if (!response.ok) throw new Error("Error al editar categoría");

    document.getElementById("edit-category-modal").style.display = "none";

    await loadData(); // 🔥 vuelve a traer data.json
    alert("Categoría actualizada.");
  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar la categoría.");
  }
}


// --- Notas ---
function addNote() {
  console.log("Función addNote ejecutada");

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
  console.log("Editando nota ID:", id);
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

    document.getElementById("edit-note-image").value = "";
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
      updateData(null);
    }
  }
}

// =================================================================
// 8. FUNCIONES DE VISTA PÚBLICA (READ ONLY)
// =================================================================

function loadCurrentIssue() {
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
    if (meta)
      meta.textContent = `N° ${issue.number} - ${issue.month} ${issue.year}`;
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

  const sortedNotes = [...data.notes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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
      <img src="${
        note.image || "https://via.placeholder.com/400x200?text=Imagen"
      }" alt="${note.title}">
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
// 9. UTILIDADES Y NAVEGACIÓN
// =================================================================

function switchTab(tabId) {
  console.log("Cambiando al tab:", tabId);

  // Remover active de todos los botones
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Remover active de todos los contenidos
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Agregar active al botón clickeado
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) {
    btn.classList.add("active");
    console.log("Botón activado:", btn);
  }

  // Mostrar el contenido correspondiente
  const content = document.getElementById(tabId);
  if (content) {
    content.classList.add("active");
    console.log("Contenido activado:", content);

    // Forzar refresco si es necesario
    if (tabId === "categorias") {
      loadAdminCategories(window.APP_DATA);
    } else if (tabId === "notas") {
      loadAdminNotes(window.APP_DATA);
      populateCategorySelect(window.APP_DATA);
    }
  }
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

  const notasSection = document.getElementById("notas");
  if (notasSection) notasSection.style.display = "none";

  const catSection = document.getElementById("category-notes");
  if (catSection) {
    catSection.style.display = "block";
    document.getElementById(
      "category-title"
    ).textContent = `Notas de: ${category.name}`;

    const container = document.getElementById("category-notes-container");
    container.innerHTML = "";

    const categoryNotes = window.APP_DATA.notes.filter(
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
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin") {
    document.getElementById("login-container").style.display = "none";
    const err = document.getElementById("login-error");
    if (err) err.style.display = "none";
    appState.isLoggedIn = true;
    showAdminPanel();
  } else {
    const err = document.getElementById("login-error");
    if (err) err.style.display = "block";
  }
}

function showAdminPanel() {
  console.log("Mostrando panel de administración");

  document.getElementById("public-view").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  appState.currentView = "admin";

  // Forzar recarga de visuales
  refreshAllViews();

  // Activar tab de categorías por defecto
  setTimeout(() => {
    switchTab("categorias");
  }, 100);
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
      img.style.borderRadius = "4px";
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

  const nextMag = document.getElementById("magazine-next");
  if (nextMag) {
    nextMag.addEventListener("click", () => {
      if (appState.flipbook) appState.flipbook.turn("next");
    });
  }

  const prevMag = document.getElementById("magazine-prev");
  if (prevMag) {
    prevMag.addEventListener("click", () => {
      if (appState.flipbook) appState.flipbook.turn("previous");
    });
  }
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

// Debug: Verificar que las funciones estén disponibles
console.log("Funciones CRUD disponibles:", {
  editCategory: typeof window.editCategory,
  deleteCategory: typeof window.deleteCategory,
  editNote: typeof window.editNote,
  deleteNote: typeof window.deleteNote,
  addCategory: typeof addCategory,
  addNote: typeof addNote,
});
