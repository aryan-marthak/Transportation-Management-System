# Environment Setup Guide

This guide explains how to set up environment variables for different deployment stages (development, staging, production) in your Transportation Management System.

## Overview

The application now uses environment variables instead of hardcoded localhost URLs, making it ready for production deployment.

## Environment Files Structure

### Backend Environment Files

- `backend/env.example` - Template with all required variables
- `backend/env.local` - Development environment (local machine)
- `backend/env.production` - Production environment

### Frontend Environment Files

- `frontend/env.example` - Template with all required variables  
- `frontend/env.local` - Development environment (local machine)
- `frontend/env.production` - Production environment

## Backend Environment Variables

### Required Variables

```bash
# Server Configuration
PORT=5002
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/transportation_system

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Optional Variables (for email/SMS features)

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Frontend Environment Variables

### Required Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:5002

# Environment
VITE_NODE_ENV=development

# Optional
VITE_APP_NAME=Transportation Management System
```

## Setup Instructions

### 1. Development Setup

1. **Backend Setup:**
   ```bash
   cd backend
   # Copy the example file and rename to .env
   cp env.example .env
   # Edit .env with your development values
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   # Copy the example file and rename to .env
   cp env.example .env
   # Edit .env with your development values
   ```

### 2. Production Setup

1. **Backend Production:**
   ```bash
   cd backend
   # Copy the production template
   cp env.production .env
   # Edit .env with your production values:
   # - Update MONGODB_URI to your production database
   # - Update FRONTEND_URL to your production frontend domain
   # - Use a strong JWT_SECRET
   # - Update email/SMS credentials if needed
   ```

2. **Frontend Production:**
   ```bash
   cd frontend
   # Copy the production template
   cp env.production .env
   # Edit .env with your production values:
   # - Update VITE_API_URL to your production backend domain
   ```

## Running the Application

### Development

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

### Production

```bash
# Backend
cd backend
npm run start:prod

# Frontend
cd frontend
npm run build:prod
npm run preview
```

## Deployment Considerations

### Backend Deployment

1. **Environment Variables:**
   - Set all required environment variables on your hosting platform
   - Use strong, unique secrets for JWT_SECRET
   - Ensure MONGODB_URI points to your production database

2. **CORS Configuration:**
   - Update FRONTEND_URL to your actual frontend domain
   - Consider using multiple origins if needed

3. **Security:**
   - Use HTTPS in production
   - Set secure cookie options
   - Implement rate limiting

### Frontend Deployment

1. **Build Process:**
   - Use `npm run build:prod` for production builds
   - The build will use production environment variables

2. **API Configuration:**
   - Ensure VITE_API_URL points to your production backend
   - Use HTTPS URLs in production

## Environment File Management

### Git Ignore

Make sure your `.gitignore` includes:
```
# Environment files
.env
.env.local
.env.production
```

### Security Best Practices

1. **Never commit .env files** to version control
2. **Use different secrets** for each environment
3. **Rotate secrets** regularly in production
4. **Use environment-specific databases**
5. **Monitor and log** environment variable usage

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check FRONTEND_URL in backend .env
   - Ensure it matches your frontend domain exactly

2. **API Connection Errors:**
   - Verify VITE_API_URL in frontend .env
   - Check if backend is running and accessible

3. **Database Connection Errors:**
   - Verify MONGODB_URI format
   - Check database credentials and network access

### Debug Mode

To debug environment variable issues:

```bash
# Backend
NODE_ENV=development DEBUG=* npm run dev

# Frontend
npm run dev -- --debug
```

## Migration from Hardcoded URLs

The application has been updated to use the new configuration system:

- **API URLs** are now centralized in `frontend/src/utils/config.js`
- **Backend CORS** uses environment variables
- **All fetch calls** use the new API_ENDPOINTS object

This makes the application much more maintainable and deployment-ready! 