# Kanban Board

A sleek and modern **Kanban board** built with **React**, inspired by the UI of **Canvaso Product Design**.  
This project showcases smooth drag-and-drop functionality using `@dnd-kit`, clean design with Material UI, and modular code structure.

---

## ✨ Features

- 🗃️ Create tasks with title, description, and priority
- ✏️ Edit and delete tasks via modal dialogs
- 🖱️ Drag-and-drop tasks **within the same column** (cross-column drag is disabled)
- 📦 Modular components (`Column`, `TaskCard`, `TaskModal`)
- 🌈 Material UI theming
- 💾 Persistent state (in-memory, can be extended)

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Column.js
│   ├── TaskCard.js
│   └── TaskModal.js
├── data/
│   └── initialTasks.js
├── App.js
└── index.js
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/kanban-board.git
cd kanban-board
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

---

## 🔧 Tech Stack

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [@dnd-kit/core](https://dndkit.com/)
- `useState`, `useEffect`, `useCallback` for state logic

---

## 🙋‍♂️ Author

**Jalil Khan**

---

## 📝 License

This project is licensed under the MIT License.

---

## 🌟 Star this project

If you found this project useful or inspiring, please give it a ⭐ on GitHub!
