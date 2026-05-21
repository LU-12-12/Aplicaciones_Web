// --- CONFIGURACIÓN Y ESTADO DE LA API ---
const API_URL = 'http://localhost:8080/TasksAPI/api/task';
let tasks = [];

// --- ELEMENTOS DEL DOM ---
const input         = document.getElementById('taskInput');
const addBtn        = document.getElementById('addBtn');
const taskList      = document.getElementById('taskList');
const emptyState    = document.getElementById('empty-state');
const taskCount     = document.getElementById('task-count');
const validationMsg = document.getElementById('validation-msg');
const globalLoader  = document.getElementById('global-loader');
const loaderText    = document.getElementById('loader-text');
const apiStatus     = document.getElementById('api-status');
const clearDoneBtn  = document.getElementById('clear-done-btn');

// MÉTODOS DE COMUNICACIÓN CON LA API
async function checkResponse(response) {
  if (!response.ok) {
    const msg = await response.text().catch(() => response.statusText);
    throw new Error(`HTTP ${response.status}: ${msg}`);
  }
  return response;
}

async function fetchTasks() {
  const response = await fetch(API_URL);
  await checkResponse(response);
  tasks = await response.json();
  return tasks;
}

async function addTask(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false }),
  });
  await checkResponse(response);
  const newTask = await response.json();
  tasks.push(newTask);
  return tasks;
}

async function deleteTask(id) {
  const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
  await checkResponse(response);
  tasks = tasks.filter(t => t.id !== id);
  return tasks;
}

async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return tasks;
  const updatedTask = { ...task, completed: !task.completed };
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });
  await checkResponse(response);
  const saved = await response.json();
  task.completed = saved.completed;
  return tasks;
}

async function editTask(id, newText) {
  const task = tasks.find(t => t.id === id);
  if (!task) return tasks;
  const updatedTask = { ...task, text: newText };
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });
  await checkResponse(response);
  const saved = await response.json();
  task.text = saved.text;
  return tasks;
}

// MÉTODOS DE INTERFAZ DE USUARIO (UI)
function render(tasksToRender) {
  taskList.innerHTML = '';
  tasksToRender.forEach(task => taskList.appendChild(buildNode(task)));
  updateCounters(tasksToRender);
}

function buildNode(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const check = document.createElement('button');
  check.className = 'task-check';
  check.setAttribute('aria-label', 'Completar');

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  const itemLoader = document.createElement('div');
  itemLoader.className = 'item-loader';
  const itemSpinner = document.createElement('div');
  itemSpinner.className = 'item-spinner';
  itemLoader.appendChild(itemSpinner);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-action edit';
  editBtn.dataset.action = 'edit';
  editBtn.setAttribute('aria-label', 'Editar');
  editBtn.textContent = '✎';

  const delBtn = document.createElement('button');
  delBtn.className = 'btn-action delete';
  delBtn.dataset.action = 'delete';
  delBtn.setAttribute('aria-label', 'Eliminar');
  delBtn.textContent = '✕';

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(check);
  li.appendChild(span);
  li.appendChild(itemLoader);
  li.appendChild(actions);

  return li;
}

function setLoading(visible, msg = 'Procesando…') {
  if (loaderText) loaderText.textContent = msg;
  if (globalLoader) globalLoader.classList.toggle('visible', visible);
}

function setStatus(state) {
  if (!apiStatus) return;
  apiStatus.className = `api-status api-status--${state}`;
  const labels = { ok: 'API conectada', error: 'API sin conexión', loading: 'conectando…' };
  apiStatus.textContent = labels[state] ?? state;
}

function showError(msg) {
  if (!validationMsg) return;
  validationMsg.textContent = msg;
  validationMsg.classList.add('show');
  clearTimeout(showError._t);
  showError._t = setTimeout(() => validationMsg.classList.remove('show'), 3000);
}

function setItemLoading(li, loading) {
  li.classList.toggle('item-loading', loading);
}

function updateCounters(tasksToCount) {
  if (taskCount) taskCount.textContent = tasksToCount.length;
  if (emptyState) emptyState.classList.toggle('hidden', tasksToCount.length > 0);
}

// FLUJO PRINCIPAL Y EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {

  // 1. Inicialización y carga de datos desde la API
  setLoading(true, 'Cargando tareas…');
  setStatus('loading');

  try {
    const fetched = await fetchTasks();
    render(fetched);
    setStatus('ok');
  } catch (err) {
    console.error('[app] fetchTasks:', err);
    setStatus('error');
    showError('No se pudo conectar con la API. ¿Está el servidor corriendo?');
  } finally {
    setLoading(false);
  }

  // 2. Manejador para añadir nuevas tareas
  async function handleCreate() {
    const text = input.value.trim();

    if (!text)           return showError('El título no puede estar vacío.');
    if (text.length < 2) return showError('Mínimo 2 caracteres.');

    addBtn.disabled  = true;
    input.disabled   = true;
    setLoading(true, 'Creando tarea…');

    try {
      const updatedTasks = await addTask(text);
      input.value = '';
      render(updatedTasks);
    } catch (err) {
      console.error('[app] addTask:', err);
      showError('Error al crear la tarea. Intenta de nuevo.');
    } finally {
      addBtn.disabled = false;
      input.disabled  = false;
      setLoading(false);
      input.focus();
    }
  }

  if (addBtn) addBtn.addEventListener('click', handleCreate);
  if (input) {
    input.addEventListener('keydown', e => { 
      if (e.key === 'Enter') handleCreate(); 
    });
  }

  // 3. Delegación de eventos en la lista de tareas (Completar, Editar, Eliminar)
  if (taskList) {
    taskList.addEventListener('click', async (e) => {
      const target = e.target;
      const li = target.closest('.task-item');
      if (!li) return;

      const id = parseInt(li.dataset.id, 10);
      if (isNaN(id)) return;

      // Evento de Completar / Conmutar estado
      if (target.classList.contains('task-check') || target.classList.contains('task-text')) {
        setItemLoading(li, true);
        try {
          const updatedTasks = await toggleTask(id);
          render(updatedTasks);
        } catch (err) {
          console.error('[app] toggleTask:', err);
          showError('No se pudo actualizar la tarea.');
          setItemLoading(li, false);
        }
        return;
      }

      // Evento de Edición
      if (target.dataset.action === 'edit') {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Editar tarea:', task.text);
        if (newText === null) return;
        const trimmed = newText.trim();
        if (!trimmed) return showError('El texto no puede estar vacío.');

        setItemLoading(li, true);
        try {
          const updatedTasks = await editTask(id, trimmed);
          render(updatedTasks);
        } catch (err) {
          console.error('[app] editTask:', err);
          showError('No se pudo guardar el cambio.');
          setItemLoading(li, false);
        }
        return;
      }

      // Evento de Eliminación individual
      if (target.dataset.action === 'delete') {
        li.classList.add('removing');
        await new Promise(r => li.addEventListener('animationend', r, { once: true }));

        try {
          const updatedTasks = await deleteTask(id);
          render(updatedTasks);
        } catch (err) {
          console.error('[app] deleteTask:', err);
          li.classList.remove('removing');
          showError('No se pudo eliminar la tarea.');
        }
      }
    });
  }

  // 4. Limpiar tareas completadas en masa
  if (clearDoneBtn) {
    clearDoneBtn.addEventListener('click', async () => {
      const completed = tasks.filter(t => t.completed);
      if (!completed.length) return;

      const nodes = [...taskList.querySelectorAll('.task-item.completed')];
      nodes.forEach(li => li.classList.add('removing'));
      
      // Esperar a que terminen todas las animaciones visuales CSS antes de llamar a la API
      await Promise.all(
        nodes.map(li => new Promise(r => li.addEventListener('animationend', r, { once: true })))
      );

      setLoading(true, `Eliminando ${completed.length} tarea(s)…`);
      try {
        await Promise.all(completed.map(t => deleteTask(t.id)));
        render(tasks);
      } catch (err) {
        console.error('[app] clearDone:', err);
        showError('Algunas tareas no pudieron eliminarse.');
        render(tasks);
      } finally {
        setLoading(false);
      }
    });
  }
});