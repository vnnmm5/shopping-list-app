const STORAGE_KEY = "shopping-list-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const list = document.getElementById("item-list");
const emptyMessage = document.getElementById("empty-message");
const remainingCount = document.getElementById("remaining-count");
const clearCheckedBtn = document.getElementById("clear-checked");

let items = loadItems();

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "item" + (item.checked ? " checked" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;
    checkbox.addEventListener("change", () => toggleItem(item.id));

    const span = document.createElement("span");
    span.textContent = item.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "삭제");
    deleteBtn.addEventListener("click", () => deleteItem(item.id));

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });

  emptyMessage.style.display = items.length === 0 ? "block" : "none";
  const remaining = items.filter((item) => !item.checked).length;
  remainingCount.textContent = `${remaining}개 남음`;
}

function addItem(name) {
  items.push({ id: Date.now().toString(), name, checked: false });
  saveItems();
  render();
}

function toggleItem(id) {
  const item = items.find((item) => item.id === id);
  if (item) item.checked = !item.checked;
  saveItems();
  render();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  render();
}

function clearChecked() {
  items = items.filter((item) => !item.checked);
  saveItems();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  addItem(name);
  input.value = "";
  input.focus();
});

clearCheckedBtn.addEventListener("click", clearChecked);

render();
