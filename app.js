// Estado de la aplicación
let appState = {
  currentView: "public",
  currentCategory: null,
  isLoggedIn: false,
};

async function loadData() {
    try {
        const response = await fetch('./data.json', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const text = await response.text();
        let data = JSON.parse(text);

        console.log(data)

        if (!Array.isArray(data.issues)) data.issues = [];

        return data;

    } catch (error) {
        console.error('Error al cargar datos:', error);
        throw error;
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Cargar revista actual desde la API
        loadCurrentIssue();

        // Cargar TODO lo demás desde data.json
        const data = await loadData();

        if (data) {
            loadIssues(data);
            loadCategories(data);
            loadNotes(data);
            setupEventListeners();
        }

    } catch (error) {
        console.error('Error detallado:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Error al cargar los datos. Por favor, recargue la página.';
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
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
document.getElementById("add-issue-btn").addEventListener("click", async function() {
    const issueData = {
        number: document.getElementById("issue-number").value,
        month: document.getElementById("issue-month").value,
        year: document.getElementById("issue-year").value,
        title: document.getElementById("issue-title").value,
        description: document.getElementById("issue-description").value,
        cover: document.getElementById("issue-cover").files[0],
        pdf: document.getElementById("issue-pdf").files[0]
    };
    
    console.log('Datos del formulario:', JSON.stringify(issueData, null, 2));
    
    try {
        await addIssue(issueData);
        // Limpiar el formulario
        document.getElementById("issue-number").value = "";
        document.getElementById("issue-title").value = "";
        document.getElementById("issue-description").value = "";
        document.getElementById("issue-cover").value = "";
        document.getElementById("issue-pdf").value = "";
    } catch (error) {
        console.error('Error al agregar revista:', error);
        alert('Error al agregar la revista. Por favor, intente nuevamente.');
    }
});

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

async function loadCurrentIssue() {
    try {
        const response = await fetch('./api/issues.php', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error('Respuesta del servidor:', responseBody);
            throw new Error(`Error ${response.status}: ${responseBody}`);
        }

        const data = JSON.parse(responseBody);
        let issues = data.data;

        if (!Array.isArray(issues) || issues.length === 0) {
            throw new Error('No hay revistas disponibles.');
        }

        // Ordenar por número de revista descendente
        issues.sort((a, b) => parseInt(b.number) - parseInt(a.number));

        // Tomar la revista más reciente
        const currentIssue = issues[0];

        document.getElementById("current-cover").src = currentIssue.cover;
        document.getElementById("current-title").textContent = currentIssue.title;
        document.getElementById("current-meta").textContent =
            `N° ${currentIssue.number} - ${currentIssue.month} ${currentIssue.year}`;
        document.getElementById("current-description").textContent = currentIssue.description;
        document.getElementById("current-pdf").href = currentIssue.pdf;

    } catch (error) {
        console.error('Error al cargar la revista actual:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Error al cargar la revista actual.';
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
}



function loadIssues(data) {
    if (!data || !data.issues) {
        console.error('Error: No se encontró el array issues en los datos');
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));
        return;
    }
    
    let issuesArray = Array.isArray(data.issues) ? data.issues : Object.values(data.issues);
    const carousel = document.getElementById("issues-carousel");
    carousel.innerHTML = "";
    
    issuesArray.forEach((issue) => {
        const issueElement = document.createElement("div");
        issueElement.className = "carousel-item";
        issueElement.innerHTML = `
            <div class="carousel-cover">
                <img src="${issue.cover}" 
                     alt="${issue.title}" 
                     onerror="this.onerror=null; 
                             this.src='https://picsum.photos/400/300?random=${Math.random()}'; 
                             this.style.opacity = '0.7';">
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

function loadCategories(data) {
    const container = document.getElementById("categories-container");
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
    container.innerHTML = "";
    // Ordenar notas por fecha, de la más reciente a la más antigua
    const sortedNotes = [...data.notes].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );
    sortedNotes.forEach((note) => {
        const category = data.categories.find((c) => c.id === note.category);
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

function loadAdminData(data) {
    // Llama a las funciones de carga solo una vez para llenar todos los listados
    loadAdminIssues(data);
    loadAdminCategories(data);
    loadAdminNotes(data);
    populateCategorySelect(data);
}

function loadAdminIssues(data) {
    if (!data || !data.issues) {
        console.error('Error: No se encontró el array issues en los datos');
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));
        return;
    }
    
    // Convertir issues a array si viene como objeto
    let issuesArray = Array.isArray(data.issues)
        ? data.issues
        : Object.values(data.issues);

    // 🔥 ESTA LÍNEA ES LA QUE FALTABA
    window.loadedIssues = issuesArray;

    const container = document.getElementById("issues-list");
    container.innerHTML = "";

    // Agregar la revista actual
    if (data.currentIssue) {
        const issueElement = createIssueAdminElement(data.currentIssue);
        container.appendChild(issueElement);
    }

    // Agregar las revistas anteriores
    issuesArray.forEach((issue) => {
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
            <button class="btn btn-small edit-issue" data-id="${issue.id}">Editar</button>
            <button class="btn btn-small btn-danger delete-issue" data-id="${issue.id}">Eliminar</button>
        </div>
    `;

    const editButton = issueElement.querySelector('.edit-issue');
    const deleteButton = issueElement.querySelector('.delete-issue');

    /* ============================================================
       ================   BOTÓN EDITAR (FRONT ONLY)   ==============
       ============================================================ */

  editButton.addEventListener('click', async () => {
    try {
        console.log("Editando ID:", issue.id);

        const response = await fetch('./api/issues.php');
        if (!response.ok) throw new Error("No se pudieron cargar las revistas");

        const data = await response.json();

        // DIAGNÓSTICO
        console.log("DATA COMPLETA:", data);

        // 🔥 SOLUCIÓN 🔥
        const issues = data.data;

        if (!Array.isArray(issues)) {
            console.error("issues NO ES ARRAY:", issues);
            throw new Error("El servidor no devolvió un array de revistas");
        }

        const issueData = issues.find(i => i.id == issue.id);

        if (!issueData) {
            console.error("ID buscado:", issue.id);
            console.error("Lista de issues recibida:", issues);
            throw new Error("No se encontró la revista seleccionada");
        }

        // Llenar inputs
        document.getElementById("edit-issue-number").value = issueData.number ?? "";
        document.getElementById("edit-issue-month").value = issueData.month ?? "";
        document.getElementById("edit-issue-year").value = issueData.year ?? "";
        document.getElementById("edit-issue-title").value = issueData.title ?? "";
        document.getElementById("edit-issue-description").value = issueData.description ?? "";

        window.currentEditingIssue = issueData;

        const coverPreview = document.getElementById("edit-issue-cover-preview");
        if (coverPreview) coverPreview.src = issueData.cover ?? "";

        const pdfPreview = document.getElementById("edit-issue-pdf-preview");
        if (pdfPreview) {
            if (issueData.pdf) {
                pdfPreview.href = issueData.pdf;
                pdfPreview.textContent = "Ver PDF actual";
            } else {
                pdfPreview.href = "#";
                pdfPreview.textContent = "No hay PDF cargado";
            }
        }

        document.getElementById("edit-issue-modal").style.display = "flex";

    } catch (error) {
        console.error("Error al cargar datos para editar:", error);
        alert(error.message || "No se pudo cargar la revista para editar");
    }
});



    /* ============================================================
       ===================   BOTÓN ELIMINAR   ======================
       ============================================================ */

    deleteButton.addEventListener('click', async () => {
        if (confirm(`¿Eliminar la revista "${issue.title}"?`)) {
            try {
                await deleteIssue(issue.id);
                const newData = await loadData();
                loadAdminIssues(newData);
                loadIssues(newData);
            } catch (error) {
                alert('Error al eliminar la revista');
            }
        }
    });

    return issueElement;
}



function loadAdminCategories(data) {
    const container = document.getElementById("categories-list");
    container.innerHTML = "";
    data.categories.forEach((category) => {
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


function loadAdminNotes(data) {
    const container = document.getElementById("notes-list");
    container.innerHTML = "";
    data.notes.forEach((note) => {
        const category = data.categories.find((c) => c.id === note.category);
        const categoryName = category ? category.name : "N/A";
        const noteElement = document.createElement("div");
        noteElement.className = "item-card";
        noteElement.innerHTML = `
            <div class="item-image">
                <img src="${note.image || "https://via.placeholder.com/80x100?text=IMG"}" 
                     alt="${note.title}">
            </div>
            <div class="item-content">
                <h4>${note.title}</h4>
                <p><strong>Categoría:</strong> ${categoryName} | <strong>Autor:</strong> ${note.author} | 
                   <strong>Fecha:</strong> ${formatDate(note.date)}</p>
                <p>${note.content.substring(0, 150)}...</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-small edit-note" data-id="${note.id}">Editar</button>
                <button class="btn btn-small btn-danger delete-note" data-id="${note.id}">Eliminar</button>
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

function populateCategorySelect(data) {
    const select = document.getElementById("note-category");
    select.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una categoría";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    data.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// =================================================================
// FUNCIONES CRUD 
// =================================================================

// --- Revistas ---

async function addIssue(issueData) {
    try {
        const formData = new FormData();
        formData.append('number', issueData.number);
        formData.append('month', issueData.month);
        formData.append('year', issueData.year);
        formData.append('title', issueData.title);
        formData.append('description', issueData.description);
        formData.append('cover', issueData.cover);
        formData.append('pdf', issueData.pdf);
        
        console.log('Datos del formulario:', JSON.stringify(issueData, null, 2));
        
        const response = await fetch('./api/issues.php', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al agregar revista: ${errorData?.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Respuesta del servidor:', JSON.stringify(data, null, 2));
        
        const newData = await loadData();
        if (newData) {
            loadAdminIssues(newData);
            loadIssues(newData);
            alert('Revista agregada correctamente');
            return data;
        } else {
            throw new Error('Error al recargar datos después de agregar la revista');
        }
    } catch (error) {
        console.error('Error al agregar revista:', error);
        alert('Error al agregar la revista. Por favor, intente nuevamente.');
        throw error;
    }
}

async function deleteIssue(id) {
    try {
        const response = await fetch(`./api/issues.php?id=${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la respuesta:', errorData);
            throw new Error(`Error al eliminar revista: ${errorData?.error || response.statusText}`);
        }
        
        const newData = await loadData();
        
        if (newData) {
            loadAdminIssues(newData);
            loadIssues(newData);
            alert('Revista eliminada correctamente');
        } else {
            throw new Error('Error al recargar datos después de eliminar la revista');
        }
    } catch (error) {
        console.error('Error al eliminar revista:', error);
        alert('Error al eliminar la revista. Por favor, intente nuevamente.');
        throw error;
    }
}

// Función para editar revista
async function editIssue() {
    try {
        const currentIssue = window.currentEditingIssue;
        if (!currentIssue) throw new Error('No hay una revista seleccionada para editar');

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('id', currentIssue.id);

        const fields = ['number','month','year','title','description'];
        fields.forEach(field => {
            const input = document.getElementById(`edit-issue-${field}`);
            if (input) formData.append(field, input.value);
        });

        const coverFile = document.getElementById('edit-issue-cover')?.files?.[0];
        const pdfFile = document.getElementById('edit-issue-pdf')?.files?.[0];
        if (coverFile) formData.append('cover', coverFile);
        if (pdfFile) formData.append('pdf', pdfFile);

        console.log("📦 ID EN FORM:", formData.get('id'));

        const response = await fetch('./api/issues.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al actualizar la revista');
        }

        const result = await response.json();
        console.log('Revista actualizada:', result);

        await loadData();
        const modal = document.getElementById('edit-issue-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('modal--opened');
        }

        alert('Revista actualizada correctamente');
        return result;
    } catch (error) {
        console.error('Error en edición:', error);
        alert(error.message || 'No se pudo actualizar la revista');
        throw error;
    }
}


// Botón guardar cambios
document.getElementById("save-edit-issue").addEventListener("click", async (e) => {
    e.preventDefault();
    await editIssue();
});

// Cerrar modal con botón
document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.getElementById("edit-issue-modal").style.display = "none";
});

// Cerrar modal al hacer click fuera
document.getElementById("edit-issue-modal").addEventListener("click", (e) => {
    if (e.target.id === "edit-issue-modal") {
        document.getElementById("edit-issue-modal").style.display = "none";
    }
});




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
async function showAdminPanel() {
    document.getElementById("public-view").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    appState.currentView = "admin";
    // 1. Carga inicial de todos los datos
    const data = await loadData();
    if (data) {
        loadAdminData(data);
        // 2. Forzar la activación y visualización de la pestaña por defecto: 'revistas'
        const defaultTabId = "revistas";
        // Asegurarse de que solo la pestaña inicial esté activa
        document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));
        // Activar la pestaña por defecto
        document.querySelector(`.tab-btn[data-tab="${defaultTabId}"]`).classList.add("active");
        document.getElementById(defaultTabId).classList.add("active");
    }
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
