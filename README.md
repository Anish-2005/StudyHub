<div align="center">
  <h1 style="margin-bottom:0.25rem">StudyHub</h1>
  <p style="margin-top:0; color:#6b7280">A focused personal study manager — topics, tasks, reminders and notes with public sharing.</p>
  <p style="margin-top:0.5rem">
    <strong>Public topic sharing</strong> via human-friendly URLs: <code>/username/topic-name</code> • privacy toggles • responsive UI
  </p>
</div>

---

<div style="display:flex; gap:1rem; align-items:center; margin:0.5rem 0 1rem 0">
  <div style="flex:1;">
    <h2 style="margin:0 0 0.25rem 0">Why StudyHub?</h2>
    <p style="margin:0; color:#374151">StudyHub helps you organize topics (courses / subjects), track tasks, set reminders, and capture notes — with the option to share topics publicly via friendly URLs. It's built to be minimal, fast and privacy-conscious.</p>
  </div>
  <div style="flex:0 0 260px; text-align:left; font-size:0.9rem; background:#0f172a; padding:0.75rem; border-radius:8px; color:#e6eef8">
    <strong>Status</strong>
    <div style="margin-top:0.5rem">Tech: Next.js 15 • React 18 • TypeScript • Tailwind • Firebase (Firestore)</div>
  </div>
</div>

## Table of contents

- Features
- Quick demo (local)
- Tech stack
- Setup & Firebase
- Routes & sharing model
- Developer notes (components & tips)
- Troubleshooting
- Contributing
- License

---

## Features

- Organize study material into Topics
- Create Tasks, Reminders and Notes per Topic
- Track progress with a compact dashboard and progress bar
- Make a Topic public or private; public topics are viewable by anyone with the link
- Human-friendly public routes: `/username/topic-name` (displayName based)
- Responsive UI (mobile & desktop) with modals and accessible controls
- No Firestore composite indexes required for common flows — client-side filtering is used where needed

---

## Quick demo (run locally)

Open a PowerShell terminal and run:

```powershell
# Install dependencies
npm install

# Start the dev server
npm run dev

# Open http://localhost:3000 in your browser
```

Notes:
- The app expects Firebase configuration (see below) in environment variables.

---

## Tech stack

| Layer | Libraries / Notes |
|---|---|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS |
| Backend / DB | Firebase Firestore (client SDK) |
| Auth | Firebase Authentication (used for private topics) |
| Tooling | ESLint / Prettier (project standard), react-hot-toast for notifications |

---

## Setup & Firebase

1. Create a Firebase project and enable Firestore and Authentication.
2. Add a web app in Firebase and grab the config keys.
3. Add the following environment variables to your `.env.local` (or platform secrets):

```text
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. Firestore rules (example) — the app uses a public/private model for topics. Add or adapt the rules below to your Firestore rules in the console. This example allows unauthenticated reads of topics/documents that are marked public but protects private data.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /topics/{topicId} {
      allow read: if resource.data.isPublic == true || request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    match /{collection}/{docId} {
      // example for notes/tasks/reminders — ensure only owners write/read private data
      allow read: if exists(/databases/$(database)/documents/topics/$(request.resource.data.topicId))
                 ? (get(/databases/$(database)/documents/topics/$(request.resource.data.topicId)).data.isPublic == true)
                 : (request.auth != null && request.auth.uid == resource.data.userId);
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Important: tailor these rules to your exact collections and data shapes. The app was designed to avoid requiring composite indexes for common list reads by filtering in the client where appropriate.

---

## Routes & sharing model

- Topic pages (public or private) are accessible at: `/[username]/[topic]` where `username` is the author's displayName (URL-encoded) and `topic` is a URL-safe topic slug.
- If a topic is public (`topic.isPublic`), anyone with the link can view it. If private, only the owner (authenticated) can view it.
- The owner sees the same dynamic route as visitors (so previews and shareable links are identical).

---

## Developer notes & main files

Below is a short mapping of important files and components to help contributors get started.

<table>
  <thead>
    <tr><th align="left">Path / Component</th><th align="left">Purpose</th></tr>
  </thead>
  <tbody>
    <tr><td><code>src/components/TopicDashboard.tsx</code></td><td>Per-topic dashboard: header, progress, tabs (Overview / Tasks / Reminders / Notes) and modals.</td></tr>
    <tr><td><code>src/components/CreateTopicModal.tsx</code></td><td>Modal used to create topics (public/private toggle & displayName-based url slug).</td></tr>
    <tr><td><code>src/app/[username]/[topic]/page.tsx</code></td><td>Public topic route — loads topic by owner/displayName and topic slug and shows public view to visitors.</td></tr>
    <tr><td><code>src/utils/slug.ts</code></td><td>Helpers to encode/decode display names and topic names into friendly URL slugs.</td></tr>
    <tr><td><code>src/lib/firebase.ts</code></td><td>Firebase initialization using env variables.</td></tr>
  </tbody>
</table>

---

## Styling & fonts

- The app uses Tailwind CSS. In the project the global font has been set to "Segoe UI" for a clean, native look across platforms. If you prefer another font, change `src/app/globals.css`.

---

## Running tests & linting

If the project includes tests or linters, use:

```powershell
npm run lint    # run ESLint
npm test        # run unit tests (if configured)
npm run build   # production build
```

---

## Common troubleshooting

- Firestore permission errors: double-check your Firestore rules and that the client is authenticating where needed. Use the browser console to view Firebase error messages.
- Next.js EPERM errors on Windows: try deleting `.next` and rerunning `npm run dev` or run your console as administrator if file locks persist.
- Missing fonts or style mismatches: verify `src/app/globals.css` and Tailwind config.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-change`
3. Make changes and add tests where applicable
4. Run `npm run lint` and `npm test`
5. Open a PR with a clear description of the change

---

## License & Contact

This project is MIT licensed. If you want to reach out, open an issue or drop a PR — happy to collaborate.

---

_Made with focus — build better study habits._

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