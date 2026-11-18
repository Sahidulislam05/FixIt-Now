"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
            fontFamily: "Georgia, serif",
            background: "#f7f4ee",
            color: "#2b2622",
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
              background: "#c2581f",
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
