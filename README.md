<div align="center">

# 📚 StudyHub

### Your focused personal study manager

*Organize topics • Track tasks • Never miss deadlines • Built with modern web tech*

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## ✨ What is StudyHub?

StudyHub is a **lightweight study management app** designed for students who want to stay organized without the complexity. Think of it as your personal workspace where every topic gets its own dedicated space for tasks, reminders, and notes.

**Key highlights:**
- 🗂️ **Topic-first organization** — Each subject gets its own organized space
- 📱 **Mobile-optimized** — Swipe gestures, pull-to-refresh, modern touch interface
- 🔐 **Secure & private** — Your data is yours, with optional public sharing
- ⚡ **Fast & real-time** — Built on Firebase for instant updates
- 🎨 **Clean interface** — Inspired by VS Code for minimal distractions

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Anish-2005/StudyHub.git
cd StudyHub

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev

# Open http://localhost:3000
```

**Firebase Setup Required:**
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password or Google)
3. Create a **Firestore Database**
4. Add your config to `.env.local`

*See [SETUP.md](./SETUP.md) for detailed Firebase configuration.*

---

## 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **📋 Smart Tasks** | Priority levels, due dates, tags, and progress tracking |
| **⏰ Reminders** | Flexible scheduling with notifications |
| **📝 Notes** | Quick notes attached to each topic |
| **📊 Study Stats** | Track your completion rates and productivity |
| **🔗 Public Sharing** | Share topics via clean URLs like `/username/topic-name` |
| **🎨 Modern UI** | Gradient cards, smooth animations, pull-to-refresh |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS with custom mobile animations
- **Backend:** Firebase (Firestore + Authentication)
- **Icons:** Heroicons
- **Date Handling:** date-fns
- **Hosting:** Vercel (recommended)

---

## 📱 Mobile Experience

StudyHub features a **premium mobile interface** with:
- Pull-to-refresh for data updates
- Swipe gestures for tab navigation
- Floating action button for quick adds
- Bottom sheet menus for actions
- Touch-optimized cards with gradient headers

---

## 🔐 Security & Privacy

- **Firestore Rules** ensure users only access their own data
- **Optional public sharing** with read-only access via shareable links
- **Firebase Authentication** with email/password or Google sign-in

*Deploy security rules from [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) before going live.*

---

## 📂 Project Structure

```
src/
├── app/                # Next.js routes
│   ├── [username]/[topic]/   # Public topic pages
│   └── page.tsx              # Dashboard
├── components/         # React components
├── contexts/          # Auth & state management
├── lib/               # Firebase config
└── types/             # TypeScript definitions
```

---

## 🤝 Contributing

Contributions welcome! Fork the repo, create a feature branch, and open a PR.

```bash
git checkout -b feature/amazing-feature
# Make your changes
npm run lint
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with focus — build better study habits** 🎓

*Questions? Open an [issue](https://github.com/Anish-2005/StudyHub/issues) or start a [discussion](https://github.com/Anish-2005/StudyHub/discussions)*

</div>