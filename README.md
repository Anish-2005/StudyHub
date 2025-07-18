# StudyHub 📚

> Your personal, organized, and intelligent study workspace - designed like VS Code

StudyHub is a modern study management application that brings the familiar VS Code interface to your learning journey. Organize your study topics, track tasks, set reminders, and get smart suggestions to enhance your productivity.

## ✨ Features

### 🗂️ Topic Organization
- **VS Code-like Folder Structure**: Each topic has its own organized folder
- **Color-coded Topics**: Visual organization with customizable colors and icons
- **Date-based Organization**: Automatic chronological organization

### ✅ Task Management
- **Priority Levels**: Low, medium, and high priority tasks
- **Due Dates**: Never miss important deadlines
- **Progress Tracking**: Mark tasks as completed and track your progress
- **Tags System**: Organize tasks with custom tags

### ⏰ Smart Reminders
- **Flexible Scheduling**: Set reminders for any date and time
- **Multiple Types**: Study reminders, task deadlines, and review sessions
- **Notifications**: Get notified when it's time to complete tasks

### 🎯 Intelligent Suggestions
- **Related Topics**: Discover connections between your study subjects
- **Study Plans**: AI-powered suggestions for optimal learning paths
- **Resource Recommendations**: Get suggestions for additional learning materials

### 🔐 Secure Authentication
- **Firebase Auth**: Secure email/password and Google sign-in
- **User Profiles**: Personalized experience with user preferences
- **Data Privacy**: Your study data is private and secure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anish-2005/StudyHub.git
   cd StudyHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if npm has network issues, try:
   yarn install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with VS Code theme
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
StudyHub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── AuthForm.tsx       # Authentication form
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── TopicItem.tsx      # Topic list item
│   │   ├── CreateTopicModal.tsx
│   │   ├── TaskList.tsx       # Task management
│   │   ├── ReminderList.tsx   # Reminder management
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                   # Utility libraries
│   │   └── firebase.ts        # Firebase configuration
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Design System

StudyHub uses a custom design system inspired by VS Code:

### Colors
- **Background**: `#1e1e1e` (VS Code dark theme)
- **Sidebar**: `#252526`
- **Accent**: `#007acc` (VS Code blue)
- **Success**: `#4caf50`
- **Warning**: `#ff9800`
- **Error**: `#f44336`

### Typography
- **Primary Font**: JetBrains Mono (monospace)
- **Fallbacks**: Fira Code, Monaco, Consolas

## 🔧 Configuration

### Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /topics/{topicId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Environment Variables
Create a `.env.local` file with your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms
- **Netlify**: Use `npm run build && npm run export`
- **Firebase Hosting**: Use `firebase deploy`
- **AWS Amplify**: Connect your GitHub repository

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VS Code Team** - For the amazing editor that inspired this design
- **Vercel Team** - For Next.js and deployment platform
- **Firebase Team** - For the backend infrastructure
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

- **Documentation**: [Wiki](https://github.com/Anish-2005/StudyHub/wiki)
- **Issues**: [GitHub Issues](https://github.com/Anish-2005/StudyHub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Anish-2005/StudyHub/discussions)

---

**Happy Studying! 🎓**