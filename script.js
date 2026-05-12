const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ================= ADD TASK ================= */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  tasks.push({
    id: Date.now(),
    title,
    description,
    category,
    date,
    status: "pending"
  });

  saveAndRender();
  form.reset();
});

/* ================= RENDER TASKS ================= */
function renderTasks() {
  const filterEl = document.getElementById("filter");
  const sortEl = document.getElementById("sort");

  const filter = filterEl ? filterEl.value : "all";
  const sort = sortEl ? sortEl.value : "newest";

  let filtered = [...tasks];

  /* FILTER */
  if (filter === "completed") {
    filtered = filtered.filter(t => t.status === "completed");
  } else if (filter === "pending") {
    filtered = filtered.filter(t => t.status === "pending");
  }

  /* SORT BY DATE */
  if (sort === "newest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === "oldest") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sort === "az") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  taskList.innerHTML = "";

  filtered.forEach(task => {
    const div = document.createElement("div");
    div.className = `task ${task.status === "completed" ? "completed" : ""}`;

    div.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong>
        <small>${task.description || ""}</small>
        <small>${task.category} | ${task.date}</small>
      </div>

      <div class="actions">
        <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
        <button onclick="toggleTask(${task.id})"><i class="fas fa-check"></i></button>
        <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;

    taskList.appendChild(div);
  });

  updateSummary();
}

/* ================= TOGGLE STATUS ================= */
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, status: task.status === "pending" ? "completed" : "pending" }
      : task
  );

  saveAndRender();
}

/* ================= DELETE ================= */
function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

/* ================= EDIT ================= */
function editTask(id) {
  const task = tasks.find(t => t.id === id);

  const newTitle = prompt("Edit Title", task.title);
  const newDesc = prompt("Edit Description", task.description);

  if (!newTitle) return;

  task.title = newTitle;
  task.description = newDesc;

  saveAndRender();
}

/* ================= SUMMARY ================= */
function updateSummary() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent =
    tasks.filter(t => t.status === "completed").length;
  document.getElementById("pending").textContent =
    tasks.filter(t => t.status === "pending").length;
}

/* ================= SAVE ================= */
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* ================= DARK MODE ================= */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

/* ================= SIDEBAR ================= */
function showDashboard() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToTasks() {
  document.getElementById("taskList").scrollIntoView({
    behavior: "smooth"
  });
}

/* ================= EVENT LISTENERS ================= */
const filterEl = document.getElementById("filter");
const sortEl = document.getElementById("sort");

if (filterEl) filterEl.addEventListener("change", renderTasks);
if (sortEl) sortEl.addEventListener("change", renderTasks);

/* ================= INIT ================= */
renderTasks();