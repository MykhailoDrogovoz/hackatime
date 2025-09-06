# 🏋️‍♂️ Sportvana

Sportvana is your chance to level up your fitness with fun & rewards.
Complete exercises, earn coins, unlock features, and challenge the leaderboard — your ultimate fitness gamification journey begins here.

🔗 Demo: [sportvana.netlify.app](https://sportvana.netlify.app/)

---

## ✨ Features

* 🎯 Gamified Fitness – Track workouts & earn coins.
* 🏆 Leaderboards – Compete with others to stay on top.
* 🔓 Unlockable Features – Use earned coins to unlock new experiences.
* ⚡ Fast & Responsive – Built with React + Vite frontend and Node.js + Express backend.
* 🔒 Environment-based Config – Securely manage API keys & secrets with .env files.

---

## 🛠️ Tech Stack

### Frontend

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)

### Backend

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)

### Other

* Environment variables via .env
* Hosted on [Netlify](https://www.netlify.com/) (Frontend)
* Hosted on [Render](https://render.com/) (Backend)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```terminal
git clone https://github.com/mishadrogovoz/sportvana.git
cd sportvana
```
### 2️⃣ Setup Environment Variables

Create .env files for both backend and frontend:

#### Frontend (/frontend/.env)
```env
VITE_API_FRONTEND_PORT=3000
VITE_API_IP=3002
VITE_API_URL="yourBackendUrl"
VITE_cloudName="yourCloudName"
VITE_unsignedUploadPreset="yourUnsignedUploadPreset"
```
#### Backend (/backend/.env)
```env
CRON_SECRET="yourCronJobSecret"
DATABASE_DIALECT="mysql"
DATABASE_HOST="yourDatabaseHost"
DATABASE_NAME="yourDatabaseName"
DATABASE_PASSWORD="yourDatabasePassword"
DATABASE_USER="yourDatabaseUser"
DB_PORT="yourDatabasePort"
EMAIL="yourEmailForNodeMailer"
EMAIL_PASSWORD="yourPasswordForNodeMailer"
EMAIL_USER="yourUserForNodeMailer"
FRONTEND_URL="yourFrontendUrl"
GITHUB_API_KEY_TOKEN="yourGithubApiKeyToken"
PORT="3002"
secret="yourSecretForJWT"
```
### 3️⃣ Install Dependencies

#### Frontend
```terminal
cd workout_app
npm install
```
#### Backend
```terminal
cd workout_app_backend
npm install
```
### 4️⃣ Run the App

#### Backend (Express server)
```terminal
cd workout_app_backend
node index.js
```
#### Frontend (React + Vite)
```terminal
cd frontend
npm run dev
```
---

## 📸 Demo Screenshot

Screenshot 1:
<img width="1902" height="892" alt="sportvana_screen_shot_1_updated" src="https://github.com/user-attachments/assets/38304571-9184-4b87-8e7d-6d6917c20b2e" />
Screenshot 2:
<img width="1898" height="911" alt="sportvana_screen_shot_2_updated" src="https://github.com/user-attachments/assets/c730fd20-a7af-402a-8f92-963042b5c06d" />
Screenshot 3:
<img width="1903" height="892" alt="sportvana_screen_shot_3_updated" src="https://github.com/user-attachments/assets/45ce65c8-bb64-4f59-9489-a54c7db2ed1b" />
Screenshot 4:
<img width="1905" height="887" alt="sportvana_screen_shot_4_updated" src="https://github.com/user-attachments/assets/41448d03-35cd-4d67-890b-9403586b6bc0" />
Screenshot 5:
<img width="1442" height="601" alt="sportvana_screen_shot_email" src="https://github.com/user-attachments/assets/e95e6c07-881d-4534-b002-8d55f0c2f5fe" />

---

## 📌 Roadmap

* 📱 Mobile app version (React Native)
* 🤝 Friend challenges & social sharing
* 🧩 More gamification elements (badges, streaks, quests)
* 📊 Detailed progress tracking

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a PR.

---

## 📜 License

This project is licensed under the MIT License.
