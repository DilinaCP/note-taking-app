# 📝 Petalpad – Note-Taking App

A stylish and secure full-stack note-taking app built with **Next.js 14**, **Express.js**, and **MongoDB**, allowing users to create, update, and delete notes after authentication.

## 🚀 Live Demo

- 🖥️ Frontend: [note-taking-app-9go4.vercel.app](https://note-taking-app-9go4.vercel.app)
- 🔗 Backend: [note-taking-app-i2uk.onrender.com](https://note-taking-app-i2uk.onrender.com)

---

## 🧠 Features

- ✨ Responsive UI built with **Tailwind CSS**
- 📝 Create, edit, and delete notes
- 🔐 User authentication using **JWT**
- 💾 Save notes to **MongoDB**
- 🚀 Deployed with **Vercel (frontend)** and **Render (backend)**

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (frontend), Render (backend)

---

## 📁 Project Structure
note-taking-app/
├── frontend/ # Next.js app
│ └── pages/
│ └── components/
├── backend/ # Express API
│ └── routes/
│ └── models/
│ └── server.js


---

## 🧪 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/DilinaCP/note-taking-app.git
cd note-taking-app

cd backend
npm install
npm run dev   # or npm start

cd ../frontend
npm install
npm run dev

🛠 API Endpoints 
POST /api/signup – Register a user

POST /api/login – Authenticate and return JWT

GET /api/notes – Get user notes

POST /api/notes – Create a note

PUT /api/notes/:id – Edit a note

DELETE /api/notes/:id – Delete a note

📄 License
This project is licensed under the MIT License.

🙌 Acknowledgments
Developed as a personal project by Dilina Perera

Inspired by modern note-taking UIs like Notion and Google Keep