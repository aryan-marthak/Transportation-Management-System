# 🖥️ IT Installation Guide - Transportation Management System

## 📋 Prerequisites Checklist

**⚠️ IMPORTANT: Install these software in EXACTLY this order!**

### 1. Required Software Downloads

#### A. Node.js (Version 18 or higher)
- **Download Link**: https://nodejs.org/en/download/
- **Choose**: "LTS" version (Long Term Support)
- **File Type**: Windows Installer (.msi) for Windows
- **Installation**: Double-click and follow the wizard (accept all defaults)

#### B. Git (Version Control)
- **Download Link**: https://git-scm.com/download/win
- **Choose**: Windows version
- **File Type**: Windows Installer (.exe)
- **Installation**: Double-click and follow the wizard (accept all defaults)

#### C. Visual Studio Code (Code Editor)
- **Download Link**: https://code.visualstudio.com/download
- **Choose**: Windows version
- **File Type**: Windows Installer (.exe)
- **Installation**: Double-click and follow the wizard (accept all defaults)

#### D. MongoDB Compass (Database GUI - Optional but Recommended)
- **Download Link**: https://www.mongodb.com/try/download/compass
- **Choose**: Windows version
- **File Type**: Windows Installer (.exe)
- **Installation**: Double-click and follow the wizard (accept all defaults)

---

## 🚀 Step-by-Step Installation Process

### Step 1: Verify Software Installation

Open **Command Prompt** (Windows + R, type `cmd`, press Enter) and run these commands:

```bash
node --version
npm --version
git --version
```

**✅ If all commands show version numbers, proceed to Step 2**
**❌ If any command shows "not recognized", reinstall that software**

### Step 2: Create Project Directory

```bash
cd C:\Users\[YourUsername]\Desktop
mkdir Transportation-Project
cd Transportation-Project
```

### Step 3: Download the Project

```bash
git clone https://github.com/[username]/Transportation-Management-System.git
cd Transportation-Management-System
```

**⚠️ If you don't have the GitHub repository, ask the developer for the project files and extract them to this folder.**

### Step 4: Set Up Backend Environment

```bash
cd backend
copy env.example .env
```

Edit the `.env` file with your actual values (see IT_Install.txt for details).

### Step 5: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 6: Set Up Frontend Environment

```bash
cd ..
cd frontend
copy env.example .env
```

Edit the frontend `.env` file as needed.

### Step 7: Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

# 🏃‍♂️ Running the Application

## DEVELOPMENT MODE (For Testing)

### Method 1: Using Root Package Scripts (Recommended)
```bash
cd ..
npm install
npm run dev
```

### Method 2: Running Separately
```bash
# Terminal 1 (Backend)
cd backend
npm start

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

---

# 🏢 PRODUCTION MODE (For Company Server - 24/7 Running)

**IMPORTANT: DO NOT keep terminal windows open 24/7 for production!**

## Step 1: Install PM2 Process Manager
```bash
npm install -g pm2
```

## Step 2: Build Frontend for Production
```bash
cd frontend
npm run build
# This creates a 'dist' folder
```

## Step 3: Start Backend with PM2
```bash
cd ../backend
pm2 start index.js --name "tms-backend" --port 5003
# Set environment variables for production (or use a .env file)
```

## Step 4: Start Frontend with PM2
```bash
cd ../frontend
pm2 serve dist 80 --name "tms-frontend"
# Or use another port if 80 is busy
pm2 serve dist 3000 --name "tms-frontend"
```

## Step 5: Save PM2 Configuration
```bash
pm2 save
pm2 startup
# Follow the instructions that appear
```

## Step 6: Verify Everything is Running
```bash
pm2 status
pm2 logs tms-backend
pm2 logs tms-frontend
```

## Step 7: Access the Application
- **Frontend**: http://your-server-ip (or http://your-server-ip:3000)
- **Backend API**: http://your-server-ip:5003

---

# 🔧 PM2 Management Commands

```bash
pm2 status                # View all running processes
pm2 restart tms-backend   # Restart backend
pm2 restart tms-frontend  # Restart frontend
pm2 stop tms-backend      # Stop backend
pm2 start tms-backend     # Start backend
pm2 logs tms-backend      # View backend logs
pm2 logs tms-frontend     # View frontend logs
pm2 monit                 # Monitor resources (CPU, Memory)
pm2 delete tms-backend    # Delete backend process
pm2 reload all            # Reload all processes
pm2 restart all           # Restart all processes
```

---

# 🌐 Accessing the Application

**DEVELOPMENT MODE:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5002

**PRODUCTION MODE:**
- Frontend: http://your-server-ip (or http://your-server-ip:3000)
- Backend: http://your-server-ip:5003

Test the application by opening the frontend URL in your browser.

---

# 🚨 Troubleshooting Common Issues

**Issue 1: "Port already in use"**
- Choose some random port names which are not being used in any processes.

**Issue 2: "Module not found" errors**
```bash
cd backend
rmdir /s node_modules
npm install
cd ../frontend
rmdir /s node_modules
npm install
```

**Issue 3: "MongoDB connection failed"**
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct

**Issue 4: "Email not working"**
- Check Gmail app password is correct
- Ensure 2-Step Verification is enabled
- Verify ADMIN_USER email is correct

**Issue 5: "npm command not recognized"**
- Reinstall Node.js
- Restart Command Prompt
- Check PATH environment variable

**Issue 6: "PM2 process not starting"**
- Check if PM2 is installed: `npm list -g pm2`
- Reinstall PM2: `npm uninstall -g pm2 && npm install -g pm2`
- Check logs: `pm2 logs`
- Restart PM2: `pm2 kill && pm2 start`

**Issue 7: "Application not accessible from other computers"**
- Check firewall settings - allow ports 80, 3000, 5003
- Check if server IP is correct
- Verify PM2 processes are running: `pm2 status`
- Check if application is bound to correct IP (not just localhost)

---

# 📁 Project Structure (For Reference)

```
Transportation-Management-System/
├── backend/                 # Server-side code
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication middleware
│   ├── utils/              # Email and SMS utilities
│   ├── Scheduler/          # Automated tasks
│   ├── jwt/                # Token generation
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment variables
├── frontend/               # Client-side code
│   ├── src/               # React source code
│   ├── public/            # Static files
│   ├── package.json       # Frontend dependencies
│   └── .env              # Frontend environment variables
├── package.json           # Root scripts
└── README.md             # Main documentation
```

---

# 📞 Support Contacts

If you encounter issues:
1. Check this guide first
2. Check the main README.md file
3. Contact the developer (+91 6351773853)
4. Check console errors in browser (F12)
5. Check PM2 logs: `pm2 logs`
6. Check server firewall settings
7. Verify network connectivity

**PRODUCTION SUPPORT:**
- Monitor application: `pm2 monit`
- Check application status: `pm2 status`
- View real-time logs: `pm2 logs --lines 100`
- Restart if needed: `pm2 restart all`

---

# ✅ Final Checklist

**DEVELOPMENT MODE CHECKLIST:**
- [ ] Node.js installed and working
- [ ] Git installed and working
- [ ] Project files downloaded
- [ ] Backend `.env` file configured
- [ ] Frontend `.env` file configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Application starts without errors
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend API accessible at http://localhost:5002
- [ ] Can create account and login
- [ ] Can access employee/admin dashboard

**PRODUCTION MODE CHECKLIST:**
- [ ] PM2 installed globally
- [ ] Frontend built for production (`npm run build`)
- [ ] Backend started with PM2
- [ ] Frontend served with PM2
- [ ] PM2 configuration saved
- [ ] PM2 startup configured
- [ ] Application accessible from other computers
- [ ] Firewall ports opened (80, 3000, 5003)
- [ ] Production environment variables set
- [ ] Database connection working
- [ ] Email notifications working
- [ ] Application survives server restart

**🎉 If all checkboxes are marked, the installation is successful!** 