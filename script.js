const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add task
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  const newTask = {
  id: Date.now(),
  title,
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
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <div class="task-info ${task.status === "completed" ? "completed" : ""}">
        <strong>${task.title}</strong>
        <small>${task.category} | ${task.date}</small>
      </div>

      <div class="actions">
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
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
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

// Init
renderTasks();