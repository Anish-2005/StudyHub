# StudyHub Setup Guide

Welcome to StudyHub! Follow these steps to get your study management app up and running.

## 🚀 Quick Setup

### 1. Dependencies ✅
Your dependencies are already installed! If you need to reinstall:
```bash
npm install --registry https://registry.npmmirror.com
```

### 2. Firebase Setup 🔥

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `studyhub-[your-name]`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. In Firebase console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Enable "Google" (optional but recommended)

#### Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select your preferred location
5. Click "Done"

#### Get Firebase Config
1. Go to Project settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) 
4. Register app with nickname "StudyHub"
5. Copy the firebaseConfig object

### 3. Environment Configuration 🔧

1. Copy your Firebase config:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### 4. Security Rules 🔒

Add these Firestore security rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Topics belong to users
    match /topics/{topicId} {
      allow read, write, create, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Tasks belong to users
    match /tasks/{taskId} {
      allow read, write, create, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Reminders belong to users
    match /reminders/{reminderId} {
      allow read, write, create, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Study sessions belong to users
    match /studySessions/{sessionId} {
      allow read, write, create, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Suggestions belong to users
    match /suggestions/{suggestionId} {
      allow read, write, create, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Start Development Server 🎉

The server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.106.1:3000

If you need to restart:
```bash
npm run dev
```

## 🎨 Features Overview

### ✅ What's Working
- **Authentication**: Email/password + Google sign-in
- **Responsive UI**: VS Code-inspired design
- **Topic Management**: Create, organize, and delete topics
- **Task Tracking**: Add tasks with priorities and due dates
- **Reminders**: Set study reminders and notifications
- **Real-time Updates**: Live data synchronization
- **User Dashboard**: Overview of all study activities

### 🚧 Ready to Implement
- Task completion tracking
- Study session timer
- Smart suggestions based on study patterns
- Notification system
- Study statistics and analytics
- Export/import functionality

## 🎯 Next Steps

1. **Test Authentication**: 
   - Sign up with email/password
   - Try Google sign-in

2. **Create Your First Topic**:
   - Click the "+" button in sidebar
   - Choose a color and icon
   - Add description

3. **Add Tasks and Reminders**:
   - Select a topic
   - Add tasks with due dates
   - Set study reminders

4. **Customize**:
   - Modify colors in `tailwind.config.js`
   - Add new icons in components
   - Extend functionality

## 🆘 Troubleshooting

### Firebase Connection Issues
- Check `.env.local` file exists and has correct values
- Verify Firebase project is active
- Ensure Firestore and Auth are enabled

### Build Errors
- Run `npm install` again
- Check TypeScript errors in VS Code
- Verify all imports are correct

### Styling Issues
- Check Tailwind CSS is working
- Verify custom CSS in `globals.css`
- Test responsive design

## 📝 Development Tips

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Firebase (Google)
- TypeScript Hero
- Auto Rename Tag

### Useful Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎉 You're Ready!

Your StudyHub is now set up and ready to use! Open http://localhost:3000 in your browser and start organizing your studies.

**Happy studying! 📚✨**
