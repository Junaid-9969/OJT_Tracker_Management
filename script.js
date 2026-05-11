const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = loadTasks();

// ---------- LOAD ----------
function loadTasks() {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}

// ---------- SAVE ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- ADD TASK ----------
function addTask(title, category, date) {
  const newTask = {
    id: Date.now(),
    title,
    category,
    date,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// ---------- DELETE ----------
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ---------- TOGGLE ----------
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

// ---------- SUMMARY ----------
function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("total").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("pending").textContent = pending;
}

// ---------- RENDER ----------
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-info ${task.completed ? "completed" : ""}">
        <strong>${task.title}</strong>
        <small>${task.category} | ${task.date}</small>
      </div>

      <div class="actions">
        <button class="complete-btn" onclick="toggleTask(${task.id})">✔</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateSummary();
}

// ---------- FORM EVENT ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!title || !date) return;

  addTask(title, category, date);
  form.reset();
});

// ---------- INIT ----------
renderTasks();