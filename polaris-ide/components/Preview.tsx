"use client";

import { useEffect } from "react";
import { useWebContainer } from "../webcontainer/useWebContainer";

export default function Preview() {
  const { boot, previewUrl, status, logs } = useWebContainer();

  useEffect(() => {
    boot({
      "index.html": `
      <!DOCTYPE html>
      <html>
        <body style="background:#0f0f13;color:white;font-family:sans-serif">
          <h1>🔥 Your WebContainer is Working</h1>
        </body>
      </html>
      `,
    });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <h2>Status: {status}</h2>

      {previewUrl && (
        <iframe
          src={previewUrl}
          style={{ width: "100%", height: "80%", border: "none" }}
        />
      )}

      <div style={{ height: "20%", overflow: "auto", background: "#111", color: "#0f0" }}>
        {logs.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}