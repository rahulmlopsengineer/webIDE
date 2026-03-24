# Polaris — Cloud IDE

A browser-based cloud IDE built with **Next.js 15**, **CodeMirror 6**, **WebContainer API**, **SQLite (better-sqlite3)**, and **Claude AI**.

## Features

| Feature | Details |
|---------|---------|
| 🖊 **CodeMirror 6 Editor** | Syntax highlighting, autocomplete, bracket matching |
| ⚡ **Live Preview** | WebContainer runs your code in-browser — hot-reloads on every edit |
| 🗄 **SQLite Database** | Files & projects persisted to `polaris.db` on disk |
| 🤖 **AI Chat** | Stream Claude Sonnet responses about your open file |
| ✏️ **AI Quick Edit** | Describe a change → Claude rewrites the file inline |
| ⌘K **Command Palette** | Fuzzy-search files + run commands |
| 📸 **Snapshots** | Point-in-time content snapshots stored in SQLite |

## Getting Started

```bash
# 1. Install
npm install

# 2. API key
cp .env.local.example .env.local
# Edit .env.local → add ANTHROPIC_API_KEY

# 3. Run
npm run dev
```

Open http://localhost:3000

> **Note:** WebContainers require **Chrome/Edge 90+** with cross-origin isolation headers.
> The `next.config.ts` already sets `Cross-Origin-Embedder-Policy: require-corp`.

## Project Structure

```
polaris-ide/
├── app/
│   ├── page.tsx                      # Renders IDEShell
│   ├── layout.tsx / globals.css
│   └── api/
│       ├── messages/route.ts         # AI chat (streaming)
│       ├── quick-edit/route.ts       # AI inline edit (streaming)
│       └── db/
│           ├── projects/route.ts     # CRUD projects
│           ├── files/route.ts        # CRUD files
│           └── snapshots/route.ts    # Snapshot create/list
│
├── features/
│   ├── editor/ide-shell.tsx          # Root shell — all state
│   ├── conversations/chat-panel.tsx  # AI chat UI
│   ├── preview/
│   │   ├── use-webcontainer.ts       # WebContainer hook
│   │   └── preview-panel.tsx         # Live preview + terminal UI
│   └── database/
│       ├── use-db.ts                 # React hooks for all DB operations
│       └── db-panel.tsx              # Projects / Files / Snapshots UI
│
├── components/
│   ├── ide-header.tsx                # Top bar (Chat / Preview / DB toggles)
│   ├── activity-bar.tsx
│   ├── sidebar.tsx
│   ├── editor-area.tsx               # Tabs, toolbar, Quick Edit, status bar
│   ├── code-editor.tsx               # CodeMirror 6 (dynamic import)
│   └── command-palette.tsx
│
└── lib/
    ├── db.ts                         # SQLite singleton + all helpers
    ├── file-store.ts                 # In-memory default file tree
    └── utils.ts
```

## Database Schema

```sql
projects  (id, name, description, created_at, updated_at)
files     (id, project_id, path, name, content, language, created_at, updated_at)
snapshots (id, file_id, content, message, created_at)
```

SQLite file: `polaris.db` (auto-created on first run, gitignored).

## REST API

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/db/projects` | List all projects |
| POST | `/api/db/projects` | Create project |
| PUT | `/api/db/projects` | Update project |
| DELETE | `/api/db/projects` | Delete project |
| GET | `/api/db/files?projectId=x` | List files |
| POST | `/api/db/files` | Create/upsert file |
| PUT | `/api/db/files` | Save file content |
| DELETE | `/api/db/files` | Delete file |
| GET | `/api/db/snapshots?fileId=x` | List snapshots |
| POST | `/api/db/snapshots` | Create snapshot |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Command palette |
| `⌘S` | Save & persist file to DB |
| `⌘\` | Toggle sidebar |
| `⌘P` | Switch to Preview panel |
| `Esc` | Close palette |
