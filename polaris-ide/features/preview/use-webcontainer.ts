"use client";

/**
 * use-webcontainer.ts
 *
 * Clean WebContainer implementation following the official docs pattern:
 * https://webcontainers.io/tutorial/2-setting-up-webcontainers
 *
 * Key rules from docs:
 * 1. WebContainer.boot() called ONCE — singleton enforced with promise guard
 * 2. wc.mount(FileSystemTree) — mounts files to container root
 * 3. wc.fs.readFile('path', 'utf-8') — relative paths, no leading /
 * 4. wc.spawn('npm', ['install']) — run commands
 * 5. wc.on('server-ready', (port, url) => ...) — get preview URL
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { FileSystemTree, WebContainerProcess } from "@webcontainer/api";

// ── Types ──────────────────────────────────────────────────────
export type PreviewStatus =
  | "idle" | "booting" | "installing" | "starting" | "ready" | "error";

export interface UseWebContainerReturn {
  status:     PreviewStatus;
  previewUrl: string | null;
  logs:       string[];
  boot:       (files: Record<string, string>, framework: string) => Promise<void>;
  writeFile:  (path: string, content: string) => Promise<void>;
  clearLogs:  () => void;
  error:      string | null;
}

// ── Singleton — one WebContainer per browser tab, ever ─────────
let _wc:          import("@webcontainer/api").WebContainer | null = null;
let _bootPromise: Promise<import("@webcontainer/api").WebContainer> | null = null;

async function getWebContainer() {
  if (_wc)          return _wc;
  if (_bootPromise) return _bootPromise;

  _bootPromise = import("@webcontainer/api")
    .then(m  => m.WebContainer.boot())
    .then(wc => { _wc = wc; return wc; })
    .catch(e  => { _bootPromise = null; throw e; });

  return _bootPromise;
}

// ── Convert flat file map to FileSystemTree (official format) ──
function buildFileSystemTree(files: Record<string, string>): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const [filePath, contents] of Object.entries(files)) {
    const parts = filePath.replace(/^\/+/, "").split("/").filter(Boolean);
    if (parts.length === 0) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node[parts[i]]) {
        node[parts[i]] = { directory: {} };
      }
      node = node[parts[i]].directory;
    }
    node[parts[parts.length - 1]] = { file: { contents } };
  }

  return tree;
}

// ── Strip ANSI colour codes from terminal output ───────────────
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*[A-Za-z]/g, "");
}

// ── Hook ───────────────────────────────────────────────────────
export function useWebContainer(): UseWebContainerReturn {
  const [status,     setStatus]     = useState<PreviewStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logs,       setLogs]       = useState<string[]>([]);
  const [error,      setError]      = useState<string | null>(null);

  const devProcess  = useRef<WebContainerProcess | null>(null);
  const readyFired  = useRef(false);

  const addLog    = useCallback((line: string) => {
    setLogs(prev => [...prev.slice(-500), line]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  // Kill dev server when component unmounts
  useEffect(() => () => { devProcess.current?.kill(); }, []);

  // ── boot ──────────────────────────────────────────────────────
  const boot = useCallback(async (
    rawFiles: Record<string, string>,
    framework: string
  ) => {
    // Kill any running process
    devProcess.current?.kill();
    devProcess.current = null;
    readyFired.current = false;

    setStatus("booting");
    setPreviewUrl(null);
    setError(null);
    setLogs([]);

    try {
      addLog("[wc] Booting WebContainer…");
      const wc = await getWebContainer();
      addLog("[wc] Boot complete.");

      // Register server-ready listener (fires when any port opens)
      wc.on("server-ready", (_port: number, url: string) => {
        if (readyFired.current) return;
        readyFired.current = true;
        addLog("[wc] ✓ Preview ready → " + url);
        setPreviewUrl(url);
        setStatus("ready");
      });

      const fw = framework.toLowerCase().trim();
      addLog("[wc] Framework: " + fw);

      if (fw === "react") {
        await runReact(wc, rawFiles, addLog, setStatus, p => { devProcess.current = p; });
      } else if (fw === "nextjs" || fw === "next") {
        await runNextStatic(wc, rawFiles, addLog, setStatus, p => { devProcess.current = p; });
      } else {
        // html-css-js, vanilla-js, or any static framework
        await runStatic(wc, rawFiles, addLog, setStatus, p => { devProcess.current = p; });
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog("[wc] ERROR: " + msg);
      setError(msg);
      setStatus("error");
    }
  }, [addLog]);

  // ── writeFile — hot reload after boot ─────────────────────────
  const writeFile = useCallback(async (filePath: string, content: string) => {
    if (!_wc) return;
    try {
      // Official docs use relative paths without leading /
      const clean = filePath.replace(/^\/+/, "");
      await _wc.fs.writeFile(clean, content);
    } catch { /* non-fatal */ }
  }, []);

  return { status, previewUrl, logs, boot, writeFile, clearLogs, error };
}

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

type WC   = import("@webcontainer/api").WebContainer;
type SetP = (p: WebContainerProcess) => void;

/** Spawn a process and pipe all output to addLog */
async function spawn(
  wc: WC,
  cmd: string,
  args: string[],
  addLog: (s: string) => void
): Promise<WebContainerProcess> {
  const p = await wc.spawn(cmd, args);
  p.output.pipeTo(new WritableStream({
    write(chunk) {
      stripAnsi(chunk)
        .split("\n")
        .forEach(line => {
          const t = line.replace(/\r/g, "").trim();
          if (t) addLog(t);
        });
    },
  }));
  return p;
}

/** Spawn, wait for exit, return code */
async function spawnWait(
  wc: WC,
  cmd: string,
  args: string[],
  addLog: (s: string) => void
): Promise<number> {
  const p = await spawn(wc, cmd, args, addLog);
  return p.exit;
}

// ═══════════════════════════════════════════════════════════════
// 1. STATIC  —  html-css-js / vanilla-js
//
// Pattern (from official docs):
//   mount(files) → npm run start → server-ready
//
// We use `npx serve` which reliably triggers server-ready
// and requires zero npm install time.
// ═══════════════════════════════════════════════════════════════
async function runStatic(
  wc: WC,
  rawFiles: Record<string, string>,
  addLog: (s: string) => void,
  setStatus: (s: PreviewStatus) => void,
  setP: SetP
) {
  setStatus("starting");

  // Build file set — drop any old generated server files
  const files: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawFiles)) {
    if (["package.json", "server.js", "server.cjs", "_server.mjs"].includes(k)) continue;
    files[k] = v;
  }

  // Guarantee index.html exists
  if (!files["index.html"]) {
    for (const alt of ["public/index.html", "src/index.html"]) {
      if (files[alt]) {
        files["index.html"] = files[alt];
        addLog("[wc] Moved " + alt + " → index.html");
        break;
      }
    }
  }

  if (!files["index.html"]) {
    addLog("[wc] WARNING: No index.html found — using fallback");
    files["index.html"] = FALLBACK_HTML;
  }

  // package.json that uses npx serve (no npm install needed)
  files["package.json"] = JSON.stringify({
    name: "app",
    version: "1.0.0",
    scripts: { start: "npx --yes serve@14 . --listen 3000 --no-clipboard" },
  }, null, 2);

  addLog("[wc] Mounting " + Object.keys(files).length + " files…");

  // Official pattern: mount(FileSystemTree)
  await wc.mount(buildFileSystemTree(files));

  // Confirm index.html is accessible (official docs use relative path)
  try {
    const content = await wc.fs.readFile("index.html", "utf-8") as string;
    addLog("[wc] index.html ✓ (" + content.length + " bytes)");
  } catch {
    addLog("[wc] index.html ✗ — not found after mount");
  }

  addLog("[wc] Starting static server…");

  // Official pattern: wc.spawn('npm', ['run', 'start'])
  const p = await spawn(wc, "npm", ["run", "start"], addLog);
  setP(p);
}

// ═══════════════════════════════════════════════════════════════
// 2. REACT  —  Vite
//
// Pattern (from official docs):
//   mount(files) → npm install → npm run dev → server-ready
// ═══════════════════════════════════════════════════════════════
async function runReact(
  wc: WC,
  rawFiles: Record<string, string>,
  addLog: (s: string) => void,
  setStatus: (s: PreviewStatus) => void,
  setP: SetP
) {
  // Drop files that conflict with our injected config
  const userFiles: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawFiles)) {
    if (["package.json", "vite.config.ts", "vite.config.js", "tsconfig.json",
         "server.js", "_server.mjs"].includes(k)) continue;
    userFiles[k] = v;
  }

  addLog("[wc] User files: " + Object.keys(userFiles).join(", "));

  // Build complete Vite + React project
  const files: Record<string, string> = {
    // Required Vite entry
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    // Vite config — host:true required for WebContainer
    "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
  },
});`,

    "tsconfig.json": JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        jsx: "react-jsx",
        strict: false,
      },
      include: ["src"],
    }, null, 2),

    "package.json": JSON.stringify({
      name: "app",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.1",
        vite: "^5.4.2",
        typescript: "^5.5.3",
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
      },
    }, null, 2),

    // Guaranteed base CSS
    "src/index.css": `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }`,

    // User files override the defaults above
    ...userFiles,
  };

  // Always inject a safe main.tsx that won't crash
  files["src/main.tsx"] = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  // If user App.tsx imports missing components, strip those imports
  if (files["src/App.tsx"]) {
    files["src/App.tsx"] = safeAppTsx(files["src/App.tsx"], files);
  } else if (files["src/App.jsx"]) {
    files["src/App.tsx"] = safeAppTsx(files["src/App.jsx"], files);
  } else {
    files["src/App.tsx"] = DEFAULT_APP_TSX;
  }

  setStatus("installing");
  addLog("[wc] Mounting " + Object.keys(files).length + " files…");
  await wc.mount(buildFileSystemTree(files));

  // Verify key files (relative paths — official docs pattern)
  for (const path of ["package.json", "src/main.tsx", "src/App.tsx", "index.html"]) {
    try {
      const content = await wc.fs.readFile(path, "utf-8") as string;
      addLog("[wc] " + path + " ✓ (" + content.length + "b)");
    } catch {
      addLog("[wc] " + path + " ✗ MISSING");
    }
  }

  addLog("[wc] npm install… (30-60s first time, cached after)");
  const code = await spawnWait(wc, "npm", ["install", "--prefer-offline", "--no-audit", "--no-fund"], addLog);
  addLog("[wc] npm install exit " + code);

  setStatus("starting");
  addLog("[wc] Starting Vite dev server…");

  // Official pattern: spawn → server-ready
  const p = await spawn(wc, "npm", ["run", "dev"], addLog);
  setP(p);
}

// ═══════════════════════════════════════════════════════════════
// 3. NEXT.JS  —  Static preview (instant, no npm install)
//
// Next.js needs ~300MB npm install inside WebContainer which
// causes it to freeze. Instead we build a full-fidelity static
// HTML preview with CDN Tailwind and Google Fonts.
//
// For full Next.js: run `npm run dev` locally.
// ═══════════════════════════════════════════════════════════════
async function runNextStatic(
  wc: WC,
  rawFiles: Record<string, string>,
  addLog: (s: string) => void,
  setStatus: (s: PreviewStatus) => void,
  setP: SetP
) {
  setStatus("starting");

  // Normalize paths
  const files: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawFiles)) {
    if (["package.json", "next.config.ts", "next.config.js",
         "server.js", "_server.mjs"].includes(k)) continue;
    // src/app/* → app/*
    if (k.startsWith("src/app/")) { files[k.replace("src/app/", "app/")] = v; continue; }
    if (k.startsWith("src/pages/")) { files[k.replace("src/pages/", "pages/")] = v; continue; }
    files[k] = v;
  }

  addLog("[wc] Building static Next.js preview…");

  // Find the main page content
  const pageContent =
    files["app/page.tsx"]    || files["app/page.jsx"]   ||
    files["pages/index.tsx"] || files["pages/index.jsx"] || "";

  const layoutContent = files["app/layout.tsx"] || files["app/layout.jsx"] || "";
  const cssContent    = files["app/globals.css"] || files["styles/globals.css"] || "";

  // Build the static HTML
  const html = buildNextStaticHtml(pageContent, layoutContent, cssContent, files);

  // Mount just the HTML file + serve package
  const mountFiles = {
    "index.html": html,
    "package.json": JSON.stringify({
      name: "app",
      version: "1.0.0",
      scripts: { start: "npx --yes serve@14 . --listen 3000 --no-clipboard" },
    }, null, 2),
  };

  addLog("[wc] Mounting preview…");
  await wc.mount(buildFileSystemTree(mountFiles));

  // Verify
  try {
    const content = await wc.fs.readFile("index.html", "utf-8") as string;
    addLog("[wc] index.html ✓ (" + content.length + " bytes)");
  } catch {
    addLog("[wc] index.html ✗");
  }

  addLog("[wc] Starting preview server…");
  addLog("[wc] Tip: For full Next.js, run npm run dev locally");

  const p = await spawn(wc, "npm", ["run", "start"], addLog);
  setP(p);
}

// ═══════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════

/** Remove imports for component files that don't exist in the file set */
function safeAppTsx(content: string, files: Record<string, string>): string {
  const lines = content.split("\n");
  const safe  = lines.filter(line => {
    const match = line.match(/import\s+\w+\s+from\s+["']\.\/components\/(\w+)["']/);
    if (!match) return true;
    const exists = `src/components/${match[1]}.tsx` in files
      || `src/components/${match[1]}.jsx` in files;
    if (!exists) return false; // drop missing component import
    return true;
  });
  const result = safe.join("\n").trim();
  return result.includes("export default") ? result : DEFAULT_APP_TSX;
}

/** Convert Next.js TSX → plain HTML */
function buildNextStaticHtml(
  page: string,
  layout: string,
  css: string,
  allFiles: Record<string, string>
): string {
  const hasTailwind = css.includes("@tailwind")
    || Object.values(allFiles).some(f => f.includes("tailwindcss"));

  // Extract title from layout
  const titleMatch = layout.match(/title:\s*["'`]([^"'`]+)["'`]/);
  const title = titleMatch?.[1] || "Preview";

  // Convert JSX to HTML
  const body = jsxToHtml(page);

  // Custom CSS without Tailwind directives
  const customCss = css
    .replace(/@tailwind\s+\w+;/g, "")
    .replace(/@import[^;]+;/g, "")
    .trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ${hasTailwind ? `<script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Syne', 'sans-serif'],
          },
        },
      },
    };
  </script>` : ""}
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { font-family: 'Inter', system-ui, sans-serif; scroll-behavior: smooth; }
    body { margin: 0; background: #0f0f13; color: #e2e8f0; }
    a { color: inherit; }
    img { max-width: 100%; height: auto; }
    ${customCss}
  </style>
</head>
<body>
${body}
  <div style="position:fixed;bottom:12px;right:12px;padding:4px 10px;border-radius:20px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;font-size:10px;font-family:Inter,sans-serif;backdrop-filter:blur(8px);z-index:9999">
    ⚡ Static preview &nbsp;·&nbsp; <code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;font-size:9px">npm run dev</code> for full Next.js
  </div>
</body>
</html>`;
}

/** Very lightweight JSX → HTML converter */
function jsxToHtml(tsx: string): string {
  if (!tsx.trim()) {
    return '<div style="padding:3rem;text-align:center;color:#94a3b8">No page content.</div>';
  }

  return tsx
    // Remove imports / exports / metadata
    .replace(/^import\s+type\s+.+$/gm, "")
    .replace(/^import\s+.+$/gm, "")
    .replace(/^export\s+const\s+metadata\s*=[\s\S]*?;/gm, "")
    .replace(/^export\s+const\s+dynamic\s*=.*?;/gm, "")
    .replace(/^"use (?:client|server)";?$/gm, "")
    // Strip function wrapper + return(
    .replace(/^\s*export\s+default\s+(?:async\s+)?function\s+\w+[^(]*\([^)]*\)\s*(?::\s*[\w<>\.]+)?\s*\{/m, "")
    .replace(/^\s*(?:export\s+(?:default\s+)?)?const\s+\w+\s*(?::\s*[A-Za-z0-9_<>\.]+)?\s*=\s*(?:async\s+)?(?:\([^)]*\)|.*?)\s*=>\s*\{/m, "")
    .replace(/export\s+default\s+\w+;?\s*$/gm, "")
    .replace(/^\s*return\s*(?:\(\s*)?/m, "")
    .replace(/\)?\s*;?\s*\}?\s*;?\s*$/, "")
    // JSX → HTML attributes
    .replace(/className=/g, "class=")
    .replace(/htmlFor=/g, "for=")
    .replace(/onClick=\{[^}]*\}/g, "")
    .replace(/onChange=\{[^}]*\}/g, "")
    .replace(/onSubmit=\{[^}]*\}/g, "")
    .replace(/onMouseEnter=\{[^}]*\}/g, "")
    .replace(/onMouseLeave=\{[^}]*\}/g, "")
    // Next.js components → HTML
    .replace(/<Image([^>]*?)src=["']([^"']+)["']([^>]*?)(?:\/>|>)/g, '<img src="$2"$1$3/>')
    .replace(/<Image([^>]*?)src=\{["']([^"']+)["']\}([^>]*?)(?:\/>|>)/g, '<img src="$2"$1$3/>')
    .replace(/<Link([^>]*?)href=["']([^"']+)["']([^>]*?)>/g, '<a href="$2"$1$3>')
    .replace(/<\/Link>/g, "</a>")
    // Comments + expressions
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\{`([^`]*)`\}/g, "$1")
    .replace(/\{"([^"]*)"\}/g, "$1")
    .replace(/\{'([^']*)'\}/g, "$1")
    .replace(/\{\s*(\d+(?:\.\d+)?)\s*\}/g, "$1")
    // TypeScript types
    .replace(/:\s*(?:React\.ReactNode|React\.FC|string|number|boolean)(\s*[|&][^=,;)}\s]+)?/g, "")
    .trim() || '<div style="padding:3rem;text-align:center;color:#94a3b8">Preview ready.</div>';
}

// ── Constants ──────────────────────────────────────────────────
const DEFAULT_APP_TSX = `export default function App() {
  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      padding: "3rem",
      background: "#0f0f13",
      color: "#e2e8f0",
      minHeight: "100vh",
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        background: "linear-gradient(135deg, #a5b4fc, #67e8f9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "1rem",
      }}>
        React App 🚀
      </h1>
      <p style={{ color: "#94a3b8" }}>
        Edit <code>src/App.tsx</code> to get started.
      </p>
    </div>
  );
}`;

const FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Preview</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #0f0f13; color: #e2e8f0;
           display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    div { text-align: center; }
    p   { color: #94a3b8; }
  </style>
</head>
<body>
  <div>
    <h1>Preview Running</h1>
    <p>No index.html found in your project files.</p>
    <p>Add an index.html to see your content here.</p>
  </div>
</body>
</html>`;