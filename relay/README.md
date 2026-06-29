# Relay — Client Portal for Freelancers

![Relay](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38BDF8?style=flat&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=flat)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat&logo=vite)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat&logo=netlify)

> Stop sending status updates over WhatsApp. Give every client a professional portal they'll actually appreciate.

**Live Demo →** [relay-demo.netlify.app](https://relay-demo.netlify.app)

---

## What is Relay?

Relay is a SaaS client portal tool built for freelancers. When you're working on a project, your client gets a private shareable link — no account needed — where they can track progress, download files, view invoices, and leave feedback.

No more "how's it going?" messages. No more Dropbox links buried in email threads. One link, everything inside.

---

## Features

- **Client Portal** — Unique `/c/:token` link per project. No login required for clients
- **Project Dashboard** — Manage all projects with status, progress, and budget tracking
- **Milestone Tracking** — Check off milestones; progress updates automatically
- **File Sharing** — Upload deliverables; clients download directly from portal
- **Invoice Summary** — Total, paid, and outstanding balance at a glance
- **Client Feedback** — Clients leave comments; freelancer sees them on dashboard
- **Global Search** — `⌘K` search across all projects and clients
- **Auth System** — Register/login with localStorage persistence + demo account

---

## Tech Stack

| Category       | Technology                          |
|----------------|-------------------------------------|
| Framework      | React 18 + Vite                     |
| Styling        | Tailwind CSS v3 (custom design system) |
| State          | Zustand + persist middleware        |
| Routing        | React Router v6                     |
| Animations     | Framer Motion                       |
| Forms          | React Hook Form + Zod               |
| Icons          | Lucide React                        |
| Deploy         | Netlify                             |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/relay.git
cd relay

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

**Demo Account:**