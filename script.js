const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add task
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  
  const newTask = {
  id: Date.now(),
  title,
  description,
  category,
  date,
  status: "pending"
};

  tasks.push(newTask);
  saveAndRender();
  form.reset();
});

// Render
function renderTasks() {
  const filter = document.getElementById("filter").value;
  const sort = document.getElementById("sort").value;

  let filteredTasks = [...tasks];

  // FILTER
  if (filter !== "all") {
    filteredTasks = filteredTasks.filter(t => t.status === filter);
  }

  // SORT
  if (sort === "date") {
    filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  taskList.innerHTML = "";

  filteredTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `

   <div class="task-info ${task.status === "completed" ? "completed" : ""}">
    <strong>${task.title}</strong>
    <small>${task.description || ""}</small>
    <small>${task.category} | ${task.date}</small>
   </div>

   <div class="actions">
    <button onclick="editTask(${task.id})">✏️</button>
    <button class="complete" onclick="toggleTask(${task.id})">✔</button>
    <button class="delete" onclick="deleteTask(${task.id})">✖</button>
   </div>
`;

    taskList.appendChild(div);
  });

  updateSummary();
}

// Toggle
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, status: task.status === "pending" ? "completed" : "pending" }
      : task
  );
  saveAndRender();
}
// Delete
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
  showToast("Task deleted");
}

// Summary
function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = total - completed;

  document.getElementById("total").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("pending").textContent = pending;
}

// Save + Render
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
function editTask(id) {
  const task = tasks.find(t => t.id === id);

  const newTitle = prompt("Edit Title", task.title);
  const newDesc = prompt("Edit Description", task.description);

  if (!newTitle) return;

  task.title = newTitle;
  task.description = newDesc;

  saveAndRender();
  showToast("Task updated");
}
 function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
showToast("Task added");
// Init
renderTasks();
document.getElementById("filter").addEventListener("change", renderTasks);
document.getElementById("sort").addEventListener("change", renderTasks);