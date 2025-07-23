# 🚗 Transportation Management System

A full-stack web application for managing vehicle requests, assignments, and fleet operations within an organization. Built with Node.js/Express (backend) and React (frontend).

---

## 📋 Features
- **Employee Dashboard:**
  - Submit vehicle/trip requests
  - View request status and history
  - Receive email notifications for request status (via **nodemailer**)
- **Admin Dashboard:**
  - Approve/reject trip requests
  - Assign vehicles and drivers
  - Add, remove, and manage vehicles and drivers
  - Mark vehicles as temporarily out of service
  - Export trip, driver, and vehicle reports to Excel (**exceljs**)
- **Automated Operations:**
  - Scheduled completion of trips and automatic resource release (**node-cron**)
- **Real-time Updates:**
  - Live status updates for requests and assignments
- **Authentication:**
  - Secure login for employees and admins
- **State Management:**
  - Efficient client-side state management using **zustand**
- **Containerization & Deployment:**
  - Easy setup and deployment using **Docker** and **docker-compose**

---

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, React Router, Lucide React
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT, CORS
- **Database:** MongoDB Atlas (cloud-based)

---

## 🚀 Getting Started

You can run this project in two ways:
1. **Local Development (Node.js & npm)**
2. **Dockerized Setup (Recommended for Easy Start)**

---

### 1. Local Development (Node.js & npm)

#### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Transportation-Management-System
```

#### 2. Install all dependencies
```bash
npm run install-all
```

#### 3. Configure environment variables
- Copy the provided `.env.example` file in the `backend` directory to `.env`:
  ```bash
  cd backend
  cp .env.example .env
  ```
- Edit `.env` to add your MongoDB Atlas URI, JWT secret, and desired PORT:
  ```env
  MONGODB_URI=your_mongodb_atlas_connection_string
  JWT_SECRET=your_very_secret_key_here
  PORT=5002
  ```

##### How to generate a MongoDB Atlas URI:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Create a new project and cluster (free tier is fine).
3. In your cluster, click "Connect" > "Connect your application".
4. Copy the provided connection string (it looks like `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`).
5. Replace `<username>`, `<password>`, and any placeholder values with your actual credentials and database name.
6. Paste this string as the value for `MONGODB_URI` in your `.env` file.

##### JWT_SECRET configuration:
- `JWT_SECRET` can be **any random string**. It is used to sign and verify authentication tokens.
- Example values:
  - `JWT_SECRET=supersecret`
  - `JWT_SECRET=myrandomstring123`
  - `JWT_SECRET=ThisIsAReallyLongAndRandomSecretKey!@#123`
- For production, use a long, unpredictable string.

##### PORT configuration:
- The default port is `5002`. You can change it in your `.env` file if needed.

#### 4. Start the application
```bash
npm run dev
```
- This will start both the backend (http://localhost:5002) and frontend (http://localhost:5173) concurrently.

#### 5. Access the app
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration
- A demo `.env.example` file is provided in the `backend` directory:
  ```env
  MONGODB_URI=your_mongodb_atlas_connection_string
  JWT_SECRET=your_very_secret_key_here
  PORT=5002
  ```
- Update the values as described above to match your MongoDB Atlas setup, JWT secret, and desired port.

---

## 👤 Default Accounts
- **Admin:**
  - You would have to add an Admin account manually in the Database.
  - Email: `example@example.com`
  - Password: `example`
- **Employee:** 
  - You will have to SignUp to create new Employee.
  - Email: `example@example.com`
  - Password: `example`

---

## 📁 Project Structure
```
Transportation-Management-System/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── package.json      # Root scripts for install/run
├── .gitignore
└── README.md
```

---

## 📝 Scripts
| Command                | Description                                      |
|------------------------|--------------------------------------------------|
| `npm run install-all`  | Installs backend and frontend dependencies       |
| `npm run dev`          | Starts backend and frontend concurrently         |
| `npm run dev-backend`  | Starts backend only                              |
| `npm run dev-frontend` | Starts frontend only                             |

---

## 🛠️ Troubleshooting
- **MongoDB connection failed:** Make sure your MongoDB Atlas URI is correct and your cluster is running.
- **Port already in use:** Check if ports 5002 (backend) or 5173 (frontend) are available.
- **Dependencies not found:** Run `npm run install-all` again.

---

### 2. Dockerized Setup (Recommended for Easy Start)

You can also run this project using Docker and Docker Compose for a fully containerized setup.

#### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

#### 1. Configure Environment Variables
- Copy `.env.example` to `.env` in the project root and fill in your secrets:
  ```env
  MONGODB_URI=your_mongodb_connection_string
  JWT_TOKEN=your_jwt_secret
  GMAIL_PASS=your_gmail_app_password
  PORT=5002
  ```

#### 2. Set up docker-compose.yml

- For using pre-built Docker images, do the following:
  - **Remove or comment out** the `build:` lines for both `backend` and `frontend` services in your `docker-compose.yml`.
  - Your `docker-compose.yml` should look like this:
    ```yaml
    services:
      backend:
        # build: ./backend
        image: aryanmarthak/tms-backend:latest
        ports:
          - "5002:5002"
        environment:
          - MONGODB_URI=${MONGODB_URI}
          - JWT_TOKEN=${JWT_TOKEN}
          - GMAIL_PASS=${GMAIL_PASS}
          - PORT=${PORT}
      frontend:
        # build: ./frontend
        image: aryanmarthak/tms-frontend:latest
        ports:
          - "5173:80"
        depends_on:
          - backend
    ```
- This allows you to pull and run the containers directly from Docker Hub or another registry, without building them locally.

#### 3. Start the Project with Docker Compose
```sh
docker compose up
```
- The frontend will be available at [http://localhost:5173](http://localhost:5173)
- The backend API will be available at [http://localhost:5002](http://localhost:5002)

#### 4. Stopping the Project
```sh
docker compose down
```

---

## 📜 License
MIT License 