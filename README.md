# 🎨 Artist Portfolio — Client

React frontend for the Artist Portfolio platform. Browse paintings, manage commission requests, and view the artist's public profile.

> Built as a university project (ХНУРЕ, group ПЗПІ-23-5) and a real portfolio application.

**Backend repo:** [artist-portfolio-server](https://github.com/NureVysotskyiIhor/artist-portfolio-server)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** + **TanStack Router** (file-based routing)
- **TanStack Query** — server state management
- **Zustand** — client/auth state
- **Tailwind CSS v4** + **shadcn/ui** (New York)
- **React Hook Form** + **Zod** — form validation
- **Sonner** — toast notifications

---

## Features

### Public
- 🖼 Browse painting gallery with filters (status, price range)
- 👤 View artist public profile (bio, skills, achievements, contacts)
- 📍 Submit commission requests with address autocomplete (Nominatim/OSM)

### Authenticated users
- ❤️ Save paintings to favorites
- 📋 Create and manage own commission requests
- 👤 Edit personal profile

### Artist (ROLE_ARTIST)
- ➕ Create, edit, delete paintings
- 📊 View all commission requests with geo filter (search by radius)
- ✏️ Update commission status and add notes
- 🗂 Manage commission topics (CRUD)
- 🏠 Configure public homepage profile

---

## Getting Started

### Prerequisites
- Node.js 20+
- Running backend at `http://localhost:8080`

### Setup

```bash
git clone https://github.com/NureVysotskyiIhor/artist-portfolio-client
cd artist-portfolio-client
npm install
```

Create `.env.development`:

```env
VITE_API_URL=http://localhost:8080/api
```

```bash
npm run dev
```

App: http://localhost:5173

---

## Project Structure

```
src/
├── api/             # Fetch wrappers per entity
├── components/
│   ├── ui/          # shadcn/ui primitives + custom (DeleteDialog, EyebrowLabel, etc.)
│   ├── painting/
│   ├── commission-request/
│   ├── commission-topic/
│   ├── homepage/
│   └── profile/
├── pages/           # Page components
├── queries/         # TanStack Query hooks
├── routes/          # TanStack Router file-based routes
├── store/           # Zustand stores (auth, ui)
├── types/           # TypeScript interfaces + enums
└── utils/           # Zod validation schemas
```

---

## Author

**Ihor Vysotskyi** — ХНУРЕ, group ПЗПІ-23-5

[GitHub](https://github.com/NureVysotskyiIhor)
