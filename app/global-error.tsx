"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
            fontFamily: "system-ui, sans-serif",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            FixItNow ran into a problem
          </h1>
          <p style={{ color: "#666", maxWidth: 420 }}>
            Something went wrong while loading the application. Please try
            refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "0.5rem",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
